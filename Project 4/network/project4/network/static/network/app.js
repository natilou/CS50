function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim()
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

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
        const userid = document.getElementById("js-user-id").value;
        fetch(`http://127.0.0.1:8000/${userid}/api/is-following`)
            .then(response=>response.json())
            .then(following => { 
                changeFollowButton(following.is_following);
        })
    }), 
    
    // document.addEventListener("DOMContentLoaded", function(){
    //     fetch(`http://127.0.0.1:8000/api/posts/followees`)
    //     .then(response => response.json())
    //     .then(posts => {
    //         posts.forEach(post => loadFolloweesPosts(post));
    //     })
    // })
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

function changeFollowButton(following){
    console.log(following);
    // const loggedUser = document.getElementById("js-logged-user").value;
    const userid = document.getElementById("js-user-id").value
    const followButton = document.getElementById("follow-btn");
    const unfollowButton = document.getElementById("unfollow-btn");

    const followersHTML = document.getElementById("followers");
    if(!following){
        unfollowButton.style.display="none";        
    } else {
        followButton.style.display="none";    
    }

    followButton.addEventListener("click", function(){
        fetch(`http://127.0.0.1:8000/${userid}/follow`, {
            method: "POST",
            headers: {
                "X-CSRFToken": getCookie('csrftoken')
            }
        })
        .then(() => followButton.style.display="none")
        .then(() => unfollowButton.style.display="block")
        .then(() => fetch(`http://127.0.0.1:8000/${userid}/get-followers`)
            .then(response => response.json())
            .then(followers => {
                console.log(followers)
                followersHTML.innerHTML = `${followers.num_followers} Followers`
            }) 
        )
    })

    unfollowButton.addEventListener("click", function(){
        fetch(`http://127.0.0.1:8000/${userid}/unfollow`, {
            method: "POST",
            headers: {
                "X-CSRFToken": getCookie('csrftoken')
            }            
        })
        .then(() => unfollowButton.style.display="none")
        .then(() => followButton.style.display="block")
        .then(() => fetch(`http://127.0.0.1:8000/${userid}/get-followers`)
            .then(response => response.json())
            .then(followers => {
                console.log(followers)
                followersHTML.innerHTML = `${followers.num_followers} Followers`
            })    
        )
    })
}

// function loadFolloweesPosts(post){
//     const divPostFollowee = document.createElement('div')
//     divPostFollowee.className = "card";
//     divPostFollowee.style.margin = "10px";
//     divPostFollowee.innerHTML = `<div class="card-header">
//     <div class="container">
//         <div class="row">
//             <div class="col-8"><strong>${post.user}</strong></div>
//             <div class="col-3">${post.created}</div>
//         </div>
//     </div>
//     </div>
//     <div class="card-body">
//         <div> 
//             <h5 class="card-title">${post.content}
//         </div>
//         <div>
//             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
//                 <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
//             </svg>
//             <span class="card-text">${post.likes}</span>
//         </div>
//     </div>`;
//     document.getElementById("posts-followees-container").append(divPostFollowee);
// }




