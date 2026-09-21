# Photography App

A full-stack photography booking platform built with React + Vite on the frontend and Django REST Framework on the backend.

This project includes:
- user registration and authentication
- photo catalog management
- album management
- order creation and tracking
- email sending via EmailJS

## Project structure

```text
photography-app-react/
├── backend/               # Django REST API
│   ├── apps/              # Django apps
│   ├── core/              # settings, urls, ASGI/WSGI
│   ├── docker-compose.yml # Postgres service for local development
│   ├── manage.py
│   ├── pyproject.toml
│   └── README.md
├── frontend/              # React + TypeScript + Vite app
│   ├── src/
│   ├── package.json
│   └── README.md
├── README.md
├── README.me
└── LICENSE
```

## Tech stack

Frontend:
- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios / fetch-based API wrapper

Backend:
- Python 3.13
- Django 6
- Django REST Framework
- SimpleJWT
- PostgreSQL
- Celery (configured in dependencies)

## Prerequisites

Before starting, make sure these are installed:
- Python 3.13+
- Node.js 20+
- npm
- Docker Desktop (for PostgreSQL container)
- uv (recommended for Python dependency management)

## Local development setup

### 1) Clone the repository

```bash
git clone <repository-url>
cd photography-app-react
```

### 2) Start PostgreSQL

The backend is configured to use PostgreSQL locally via Docker Compose.

```bash
cd backend
docker compose up -d
```

This creates a local Postgres instance on:
- host: `localhost`
- port: `5432`
- database: `photography_db`
- user: `postgres`
- password: `lucas123`

> These values are currently set in [backend/core/settings.py](backend/core/settings.py). Update them if your local environment differs.

### 3) Install backend dependencies

From the backend directory:

```bash
cd backend
uv sync
```

If you want to create the virtual environment explicitly:

```bash
source .venv/bin/activate
```

### 4) Run database migrations

```bash
cd backend
uv run python manage.py migrate
```

If you need to generate migrations after changing models:

```bash
uv run python manage.py makemigrations
```

### 5) Start the Django API

```bash
cd backend
uv run python manage.py runserver 0.0.0.0:8000
```

The API should be available at:
- `http://127.0.0.1:8000`

### 6) Install frontend dependencies

From the frontend directory:

```bash
cd frontend
npm install
```

### 7) Start the frontend

```bash
cd frontend
npm run dev
```

The app will typically run at:
- `http://localhost:5173`

## Environment variables

The frontend expects EmailJS variables to be configured in a `.env` file.

Create a `.env` file in the `frontend` folder with values like:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_CLIENT_TEMPLATE_ID=your_client_template_id
VITE_EMAILJS_ADMIN_TEMPLATE_ID=your_admin_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

The app also uses a Django auth flow with JWT tokens via `/api/token/` and `/api/token/refresh/`.

## Testing

### Backend tests

```bash
cd backend
uv run pytest
```

### Frontend validation

```bash
cd frontend
npm run build
npm run lint
```

## Common troubleshooting

### Backend dependency errors

If `uv` or Python packages are missing or the environment is inconsistent:

```bash
cd backend
rm -rf .venv
uv sync
```

### Database connection issues

Check that Postgres is running:

```bash
docker compose ps
```

If needed, restart the container:

```bash
docker compose down
docker compose up -d
```

### Frontend runs but API calls fail

Verify:
- the Django server is running on port 8000
- CORS settings allow your frontend origin
- the frontend is hitting the correct API paths

## Notes for contributors

- The backend uses Django’s default auth model with a custom `User` model.
- The frontend routes and API utilities expect the backend API base to be `/api/...`.
- This repo is primarily a local development project; production deployment, environment hardening, and secret management are not fully documented yet.

## License

This project is licensed under the terms specified in the repository license file.
