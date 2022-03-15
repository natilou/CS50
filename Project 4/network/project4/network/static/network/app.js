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