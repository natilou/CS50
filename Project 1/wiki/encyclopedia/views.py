import random
import markdown2
from django.shortcuts import redirect, render
from django.http import Http404, HttpResponseRedirect
from django.urls import reverse
from django import forms
from django.core.exceptions import ValidationError

from . import util


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def show_entry(request, title):
    entry = util.get_entry(title)
    if entry:
        return render(request, "encyclopedia/entry.html", {
            "title": title,
            "content": markdown2.markdown(entry)      
        })
    else:
        raise Http404


def random_entry(request):
    entries = util.list_entries()
    return redirect("show_entry", title=random.choice(entries))

class NewPageForm(forms.Form):
    title = forms.CharField(label="Title")
    textarea = forms.CharField(widget=forms.Textarea,label="Information")
    
    def clean_title(self):
        title = self.cleaned_data["title"]
        if util.get_entry(title):
            raise ValidationError("A entry with this title already exists.")
        return title

def create_entry(request): 
    if request.method == "POST":
        form = NewPageForm(request.POST)
        if form.is_valid():
            title = form.cleaned_data["title"]
            textarea = form.cleaned_data["textarea"]
            util.save_entry(title, textarea)
            return HttpResponseRedirect(reverse('show_entry', kwargs={"title":title}))
        else:
            return render(request, "encyclopedia/new_entry.html", {
                "form": form
            })
    
    return render(request, "encyclopedia/new_entry.html",{
        "form": NewPageForm()
    })
