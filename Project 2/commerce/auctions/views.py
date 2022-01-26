from locale import currency
from pydoc import describe
from typing import List
from unicodedata import category
from django import http
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django import forms
from django.contrib.auth.decorators import login_required
from .models import Category, User, Listing, Bid, Comment, Watchlist
from django.shortcuts import get_object_or_404


def index(request):
    listings =  Listing.objects.filter(is_active = True) 
    category_id = request.GET.get("category_id")
    if category_id:
        listings = listings.filter(category_id=category_id)
    
    return render(request, "auctions/index.html", {
        "listings": listings
    })


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
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


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
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")


class FormCreateListing(forms.Form):
    title = forms.CharField(label="Title")
    description = forms.CharField(widget=forms.Textarea,label="Details", max_length=300)
    starting_price = forms.FloatField()
    currency = forms.CharField(max_length=4)
    image_url = forms.URLField(required=False)
    category = forms.ModelChoiceField(queryset=Category.objects.all())

@login_required 
def new_listing(request):
    if request.method == "POST":
        form = FormCreateListing(request.POST)
        if form.is_valid():
            title = form.cleaned_data["title"]
            description = form.cleaned_data["description"]
            starting_price = form.cleaned_data["starting_price"]
            currency = form.cleaned_data["currency"]
            image_url = form.cleaned_data["image_url"]
            category = form.cleaned_data["category"]
            Listing.objects.create(title=title, description=description,starting_price=starting_price, currency=currency, image_url=image_url, category=category, user=request.user)
            return  HttpResponseRedirect(reverse('index'))
        else:
            return render(request, "auctions/new.html", {
                "form": form
            })
    return render(request, "auctions/new.html", {
        "form": FormCreateListing()
    })

def listing(request, listing_id):
    listing_page = Listing.objects.get(id=listing_id)
    is_in_watchlist = False
    if request.user:
        is_in_watchlist = Watchlist.objects.filter(user=request.user, listings=listing_page).exists()
    return render(request, "auctions/listing.html", {
        "listing": listing_page, 
        "is_in_watchlist": is_in_watchlist, 
        "comment_form": FormCreateComment(),
        "comments": Comment.objects.filter(listing=listing_id) 
    })


@login_required
def add_to_watchlist(request, listing_id):
    listing = get_object_or_404(Listing, id=listing_id)
    if not Watchlist.objects.filter(user=request.user, listings=listing).exists():
        Watchlist.objects.create(user=request.user, listings=listing) 
    return HttpResponseRedirect(reverse("show_watchlist"))

@login_required
def remove_listing(request, listing_id):
    listing = get_object_or_404(Listing, id=listing_id)
    if Watchlist.objects.filter(user=request.user, listings=listing).exists():
       Watchlist.objects.filter(user=request.user, listings=listing).delete()
    return HttpResponseRedirect(reverse("show_watchlist"))


def show_watchlist(request):
    return render(request, "auctions/watchlist.html", {
        "listings": Listing.objects.filter(watchlists__user=request.user)
    })

def show_categories(request):
    return render(request, "auctions/show_categories.html", {
        "categories": Category.objects.all()
    })


class FormCreateComment(forms.Form):
    body = forms.CharField(widget=forms.Textarea,label="Comment", max_length=300)

def create_comment(request, listing_id):
    listing = get_object_or_404(Listing, id=listing_id)
    if request.method == "POST":
        form = FormCreateComment(data=request.POST)
        if form.is_valid():
            body = form.cleaned_data["body"]
            Comment.objects.create(body=body, user=request.user, listing=listing)
            return render(request, "auctions/listing.html", {
                "listing": listing,
                "comment_form": FormCreateComment(),
                "comments": Comment.objects.filter(listing=listing)
            })
        else:
            return render(request, "auctions/listing.html", {
            "comment_form": form,
            "listing": listing,
            "comments": Comment.objects.filter(listing=listing)
            })
    return render(request, "auctions/listing.html", {
        "comment_form": FormCreateComment(),
        "listing": listing,
        "comments": Comment.objects.filter(listing=listing)
    })
