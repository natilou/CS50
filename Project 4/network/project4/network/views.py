import json
from pydoc import classname
from unittest.util import _MAX_LENGTH
from urllib import request
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpRequest, HttpResponse, HttpResponseRedirect, JsonResponse, QueryDict
from django.shortcuts import redirect, render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django import forms
from .models import User, Post, Comment, Following
from django.shortcuts import get_object_or_404

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
    #serializers.serialize('json', posts)
    # return HttpResponse(posts_list, content_type="text/json-comment-filtered")
    return JsonResponse([post.serialize() for post in posts], safe=False)


def load_posts(request):
    return render(request, "network/all-posts.html")

    
@login_required
def profile(request, user_id): 
    profile_user = get_object_or_404(User, id=user_id)
    get_user_posts(request, user_id)
    return render(request, "network/profile.html", {
        "profile_user": profile_user, 
    })

def get_user_posts(request, user_id):
    user_posts = Post.objects.filter(user=user_id).order_by("-created")
    return JsonResponse([post.serialize() for post in user_posts], safe=False)

def get_followers(request, user_id):
    followers = Following.objects.filter(followee=user_id)
    return JsonResponse([follower.serialize() for follower in followers], safe=False)





