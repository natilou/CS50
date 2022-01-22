import random
from django.shortcuts import redirect, render
from django.http import Http404

from . import util


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def show_entry(request, title):
    entry =  util.get_entry(title)
    if entry:
        return render(request, "encyclopedia/entry.html", {
            "title": title,
            "content": entry,         
        })
    else:
        raise Http404


def random_entry(request):
    entries = util.list_entries()
    return redirect("show_entry", title=random.choice(entries)) 
