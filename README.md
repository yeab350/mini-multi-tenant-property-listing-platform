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

### Run both (one command)

From the repo root:

```powershell
npm install
npm run docker:up
Copy-Item backend/.env.example backend/.env
# Edit backend/.env if your Postgres password is not "postgres"
npm run db:ensure
npm run dev:all
```

This runs:
- backend: `npm --prefix backend run start:dev` (API on `http://localhost:3001/api`)
- frontend: `npm --prefix frontend run dev` (UI on `http://localhost:3000`)

Note: you still need Postgres running + the backend `.env` set up (see backend section above).

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

## Technical decision document (exam)

### Why this backend framework
- **NestJS**: opinionated structure (modules/controllers/services/guards) that scales well for multi-tenant APIs, and makes RBAC + validation straightforward.

### State management approach
- **Zustand**: lightweight client state for auth + favorites with `persist` to keep sessions across refresh.
- Server state is fetched directly from the NestJS API (SSR where required; CSR in dashboards).

### Access control enforcement
- **JWT auth** with a Passport JWT strategy.
- **Tenant scoping** via a guard that prevents cross-tenant access (`tenantSlug` in path must match JWT).
- **Role-based access** via a `@Roles()` decorator + `RolesGuard`.

### Image handling (type/size + production URLs)
- Client validates image type/size before upload (JPG/PNG/WebP, max 5MB).
- Owner uploads images to the backend which stores them under `/uploads/*` and returns **http(s) URLs** that are saved on the property.
- This keeps images working in production without relying on browser-only `blob:` URLs.

### Hardest technical challenge
- Keeping multi-tenant scoping consistent across every route (public vs owner vs admin) while maintaining a simple developer experience.

### What breaks first at scale
- Uploaded images stored on the backend filesystem (you would migrate to S3/Cloudinary + CDN).
- Listing queries would benefit from additional indexes + caching once traffic grows.

## Deployment URLs (fill in)
- Frontend: <ADD_YOUR_VERCEL_OR_NETLIFY_URL>
- Backend API: <ADD_YOUR_RENDER_RAILWAY_FLY_URL>

## API documentation
- Swagger UI: `/api/docs` on the backend (example: `http://localhost:3001/api/docs`).
