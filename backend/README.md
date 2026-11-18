# Photography App Backend

Django 6 REST API and Celery background worker for the photography booking and ordering application.

## Overview

This backend provides:
- **User Accounts & Recovery**: Custom `User` model, registration, login, and password reset emails.
- **Album Management**: CRUD endpoints with search (`name`, `event`, `author`) and ordering (`created_at`, `name`).
- **Photo Management**: CRUD endpoints for album photos, photo sizes (`15x20`), featured filtering, and user favorites toggling.
- **Order Processing**: Order creation (`ORD-...`), photo associations, and order listing/filtering (`order_number`, `client_name`, `client_email`).
- **Async Email Tasks (Celery + Redis)**: Sends HTML order confirmation emails (`send_order_confirmation_email`) and password reset emails (`send_password_reset_email_task`).

---

## Tech Stack

- **Python 3.13+**
- **Django 6.1** & **Django REST Framework 3.18**
- **Uvicorn** (ASGI server)
- **PostgreSQL 15** (`psycopg2-binary`)
- **Celery 5.6** & **Redis** (`redis`)
- **Django Filter**, **Django CORS Headers**, **Django Phonenumber Field** (`phonenumbers`)

---

## Local Setup

### 1) Start PostgreSQL and Redis

From the `backend/` directory:

```bash
docker compose up -d
```

This starts:
- **PostgreSQL** on `localhost:5432` (configured in `docker-compose.yml`)
- **Redis** on `localhost:6379` (Celery message broker & result backend)

### 2) Configure Environment Variables (`.env`)

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Expected variables in `backend/.env` (never commit `.env` to version control):

```env
DEBUG=True
SECRET_KEY=<your-generated-secret-key>

POSTGRES_DB=photography_db
POSTGRES_USER=<your-db-user>
POSTGRES_PASSWORD=<your-db-password>
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

FRONTEND_URL=http://localhost:5173
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/1

# Email settings:
# Leave EMAIL_HOST empty for local dev to print emails to the console,
# or configure your SMTP provider credentials.
EMAIL_HOST=
EMAIL_PORT=587
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
EMAIL_USE_TLS=true
EMAIL_USE_SSL=false
DEFAULT_FROM_EMAIL=noreply@localhost
```

### 3) Install Dependencies

Using `uv` (recommended):

```bash
uv sync
```

*(Optional)* Activate the virtual environment in your shell:

```bash
source .venv/bin/activate
```

### 4) Run Database Migrations

```bash
uv run python manage.py makemigrations
uv run python manage.py migrate
```

### 5) Start the API Server and Celery Worker

Run the API server with Uvicorn (ASGI) or Django's development server:

```bash
uv run uvicorn core.asgi:application --host 127.0.0.1 --port 8000 --reload
# Or:
uv run python manage.py runserver 0.0.0.0:8000
```

In a second terminal, start the Celery worker:

```bash
uv run celery -A core worker -l info
```

The API will be available at `http://127.0.0.1:8000`.

---

## API Endpoints

All endpoints are prefixed with `/api/`:

| Area | Endpoint | Methods | Description |
| :--- | :--- | :--- | :--- |
| **Users** | `/api/users/` | `GET`, `POST` | List users or register a new user |
| | `/api/users/<id>/` | `GET`, `PUT`, `PATCH`, `DELETE` | Retrieve, update, or delete user |
| | `/api/password/reset/` | `POST` | Request password reset email |
| | `/api/password/reset/confirm/` | `POST` | Confirm password reset |
| **Albums** | `/api/albums/` | `GET`, `POST` | List/filter albums (`name`, `event`, `author`) or create |
| | `/api/albums/<id>/` | `GET`, `PUT`, `PATCH`, `DELETE` | Retrieve, update, or delete album |
| **Photos** | `/api/photos/` | `GET`, `POST` | List/filter photos (`album_id`, `featured`) or create |
| | `/api/photos/<id>/` | `GET`, `PUT`, `PATCH`, `DELETE` | Retrieve, update, or delete photo |
| | `/api/photos/favorites/` | `GET` | List user's favorite photos |
| **Orders** | `/api/orders/` | `GET`, `POST` | Create or list orders |
| | `/api/orders/<id>/` | `GET`, `PUT`, `PATCH`, `DELETE` | Retrieve, update, or delete order |

---

## Testing & Code Quality

```bash
# Run full test suite with pytest
uv run pytest

# Run linter
uv run ruff check .
uv run pflake8
```

---

## Troubleshooting

- **Using `pip3` inside `.venv`**:
  `uv venv` creates `.venv` without `pip` by default. To add `pip3` into `.venv` offline, run:
  ```bash
  .venv/bin/python -m ensurepip --upgrade
  source .venv/bin/activate
  pip3 install -r requirements.txt
  ```
  Or use `uv pip install -r requirements.txt`.
- **PyPI Connection Timeouts (`files.pythonhosted.org`)**:
  `pyproject.toml` is configured with `[[tool.uv.index]]` pointing to `https://pypi.tuna.tsinghua.edu.cn/simple` as a fallback mirror if `files.pythonhosted.org` is unreachable on your network.
- **Database Connection Refused**:
  Verify Docker containers are up with `docker compose ps` and that your `POSTGRES_*` values in `backend/.env` match `docker-compose.yml`.
