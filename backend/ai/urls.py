from django.urls import path

from . import views

urlpatterns = [
    path("analyze/", views.AnalyzeView.as_view()),
    path("draft/", views.DraftView.as_view()),
]