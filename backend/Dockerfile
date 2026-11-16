FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Build-time placeholders: collectstatic only needs settings to load.
# These are not saved in the image, and the real values come from Render at runtime.
RUN DJANGO_SECRET_KEY=build-only \
    GOOGLE_CLIENT_ID=build \
    GOOGLE_CLIENT_SECRET=build \
    GOOGLE_REDIRECT_URI=http://localhost/build \
    ANTHROPIC_API_KEY=build \
    python manage.py collectstatic --noinput

EXPOSE 8000

CMD sh -c "python manage.py migrate --noinput && gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000}"