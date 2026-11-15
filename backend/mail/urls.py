from django.urls import path

from . import views

urlpatterns = [
    path("messages/", views.MessageListView.as_view()),
    path("messages/<str:message_id>/", views.MessageDetailView.as_view()),
    path("messages/<str:message_id>/modify/", views.MessageModifyView.as_view()),
    path("send/", views.SendView.as_view()),
]