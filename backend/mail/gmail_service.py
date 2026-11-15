import base64
import re
from datetime import datetime, timezone
from email.mime.text import MIMEText

from django.conf import settings
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

from accounts.models import GoogleAccount


def gmail_for(user):
    """Build an authorized Gmail client. Access tokens refresh automatically."""
    acct = GoogleAccount.objects.get(user=user)
    creds = Credentials(
        token=None,
        refresh_token=acct.refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        scopes=settings.GMAIL_SCOPES,
    )
    return build("gmail", "v1", credentials=creds, cache_discovery=False)


def _header(headers, name):
    return next((h["value"] for h in headers if h["name"].lower() == name.lower()), "")


def _summary(msg):
    headers = msg.get("payload", {}).get("headers", [])
    labels = msg.get("labelIds", [])
    return {
        "id": msg["id"],
        "thread_id": msg["threadId"],
        "from": _header(headers, "From"),
        "to": _header(headers, "To"),
        "subject": _header(headers, "Subject"),
        "date": datetime.fromtimestamp(int(msg["internalDate"]) / 1000, tz=timezone.utc).isoformat(),
        "snippet": msg.get("snippet", ""),
        "labels": labels,
        "unread": "UNREAD" in labels,
        "starred": "STARRED" in labels,
    }


def list_messages(user, label="INBOX", q="", page_token=None, max_results=25):
    svc = gmail_for(user)
    resp = svc.users().messages().list(
        userId="me",
        labelIds=[label] if label else None,
        q=q or None,
        maxResults=max_results,
        pageToken=page_token,
    ).execute()

    refs = resp.get("messages", [])
    results = {}

    def collect(request_id, response, exception):
        if not exception:
            results[request_id] = _summary(response)

    # Batch the metadata lookups into one HTTP request instead of N.
    batch = svc.new_batch_http_request()
    for ref in refs:
        batch.add(
            svc.users().messages().get(
                userId="me", id=ref["id"], format="metadata",
                metadataHeaders=["From", "To", "Subject", "Date"],
            ),
            callback=collect,
            request_id=ref["id"],
        )
    if refs:
        batch.execute()

    return {
        "messages": [results[r["id"]] for r in refs if r["id"] in results],
        "next_page_token": resp.get("nextPageToken"),
    }


def _decode(data):
    return base64.urlsafe_b64decode(data + "=" * (-len(data) % 4)).decode("utf-8", errors="replace")


def _parts(payload):
    mime = payload.get("mimeType")
    data = payload.get("body", {}).get("data")
    if mime in ("text/plain", "text/html") and data:
        yield mime, _decode(data)
    for part in payload.get("parts", []):
        yield from _parts(part)


def _body(payload):
    found = {}
    for mime, text in _parts(payload):
        found.setdefault(mime, text)
    if "text/plain" in found:
        return found["text/plain"]
    return re.sub(r"<[^>]+>", " ", found.get("text/html", "")).strip()


def get_message(user, message_id):
    msg = gmail_for(user).users().messages().get(userId="me", id=message_id, format="full").execute()
    data = _summary(msg)
    data["body"] = _body(msg.get("payload", {}))
    return data


def send_message(user, to, subject, body, thread_id=None):
    mime = MIMEText(body, "plain", "utf-8")
    mime["To"] = to
    mime["Subject"] = subject
    payload = {"raw": base64.urlsafe_b64encode(mime.as_bytes()).decode()}
    if thread_id:
        payload["threadId"] = thread_id
    return gmail_for(user).users().messages().send(userId="me", body=payload).execute()


def modify_labels(user, message_id, add=(), remove=()):
    return gmail_for(user).users().messages().modify(
        userId="me",
        id=message_id,
        body={"addLabelIds": list(add), "removeLabelIds": list(remove)},
    ).execute()