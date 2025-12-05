# LIBRARY__TRENDS

Frontend for SHAI Library built with React (Vite) and Tailwind CSS. This app provides the user-facing UI for seat booking, user profile, feedback and admin views.

## Features
- React + Vite for fast dev experience
- Tailwind CSS for styling
- Components for booking, feedback, admin dashboard and profile upload

## Tech stack
- React (Vite)
- Tailwind CSS
- JavaScript (JSX)

## Quickstart
1. Install dependencies:

	npm install

2. Run the development server:

	npm run dev

3. Build for production:

	npm run build

4. Preview production build:

	npm run preview

## Environment
If the frontend needs environment variables (API base URL, keys), create a `.env` file in the project root. Example variables:

- `VITE_API_BASE_URL` — URL of the backend API (e.g., `http://localhost:5000/api`)

Use the `VITE_` prefix for environment variables to be exposed to the client.

## Folder overview
- `src/` — main source folder
- `src/components/` — UI components (auth, admin, bookings, feedback)
- `src/routes/` — route definitions
- `src/utils/` — API helpers (e.g., `authApi.js`)

## Notes
- Tailwind and Vite configs are included. Adjust `tailwind.config.js` as needed.
- The frontend expects a running backend API; set `VITE_API_BASE_URL` accordingly.

## Contributing
Open issues or pull requests. Follow the code style used across components; keep components small and composable.

---
If you'd like, I can add a sample `.env` file, a simple README section showing common flows, or a small Postman/HTTP collection for the backend endpoints this UI uses.
