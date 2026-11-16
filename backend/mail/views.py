import logging

from google.auth.exceptions import RefreshError
from googleapiclient.errors import HttpError
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView

from . import gmail_service as gmail

logger = logging.getLogger(__name__)

ALLOWED_LABELS = {"STARRED", "UNREAD", "INBOX", "TRASH"}


class GmailAPIView(APIView):
    def handle_exception(self, exc):
        if isinstance(exc, HttpError):
            logger.warning("Gmail API error: %s", exc)
            return Response(
                {"error": f"Gmail API error: {exc.resp.status} {exc.reason}"},
                status=exc.resp.status,
            )

        if isinstance(exc, RefreshError):
            logger.warning("Google token refresh failed: %s", exc)
            return Response(
                {"error": "Your Google access has expired. Sign out, then sign in with Google again."},
                status=403,
            )

        try:
            return super().handle_exception(exc)
        except Exception:
            logger.exception("Unhandled error in %s", self.__class__.__name__)
            return Response({"error": "Server error. Check the Render logs."}, status=500)


class SendSerializer(serializers.Serializer):
    to = serializers.CharField(max_length=500)
    subject = serializers.CharField(max_length=500, allow_blank=True)
    body = serializers.CharField(allow_blank=True)
    thread_id = serializers.CharField(required=False, allow_blank=True)


class MessageListView(GmailAPIView):
    def get(self, request):
        data = gmail.list_messages(
            request.user,
            label=request.query_params.get("label", "INBOX"),
            q=request.query_params.get("q", ""),
            page_token=request.query_params.get("page_token"),
        )
        return Response(data)


class MessageDetailView(GmailAPIView):
    def get(self, request, message_id):
        return Response(gmail.get_message(request.user, message_id))


class MessageModifyView(GmailAPIView):
    def post(self, request, message_id):
        add = set(request.data.get("add", []))
        remove = set(request.data.get("remove", []))
        if not (add | remove) <= ALLOWED_LABELS:
            return Response({"error": "Label not allowed"}, status=400)
        gmail.modify_labels(request.user, message_id, add=add, remove=remove)
        return Response({"ok": True})


class SendView(GmailAPIView):
    def post(self, request):
        s = SendSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        d = s.validated_data
        result = gmail.send_message(request.user, d["to"], d["subject"], d["body"], d.get("thread_id") or None)
        return Response({"id": result["id"]}, status=201)