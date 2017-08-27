from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.datastructures import MultiValueDictKeyError
from .yelpapi import *
import redis

r = redis.StrictRedis(host='0.0.0.0', port=6379)
getAuth()

@csrf_exempt
def index(request):
    print(request.POST)
    try:
        type = request.POST['TYPE']
        session = request.POST['SESSION']
        if type == "start":
            location = request.POST['LOCATION']
            query_restaurants(session, location)
            msg = next_restaurant(session, first=True)
        elif type == "next":
            result = request.POST['RESULT'] == 'true'
            msg = next_restaurant(session, result=result)
        elif type == 'results':
            result = request.POST['RESULT'] == 'true'
            next_restaurant(session, result)
            msg = get_recommend(session)
    except MultiValueDictKeyError as e:
        msg = "[ERROR] Missing " + e
    return HttpResponse(msg)
