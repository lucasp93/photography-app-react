# Photography App Frontend

React + TypeScript frontend for the photography application.

## Overview

This frontend provides the user-facing interface for:
- user signup and login
- browsing albums and photos
- creating and viewing orders
- managing shopping/cart flows
- contact and email submission

## Tech stack

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Material UI helpers
- EmailJS

## Local setup

### 1) Install dependencies

```bash
npm install
```

### 2) Start the app

```bash
npm run dev
```

The frontend usually runs at:
- `http://localhost:5173`

## Environment variables

Create a `.env` file in this folder if you want to enable the email contact flow:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_CLIENT_TEMPLATE_ID=your_client_template_id
VITE_EMAILJS_ADMIN_TEMPLATE_ID=your_admin_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

If the app is using a backend API, make sure the Django server is running before testing the UI.

## Available scripts

```bash
npm run dev     # start Vite dev server
npm run build   # type-check and build production bundle
npm run lint    # run ESLint
npm run preview # preview the built app locally
```

## Notes

- The frontend expects the backend API under `/api/...`.
- Authentication tokens are stored in `localStorage`.
- API requests are centralized in the frontend service layer to handle JWT refresh logic.

## Troubleshooting

If the app does not load or API calls fail:

1. confirm the backend is running on port 8000
2. check browser devtools for network or CORS errors
3. verify the `.env` values for EmailJS are populated only if email features are used

## Production build

```bash
npm run build
```

This produces a production bundle in the `dist/` directory.
