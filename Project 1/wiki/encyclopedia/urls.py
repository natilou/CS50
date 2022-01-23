from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("wiki/<str:title>", views.show_entry, name="show_entry"),
    path("random", views.random_entry, name="random_entry"),
    path("new", views.create_new_page, name="create_new_page"),
]
