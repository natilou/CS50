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
        const userProfileId = document.getElementById("js-user-profile-id").value
        fetch(`http://127.0.0.1:8000/${userProfileId}/api/posts`)
        .then(response => response.json())
        .then(posts => {
            posts.forEach((post) => {   
                loadUserPosts(post);
            });
        })

    }),

    document.addEventListener("DOMContentLoaded", function(){
        const userProfileId = document.getElementById("js-user-profile-id").value;
        fetch(`http://127.0.0.1:8000/${userProfileId}/api/is-following`)
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

// genera card de post
function generateCardPost(post){
    const cardPost = document.createElement('div')
    cardPost.className = "card";
    cardPost.style.margin = "10px";
    cardPost.innerHTML =  `<div class="card-header">
    <div class="container">
        <div id="title-card-${post.id}" class="row">
            <div class="col-9"><a href="http://127.0.0.1:8000/${post.user_id}"><strong>${post.user}</strong></a></div>
            <div class="col-2" id="date-post-${post.id}"><small>${post.created !== post.updated ? post.updated : post.created}</small></div>
        </div>
    </div>
</div>
<div class="card-body">
    <div> 
        <h5 class="card-title"id="content-${post.id}">${post.content}</h5> 
    </div>
    <div>
        <button type="button" class="btn btn-link like-btn post-${post.id}" onclick="changeLikeStatus(${post.id})">   
            ${post.is_liked ? redIcon : blackIcon}
        </button>
        <span id="num-likes" class="card-text span-${post.id}">${post.num_likes}</span>
    </div>
</div>`;
    return cardPost;
}

// carga todos los posts de todos los usuarios en all-posts.html
function loadPosts(post){
    document.getElementById("all-posts-container").append(generateCardPost(post)); 
}

// carga los posts del usuario logeado, para verlos en su perfil, en profile.html
function loadUserPosts(post){
    loggedUserId = document.getElementById("js-logged-user").value;
    userProfileId = document.getElementById("js-user-profile-id").value;
    if (loggedUserId === userProfileId){
        //create a edit button 
        const cardPost = generateCardPost(post);
        const editBtn = document.createElement("button");
        editBtn.className = `btn btn-link post-${post.id}`;
        editBtn.innerHTML = "Edit";
        editBtn.setAttribute("type", "button");
        // append edit button to the post card
        cardPost.append(editBtn);

        //create a save button
        const saveEdit = document.createElement("button");
        saveEdit.className = `btn btn-link save-post-${post.id}`;
        saveEdit.innerHTML = "Save";
        saveEdit.setAttribute("type", "button");
        saveEdit.style.display = "none";
        // append edit button to the post card
        cardPost.append(saveEdit);

        document.querySelector("#profile-container").append(cardPost);
        
        editBtn.addEventListener("click", function() {
            editBtn.style.display = "none";
            saveEdit.style.display = "block";
            editPost(post, saveEdit, editBtn);
        })

    } else {
        document.querySelector("#profile-container").append(generateCardPost(post));
    }
    
}

function changeFollowButton(following){
    console.log(following);
    // const loggedUser = document.getElementById("js-logged-user").value;
    const userProfileId = document.getElementById("js-user-profile-id").value
    const followButton = document.getElementById("follow-btn");
    const unfollowButton = document.getElementById("unfollow-btn");

    const followersHTML = document.getElementById("followers");
    if(!following){
        unfollowButton.style.display="none";
        followButton.style.display="block";        
    } else {
        followButton.style.display="none";
        unfollowButton.style.display="block";    
    }

    followButton.addEventListener("click", function(){
        fetch(`http://127.0.0.1:8000/${userProfileId}/follow`, {
            method: "POST",
            headers: {
                "X-CSRFToken": getCookie('csrftoken')
            }
        })
        .then(() => followButton.style.display="none")
        .then(() => unfollowButton.style.display="block")
        .then(() => fetch(`http://127.0.0.1:8000/${userProfileId}/get-followers`)
            .then(response => response.json())
            .then(followers => {
                console.log(followers)
                followersHTML.innerHTML = `${followers.num_followers} Followers`
            }) 
        )
    })

    unfollowButton.addEventListener("click", function(){
        fetch(`http://127.0.0.1:8000/${userProfileId}/unfollow`, {
            method: "POST",
            headers: {
                "X-CSRFToken": getCookie('csrftoken')
            }            
        })
        .then(() => unfollowButton.style.display="none")
        .then(() => followButton.style.display="block")
        .then(() => fetch(`http://127.0.0.1:8000/${userProfileId}/get-followers`)
            .then(response => response.json())
            .then(followers => {
                console.log(followers)
                followersHTML.innerHTML = `${followers.num_followers} Followers`
            })    
        )
    })
}

function loadFolloweesPosts(post){
    document.getElementById("posts-followees-container").append(generateCardPost(post));
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

function editPost(post, saveEdit, editBtn){
    const content = document.querySelector(`#content-${post.id}`); 
    content.innerHTML = `<textarea id="textarea-${post.id}" style="width:100%;" maxlength=200>${post.content}</textarea>`
    console.log(content.value);
    const textArea = document.querySelector(`#textarea-${post.id}`);

    saveEdit.addEventListener("click", function(){
        console.log("quiero guardar")
        console.log(content)
        console.log(textArea)
        console.log(textArea.value)
        fetch(`http://127.0.0.1:8000/api/posts/${post.id}/edit`,{
            method: "POST",
            headers: {
                "X-CSRFToken": getCookie('csrftoken')
            },
            body: JSON.stringify({
                content: textArea.value,
            }), 
           
        })
        .then(() => fetch(`http://127.0.0.1:8000/api/posts/${post.id}`)
            .then(response => response.json())
            .then(post => {
                document.querySelector(`#content-${post.id}`).innerHTML = `<h5 class="card-title"id="content-${post.id}">${post.content}</h5>`
                document.querySelector(`#date-post-${post.id}`).innerHTML = `<small>${post.updated}</small>`
            })
            .then(() => {
                saveEdit.style.display = "none"
                editBtn.style.display = "block"
            })
            
        )
    
    })
}
        
