function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const redIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
<path fill="#dc3545" fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
</svg>`

const blackIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
<path fill="#212529" fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
</svg>`

document.addEventListener("DOMContentLoaded", function() {
    // fetch a api con todos los posts de todos los usuarios
    fetch("http://127.0.0.1:8000/api/posts")
    .then(response => response.json())
    .then(posts => {
        console.log(posts);
        posts.forEach((post) => {
            loadPosts(post);
            })
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
    
    document.addEventListener("DOMContentLoaded", function(){
        fetch(`http://127.0.0.1:8000/api/posts/followees`)
        .then(response => response.json())
        .then(posts => {
            posts.forEach(post => loadFolloweesPosts(post));
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
            <button type="button" class="btn btn-link like-btn post-${post.id}" onclick="changeLikeStatus(${post.id})">   
                ${post.is_liked ? redIcon : blackIcon}
            </button>
            <span id="num-likes" class="card-text span-${post.id}">${post.num_likes}</span>
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
            <button type="button" class="btn btn-link like-btn post-${post.id}" onclick="changeLikeStatus(${post.id})">   
                ${post.is_liked ? redIcon : blackIcon}
            </button>
            <span id="num-likes" class="card-text span-${post.id}">${post.num_likes}</span>
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

function loadFolloweesPosts(post){
    const divPostFollowee = document.createElement('div')
    divPostFollowee.className = "card";
    divPostFollowee.style.margin = "10px";
    divPostFollowee.innerHTML = `<div class="card-header">
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
            <button type="button" class="btn btn-link like-btn post-${post.id}" onclick="changeLikeStatus(${post.id})">   
                ${post.is_liked ? redIcon : blackIcon}
            </button>
            <span id="num-likes" class="card-text span-${post.id}">${post.num_likes}</span>
        </div>
    </div>`;
    document.getElementById("posts-followees-container").append(divPostFollowee);
}


function changeLikeStatus(post_id){

    let likeBtn = document.querySelector(`.post-${post_id}`); 

    fetch(`http://127.0.0.1:8000/api/posts/${post_id}`)
    .then(response => response.json())
    .then((post) => {
        if (!post.is_liked){
            fetch(`http://127.0.0.1:8000/api/posts/${post.id}/like`, {
                method: "POST",
                headers: {
                    "X-CSRFToken": getCookie('csrftoken')
                    }
            })
            .then(() => likeBtn.innerHTML = redIcon)
            .then(() => fetch(`http://127.0.0.1:8000/api/posts/${post.id}`)
                .then(response => response.json())
                .then(post => document.querySelector(`.span-${post_id}`).innerHTML = `${post.num_likes}`)
            )
            
        } else {
            fetch(`http://127.0.0.1:8000/api/posts/${post.id}/unlike`, {
                method: "POST",
                headers: {
                    "X-CSRFToken": getCookie('csrftoken')
                }
            })
            .then(() => { likeBtn.innerHTML = blackIcon
                })
            .then(() => fetch(`http://127.0.0.1:8000/api/posts/${post.id}`)
                .then(response => response.json())
                .then(post => document.querySelector(`.span-${post_id}`).innerHTML = `${post.num_likes}`) 
            )
        }

    })   

}