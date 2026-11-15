from rest_framework.response import Response
from rest_framework.views import APIView

from mail import gmail_service as gmail

from . import services
from .models import AIInsight


class AnalyzeView(APIView):
    def post(self, request):
        message_id = request.data.get("message_id")
        if not message_id:
            return Response({"error": "message_id is required"}, status=400)

        cached = AIInsight.objects.filter(user=request.user, message_id=message_id, kind="analysis").first()
        if cached:
            return Response(cached.content)

        email = gmail.get_message(request.user, message_id)
        result = services.analyze(email)
        AIInsight.objects.update_or_create(
            user=request.user, message_id=message_id, kind="analysis", defaults={"content": result}
        )
        return Response(result)


class DraftView(APIView):
    def post(self, request):
        message_id = request.data.get("message_id")
        if not message_id:
            return Response({"error": "message_id is required"}, status=400)

        email = gmail.get_message(request.user, message_id)
        draft = services.draft_reply(
            email,
            tone=request.data.get("tone", "Professional"),
            instructions=request.data.get("instructions", "")[:500],
        )
        return Response({"draft": draft})