from locale import currency
from pydoc import describe
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django import forms
from django.contrib.auth.decorators import login_required
from .models import User, Listing, Bid, Comment, Watchlist
from django.shortcuts import get_object_or_404


def index(request): 
    return render(request, "auctions/index.html", {
        "listings": Listing.objects.filter(is_active = True) 
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

class CreateForm(forms.Form):
    title = forms.CharField(label="Title")
    description = forms.CharField(widget=forms.Textarea,label="Details", max_length=300)
    starting_price = forms.FloatField()
    currency = forms.CharField(max_length=4)
    image_url = forms.URLField(required=False)
    category = forms.CharField(max_length=64, required=False)
    current_price = starting_price


@login_required  #cambiar a new_listing
def new(request):
    if request.method == "POST":
        form = CreateForm(request.POST)
        if form.is_valid():
            title = form.cleaned_data["title"]
            description = form.cleaned_data["description"]
            starting_price = form.cleaned_data["starting_price"]
            currency = form.cleaned_data["currency"]
            image_url = form.cleaned_data["image_url"]
            category = form.cleaned_data["category"]
            current_price = form.cleaned_data["current_price"]
            Listing.objects.create(title=title, description=description,starting_price=starting_price, currency=currency, image_url=image_url, category=category, current_price=current_price, user=request.user)
            return  HttpResponseRedirect(reverse('index'))
        else:
            return render(request, "auctions/new.html", {
                "form": form
            })
    return render(request, "auctions/new.html", {
        "form": CreateForm()
    })

def listing(request, listing_id):
    listing_page = Listing.objects.get(id=listing_id)
    return render(request, "auctions/listing.html", {
        "listing": listing_page
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