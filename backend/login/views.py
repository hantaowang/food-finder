from django.shortcuts import render
from django.http import HttpResponse
from .auth import *

# Create your views here.

def index(request):
    if validate(request.GET, ["TYPE"]) != True:
            msg = "[ERROR] Missing Field: " + validate(request.GET, ["TYPE"])
            return HttpResponse(msg)
    type = request.GET["TYPE"]

    if type == "createuser":
        if validate(request.GET, ["NAME"]) != True:
            msg = "[ERROR] Missing Field: " + validate(request.GET, ["NAME"])
            return HttpResponse(msg)
        salt = generate_new_user(request.GET["NAME"])
        return HttpResponse(salt)
    

# Validates that the necessary fields exist in the request
def validate(dict, fields):
    for f in fields:
        if f not in fields:
            return f
    return True
