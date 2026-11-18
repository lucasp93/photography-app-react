# CLAUDE.md

This file provides guidance to Claude Code (and other AI coding agents) when working with code in this repository.

## Project Overview

Full-stack photography portfolio, booking, and print-ordering web application:
- **`backend/`**: Django 6.1 + Django REST Framework + Celery + Redis + PostgreSQL (`python >= 3.13`, managed with `uv`).
- **`frontend/`**: React 19 + TypeScript 6 + Vite 8 + Tailwind CSS 4 + React Bootstrap + MUI (`npm`).

---

## Common Commands

### Backend (run from `backend/`)
```bash
# Start PostgreSQL (port 5432) and Redis (port 6379)
docker compose up -d

# Sync dependencies into backend/.venv
uv sync

# Run database migrations
uv run python manage.py makemigrations
uv run python manage.py migrate

# Start ASGI server with Uvicorn (preferred) or Django runserver
uv run uvicorn core.asgi:application --host 127.0.0.1 --port 8000 --reload
uv run python manage.py runserver 0.0.0.0:8000

# Start Celery worker (required for order confirmation & password reset emails)
uv run celery -A core worker -l info

# Run backend tests (pytest-django)
uv run pytest
uv run pytest apps/orders/tests/   # run a single app's tests

# Lint backend code
uv run ruff check .
uv run pflake8
```

### Frontend (run from `frontend/`)
```bash
# Install dependencies
npm install

# Start Vite dev server (http://localhost:5173)
npm run dev

# Run Jest unit tests
npm test
npx jest src/components/AlbumForm.test.tsx   # run a single test file

# Type-check and build production bundle
npm run build

# Run ESLint
npm run lint
```

---

## Architecture & Key Files

### Backend (`backend/`)
- **`core/settings.py`**: Loads `backend/.env` via `python-dotenv`. Configures `AUTH_USER_MODEL = "users.User"`, `REST_FRAMEWORK`, PostgreSQL (`photography_db`), Celery (`redis://localhost:6379/0`), and SMTP/console `EMAIL_BACKEND`.
- **`core/celery.py`**: Initializes Celery (`app = Celery("core")`) and auto-discovers tasks via `app.autodiscover_tasks(["apps"])`.
- **`apps/tasks.py`**: Shared Celery tasks:
  - `send_order_confirmation_email(order_id)`: Sends multipart text + HTML order summary email.
  - `send_password_reset_email_task(recipient_email, reset_url)`: Sends password reset link with retry backoff.
- **Django Apps (`apps/`)**:
  - `apps/users/`: Custom `User` model, user CRUD, and password reset views.
  - `apps/albums/`: `Album` model (`name`, `event`, `author`), filterable/searchable `AlbumViewSet`.
  - `apps/photos/`: `Photo` model (`name`, `author`, `featured`, `url`, `size`, `album` FK, `orders` M2M, `favorited_by` M2M).
  - `apps/orders/`: `Order` model (`order_number` prefixed with `ORD-`, `client_name`, `client_email`, `client_contact` via `PhoneNumberField`, `price`) and `OrderViewSet`.

### Frontend (`frontend/`)
- **`src/utils/ApiUrls.tsx`**: Central dictionary of `/api/...` endpoints.
- **`src/services/api.ts` & `src/services/utils.ts`**: Centralized Axios client and CRUD helper functions (`createAlbum`, `createPhoto`, `createOrder`, `deleteItem`, etc.).
- **`src/interfaces/interfaces.tsx`**: Core TypeScript interfaces (`Photo`, `Album`, `Order`, `User`).
- **`src/context/AuthContext.tsx` & `src/context/CartContext.tsx`**: Global user session and shopping cart providers wrapping the app in `src/App.tsx`.
- **`src/routes/AppRoutes.tsx`**: Defines public routes (`/`, `/portfolio/:event_name`, `/albums/:album_id`, `/checkout/cart`, `/login`, `/signup`, `/password/reset`, `/contact`) and protected routes wrapped in `<ProtectedRoute>` (`/albums`, `/photos`, `/orders`, `/users`, `/favourites`).
- **`src/pages/*ListPage.tsx`**: Management tables (`AlbumListPage`, `PhotoListPage`, `OrderListPage`, `UserListPage`) with client-side pagination, filtering, and CRUD actions.

---

## Important Conventions & Gotchas

1. **Dependency Management (`backend/`)**:
   - Always keep `backend/pyproject.toml` and `backend/requirements.txt` in sync when adding/removing Python packages.
   - `pyproject.toml` configures `[[tool.uv.index]]` with `https://pypi.tuna.tsinghua.edu.cn/simple` so `uv` can download wheels even when `files.pythonhosted.org` is blocked or poisoned by local DNS.
2. **Environment File Location**:
   - Backend `.env` must live at `backend/.env` (loaded via `BASE_DIR / ".env"` in `core/settings.py`) and should never be committed to version control.
   - Ensure `SECRET_KEY` and database credentials are configured via `backend/.env` rather than hardcoded.
3. **TypeScript & Jest (`frontend/`)**:
   - `frontend/tsconfig.app.json` has `"noUnusedLocals": true`, `"noUnusedParameters": true`, and `"jsx": "react-jsx"` (do not add unused `import React from 'react'` in `.tsx` files).
   - Global types in `tsconfig.app.json` include `["vite/client", "jest"]`.
   - Because `frontend/package.json` uses `"type": "module"`, Jest config lives in `frontend/jest.config.cjs`.
