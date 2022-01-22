from django.shortcuts import render
from django import forms
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.template.defaulttags import register


class NewTaskForm(forms.Form):
    task = forms.CharField(label="New Task")
    priority = forms.IntegerField(label="Priority", min_value=1, max_value=5)

# Create your views here.
def index(request):
    if "tasks" not in request.session:
        request.session["tasks"] = []

    return render(request, "tasks/index.html", {
        "tasks": sorted(request.session["tasks"], key= lambda task: task[1], reverse=True)
    })

def add(request):
    if request.method == "POST":
        form = NewTaskForm(request.POST)
        if form.is_valid():
            task = form.cleaned_data["task"]
            priority = form.cleaned_data["priority"]
            request.session["tasks"] += [(task, priority)]
            return HttpResponseRedirect(reverse("tasks:index"))
        else:
            return render(request, "tasks/add.html", {
                "form": form 
            })
            
    return render(request, "tasks/add.html", {
        "form": NewTaskForm()
    })



@register.filter
def get_range(value):
    return range(value)
