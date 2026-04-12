# Norman's Kitchen Web App Starter

This is a Next.js + TypeScript starter for a Jamaican cookshop-focused business in the diaspora.

## Current MVP Screens

- Customer-facing storefront landing page
- Featured Jamaican menu section
- Operator dashboard with KPI cards, live queue, and status controls
- Cart and checkout flow at `/order`
- Order confirmation page at `/order/confirmation`
- Orders API route at `/api/orders` with Prisma + PostgreSQL
- Admin login at `/admin/login` for protected operations

## Run Locally

```bash
cd /Users/patrickharrison/Desktop/Normans_Kitchen
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Build and Lint

```bash
npm run lint
npm run build
```

## Phase 2 Database Setup (PostgreSQL + Prisma)

1. Copy `.env.example` to `.env.local`.
2. Set `DATABASE_URL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` in `.env.local`.
3. Generate Prisma client:

```bash
npm run prisma:generate
```

4. Sync schema to your database:

```bash
npm run prisma:push
```

This app now requires PostgreSQL. It will not run order read/write APIs without `DATABASE_URL`.

5. Optional local DB UI:

```bash
npm run prisma:studio
```

If `DATABASE_URL` is not set, the app falls back to local JSON storage in `data/orders.json` for development.

## Project Structure

- `src/app/page.tsx`: customer storefront
- `src/app/dashboard/page.tsx`: operator dashboard
- `src/app/order/page.tsx`: cart and checkout
- `src/app/order/confirmation/page.tsx`: confirmation screen
- `src/app/admin/login/page.tsx`: admin login screen
- `src/app/api/orders/route.ts`: order GET and POST route handlers
- `src/app/api/orders/[orderId]/status/route.ts`: order status updates
- `src/app/api/admin/login/route.ts`: admin login endpoint
- `src/app/api/admin/logout/route.ts`: admin logout endpoint
- `prisma/schema.prisma`: Postgres schema for orders and line items
- `src/lib/prisma.ts`: Prisma client singleton
- `src/lib/admin-auth.ts`: admin session helpers
- `src/lib/menu-data.ts`: starter menu and KPI data
- `src/lib/order-store.ts`: PostgreSQL persistence utility
- `src/app/globals.css`: theme and typography

## Push to GitHub

1. Create an empty GitHub repository (for example: `normans-kitchen`).
2. Run:

```bash
cd /Users/patrickharrison/Desktop/Normans_Kitchen
git add .
git commit -m "Initial Norman's Kitchen MVP"
git branch -M main
git remote add origin https://github.com/<your-username>/normans-kitchen.git
git push -u origin main
```

If a remote already exists, update it with:

```bash
git remote set-url origin https://github.com/<your-username>/normans-kitchen.git
```
