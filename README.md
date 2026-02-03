# Mini Multi‑Tenant Property Listing Platform

Monorepo containing:

- `frontend/`: Next.js App Router UI (multi‑tenant via `/:tenant`)
- `backend/`: NestJS + PostgreSQL API (`/api/*`) with multi‑tenant scoping, JWT auth, properties, favorites, and seed data

## Quickstart (local dev)

### 1) Backend (API + database)

Prereqs:
- Node.js + npm
- PostgreSQL running on `localhost:5432` (either Docker Desktop or a local Postgres install)

From `backend/`:

```powershell
npm install
Copy-Item .env.example .env
# Edit .env if your local Postgres password is not "postgres"
npm run db:ensure
npm run start:dev
```

API base URL: `http://localhost:3001/api`

Seeded demo users (per tenant):
- `user@demo.com` / `password`
- `owner@demo.com` / `password`
- `admin@demo.com` / `password`

Tenants:
- `alpha-homes`
- `city-rentals`
- `luxe-estates`

### 2) Frontend (Next.js)

From `frontend/`:

```powershell
npm install
npm run dev
```

Open: `http://localhost:3000`

Optional env var (only needed if your API is not `http://localhost:3001/api`):

- `NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api`

## Running Postgres with Docker (optional)

If you have Docker Desktop:

```powershell
cd backend
docker compose up -d
```

Then follow the backend steps above.

## Notes

- The app is multi‑tenant by URL segment: `http://localhost:3000/alpha-homes`, etc.
- Favorites:
  - When logged in, favorites are stored in the backend (per tenant + user).
  - When logged out, favorites still work locally (Zustand + localStorage).
