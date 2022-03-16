
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
    path("api/profile/posts", views.get_user_posts, name="api-profile-posts"),
    path("profile", views.profile, name="profile")
]