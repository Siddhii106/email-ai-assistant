import json

from anthropic import Anthropic
from django.conf import settings

client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)


def _text(resp):
    return "".join(block.text for block in resp.content if block.type == "text").strip()


def ask_text(system, user_content, max_tokens=800):
    resp = client.messages.create(
        model=settings.ANTHROPIC_MODEL,
        max_tokens=max_tokens,
        system=system,
        messages=[{"role": "user", "content": user_content}],
    )
    return _text(resp)


def ask_json(system, user_content, max_tokens=600):
    raw = ask_text(system, user_content, max_tokens)
    raw = raw.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    return json.loads(raw)