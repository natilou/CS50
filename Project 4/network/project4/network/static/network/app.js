

document.addEventListener("DOMContentLoaded", function() {
    // fetch a api con todos los posts de todos los usuarios
    fetch("http://127.0.0.1:8000/api/posts")
    .then(response => response.json())
    .then(posts => {
        // console.log(posts);
        posts.forEach((post) => {
            loadPosts(post);
            });
        })
    
    },
    // fetch a api con todos los posts del usuario logeado
    document.addEventListener("DOMContentLoaded", function(){
        const userid = document.getElementById("js-user-id").value
        fetch(`http://127.0.0.1:8000/${userid}/api/posts`)
        .then(response => response.json())
        .then(posts => {
        posts.forEach((post) => {   
        loadUserPosts(post);
            });
        })
    
    }),

    document.addEventListener("DOMContentLoaded", function(){
        const userid = document.getElementById("js-user-id").value
        fetch(`http://127.0.0.1:8000/${userid}/api/followers`)
            .then(response=>response.json())
            .then(followers => {
                if(followers.length === 0){
                    let emptyFollowers = [{"follower": null, "followee": document.getElementById("js-user-username").value}]
                    changeFollowButton(emptyFollowers);
                } else {
                    followers.forEach((follower)=> {
                        changeFollowButton(follower);})
                }
            })
    })
)


// carga todos los posts de todos los usuarios en all-posts.html
function loadPosts(post){
    // console.log(post)
    const postDiv = document.createElement('div');
    postDiv.className = "card";
    postDiv.style.margin = "10px";
    postDiv.innerHTML = `<div class="card-header">
        <div class="container">
            <div class="row">
                <div class="col-9"><a href="http://127.0.0.1:8000/${post.user_id}"><strong>${post.user}</strong></a></div>
                <div class="col-3">${post.created}</div>
            </div>
        </div>
    </div>
    <div class="card-body">
        <div> 
            <h5 class="card-title">${post.content}

        </div>
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
            </svg>
            <span class="card-text">${post.likes}</span>
        </div>
    </div>`;
    document.getElementById("all-posts-container").append(postDiv); 
}

// carga los posts del usuario logeado, para verlos en su perfil, en profile.html
function loadUserPosts(post){
    console.log(post)
    const userDivPost = document.createElement('div')
    userDivPost.className = "card";
    userDivPost.style.margin = "10px";
    userDivPost.innerHTML = `<div class="card-header">
    <div class="container">
        <div class="row">
            <div class="col-8"><strong>${post.user}</strong></div>
            <div class="col-3">${post.created}</div>
        </div>
    </div>
    </div>
    <div class="card-body">
        <div> 
            <h5 class="card-title">${post.content}
        </div>
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
            </svg>
            <span class="card-text">${post.likes}</span>
        </div>
    </div>`;
    document.querySelector("#profile-container").append(userDivPost);
}

function changeFollowButton(follower){
    const loggedUser = document.getElementById("js-logged-user").value;
    const followButton = document.getElementById("follow-btn");
    followButton.innerHTML= loggedUser === follower.follower ? "Unfollow" : "Follow";
}
