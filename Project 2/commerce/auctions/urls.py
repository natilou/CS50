from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("new", views.new_listing, name="new"), 
    path("<int:listing_id>", views.listing, name="listing"),
    path("<int:listing_id>/watchlist/add", views.add_to_watchlist, name="add_to_watchlist"),
    path("<int:listing_id>/watchlist/remove", views.remove_listing, name="remove_listing"),
    path("watchlist",views.show_watchlist, name="show_watchlist"), 
    path("categories", views.show_categories, name="show_categories"),
    path("<int:listing_id>/comment", views.create_comment, name="create_comment"),
    path("<int:listing_id>/bid", views.create_bid, name="create_bid"),
    path("<int:listing_id>/close_listing", views.close_listing, name="close_listing"), 
    path("mylistings", views.show_my_listings, name="show_my_listings"), 
    path("my_bids", views.show_my_bids, name="show_my_bids"), 
]
