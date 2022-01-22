from http.client import HTTPResponse

from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.

# default view:
def index(request):
    return render(request, "hello/index.html")

def naty(request):
    return HttpResponse("Hello, Naty!")

def greet(request, name):
    return render(request, "hello/greet.html", {
        "name": name.capitalize()
    })

