# Food Finder
A Tinder-Like app that helps one choose a nearby restaurant.

## Current Features
The app will present 20 restaurants nearby and have the user "swipe left" or "swipe right" depending on their preferences. The app will then recommend 5 - 12 restaurants based on the user's response. 

## Planned Features
We are planning to have the ability where users can create accounts to save their preferences/responses for future recommendations. We also plan on moving Food Finder to a distributed system. The current front-end is just for testing purposes, and we are expecting to use Angular to improve the user interface.

## What Makes this App Special
While the idea it is pretty simple, the app uses complex features at it's core. First it uses a Redis data store to maintain each user's unique session, progress, and restaurant preferences. Secondly, it uses ETCD to store user login information and imploys SALTs to protect user data in case of a security breach. Next, the app is able to learn from the user's preferences and recommend restaurants that fit their taste, as well as assisting them to explore different cusines. Lastly, this app is scalable from the use of Nginx and clusterized Redis and ETCD services.

Note: This app uses the Yelp Fusion API to retrieve restaurant information.
