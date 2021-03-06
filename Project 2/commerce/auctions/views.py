from locale import currency
from pydoc import describe
from typing import List
from unicodedata import category
from webbrowser import get
from django import http
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import redirect, render
from django.urls import reverse
from django import forms
from django.contrib.auth.decorators import login_required
from .models import Category, User, Listing, Bid, Comment, Watchlist
from django.shortcuts import get_object_or_404
from django.contrib import messages

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
    if request.user.is_authenticated:
        is_in_watchlist = Watchlist.objects.filter(user=request.user, listings=listing_page).exists()
    return render(request, "auctions/listing.html", {
        "listing": listing_page, 
        "is_in_watchlist": is_in_watchlist, 
        "comment_form": FormCreateComment(),
        "comments": Comment.objects.filter(listing=listing_id),
        "bid_form": FormCreateBid(),
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

@login_required
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

@login_required
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

class FormCreateBid(forms.Form):
    amount = forms.FloatField()
    currency = forms.CharField(max_length=4)

@login_required
def create_bid(request, listing_id):
    listing = get_object_or_404(Listing, id=listing_id)
    if request.method == "POST":
        bid_form = FormCreateBid(data=request.POST)
        if bid_form.is_valid():
            amount = bid_form.cleaned_data["amount"]
            currency = bid_form.cleaned_data["currency"]
            if currency == listing.currency and amount > listing.current_price and listing.is_active:
                messages.success(request, f"You just made a bid for {currency} {amount}")
                Bid.objects.create(amount=amount, currency=currency, user=request.user, listing=listing)
                return render(request, "auctions/listing.html", {
                "listing": listing,
                "comment_form": FormCreateComment(),
                "comments": Comment.objects.filter(listing=listing),
                "bid_form": FormCreateBid()
                })
            else:
                messages.error(request, "The bid must be higher or the currency must be the same as the listing")
                return render(request, "auctions/listing.html", {
                "listing": listing,
                "comment_form": FormCreateComment(),
                "comments": Comment.objects.filter(listing=listing), 
                "bid_form": bid_form
            })
        else:
            return render(request, "auctions/listing.html", {
                "listing": listing,
                "comment_form": FormCreateComment(),
                "comments": Comment.objects.filter(listing=listing), 
                "bid_form": bid_form
            })
    return render(request, "auctions/listing.html", {
        "comment_form": FormCreateComment(),
        "listing": listing,
        "comments": Comment.objects.filter(listing=listing),
        "bid_form": FormCreateBid()
    })


@login_required
def close_listing(request, listing_id):
    listing = get_object_or_404(Listing, id=listing_id)
    if Listing.objects.filter(user=request.user, id=listing_id, is_active=True).exists():
       listing.is_active = False
       listing.save()
    return HttpResponseRedirect(reverse("listing", kwargs={"listing_id": listing_id}))


@login_required
def show_my_listings(request):
    return render(request, "auctions/my_listings.html", {
        "my_listings": Listing.objects.filter(user=request.user)
    })

@login_required
def show_my_bids(request):
    bids = Bid.objects.filter(user=request.user).order_by('-amount')
    max_bid_per_listing = {}
 
    for bid in bids:
        if bid.listing_id not in max_bid_per_listing:
            max_bid_per_listing[bid.listing_id] = bid

    return render(request, "auctions/my_bids.html", {
        "bids": list(max_bid_per_listing.values())
    })



@login_required
def show_bids_received(request, listing_id):
    listing = get_object_or_404(Listing, id=listing_id)
    bids_received = Bid.objects.filter(listing_id=listing.id).order_by('-amount')
    return render(request, "auctions/bids_received.html", {
        "bids": bids_received, 
        "listing": listing
    } )


