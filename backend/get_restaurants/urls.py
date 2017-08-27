from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^start$', views.start, name="start"),
    url(r'^next$', views.next, name="next"),
    url(r'^results$', views.results, name="results")]
