# Notion Clone — Next.js + Convex + Clerk + BlockNote

A full-stack Notion-like editor built with:
- **Next.js 16 Canary** + Turbopack
- **Convex** — real-time backend
- **Clerk** — authentication
- **BlockNote** — rich text editor
- **Tailwind CSS v4**

---

## Setup (Required before running)

### 1. Set Replit Secrets

Open the **Secrets** tab in Replit and add these keys:

| Secret Key | Where to get it |
|---|---|
| `NEXT_PUBLIC_CONVEX_URL` | Convex dashboard after `npx convex dev --once` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard → API Keys |
| `CLERK_SECRET_KEY` | Clerk Dashboard → API Keys |
| `CLERK_JWT_ISSUER_DOMAIN` | Clerk Dashboard → JWT Templates → Convex |

### 2. Initialize Convex

In the Replit Shell, run:
```bash
npx convex dev --once
```
This generates `convex/_generated/` and gives you your `NEXT_PUBLIC_CONVEX_URL`.

### 3. Configure Clerk

In your **Clerk Dashboard**:
1. Go to **JWT Templates** → Create template → select **Convex**
2. Copy the **Issuer URL** → paste into `CLERK_JWT_ISSUER_DOMAIN` secret
3. Go to **Allowed Origins** → add your Replit URL: `https://YOUR-REPL.replit.dev`

### 4. Start the app

Click the **Run** button or in the Shell:
```bash
npm run dev
```

The app runs on port **5000** (Replit webview port).

---

## Project Structure

```
├── app/
│   ├── layout.tsx          — Root layout (Clerk + Convex providers)
│   ├── page.tsx            — Landing / redirect page
│   ├── dashboard/page.tsx  — Dashboard with sidebar
│   ├── doc/[id]/page.tsx   — Document editor page
│   └── (auth)/             — Sign-in / sign-up pages
├── components/
│   ├── editor.tsx          — BlockNote rich text editor
│   ├── sidebar.tsx         — Page list & trash
│   └── navbar.tsx          — Doc navbar with publish button
├── convex/
│   ├── schema.ts           — Database schema
│   ├── pages.ts            — Page CRUD mutations/queries
│   ├── blocks.ts           — Block content mutations/queries
│   └── auth.config.ts      — Clerk JWT config
├── lib/
│   └── convex.tsx          — ConvexClientProvider
└── middleware.ts            — Clerk route protection
```

---

## Features

- 📝 Rich text editing with BlockNote (slash commands, markdown shortcuts)
- 📁 Sidebar with page list and trash
- 🔐 Auth-protected routes with Clerk
- ☁️ Real-time sync with Convex
- 📤 Publish/unpublish pages
- 🗑️ Archive and restore pages
