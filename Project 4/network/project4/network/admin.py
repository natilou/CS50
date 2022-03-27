from django.contrib import admin
from .models import User, Post, Comment, Following, Likes

admin.site.register(User)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Following)
admin.site.register(Likes)