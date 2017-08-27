from django.shortcuts import render
from django.http import HttpResponse
from django.utils.datastructures import MultiValueDictKeyError
from django.views.decorators.csrf import csrf_exempt

import redis, datetime
from random import randint
from .auth import *

r = redis.StrictRedis(host='0.0.0.0', port=6379)

@csrf_exempt
def createuser(request):
    try:
        msg = generate_new_user(request.POST['NAME'], request.POST['PASS'])
    except MultiValueDictKeyError as e:
        msg = "[ERROR] Missing POST Parameter: {0}".format(str(e)[1:-1])
    return HttpResponse(msg)

@csrf_exempt
def urlvalidate(request):
    try:
        if validate(request.POST['NAME'], request.POST['PASS']):
            r.hset(request.POST['SESSION'], "name", request.POST['NAME'])
            msg = request.POST['NAME']
        else:
            msg = "False"
    except MultiValueDictKeyError as e:
        msg = "[ERROR] Missing POST Parameter: {0}".format(str(e)[1:-1])
    return HttpResponse(msg)

@csrf_exempt
def session(request):
    try:
        msg = new_session(r)
    except MultiValueDictKeyError as e:
        msg = "[ERROR] Missing POST Parameter: {0}".format(str(e)[1:-1])
    return HttpResponse(msg)
