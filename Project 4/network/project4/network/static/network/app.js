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
    fetch("http://127.0.0.1:8000/api/profile/posts")
        .then(response => response.json())
        .then(posts => {
            posts.forEach((post) => {
            loadUserPosts(post);
                });
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
                <div class="col-9"><strong>${post.user}</strong></div>
                <div class="col-3">${post.created}</div>
            </div>
        </div>
    </div>
    <div class="card-body">
        <div> 
            <h5 class="card-title">${post.content}

        </div>
        <p class="card-text">Likes ${post.likes}</p>
        
    </div>`;

    document.querySelector(".container-xl").append(postDiv); 
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
            <div class="col-9"><strong>${post.user}</strong></div>
            <div class="col-3">${post.created}</div>
        </div>
    </div>
    </div>
    <div class="card-body">
        <div> 
            <h5 class="card-title">${post.content}
        </div>
         <p class="card-text">Likes ${post.likes}</p>
    </div>`;
    document.querySelector("#profile-container").append(userDivPost);
}