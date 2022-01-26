from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("new", views.new, name="new"), 
    path("<int:listing_id>", views.listing, name="listing"),
    path("<int:listing_id>/watchlist/add", views.add_to_watchlist, name="add_to_watchlist"),
    path("<int:listing_id>/watchlist/remove", views.remove_listing, name="remove_listing"),
    path("watchlist",views.show_watchlist, name="show_watchlist"), 
    path("categories", views.show_categories, name="show_categories")
]
