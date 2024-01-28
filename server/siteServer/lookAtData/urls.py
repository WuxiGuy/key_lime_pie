from django.urls import path
from lookAtData import views

urlpatterns = [
    path("", views.index, name="index"),
    path("post_data/", views.post_data, name="post_data"),
    path("show_data/", views.show_data, name="show_data")
]