from django.urls import path

# From the current file dir we want to import the views file code here
from . import views

# the pattern for urls in the path function is that the first argument is the uri name, the second is the middleware function to execute on endpoint ping, the third is ?
urlpatterns = [
    path("prompt", views.index, name="index"),
]