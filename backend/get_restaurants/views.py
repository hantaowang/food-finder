from django.shortcuts import render
from .yelpapi import *
import redis

r = redis.StrictRedis(host='0.0.0.0', port=6379)

def index(request):
    try:
        session = request.POST['SESSION']
        location = request.POST['LOCATION']
        query_restaurants(session, location)
    except:
        msg = "[ERROR] Missing SESSION_ID or LOCATION Parameter"
    return HttpResponse(msg)
