from datetime import datetime
import json
from pydoc import classname
from unittest.util import _MAX_LENGTH
from urllib import request
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpRequest, HttpResponse, HttpResponseBadRequest, HttpResponseNotFound, HttpResponseRedirect, JsonResponse, QueryDict
from django.shortcuts import redirect, render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django import forms
from .models import User, Post, Comment, Following, Likes
from django.shortcuts import get_object_or_404
from django.db import models

def index(request):
    if request.user.is_authenticated:
        return render(request, "network/index.html", {
            "form": FormNewPost(),
        })
    else:
        return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

class FormNewPost(forms.Form):
    content = forms.CharField(widget=forms.Textarea(attrs={'class': "form-control"}), max_length=200, label="")

@login_required 
def create_new_post(request):
    if request.method == "POST":
        form = FormNewPost(request.POST)
        if form.is_valid():
            content = form.cleaned_data["content"]
            Post.objects.create(user=request.user, content=content)
            return HttpResponseRedirect(reverse('index'))
        else:
            return HttpResponseRedirect(reverse('index'), {
                "form": form
            })
    return HttpResponseRedirect(reverse('index'), {
                "form": FormNewPost()
     })

def get_posts(request):
    posts = Post.objects.order_by("-created").all()
    # Get variable serialized_posts
    serialized_posts = [post.serialize() for post in posts]
    # Iterate through serialized posts, adding is_liked key for each one
    for serialized_post in serialized_posts:
        is_liked = Likes.objects.filter(user=request.user, post_id = serialized_post["id"]).exists()
        serialized_post["is_liked"] = is_liked
    #serializers.serialize('json', posts)
    # return HttpResponse(posts_list, content_type="text/json-comment-filtered")
    return JsonResponse(serialized_posts, safe=False)


def load_posts(request):
    return render(request, "network/all-posts.html")

    
@login_required
def profile(request, user_id): 
    profile_user = get_object_or_404(User, id=user_id)
    return render(request, "network/profile.html", {
        "profile_user": profile_user, 
    })

def get_user_posts(request, user_id):
    user_posts = Post.objects.filter(user=user_id).order_by("-created")
    serialized_posts = [post.serialize() for post in user_posts]
    # Iterate through serialized posts, adding is_liked key for each one
    for serialized_post in serialized_posts:
        is_liked = Likes.objects.filter(user=request.user, post_id = serialized_post["id"]).exists()
        serialized_post["is_liked"] = is_liked
    return JsonResponse(serialized_posts, safe=False)

@login_required
def is_following(request, user_id):
    is_following = Following.objects.filter(follower=request.user, followee=user_id).exists()
    return JsonResponse({"is_following": is_following}, safe=False)

@login_required
def follow_user(request,  user_id):
    if request.method == "POST":
        followers = Following.objects.filter(follower=request.user, followee_id=user_id).exists()
        if not followers:
            Following.objects.create(follower=request.user, followee_id=user_id)
            return HttpResponse()
    return HttpResponseNotFound()

@login_required
def unfollow_user(request, user_id):
    if request.method == "POST":
        followers = Following.objects.filter(follower=request.user, followee_id=user_id).exists()
        if followers:
            Following.objects.filter(follower=request.user, followee_id=user_id).delete()
            return HttpResponse()
    return HttpResponseNotFound()

def get_followers(request, user_id):
    user_profile = get_object_or_404(User, id=user_id)
    return JsonResponse({"num_followers": user_profile.num_followers}, safe=False)

@login_required
def get_posts_from_followees(request):
    posts = Post.objects.filter(
        user__followees__follower=request.user
    ).order_by("-created")
    # Get variable serialized_posts
    serialized_posts = [post.serialize() for post in posts]
    # Iterate through serialized posts, adding is_liked key for each one
    for serialized_post in serialized_posts:
        is_liked = Likes.objects.filter(user=request.user, post_id = serialized_post["id"]).exists()
        serialized_post["is_liked"] = is_liked
    return JsonResponse(serialized_posts, safe=False)

@login_required
def load_posts_followees(request):
    return render(request, "network/posts-followees.html")

@login_required
def like_post(request, post_id):
    if request.method == "POST":
        liked = Likes.objects.filter(user=request.user, post_id=post_id).exists()
        if not liked:
            Likes.objects.create(user=request.user, post_id=post_id)
            return HttpResponse()
    return HttpResponseNotFound()

@login_required
def unlike_post(request, post_id):
    if request.method == "POST":
        liked = Likes.objects.filter(user=request.user, post_id=post_id).exists()
        if liked:
            Likes.objects.filter(user=request.user, post_id=post_id).delete()
            return HttpResponse()
    return HttpResponseNotFound()

def get_post(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    serialized_post = post.serialize()
    serialized_post["is_liked"] = Likes.objects.filter(user=request.user, post=post).exists()
    return JsonResponse(serialized_post, safe=False)

@login_required
def edit_post(request, post_id):
    if request.method == "POST":
        data = json.loads(request.body)
        post_edited = get_object_or_404(Post, id = post_id)
        post_edited.content = data["content"]
        post_edited.updated = datetime.now()      
        post_edited.save()
        return JsonResponse(post_edited.serialize(), safe=False)  
    else:
        return HttpResponseBadRequest()



