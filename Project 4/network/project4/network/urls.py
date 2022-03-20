
from django.urls import path

# from rest_framework import routers, serializers, viewsests

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"), 
    path("new-post", views.create_new_post, name="new-post"),
    path("api/posts", views.get_posts, name="api-post"), 
    path("posts", views.load_posts, name="posts"), 
    path("<int:user_id>/api/posts", views.get_user_posts, name="api-profile-posts"),
    path("<int:user_id>", views.profile, name="profile"),
    path("<int:user_id>/api/is-following", views.is_following, name="is_following"), 
    path("<int:user_id>/follow", views.follow_user, name="follow_user"), 
    path("<int:user_id>/unfollow", views.unfollow_user, name="unfollow_user"), 
    path("<int:user_id>/get-followers", views.get_followers, name="get_followers"), 
    path("api/posts/followees", views.get_posts_from_followees, name="get_posts_from_followees"),
    path("posts/followees", views.load_posts_followees, name="load_posts_followees")
]
