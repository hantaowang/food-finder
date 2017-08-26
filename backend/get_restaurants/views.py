from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .yelpapi import *
import redis

r = redis.StrictRedis(host='0.0.0.0', port=6379)

@csrf_exempt
def index(request):
    try:
        session = request.POST['SESSION']
        location = request.POST['LOCATION']
        query_restaurants(session, location)
        msg = "Success"
    except:
        msg = "[ERROR] Missing SESSION or LOCATION Parameter"
    return HttpResponse(msg)
