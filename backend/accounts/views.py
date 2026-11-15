import requests
from django.conf import settings
from django.contrib.auth.models import User
from django.shortcuts import redirect
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .google_oauth import make_flow
from .models import GoogleAccount


@api_view(["GET"])
@permission_classes([AllowAny])
def google_login(request):
    flow = make_flow()
    auth_url, state = flow.authorization_url(
        access_type="offline", prompt="consent", include_granted_scopes="true"
    )
    request.session["oauth_state"] = state
    request.session["code_verifier"] = flow.code_verifier
    return redirect(auth_url)


@api_view(["GET"])
@permission_classes([AllowAny])
def google_callback(request):
    if request.GET.get("state") != request.session.pop("oauth_state", None):
        return redirect(f"{settings.FRONTEND_URL}/login?error=state")

    flow = make_flow()
    flow.code_verifier = request.session.pop("code_verifier", None)
    flow.fetch_token(authorization_response=request.build_absolute_uri())
    creds = flow.credentials

    info = requests.get(
        "https://openidconnect.googleapis.com/v1/userinfo",
        headers={"Authorization": f"Bearer {creds.token}"},
        timeout=10,
    ).json()

    user, _ = User.objects.get_or_create(
        username=info["email"],
        defaults={"email": info["email"], "first_name": info.get("given_name", "")},
    )
    GoogleAccount.objects.update_or_create(
        user=user,
        defaults={
            "email": info["email"],
            "picture": info.get("picture", ""),
            "refresh_token": creds.refresh_token,
        },
    )

    tokens = RefreshToken.for_user(user)
    # The token travels in the URL fragment, which the browser never sends to a server.
    return redirect(
        f"{settings.FRONTEND_URL}/auth/callback#access={tokens.access_token}&refresh={tokens}"
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    acct = GoogleAccount.objects.filter(user=request.user).first()
    return Response({
        "email": request.user.email,
        "name": request.user.first_name,
        "picture": acct.picture if acct else "",
    })