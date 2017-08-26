from django.shortcuts import render
from django.http import HttpResponse
from django.utils.datastructures import MultiValueDictKeyError
from django.views.decorators.csrf import csrf_exempt

import redis, datetime
from random import randint
from .auth import *

r = redis.StrictRedis(host='0.0.0.0', port=6379)

@csrf_exempt
def index(request):
    try:
        type = request.POST['TYPE']

        if type == "createuser":
            msg = generate_new_user(request.POST['NAME'], request.POST['PASS'])
        if type == 'validate':
            if validate(request.POST['NAME'], request.POST['PASS']):
                session = randint(100000, 999999)
                while r.exists(session) == 1:
                    session = randint(100000, 999999)
                r.hset(session, "time", str(datetime.datetime.now()))
                r.hset(session, "name", request.POST['NAME'])
            msg = session
        else:
            msg = "[ERROR] Invalid Command"
    except MultiValueDictKeyError as err:
        msg = "[ERROR] Missing POST Parameter: {0}".format(str(err)[1:-1])
    return HttpResponse(msg)
