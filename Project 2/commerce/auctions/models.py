from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import datetime


class User(AbstractUser):
    pass

class Bid(models.Model):
    amount = models.FloatField()
    currency = models.CharField(max_length=4)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bids") 

    def __str__(self) -> str:
        return f"Amount: {self.currency} {self.amount}"
    
    def show_bid(self):
        return self.amount


class Listing(models.Model):
    title = models.CharField(max_length=64)
    description = models.TextField(max_length=300)
    starting_price = models.FloatField()
    currency = models.CharField(max_length=4)
    image_url = models.URLField(null=True, blank=True)
    category = models.CharField(max_length=64, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="listings")
    current_price = models.FloatField()

    @property
    def status_label(self):
        if not self.is_active:
            return "Closed"
        return "Active" 

    #acá habría que agregar cómo el usuario cambia is_active?   


    def __str__(self) -> str:
        return f"{self.title}, starting bid: {self.starting_price}, {self.category}, {self.status_label}"
    
    def change_price(self):
        if Bid.show_bid():
            self.current_price += Bid.amount
        
        return self.current_price

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    body = models.TextField(max_length=200)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="comments")
    created = models.DateTimeField(default=datetime.now)

    def __str__(self) -> str:
        return f"Comment by {self.user} at {self.created}"


class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="watchlists")
    listings = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="watchlists")
