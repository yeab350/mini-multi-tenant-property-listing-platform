# Mini Multi-Tenant Property Listing Platform (Frontend)

Next.js (App Router) frontend for the **Mini Multi‑Tenant Property Listing Platform**.

- Multi-tenant routing is path-based: `/:tenant/...`
- Talks to the NestJS backend by default at `http://localhost:3001/api` (configurable).

## What’s Implemented (Frontend)

- Multi-tenant routing via `/:tenant/...` (tenant picker on `/`)
- Auth pages: `/:tenant/auth/login` + `/:tenant/auth/register` (real backend JWT auth)
- Public property listing: `/:tenant/properties` (server-rendered) with filtering + pagination
- Property detail: `/:tenant/properties/:id`

- Dashboards (client-rendered):
	- User: `/:tenant/dashboard/user` (favorites)
	- Owner: `/:tenant/dashboard/owner` (create/update/publish via backend)
	- Admin: `/:tenant/dashboard/admin` (admin list + disable/enable via backend)
- Persist auth across refresh (Zustand persist)
- Favorites sync across tabs (Storage events + BroadcastChannel)
- Optimistic UI update (favorite toggle; reverts on API error)
- Protected routes with loading/redirect states

## Run Locally

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:3000

### Backend API base URL

Defaults to `http://localhost:3001/api`.

Override by setting:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

### Demo logins

The backend seeds demo users per tenant:

- `user@demo.com` / `password`
- `owner@demo.com` / `password`
- `admin@demo.com` / `password`

## Tech Decisions (Frontend)

- Framework: Next.js (preferred) for SSR listing + routing
- State management: Zustand (simple client state + persistence for auth/favorites)
- Multi-tenancy: path-based `/:tenant` (easy to swap to subdomain strategy later)
- API integration: see `src/lib/apiClient.ts` + `src/lib/backendApi.ts`
