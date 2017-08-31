from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.datastructures import MultiValueDictKeyError
from .yelpapi import *
import redis

r = redis.StrictRedis(host=os.getenv("redishost", "0.0.0.0"), port=6379, password=os.getenv("redispass", None))

def errorMsg(e):
    return {"name": "ERROR", 'categories': ["Missing " + str(e)], 'img': 'http://thecatapi.com/api/images/get?format=src&type=gif', 'next': "None"}

@csrf_exempt
def start(request):
    try:
        session = request.POST['SESSION']
        location = request.POST['LOCATION']
        query_restaurants(session, location)
        msg = next_restaurant(session, first=True)
    except MultiValueDictKeyError as e:
        msg = errorMsg(e)
    return HttpResponse(msg)

@csrf_exempt
def next(request):
    try:
        session = request.POST['SESSION']
        result = request.POST['RESULT'] == 'true'
        msg = next_restaurant(session, result=result)
    except MultiValueDictKeyError as e:
        msg = errorMsg(e)
    return HttpResponse(msg)

@csrf_exempt
def results(request):
    try:
        session = request.POST['SESSION']
        result = request.POST['RESULT'] == 'true'
        next_restaurant(session, result=result)
        msg = get_recommend(session)
    except MultiValueDictKeyError as e:
        msg = errorMsg(e)
    return HttpResponse(msg)
