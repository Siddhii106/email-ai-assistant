from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

urlpatterns = [
    path("google/login/", views.google_login),
    path("google/callback/", views.google_callback),
    path("token/refresh/", TokenRefreshView.as_view()),
    path("me/", views.me),
]