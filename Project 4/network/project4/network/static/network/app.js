    document.addEventListener("DOMContentLoaded", function() {
        fetch("http://127.0.0.1:8000/api/posts")
        .then(response => response.json())
        .then(posts => {
            console.log(posts);
            posts.forEach((post) => {
                loadPosts(post);
            });
        })
        }
    )


function loadPosts(post){
    console.log(post)
    const postDiv = document.createElement('div');
    postDiv.className = "card";
    postDiv.innerHTML = `<div class="card-header"><strong>${post.fields.user}</strong></div>
    <div class="card-body">
        <div> 
            <h5 class="card-title">${post.fields.content}
            <span><small>Published at ${post.fields.created}</small></span>
        </div>
        <p class="card-text">Likes ${post.fields.likes}</p>
    </div>`;

    document.querySelector(".container").append(postDiv); 
}