
from unicodedata import name
from django.urls import path

# from rest_framework import routers, serializers, viewsests

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"), 
    path("api/posts", views.get_posts, name="api-post"),
    path("api/posts/<int:post_id>", views.get_post, name="api-post-id"),
    path("api/posts/<int:post_id>/like", views.like_post, name="like_post"), 
    path("api/posts/<int:post_id>/unlike", views.unlike_post, name="unlike_post"), 
    path("api/posts/<int:post_id>/edit", views.edit_post, name="edit_post"),
    path("api/posts/<int:post_id>/delete", views.delete_post, name="delete_post"), 
    path("api/<int:user_id>/posts", views.get_user_posts, name="api-profile-posts"),
    path("api/<int:user_id>/is-following", views.is_following, name="is_following"), 
    path("api/posts/followees", views.get_posts_from_followees, name="get_posts_from_followees"),
    path("api/twitter/<str:username>", views.get_twitter_username, name = "get_twitter_username"),
    path("<int:user_id>", views.profile, name="profile"),
    path("<int:user_id>/follow", views.follow_user, name="follow_user"), 
    path("<int:user_id>/unfollow", views.unfollow_user, name="unfollow_user"), 
    path("<int:user_id>/get-followers", views.get_followers, name="get_followers"),
    path("new-post", views.create_new_post, name="new-post"),
    path("posts", views.load_posts, name="posts"), 
    path("posts/followees", views.load_posts_followees, name="load_posts_followees"),
    path("post/real-tweets", views.load_real_tweets, name="real-tweets")
]
