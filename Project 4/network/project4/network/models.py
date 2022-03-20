from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    @property
    def num_followers(self):
        total_followers = Following.objects.filter(followee=self).count()
        return total_followers
    
    @property
    def num_followees(self):
        total_followees = Following.objects.filter(follower=self).count()
        return total_followees


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    content = models.TextField(max_length=200)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0)

    def serialize(self):
        return {
            "id": self.id,
            "user": self.user.username,
            "user_id": self.user.id,
            "content": self.content,
            "created": self.created.strftime("%b %d %Y, %I:%M %p"),
            "updated": self.updated.strftime("%b %d %Y, %I:%M %p"),
            "likes": self.likes
        }


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    content = models.TextField(max_length=100)
    created = models.DateTimeField(auto_now_add=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")


class Following(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers")
    followee = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followees")

    class Meta:
        unique_together = ['follower', 'followee']
    
    def serialize(self):
        return {
            "follower": self.follower.username, 
            "followee": self.followee.username
        }
    
