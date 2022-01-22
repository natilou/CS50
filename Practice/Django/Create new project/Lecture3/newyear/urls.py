from pydoc import importfile
from django.urls import path

from . import views

urlpatterns= [
    path("", views.index, name="index")
]
