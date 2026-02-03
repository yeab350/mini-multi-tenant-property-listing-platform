# Backend (NestJS + PostgreSQL)

NestJS + PostgreSQL backend for the **Mini Multi‑Tenant Property Listing Platform**.

- Base URL: `http://localhost:3001/api`
- Multi-tenant routing uses `tenantSlug` in the path (example: `/api/tenants/alpha-homes/public/properties`).

## Local development

### 1) Configure env

Copy the template file:

```powershell
Copy-Item .env.example .env
```

If your local Postgres password isn’t `postgres`, update `DB_PASSWORD` in `.env`.

### 2) Ensure the database exists

Some machines don’t have `psql` available in PATH, and TypeORM cannot create a database.
This repo includes a small helper that creates `DB_NAME` if missing:

```powershell
npm run db:ensure
```

### 3) Start the API

```powershell
npm run start:dev
```

Seed behavior:
- Controlled by `SEED_ON_START`.
- Seed runs only when there are **no tenants** in the DB.

### Demo logins

- `user@demo.com` / `password`
- `owner@demo.com` / `password`
- `admin@demo.com` / `password`

Tenants:
- `alpha-homes`
- `city-rentals`
- `luxe-estates`

## Running Postgres with Docker (optional)

If you have Docker Desktop:

```powershell
docker compose up -d
```

## Key endpoints

- `GET /api/tenants`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/tenants/:tenantSlug/public/properties`
- `GET /api/tenants/:tenantSlug/public/properties/:id`
- `GET /api/tenants/:tenantSlug/favorites` (Bearer token)
- `POST /api/tenants/:tenantSlug/favorites/:propertyId/toggle` (Bearer token)
- `POST /api/tenants/:tenantSlug/owner/properties` (owner)
- `PATCH /api/tenants/:tenantSlug/admin/properties/:id/toggle-disabled` (admin)
