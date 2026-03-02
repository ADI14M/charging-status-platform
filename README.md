<div align="center">

# ⚡ ChargeConnect

### India's Smart EV Charging Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Typed-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

A full-stack EV charging station management and discovery platform with real-time charger status tracking, station owner dashboards, admin approval workflows, and a consumer-facing map experience.

[Live Demo →](#getting-started) · [Features](#-features) · [Tech Stack](#-tech-stack) · [Setup](#-getting-started)

---

</div>

## 🎯 Overview

ChargeConnect connects **EV drivers** with nearby charging stations while giving **station owners** powerful tools to manage their infrastructure. An **admin panel** oversees the entire network with approval workflows and analytics.

```
👤 EV Driver          →  Find stations · Navigate · Start charging · Pay
🏢 Station Owner      →  Add stations · Manage chargers · Track earnings
🛡️ Platform Admin     →  Approve stations · Monitor network · Analytics
```

---

## ✨ Features

### 🗺️ Consumer Experience
- **Interactive Station Finder** — Map + List dual-view with real-time charger status
- **Smart Search** — Search stations by name or location
- **Filter System** — Filter by availability, fast charge capability, or nearest
- **Distance Sorting** — Stations sorted by proximity using GPS
- **Live Charger Status** — Color-coded markers: 🟢 Available · 🟡 Engaged · 🔴 Offline
- **Google Maps Navigation** — One-tap directions to any station
- **Charging Simulation** — Animated charging flow with live cost tracking

### 📊 Station Owner Dashboard
- **Revenue Analytics** — Area charts showing 7-day and 30-day revenue trends
- **Session Tracking** — Bar charts for daily charging sessions
- **Transaction History** — Paginated table with status badges and duration
- **Station Management** — Full CRUD: add, edit, view, delete stations
- **Charger Management** — Dynamic charger setup with connector types and pricing
- **Real-time Status** — Live charger status indicators across all stations
- **Earnings Page** — Total revenue, monthly breakdown, average per session

### 🛡️ Admin Panel
- **Approval Workflow** — Review and approve/reject new stations
- **Owner Verification** — View station owner profiles and contact info
- **Expandable Details** — Inspect station amenities, photos, and descriptions
- **Rejection Reasons** — Provide feedback when rejecting applications

### 🔐 Authentication
- **Role-Based Access** — Consumer, Station Owner, and Admin roles
- **Supabase Auth** — Secure email/password authentication
- **Protected Routes** — Auth guard redirects unauthenticated users
- **Forgot Password** — Magic link password reset flow

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 14 | Server-side rendering, routing, API |
| **Language** | TypeScript | Type-safe development |
| **Styling** | Tailwind CSS | Utility-first responsive design |
| **Database** | Supabase (PostgreSQL) | Data storage with Row Level Security |
| **Auth** | Supabase Auth | User management and sessions |
| **Real-time** | Supabase Realtime | Live charger status subscriptions |
| **Charts** | Recharts | Revenue and session analytics |
| **Animations** | Framer Motion | Page transitions and micro-interactions |
| **Icons** | Lucide React | Consistent iconography |
| **Maps** | Google Maps API | Station navigation (optional) |

---

## 📁 Project Structure

```
charging-status-platform/
├── admin-panel/                    # Next.js web application
│   ├── components/
│   │   ├── Landing/               # Hero, Navbar for landing page
│   │   ├── Map/                   # StationDrawer, ChargingModal, FilterChips
│   │   ├── Layout.tsx             # Admin sidebar layout
│   │   └── ConsumerLayout.tsx     # Consumer map layout
│   ├── lib/
│   │   ├── supabaseClient.ts      # Supabase initialization
│   │   └── auth.ts                # useAuth hook with role guards
│   ├── pages/
│   │   ├── index.tsx              # Premium landing page
│   │   ├── login.tsx              # Auth with forgot password
│   │   ├── signup.tsx             # Role-based registration
│   │   ├── dashboard.tsx          # Owner analytics dashboard
│   │   ├── stations.tsx           # Station list management
│   │   ├── stations/add.tsx       # Add new station form
│   │   ├── stations/[id].tsx      # Station detail & edit
│   │   ├── earnings.tsx           # Revenue analytics
│   │   ├── map/index.tsx          # Consumer station finder
│   │   └── admin/approvals.tsx    # Admin approval workflow
│   └── styles/globals.css         # Custom animations & design tokens
├── backend/
│   ├── schema.sql                 # Database schema
│   └── supabase/
│       ├── migrations/            # Database migrations
│       ├── functions/             # Edge functions (payments, notifications)
│       └── seed/                  # Sample data
└── docs/                          # Architecture & API documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Supabase** account ([supabase.com](https://supabase.com))
- **Google Maps API key** (optional, for map navigation)

### 1. Clone the repository

```bash
git clone https://github.com/ADI14M/charging-status-platform.git
cd charging-status-platform
```

### 2. Install dependencies

```bash
cd admin-panel
npm install
```

### 3. Set up environment variables

```bash
cp ../.env.example .env.local
```

Edit `.env.local` with your actual keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key   # Optional
```

### 4. Set up Supabase database

Run the SQL from `backend/schema.sql` in your Supabase SQL editor to create all tables, policies, and triggers.

### 5. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📸 Screenshots

| Landing Page | Signup Flow |
|:---:|:---:|
| Dark gradient hero with animated stats | Role selection (EV Driver / Station Owner) |

| Consumer Map | Station Drawer |
|:---:|:---:|
| Color-coded markers with distance sorting | Charger-by-charger status with pricing |

| Dashboard | Earnings |
|:---:|:---:|
| Revenue & session charts with real data | 30-day trend with transaction history |

---

## 🗄️ Database Schema

```
profiles         → User accounts with roles (user, charger_owner, admin)
charging_stations → Station details, location, amenities, status
chargers         → Individual charger specs (connector, power, price)
charger_status   → Real-time charger availability (available, charging, offline)
transactions     → Payment records with energy consumed and duration
reviews          → Station ratings and user feedback
verification_logs → Admin approval/rejection history
```

All tables have **Row Level Security (RLS)** enabled for data isolation.

---

## 🔑 User Roles

| Role | Access |
|------|--------|
| **Consumer** (`user`) | Map, station search, navigation, charging |
| **Station Owner** (`charger_owner`) | Dashboard, station CRUD, earnings, charger management |
| **Admin** (`admin`) | Everything + approval workflows |

---

## 🌟 Design Highlights

- **Dark-mode landing page** with gradient orbs and glassmorphism
- **Scroll-aware navbar** transitioning from transparent to frosted glass
- **Animated charging modal** with SVG progress ring and live cost
- **Color-coded status system** — green/yellow/red across all views
- **Responsive design** — works on mobile with bottom navigation
- **Framer Motion transitions** on drawers, modals, and page entries

---

## 📄 License

This project is owned by Aditya & tarun and portfolio purposes.

---

<div align="center">

**Built with ❤️ for the EV revolution 🚗⚡**

</div>
