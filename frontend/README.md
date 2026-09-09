# Frontend

React + TypeScript frontend for Boom.

## Backend integration

The frontend talks to the Python/FastAPI backend through `/api/*` endpoints. Vite proxies `/api` to `http://localhost:8000` during local development, so no CORS or hard-coded localhost URL is needed in the browser.

### Run locally

1. Start the backend on port `8000` from `backend/`.
2. Start the frontend with `npm run dev` from `frontend/`.
3. Open the frontend and go to **گفتگو با بوم AI**.
4. The chat screen checks `/api/health` and sends messages to `/api/boom/chat` or `/api/boom/study-plan`.

For a deployed frontend, set `VITE_API_URL` to the public backend origin before building (for example, `https://api.example.com`).

The shared API client lives in `src/api.ts` so future dashboard, plan, recovery, exam, and profile integrations can use the same boundary instead of putting raw `fetch()` calls throughout the UI.
