from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import Max



class User(AbstractUser):
    pass


class Category(models.Model):
    name = models.CharField(max_length=64)

    def __str__(self):
        return self.name

class Listing(models.Model):
    title = models.CharField(max_length=64)
    description = models.TextField(max_length=300)
    starting_price = models.FloatField()
    currency = models.CharField(max_length=4)
    image_url = models.URLField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="listings")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="listings")

    @property
    def status_label(self):
        if not self.is_active:
            return "Closed"
        return "Active" 

    @property
    def current_price(self):
        max_amount = Bid.objects.filter(listing=self).aggregate(Max("amount")).get('amount__max')
        if max_amount:
            return max_amount
        return self.starting_price      

    @property
    def bid_winner(self):
        last_bid = Bid.objects.filter(listing_id=self).last()
        if self.status_label == "Closed":
            return last_bid.user
    

    def __str__(self) -> str:
        return f"{self.title}, starting bid: {self.starting_price}, {self.category}, {self.status_label}"

    
class Bid(models.Model):
    amount = models.FloatField()
    currency = models.CharField(max_length=4)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bids") 
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="bids")

    def __str__(self) -> str:
        return f"Amount: {self.currency} {self.amount}"


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    body = models.TextField(max_length=200)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="comments")
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)

    class Meta:
        ordering = ('created',)

    def __str__(self) -> str:
        return f"{self.body}. Commented by {self.user} at {self.created}"


class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="watchlists")
    listings = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="watchlists")
