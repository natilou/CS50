// Constants

const serverAddress = "http://127.0.0.1:8000"

const allPostsContainerId = "all-posts-container";

const profilePostsContainerId = "profile-container";

const followeesPostsContainerId = "posts-followees-container";

const allPostsPaginationId = "all-posts-pagination"; 

const profilePaginationId = "profile-pagination"; 

const followeesPaginationId = "followees-pagination"; 

const userProfileId = document.getElementById("js-user-profile-id") ? document.getElementById("js-user-profile-id").value : null

const redIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
<path fill="#dc3545" fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
</svg>`;

const greyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
<path fill="#90929a" fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
</svg>`;

const editIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pl-square" viewBox="0 0 16 16">
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


// Utils

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


// Events

document.addEventListener("DOMContentLoaded", function() {
    // api fetch to posts from all users
    
    fetch(`${serverAddress}/api/posts`)
    .then(response => response.json())
    .then(response => {
        response.data.forEach((post) => renderPost(post, allPostsContainerId))
        renderPagination(response.page);
    })
    .catch(error => console.log(error))
    },

    
    document.addEventListener("DOMContentLoaded", function(){
        // api fetch to posts from profile user
        if (!userProfileId){
            return;
        }
        fetch(`${serverAddress}/api/${userProfileId}/posts`)
        .then(response => response.json())
        .then(response => {
            response.data.forEach((post) => renderPost(post, profilePostsContainerId));
            renderPagination(response.page); 
        })
        .catch(error => console.log(error))
    }),

    document.addEventListener("DOMContentLoaded", function(){
        // api fetch to know if logged user follow profile user
        const followButton = document.getElementById("follow-btn") ? document.getElementById("follow-btn") : null;
        if (!userProfileId || !followButton){
            return;
        }
        fetch(`${serverAddress}/api/${userProfileId}/is-following`)
        .then(response=>response.json())
        .then(following => {
            if(following.is_following){
                followButton.innerHTML = "Unfollow"
            } else {
                followButton.innerHTML = "Follow"
            }
            followButton.addEventListener("click", () => changeFollowButton())
        })
        .catch(error => console.log(error))
        
    }), 
    
    document.addEventListener("DOMContentLoaded", function(){
        // api fetch to posts from user's followees

        fetch(`${serverAddress}/api/posts/followees`)
        .then(response => response.json())
        .then(response => {
            response.data.forEach((post) => renderPost(post, followeesPostsContainerId))
            renderPagination(response.page)
        })
        .catch(error => console.log(error))
    }),

    document.getElementById("real-tweets").addEventListener("click", function(){
        // api fetch to real twitter posts 

        fetch(`${serverAddress}/api/twitter`)
        .then(response => response.json())
        .then(tweets => tweets.forEach( tweet => renderRealTweet(tweet)))
        .catch(error => console.log(error))
    })
)


// Functions

