# Photography App Backend

Django REST API for the photography booking application.

## Overview

This backend provides the API for:
- user authentication and registration
- photo management
- album management
- order processing
- JWT-based authorization

## Tech stack

- Python 3.13+
- Django 6
- Django REST Framework
- Django SimpleJWT
- PostgreSQL
- Django filter and CORS support

## Local setup

### 1) Start PostgreSQL

From this directory:

```bash
docker compose up -d
```

This starts a local Postgres database using the credentials configured in the project settings.

### 2) Install dependencies

```bash
uv sync
```

### 3) Activate the environment (optional)

```bash
source .venv/bin/activate
```

### 4) Run migrations

```bash
uv run python manage.py migrate
```

### 5) Start the backend

```bash
uv run python manage.py runserver 0.0.0.0:8000
```

The API will be available at:
- `http://127.0.0.1:8000`

## Custom settings to be aware of

The project currently uses PostgreSQL with a local development configuration in [core/settings.py](core/settings.py):
- database: `photography_db`
- user: `postgres`
- password: `lucas123`
- host: `localhost`
- port: `5432`

If your local setup differs, update those values before running the server.

## Migrations

Create migrations after model changes:

```bash
uv run python manage.py makemigrations
```

Apply them:

```bash
uv run python manage.py migrate
```

## Testing

Run the backend test suite:

```bash
uv run pytest
```

## Useful commands

```bash
# install dependencies
uv sync

# run server
uv run python manage.py runserver 0.0.0.0:8000

# run tests
uv run pytest

# refresh environment if dependency issues appear
rm -rf .venv
uv sync
```

## Troubleshooting

If the app fails to start because of missing packages or an inconsistent environment:

```bash
rm -rf .venv
uv sync
```

If the database connection fails, confirm Docker is running and the Postgres container is healthy:

```bash
docker compose ps
```

## API conventions

The app exposes endpoints under `/api/...` and uses JWT authentication for protected routes. Tokens are handled by the SimpleJWT configuration in the Django settings.