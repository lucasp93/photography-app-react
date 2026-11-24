# Photography App

A full-stack photography portfolio, booking, and print-ordering platform built with **React 19 + TypeScript + Vite** on the frontend and **Django 6 + Django REST Framework + Celery** on the backend.

## Features

- **User Accounts & Access Control**: User registration, login, and password reset via email.
- **Portfolio & Album Management**: Browse albums by event category (`weddings`, `birthday`, `family`, `business`, `maternity`, `newborn`), create/update/delete albums, and view album galleries.
- **Photo Catalog & Favorites**: Manage photos with size options (`15x20`, etc.), featured flags, and per-user favorite photo lists.
- **Shopping Cart & Order Checkout**: Persistent cart (`CartContext`), guest and authenticated checkout, order management table with pagination, photo preview modals, and filters (by Order #, Client Name, and Email).
- **Asynchronous Email Notifications**:
  - **Backend (Celery + Redis + Django SMTP)**: Queues and sends HTML order confirmation emails and password reset links.
  - **Frontend (EmailJS)**: Handles contact form inquiries.

---

## Project Structure

```text
photography-app-react/
├── backend/                  # Django 6 REST API + Celery tasks
│   ├── apps/                 # Domain apps (users, albums, photos, orders) & tasks.py
│   ├── core/                 # Project settings, URLs, ASGI/WSGI, Celery config
│   ├── docker-compose.yml    # PostgreSQL 15 & Redis 7 services
│   ├── .env.example          # Backend environment template
│   ├── manage.py
│   ├── pyproject.toml        # uv project & dependencies
│   ├── requirements.txt      # pip-compatible dependency list
│   └── README.md
├── frontend/                 # React 19 + TypeScript + Vite SPA
│   ├── src/
│   │   ├── components/       # Reusable UI components, modals, forms & Jest tests
│   │   ├── context/          # AuthContext & CartContext
│   │   ├── interfaces/       # TypeScript domain interfaces (Photo, Album, Order, User)
│   │   ├── pages/            # Public & protected route pages
│   │   ├── routes/           # AppRoutes & ProtectedRoute
│   │   ├── services/         # Axios API client & CRUD helpers
│   │   └── utils/            # ApiUrls constants
│   ├── jest.config.cjs       # Jest + ts-jest configuration
│   ├── package.json
│   └── README.md
├── CLAUDE.md                 # AI assistant development guide
├── README.md                 # Main project documentation
└── LICENSE
```

---

## Tech Stack

### Frontend
- **React 19** + **TypeScript 6** + **Vite 8**
- **Styling & UI**: Tailwind CSS 4, React Bootstrap, Bootstrap 5, Material UI (`@mui/material`, `@mui/icons-material`), Lucide React, Swiper
- **Routing & State**: React Router v7, React Context (`AuthContext`, `CartContext`)
- **HTTP & Services**: Axios (centralized API wrapper), EmailJS (`@emailjs/browser`)
- **Testing**: Jest 30, `ts-jest`, React Testing Library (`@testing-library/react`, `@testing-library/jest-dom`)

### Backend
- **Python 3.13+**
- **Web Framework**: Django 6.1, Django REST Framework (`djangorestframework`), `django-cors-headers`, `django-filter`, `django-phonenumber-field`
- **ASGI Server**: Uvicorn (`uvicorn`)
- **Database**: PostgreSQL 15 (`psycopg2-binary`)
- **Task Queue & Broker**: Celery 5.6 + Redis (`redis`)

---

## Prerequisites

- **Python 3.13+** and **[uv](https://docs.astral.sh/uv/)**
- **Node.js 20+** and **npm**
- **Docker Desktop** (for PostgreSQL and Redis containers)

---

## Local Development Setup

### 1) Clone the repository

```bash
git clone <repository-url>
cd photography-app-react
```

### 2) Start PostgreSQL and Redis (Docker)

```bash
cd backend
docker compose up -d
```

This starts:
- **PostgreSQL 15** on `localhost:5432` (configured via `backend/docker-compose.yml`)
- **Redis 7** on `localhost:6379` (Celery broker & result backend)

### 3) Configure Backend Environment Variables

Copy `.env.example` to `.env` inside `backend/`:

```bash
cd backend
cp .env.example .env
```

Update `backend/.env` with your own local values (never commit `.env` to version control):

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

# Leave EMAIL_HOST empty in local dev to print emails to console, or set SMTP credentials:
EMAIL_HOST=smtp-mail.outlook.com or smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=[host_user]
EMAIL_HOST_PASSWORD=[host_password]
EMAIL_USE_TLS=true
EMAIL_USE_SSL=false
DEFAULT_FROM_EMAIL=noreply@localhost
```

### 4) Install Backend Dependencies & Run Migrations

```bash
cd backend
uv sync
uv run python manage.py migrate
```

### 5) Start the Backend API & Celery Worker

Run the API server (using Uvicorn ASGI or Django's dev server):

```bash
cd backend
uv run uvicorn core.asgi:application --host 127.0.0.1 --port 8000 --reload
# Or:
uv run python manage.py runserver 0.0.0.0:8000
```

In a separate terminal, start the Celery worker to process order confirmation and password reset emails:

```bash
cd backend
uv run celery -A core worker -l info
```

The backend API will be available at `http://127.0.0.1:8000`.

### 6) Configure & Start the Frontend

Create `frontend/.env` for EmailJS (and optional local settings):

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_CLIENT_TEMPLATE_ID=your_client_template_id
VITE_EMAILJS_ADMIN_TEMPLATE_ID=your_admin_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Install dependencies and start Vite:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

## Testing & Linting

### Backend
```bash
cd backend
uv run pytest
uv run ruff check .
```

### Frontend
```bash
cd frontend
npm test        # Run Jest unit tests
npm run lint    # Run ESLint
npm run build   # Type-check with tsc and build production bundle
```

---

## Common Troubleshooting

- **Backend dependency or `.venv` issues**:
  ```bash
  cd backend
  rm -rf .venv
  uv sync
  ```
  If using `pip3` directly inside `.venv`, bootstrap pip first with `.venv/bin/python -m ensurepip --upgrade`.
- **Database or Redis connection errors**:
  Ensure Docker containers are running with `docker compose ps` inside `backend/`.
- **Secret key warnings**:
  Ensure `SECRET_KEY` in `backend/.env` is a strong, randomly generated value.

---

## License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.
