from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^createuser$', views.createuser, name="createuser"),
    url(r'^validate$', views.urlvalidate, name="validate"),
    url(r'^session$', views.session, name="session")]
