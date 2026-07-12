# Zomato — Food Ordering App

A full-stack food ordering web application inspired by Zomato. Browse restaurants, explore menus, manage a persistent cart, and place orders with simulated checkout.

## Features

- **Authentication** — Register, login, logout with JWT sessions (httpOnly cookies)
- **Restaurant discovery** — Search, category filters, rating and veg filters
- **Restaurant detail** — Menu grouped by category, reviews, recommended dishes
- **Shopping cart** — Add/remove items, quantity controls, database persistence
- **Checkout** — Delivery address, simulated payment (COD / UPI / Card), order confirmation
- **Order history** — View past orders on the profile page
- **Responsive UI** — Mobile-friendly layout with loading skeletons and empty states

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS 4, Framer Motion |
| Database | SQLite via Prisma 7 |
| Auth | bcryptjs + jsonwebtoken |
| Icons | react-icons |

## Prerequisites

- Node.js 18+
- npm

## Installation

```bash
# Clone the repository and enter the project folder
cd zomato

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

Edit `.env` and set a strong `JWT_SECRET` before running in production.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | SQLite connection string, e.g. `file:./dev.db` |
| `JWT_SECRET` | Yes | Secret key for signing JWT session tokens |

See `.env.example` for a template.

## Database Setup

### Generate Prisma Client

```bash
npm run db:generate
```

### Run Migrations

```bash
npm run db:migrate
```

### Seed the Database

Populates restaurants, categories, food items, demo users, and reviews:

```bash
npm run db:seed
```

### Reset Database (optional)

Drops data, re-runs migrations, and seeds again:

```bash
npm run db:reset
```

### Open Prisma Studio (optional)

Visual database browser:

```bash
npm run db:studio
```

## Running Locally

```bash
# Development server (with Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You will be redirected to login if not authenticated.

### Demo Account

After seeding, use these credentials:

| Field | Value |
|-------|-------|
| Email | `user@example.com` |
| Password | `Password123` |

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript check |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Apply database migrations |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:reset` | Reset database and re-seed |
| `npm run db:studio` | Open Prisma Studio |

## Project Structure

```
app/           # Pages and API routes
components/    # Reusable UI components
context/       # React context (auth, cart, toast)
lib/           # Auth helpers and Prisma client
prisma/        # Schema, migrations, and seed script
types/         # Shared TypeScript interfaces
middleware.ts  # Route protection
```

## API Routes

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/auth/register` | POST | Create account |
| `/api/auth/login` | POST | Sign in |
| `/api/auth/logout` | POST | Sign out |
| `/api/auth/me` | GET | Current user |
| `/api/restaurants` | GET | List/search restaurants |
| `/api/restaurants/[id]` | GET | Restaurant detail |
| `/api/cart` | GET, POST, PUT, DELETE | Cart operations |
| `/api/orders` | GET, POST | Order history / place order |

## License

Private — built for educational / submission purposes.
