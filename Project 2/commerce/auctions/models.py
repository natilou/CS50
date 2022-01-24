from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Bid(models.Model):
    starting_amount = models.FloatField()
    currency = models.CharField(max_length=4) 

    def __str__(self) -> str:
        return f"{self.currency} {self.starting_amount}"
    

class Comment(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="user_comments")
    textarea = models.TextField(max_length=200)

    def __str__(self) -> str:
        return f"Comment by {self.user}, {self.textarea}"


class Listing(models.Model):
    title = models.CharField(max_length=64)
    description = models.TextField(max_length=300)
    starting_bid = models.ForeignKey(Bid, on_delete=models.CASCADE, related_name="bids")
    url_img = models.URLField()
    category = models.CharField(max_length=64)
    is_active = models.BooleanField(default=True)
    user = models.OneToOneField(User,  on_delete=models.CASCADE, related_name="user_listings")
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name="listing_comments")
    
    @property
    def status_label(self):
        if not self.is_active:
            return "Closed"
        return "Active" 


    def __str__(self) -> str:
        return f"{self.title}, starting bid: {self.starting_bid}, {self.category}, {self.status_label}"
