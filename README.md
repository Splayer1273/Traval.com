# ✈️ Project Sunrise — MERN Corporate Travel Platform

A professional, light-themed corporate travel management platform built with the **MERN** stack:
MongoDB, Express, React (Vite) and Node.js.

**Base URL:** `http://localhost:5000/api`

## ✨ Features

- **Auth** — JWT register / login / me / logout with role-based access
  (`admin`, `manager`, `finance`, `employee`)
- **Trips** — request, edit, cancel & track trips with an approval workflow
- **Approvals** — manager review queue with approve / reject + full decision history
- **Bookings** — flights, hotels, cabs, trains per trip, with live trip-cost sync
- **Expenses** — claims with category, finance review (approve / reject with notes)
- **Companies & Team** — admin management of companies, members and roles
- **Dashboard** — KPI cards, trip-status donut, spend-by-month bar chart, recent trips
- **Polished light UI** — custom design system, responsive sidebar, toasts, modals

## 📁 Project structure

```
trip/
├── backend/                 # Express + Mongoose API
│   ├── server.js
│   └── src/
│       ├── config/db.js
│       ├── models/          # User, Company, Trip, Booking, Expense
│       ├── controllers/     # auth, users, companies, trips, bookings, approvals, expenses
│       ├── routes/
│       ├── middleware/      # JWT auth + role guard, error handler
│       └── seed/seed.js     # Demo data
├── frontend/                # React (Vite) app
│   └── src/
│       ├── components/      # Layout, ProtectedRoute, UI kit
│       ├── context/         # AuthContext (JWT in localStorage)
│       ├── lib/             # api client, toasts, formatting
│       └── pages/           # Login, Register, Dashboard, Trips, Bookings,
│                            # Approvals, Expenses, Companies, Users, 404
└── package.json             # Root scripts (run everything with one command)
```

## 🚀 Getting started

### Prerequisites

- Node.js ≥ 18
- MongoDB running locally on `27017` (or change `MONGO_URI` in `backend/.env`)

### 1. Install

```bash
npm run install:all
```

### 2. Seed the database (optional but recommended)

```bash
npm run seed
```

### 3. Run both servers

```bash
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend (Vite) | http://localhost:5173 |
| Backend API | http://localhost:5000/api |

Run them individually with `npm run dev:api` and `npm run dev:web`.

## 🔑 Demo accounts

All seeded accounts use the password **`Password@123`**

| Role | Email |
|------|-------|
| Admin | `admin@sunrise.io` |
| Manager | `manager@acme.com` |
| Finance | `finance@acme.com` |
| Employee | `emma@acme.com` |
| Employee | `john@globex.com` |
| Employee | `priya@initech.com` |

> Tip: the login page has one-click demo-account buttons.

## 🔌 API overview

| Resource | Endpoints | Notes |
|----------|-----------|-------|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/logout` | JWT bearer |
| Users | `GET/POST /users`, `GET/PUT/DELETE /users/:id`, `PATCH /users/:id/role` | Admin |
| Companies | `GET /companies`, `POST/PUT/DELETE /companies/:id` | Write = admin |
| Trips | `GET/POST /trips`, `GET/PUT/DELETE /trips/:id` | Scoped by role/company |
| Bookings | `GET/POST /bookings`, `GET/PUT/DELETE /bookings/:id` | Attached to trips |
| Approvals | `GET /approvals?status=`, `PATCH /approvals/:tripId/approve|reject` | Manager/admin |
| Expenses | `GET/POST /expenses`, `GET/PUT/DELETE /expenses/:id`, `PATCH /expenses/:id/status` | Review = finance/admin |

**Common response format**

```json
{ "success": true, "count": 0, "data": [ ... ] }
{ "success": false, "message": "Error description" }
```

### Role matrix

| Capability | Employee | Manager | Finance | Admin |
|------------|:--------:|:-------:|:-------:|:-----:|
| Create / manage own trips | ✅ | ✅ | ✅ | ✅ |
| See company trips | — | ✅ | ✅ | ✅ |
| Approve / reject trips | — | ✅ | — | ✅ |
| Review expenses | — | — | ✅ | ✅ |
| Manage companies / users | — | — | — | ✅ |
| Change roles | — | — | — | ✅ |

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run API + web with hot reload |
| `npm run seed` | Reset & seed demo data |
| `npm run build` | Production build of the frontend |
| `npm --prefix backend start` | Run the API in production mode |

---

*Built for Project Sunrise — corporate travel made effortless.*
