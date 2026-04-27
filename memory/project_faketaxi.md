---
name: FakeTaxi project
description: Taxi ride tracker app built with Next.js 14 App Router + TypeScript + Supabase + Tailwind CSS
type: project
---

Full Next.js project scaffolded at c:\Users\natan\Desktop\codigo\faketaxi.

**Why:** User wanted a mobile-first ride tracker for taxi drivers, designed for one-handed use in a car.

**How to apply:** This is the primary working project. The user still needs to: run `npm install`, set up a Supabase project, copy `.env.local.example` → `.env.local`, run the SQL migration in `supabase/migrations/001_init.sql`, then `npm run dev`.

Stack: Next.js 14 App Router, TypeScript, Tailwind CSS, Supabase JS v2, SWR, date-fns v3, recharts, react-hot-toast.

Key design decisions:
- Numpad uses "centimos entry" (right-to-left, POS style) — stored as `cents` integer internally, divided by 100 on save
- All pages are `'use client'` for interactivity; SWR handles cache + optimistic updates
- Swipe-left on RideCard reveals delete button; confirmation modal before delete
- Last payment method persisted in localStorage via `LAST_PAYMENT_KEY`
- `daily_summaries` is a Supabase VIEW (not a table) — queried with `.from('daily_summaries')`
