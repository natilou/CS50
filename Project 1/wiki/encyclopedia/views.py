from django.shortcuts import render
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


