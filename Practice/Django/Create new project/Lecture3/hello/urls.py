from django.urls import path
from . import views

urlpatterns=[
    path("", views.index, name="index"), 
    path("naty", views.naty, name="naty"), 
    path("<str:name>", views.greet, name="greet")
]
