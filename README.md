# Norman's Kitchen Web App Starter

This is a Next.js + TypeScript starter for a Jamaican cookshop-focused business in the diaspora.

## Current MVP Screens

- Customer-facing storefront landing page
- Featured Jamaican menu section
- Operator dashboard skeleton with KPI cards and live order queue

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

## Project Structure

- `src/app/page.tsx`: customer storefront
- `src/app/dashboard/page.tsx`: operator dashboard
- `src/lib/menu-data.ts`: starter menu and KPI data
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
