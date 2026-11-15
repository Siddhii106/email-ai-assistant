from django.contrib.auth.models import User
from django.db import models


class AIInsight(models.Model):
    """Caches Claude analysis per email so we don't pay for the same call twice."""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message_id = models.CharField(max_length=64)
    kind = models.CharField(max_length=32)
    content = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "message_id", "kind")