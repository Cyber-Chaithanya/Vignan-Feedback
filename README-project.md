# UniFeedback — University Multi-Stakeholder Feedback Platform

A production-ready React application for collecting, analyzing, and acting on feedback from students, faculty, and parents.

## Features

- **Multi-role auth** (Student / Faculty / Parent / Admin) with demo mode
- **Role-based dashboards** and feedback submission with star ratings
- **AI-style sentiment analysis** on comments
- **Admin Command Center**: analytics charts, master inbox with filters & bulk actions, action plan generator
- **Executive report export**
- **Dark / light mode**, fully responsive, toast notifications
- **Works offline with localStorage mock data** — no Supabase required for demo

## Quick Start

```bash
cd uni-feedback
npm install
npm run dev
```

Open http://localhost:5173

### Demo logins (password: `demo123`)

| Role    | Email            |
|---------|------------------|
| Student | student@uni.edu  |
| Faculty | faculty@uni.edu  |
| Parent  | parent@uni.edu   |
| Admin   | admin@uni.edu    |

Or use the role cards on the landing page for one-click demo access.

## Optional Supabase Setup

1. Create a Supabase project
2. Run the SQL schema (see `supabase-schema.sql`)
3. Copy `.env.example` → `.env` and fill in keys
4. Enable Email auth in Supabase dashboard

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS
- Lucide Icons
- Recharts
- Supabase JS (optional)
- Sonner toasts
- React Router 7

## Project Structure

```
src/
  components/   # UI + shared forms
  context/      # Auth + Feedback state
  data/         # Seed / mock data
  pages/        # Landing, Auth, role portals, Admin
  types/        # Shared TypeScript types
  lib/          # utils + supabase client
```
