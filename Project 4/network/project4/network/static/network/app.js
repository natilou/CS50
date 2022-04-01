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
</svg>`;

const greyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
<path fill="#90929a" fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
</svg>`;

const editIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
<path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
</svg>`;

const saveIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2-square" viewBox="0 0 16 16">
<path d="M3 14.5A1.5 1.5 0 0 1 1.5 13V3A1.5 1.5 0 0 1 3 1.5h8a.5.5 0 0 1 0 1H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 1 0v5a1.5 1.5 0 0 1-1.5 1.5H3z"/>
<path d="m8.354 10.354 7-7a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"/>
</svg>`;

const deleteIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
<path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
</svg>`;

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
        const userProfileId = document.getElementById("js-user-profile-id").value;
        fetch(`http://127.0.0.1:8000/${userProfileId}/api/posts`)
        .then(response => response.json())
        .then(posts => {
            posts.forEach((post) => {   
                loadUserPosts(post);
            });
        })

    }),

    window.addEventListener("load", function(){
        const navPage = document.querySelector("#nav-page");
        navPage.style.display = "block"; // tal vez con una animación en css se puede retrasar su aparición.
        const postsContainer = document.querySelector("#all-posts-container"); 
        const pagesNum = this.document.querySelectorAll(".page-link");
        pagesNum.forEach(pageNum => pageNum.addEventListener("click", function(){
            console.log("recargando la pag");
            postsContainer.innerHTML = "";
            fetch("http://127.0.0.1:8000/api/posts")
            .then(response => response.json())
            .then(posts => {
                console.log(posts);
                posts.forEach((post) => {
                    loadPosts(post);
                    })
                })
            })
        )
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
            <div class="col-8"><a href="http://127.0.0.1:8000/${post.user_id}"><strong>${post.user}</strong></a></div>
            <div class="col-2" id="date-post-${post.id}"><small>${post.created !== post.updated ? post.updated : post.created}</small></div>
            <div class="col-2 row justify-content-center" id="buttons-post-${post.id}" style="visibility:hidden;"></div>
        </div>
    </div>
    </div>
    <div class="card-body">
        <div> 
            <h5 class="card-title"id="content-${post.id}">${post.content}</h5> 
        </div>
        <div>
            <button type="button" class="btn btn-link like-btn post-${post.id}" onclick="changeLikeStatus(${post.id})">   
                ${post.is_liked ? redIcon : greyIcon}
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
    if(loggedUserId === userProfileId){

       //generate card
       const cardPost = generateCardPost(post);

       //create a edit button 
       const editBtn = document.createElement("button");
       editBtn.className = `col-md-auto btn btn-link edit-post-${post.id}`;
       editBtn.innerHTML = `${editIcon}`;
       editBtn.setAttribute("type", "button");

        //create a save button
        const saveEdit = document.createElement("button");
        saveEdit.className = `col-md-auto btn btn-link save-post-${post.id}`;
        saveEdit.innerHTML = `${saveIcon}`;
        saveEdit.setAttribute("type", "button");

        //create a delete button 
        const deletePost = document.createElement("button");
        deletePost.className = `col-md-auto btn btn-link delete-post-${post.id}`;
        deletePost.innerHTML = `${deleteIcon}`
        deletePost.setAttribute("type", "button");

        
        document.querySelector("#profile-container").append(cardPost);
        console.log("apend de card")

        //select div for buttons section
        const divButtons = document.getElementById(`buttons-post-${post.id}`)

        cardPost.addEventListener("mouseenter", function() {
            divButtons.style.visibility = "visible";
        
            // append edit, save and delete buttons to the divButtons
            divButtons.append(editBtn);
            divButtons.append(saveEdit);
            divButtons.append(deletePost);
        })

        cardPost.addEventListener("mouseleave", function(){
            divButtons.style.visibility = "hidden";
        })
              
        editBtn.addEventListener("click", function() {
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
            .then(() => { likeBtn.innerHTML = greyIcon })
            .then(() => fetch(`http://127.0.0.1:8000/api/posts/${post.id}`)
                .then(response => response.json())
                .then(post => document.querySelector(`.span-${post_id}`).innerHTML = `${post.num_likes}`) 
            )
        }

    })   

}

function editPost(post, saveEdit, editBtn){
    const content = document.querySelector(`#content-${post.id}`); 
    content.innerHTML = `<textarea id="textarea-${post.id}" style="width:100%;" maxlength=200>${post.content}</textarea>`;
    const textArea = document.querySelector(`#textarea-${post.id}`);

    saveEdit.addEventListener("click", function(){
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
                loadUserPosts(post)
            })
        )
    
    })
}
        
