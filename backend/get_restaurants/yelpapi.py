import argparse
import json
import redis
import requests
import sys
import urllib

from urllib.error import HTTPError
from urllib.parse import quote
from urllib.parse import urlencode

# TODO
# Client_ID and Client_Secret constants (MUST REMOVE IF REPO IS PUBLIC)
CLIENT_ID = 'Atz_4eQ6jE5PY839AWdoAQ'
CLIENT_SECRET='raGawm10KZyS4pHsszfjKgE8LjjpIXkAehDfQeBVIIqwwHgKWCDOBQ2slAUMOdZI'

# Redis Client_ID
# r = redis.StrictRedis(host='0.0.0.0', port=6379)

def getAuth():
    url = 'https://api.yelp.com/oauth2/token'
    data = urlencode({
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'client_credentials',
    })
    headers = {
        'content-type': 'application/x-www-form-urlencoded',
    }
    response = requests.request('POST', url, data=data, headers=headers)
    auth_token = response.json()['access_token']
    return auth_token

def query_restaurants(location):
    # Check to see if there is already an auth_token with sessionID (with Redis)
    # auth_token = r.hget(session, 'Auth_Token')
    # if auth_token == None:
    #    auth_token = getAuth()
    #    r.hset(session, 'Auth_Token', auth_token)
    auth_token = getAuth()
    url_params = {
        'term': 'restaurants',
        'location': location.replace(' ', '+'),
        'radius' : 3200,
        'limit' : 20,
    }
    url = 'https://api.yelp.com/v3/businesses/search'
    headers = {
        'Authorization': 'Bearer {0}'.format(auth_token),
    }
    response = requests.request('GET', url, headers=headers, params=url_params).json()
    print(response.type)

# Used for unit testing
if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--loc', type=str, help='Current Location')
    args = parser.parse_args()

    if not args.loc:
        print('Need to input Current Location')
        exit()

    try:
        if args.loc:
            query_restaurants(args.loc)
    except HTTPError as error:
        sys.exit(
            'Encountered HTTP error {0} on {1}:\n {2}\nAbort program.'.format(
                error.code,
                error.url,
                error.read(),
            )
        )
