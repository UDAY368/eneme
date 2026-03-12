# ENEME Website - Admin Panel System

Production-grade website with Admin Panel for ENEME. Built with Next.js, Express, PostgreSQL (Railway), and Prisma.

## Project Structure

```
├── backend/          # Express API server
├── frontend/         # Next.js app (User UI + Admin UI)
│   ├── app/          # App router
│   │   ├── admin/    # Admin panel (/admin)
│   │   └── page.tsx  # User landing (public)
├── docs/
│   └── API_CONTRACT.md
```

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` (or use existing) with:
```
DATABASE_URL=postgresql://postgres:...@shinkansen.proxy.rlwy.net:59800/railway
DATABASE_PUBLIC_URL=postgresql://postgres:...@shinkansen.proxy.rlwy.net:59800/railway
JWT_SECRET=mysupersecretkey123456789railwaydb
PORT=4000
```

Run database setup:

**Option A - Fresh database (no existing tables):**
```bash
npx prisma migrate deploy
npm run db:seed
```

**Option B - Database has existing tables (reset to match schema):**
```bash
npx prisma db push --force-reset
npm run db:seed
```

**Option C - Development (creates migration from schema):**
```bash
npm run db:migrate
npm run db:seed
```

Start backend:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Start frontend:
```bash
npm run dev
```

### 3. Access

- **User UI**: http://localhost:3000 (public, no login)
- **Admin Panel**: http://localhost:3000/admin (login required)
  - Username: `user@111`
  - Password: `Admin@111`

## Admin Features

- **Analytics**: Total visits, total leads, daywise/monthwise charts
- **Content > Portfolio**: Categories, sub-categories, portfolio CRUD
- **Content > Blog**: Blog CRUD with rich text editor
- **Leads**: View leads from "Start Our Journey" form, filter, mark reviewed

## API Documentation

See [docs/API_CONTRACT.md](docs/API_CONTRACT.md) for full API specification.