function generateCardPost(post){
    // Generate card HTML content for post
    
    // Generate generic card content

    const cardPost = document.createElement('div')
    cardPost.id = `card-post-${post.id}`
    cardPost.className = "card";
    cardPost.style.margin = "10px";
    cardPost.innerHTML =  `<div class="card-header">
    <div class="container">
        <div id="title-card-${post.id}" class="row">
            <div class="col-8"><a href="${serverAddress}/${post.user_id}"><strong>${post.user}</strong></a></div>
            <div class="col-2" id="date-post-${post.id}"><small>${post.updated}</small></div>
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

function enrichCardPost(post){
    // Add interactive features to card post 

    // When logged user is the post owner, add action buttons

    let loggedUserId = document.getElementById("js-logged-user") ? document.getElementById("js-logged-user").value : null;

    if (loggedUserId == post.user_id) {
        cardPost = document.getElementById(`card-post-${post.id}`);

        //create a edit button 
        const editBtn = document.createElement("button");
        editBtn.className = `col-md-auto btn btn-link edit-post-${post.id}`;
        editBtn.innerHTML = `${editIcon}`;
        editBtn.setAttribute("type", "button");
        
        //create a save button
        const saveBtn = document.createElement("button");
        saveBtn.className = `col-md-auto btn btn-link save-post-${post.id}`;
        saveBtn.innerHTML = `${saveIcon}`;
        saveBtn.setAttribute("type", "button");

        //create a delete button 
        const deleteBtn = document.createElement("button");
        deleteBtn.className = `col-md-auto btn btn-link delete-post-${post.id}`;
        deleteBtn.innerHTML = `${deleteIcon}`
        deleteBtn.setAttribute("type", "button");

        //select div for buttons section
        const divButtons = document.getElementById(`buttons-post-${post.id}`)
        divButtons.append(editBtn);
        divButtons.append(saveBtn);
        divButtons.append(deleteBtn);

        cardPost.addEventListener("mouseenter", function() {
            divButtons.style.visibility = "visible";
        })

        cardPost.addEventListener("mouseleave", function(){
            divButtons.style.visibility = "hidden";
        })
              
        editBtn.addEventListener("click", function() {
            initializeEditPost(post);
        })

        saveBtn.addEventListener("click", function(){
            saveEditPost(post);
        })

        deleteBtn.addEventListener("click", function(){
            const alert = confirm("Are you sure you want to delete this post?");
            if (alert) {
                deletePost(post);
            }
        })
    }
}

function renderPost(post, containerId){
    // Render post card in specified container
    document.getElementById(containerId).append(generateCardPost(post)); 
    enrichCardPost(post);    
}

function renderPagination(page){
    //change pages

    const pageHtml = document.querySelector("#current a");
    const previousHtml = document.querySelector("#previous a");
    const nextHtml = document.querySelector("#next a");
    currentPage = page.current;
    nextPage = 0;
    previousPage = 0;

    if(page.has_next){
        nextPage = currentPage + 1;
        nextHtml.removeAttribute("aria-disabled");
        nextHtml.setAttribute("href", "#");
    } else {
        nextHtml.setAttribute("aria-disabled", "true")
        nextHtml.removeAttribute("href");
    }

    if(page.has_previous){
        previousPage = currentPage - 1;
        previousHtml.removeAttribute("aria-disabled");
        previousHtml.setAttribute("href", "#");
    } else{
        previousHtml.setAttribute("aria-disabled", "true");
        previousHtml.removeAttribute("href");
    }
    
    pageHtml.innerHTML = currentPage;

    let url;
    let containerId;
    if(document.getElementById("js-user-profile-id")){
        url = `${serverAddress}/api/${userProfileId}/posts`;
        containerId = profilePostsContainerId;
    }
    if(document.getElementById(`${allPostsContainerId}`)){
        url = `${serverAddress}/api/posts`;
        containerId = allPostsContainerId;
    }
    if(document.getElementById(`${followeesPostsContainerId}`)){
        url = `${serverAddress}/api/posts/followees`;
        containerId = followeesPostsContainerId;
    }


    nextHtml.addEventListener("click", function(){
        fetch(`${url}?page=${nextPage}`)
        .then(response => response.json())
        .then(response => {
            document.getElementById(containerId).innerHTML = "";
            response.data.forEach((post) => renderPost(post, containerId));
            renderPagination(response.page); 
        })
        .catch(error => console.log(error))
    })

    previousHtml.addEventListener("click", function(){
        fetch(`${url}?page=${previousPage}`)
        .then(response => response.json())
        .then(response => {
            document.getElementById(containerId).innerHTML = "";
            response.data.forEach((post) => renderPost(post, containerId));
            renderPagination(response.page); 
        })
        .catch(error => console.log(error))
    })

}

function changeFollowButton(){
    // Follow or unfollow user

    const userProfileId = document.getElementById("js-user-profile-id").value;
    const followButton = document.getElementById("follow-btn");
    const followersHTML = document.getElementById("followers");

    fetch(`${serverAddress}/${userProfileId}/api/is-following`)
    .then(response=>response.json())
    .then(following =>  {
        const is_following = following.is_following;
        fetch(`${serverAddress}/${userProfileId}/${is_following ? "unfollow" : "follow"}`, {
            method: "POST",
            headers: {
                "X-CSRFToken": getCookie('csrftoken')
            }
        })
        .then(() => followButton.innerHTML = `${is_following ? "Follow" : "Unfollow"}`)
        .then(() => fetch(`${serverAddress}/${userProfileId}/get-followers`)
            .then(response => response.json())
            .then(followers => followersHTML.innerHTML = `${followers.num_followers} Followers`) 
        )
    }
)
}


function changeLikeStatus(post_id){
    // Like or unlike a post

    let likeBtn = document.querySelector(`.post-${post_id}`); 

    fetch(`${serverAddress}/api/posts/${post_id}`)
    .then(response => response.json())
    .then((post) => {
        let endpointAction = "unlike";
        let colorIcon = greyIcon;  
        if (!post.is_liked){
            endpointAction = "like";
            colorIcon = redIcon;
        }
      
        fetch(`${serverAddress}/api/posts/${post.id}/${endpointAction}`, {
            method: "POST",
            headers: {
                "X-CSRFToken": getCookie('csrftoken')
            }
        })
        .then(() => { likeBtn.innerHTML = colorIcon })
        .then(() => fetch(`${serverAddress}/api/posts/${post.id}`)
            .then(response => response.json())
            .then(post => document.querySelector(`.span-${post_id}`).innerHTML = `${post.num_likes}`) 
        )

    })   

}

function initializeEditPost(post){
    // Create textarea to edit post

    const content = document.getElementById(`content-${post.id}`); 
    content.innerHTML = `<textarea id="textarea-${post.id}" style="width:100%;" maxlength=200>${content.textContent}</textarea>`;
}

function saveEditPost(post){
    // Save changes to post content

    const textArea = document.getElementById(`textarea-${post.id}`);
    fetch(`${serverAddress}/api/posts/${post.id}/edit`,{
        method: "POST",
        headers: {
            "X-CSRFToken": getCookie('csrftoken')
        },
        body: JSON.stringify({
            content: textArea.value,
        }), 
        
    })
    .then(() => fetch(`${serverAddress}/api/posts/${post.id}`)
        .then(response => response.json())
        .then(post => {
            document.querySelector(`#content-${post.id}`).innerHTML = `<h5 class="card-title"id="content-${post.id}">${post.content}</h5>`
            document.querySelector(`#date-post-${post.id}`).innerHTML = `<small>${post.updated}</small>`
        })
    )
}

function deletePost(post){
    // Delete post 
    
    fetch(`${serverAddress}/api/posts/${post.id}/delete`, {
        method: "POST",
        headers: {
            "X-CSRFToken": getCookie('csrftoken')
        }
    })
    .then(()=> document.querySelector(`#card-post-${post.id}`).remove())
}

function renderRealTweet(tweet){
    // Render real twitter posts 

    const realTweetsContainer = document.getElementById("real-tweet-container")
    console.log(tweet)
}


  

