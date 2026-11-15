from django.conf import settings
from django.db import models


class GoogleAccount(models.Model):
    """Links a Django user to their Google account and stores the Gmail refresh token."""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="google")
    email = models.EmailField()
    picture = models.URLField(blank=True)
    refresh_token = models.TextField()  # encrypt at rest in production
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.email