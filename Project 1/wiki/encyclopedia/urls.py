from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("wiki/<str:title>", views.show_entry, name="show_entry"),
    path("random", views.random_entry, name="random_entry"),
    path("new", views.create_entry, name="create_entry"),
    path("edit/<str:title>", views.edit_entry, name="edit_entry")
]
