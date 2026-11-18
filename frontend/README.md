# Photography App Frontend

React 19 + TypeScript + Vite single-page application for the photography portfolio and print-ordering platform.

## Overview

This frontend provides:
- **Public Portfolio & Galleries**: Home page, event-filtered album galleries (`/portfolio/:event_name`), album photo viewer (`/albums/:album_id`), experience, testimonials, and contact page.
- **Authentication & Password Recovery**: Login (`/login`), signup (`/signup`), password reset request (`/password/reset`), and password reset confirmation (`/password/reset/confirm/:uid/:token`).
- **Shopping Cart & Checkout**: Persistent shopping cart via `CartContext`, photo size selection, and checkout modal (`/checkout/cart`).
- **Protected Management Pages**:
  - **Albums (`/albums`)**: Paginated table and form to create/delete albums.
  - **Photos (`/photos`)**: Paginated table and form to add/delete photos and assign albums.
  - **Orders (`/orders`)**: Paginated table with live filters (**Order #**, **Client**, **Email**), photo list modal preview, and delete actions.
  - **Users (`/users`)**: Paginated user management table.
  - **Favourites (`/favourites`)**: Authenticated user's saved favorite photos.

---

## Tech Stack

- **Framework**: React 19 + TypeScript 6 + Vite 8
- **Routing**: React Router DOM v7
- **Styling & UI Components**:
  - Tailwind CSS v4 (`@tailwindcss/vite`)
  - React Bootstrap & Bootstrap 5
  - Material UI (`@mui/material`, `@mui/icons-material`)
  - Lucide React icons & Swiper carousels
- **HTTP & Email**: Axios (centralized in `src/services/api.ts`), EmailJS (`@emailjs/browser`)
- **Unit Testing**: Jest 30, `ts-jest`, React Testing Library (`@testing-library/react`, `@testing-library/jest-dom`), JSDOM

---

## Local Setup

### 1) Install Dependencies

```bash
cd frontend
npm install
```

### 2) Configure Environment Variables

Create a `.env` file in `frontend/`:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_CLIENT_TEMPLATE_ID=your_client_template_id
VITE_EMAILJS_ADMIN_TEMPLATE_ID=your_admin_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Make sure the Django backend is running at `http://127.0.0.1:8000` before interacting with API-backed pages.

### 3) Start the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Available Scripts

```bash
npm run dev      # Start Vite development server with HMR
npm test         # Run Jest unit tests
npm run build    # Type-check (tsc -b) and build production bundle to dist/
npm run lint     # Run ESLint across the codebase
npm run preview  # Preview the production build locally
```

---

## Testing with Jest

Tests are colocated with components under `src/components/*.test.tsx` and configured via [jest.config.cjs](jest.config.cjs) and [tsconfig.app.json](tsconfig.app.json).

If setting up testing dependencies for the first time, ensure React Testing Library and the JSDOM environment are installed:

```bash
npm install -D @testing-library/react @testing-library/jest-dom jest-environment-jsdom
npm test
```

---

## Architecture Notes

- **API Layer (`src/services/api.ts` & `src/utils/ApiUrls.tsx`)**: All endpoint paths are defined in `ApiUrls` and handled by the centralized Axios service wrapper.
- **State Contexts (`src/context/`)**:
  - `AuthContext.tsx`: Manages current user session state.
  - `CartContext.tsx`: Manages cart items, quantities, and total price calculation across sessions.
- **Protected Routes (`src/routes/ProtectedRoute.tsx`)**: Guards management routes (`/albums`, `/photos`, `/orders`, `/users`, `/favourites`) and redirects unauthenticated visitors to `/`.
