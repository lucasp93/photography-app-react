#!/bin/sh
set -e

uv run --no-sync python manage.py migrate --noinput
uv run --no-sync uvicorn core.asgi:application --host 127.0.0.1 --port 8000 &

exec nginx -g "daemon off;"
