from django.conf.urls import url, include
from . import views

urlpatterns = [
    url(r'^$', views.index, name="index"),
    url(r'^login/', include('login.urls'))
    url(r'^get_restaurants/', include('get_restaurants.urls'))]
