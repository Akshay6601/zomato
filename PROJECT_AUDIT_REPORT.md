# PROJECT AUDIT REPORT — Zomato-Inspired Food Ordering App

**Audit Date:** July 12, 2026  
**Auditor Role:** Senior Software Architect / Code Reviewer  
**Scope:** Read-only analysis of repository at `C:\Users\Akshay\Desktop\zomato`  
**Stack:** Next.js 15.5.20 (App Router) · React 19 · TypeScript · Prisma 7 · SQLite · Tailwind CSS 4 · JWT + bcrypt

---

## Executive Summary

This project is a **substantially complete** Zomato-inspired food ordering application. The core user journey — register/login → browse restaurants → view menu → add to cart → checkout → view order history — is implemented end-to-end with a real database, API layer, and polished UI.

Development was interrupted before final polish: there is no project-specific README, several ESLint errors block a clean lint pass, production build failed in this environment due to Google Fonts fetch (network), middleware does not validate JWT tokens, and several “nice-to-have” features (write reviews, dedicated search page, order detail API) are absent.

**Estimated overall completion: ~78%**

---

## Step 1 — Project Analysis

### 1.1 Folder Structure

```
zomato/
├── app/                          # Next.js App Router
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   ├── me/route.ts
│   │   │   └── register/route.ts
│   │   ├── cart/route.ts         # GET, POST, PUT, DELETE
│   │   ├── orders/route.ts       # GET, POST
│   │   └── restaurants/
│   │       ├── route.ts          # GET (list + search)
│   │       └── [id]/route.ts     # GET (detail)
│   ├── cart/page.tsx
│   ├── checkout/
│   │   ├── page.tsx
│   │   └── success/page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── profile/page.tsx
│   ├── restaurants/[id]/page.tsx
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx
│   ├── globals.css
│   └── favicon.ico
├── components/
│   ├── Navbar.tsx
│   ├── RestaurantCard.tsx
│   └── Skeleton.tsx
├── context/
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   └── ToastContext.tsx
├── lib/
│   ├── auth.ts                   # JWT + bcrypt helpers
│   └── db.ts                     # Prisma client singleton
├── types/
│   └── index.ts                  # Shared TypeScript interfaces
├── prisma/
│   ├── schema.prisma
│   ├── seed.js                   # Comprehensive seed data
│   └── migrations/
│       └── 20260712162050_init/
├── middleware.ts
├── prisma.config.ts
├── next.config.ts
├── dev.db                        # SQLite database (populated)
├── public/                       # Default Next.js SVG assets only
└── package.json
```

**Total application source files (excluding `node_modules`, `.next`):** 47 files

### 1.2 Dependencies (`package.json`)

| Category | Packages |
|----------|----------|
| **Runtime** | `next@15.5.20`, `react@19.1.0`, `react-dom@19.1.0`, `@prisma/client@7.8.0`, `@prisma/adapter-better-sqlite3@7.8.0`, `better-sqlite3@12.11.1`, `bcryptjs@3.0.3`, `jsonwebtoken@9.0.3`, `framer-motion@12.42.2`, `react-icons@5.7.0` |
| **Dev** | `typescript@5`, `prisma@7.8.0`, `tailwindcss@4`, `@tailwindcss/postcss@4`, `eslint@9`, `eslint-config-next@15.5.20`, `@types/*` for bcryptjs, jsonwebtoken, node, react |

### 1.3 Package Scripts

| Script | Command | Status |
|--------|---------|--------|
| `dev` | `next dev --turbopack` | ✅ Present |
| `build` | `next build --turbopack` | ✅ Present |
| `start` | `next start` | ✅ Present |
| `lint` | `eslint` | ✅ Present |
| `db:generate` | — | ❌ Missing |
| `db:migrate` | — | ❌ Missing |
| `db:seed` | — | ❌ Missing (seed configured only in `prisma.seed` block) |
| `typecheck` | — | ❌ Missing |

### 1.4 Next.js Configuration

- **Framework:** App Router (`app/` directory)
- **TypeScript:** Enabled (`tsconfig.json` with `strict: true`, path alias `@/*`)
- **Styling:** Tailwind CSS v4 via `@import "tailwindcss"` in `globals.css`
- **Fonts:** Geist Sans + Geist Mono via `next/font/google` in `layout.tsx`
- **next.config.ts:** Empty/default — no `images.remotePatterns` for Unsplash URLs
- **Middleware:** Present at root (`middleware.ts`)
- **Turbopack:** Used for both `dev` and `build`

### 1.5 Prisma & Database

| Item | Status | Details |
|------|--------|---------|
| Schema | ✅ | 8 models: `User`, `Restaurant`, `Category`, `FoodItem`, `CartItem`, `Order`, `OrderItem`, `Review` |
| Provider | SQLite | Via `@prisma/adapter-better-sqlite3` |
| Migrations | ✅ | One migration: `20260712162050_init` |
| Seed script | ✅ | `prisma/seed.js` — 10 restaurants, 9 categories, 150 food items, 5 users, 30 reviews |
| Database file | ✅ | `dev.db` exists at project root |
| Prisma config | ✅ | `prisma.config.ts` references `DATABASE_URL` from env |

### 1.6 Environment Variables

| Variable | In `.env` | Used By | Notes |
|----------|-----------|---------|-------|
| `DATABASE_URL` | ✅ `file:./dev.db` | `prisma.config.ts` | Present |
| `JWT_SECRET` | ❌ | `lib/auth.ts` | Falls back to hardcoded default: `super-secret-key-zomato-nextjs-app` |
| `NODE_ENV` | Auto | Cookie `secure` flag | Standard |

**Missing:** `.env.example` for onboarding new developers.

### 1.7 Routes (Pages)

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.tsx` | Homepage — categories, search, filters, restaurant listings |
| `/login` | `app/login/page.tsx` | Login form with demo credentials |
| `/register` | `app/register/page.tsx` | Registration form |
| `/restaurants/[id]` | `app/restaurants/[id]/page.tsx` | Restaurant detail, menu, reviews |
| `/cart` | `app/cart/page.tsx` | Shopping cart |
| `/checkout` | `app/checkout/page.tsx` | Checkout flow |
| `/checkout/success` | `app/checkout/success/page.tsx` | Order confirmation |
| `/profile` | `app/profile/page.tsx` | User profile + order history |

**Missing pages:** `/search`, `/orders/[id]`, `/restaurants` (list page — handled on homepage)

### 1.8 API Routes

| Endpoint | Methods | Auth Required | Purpose |
|----------|---------|---------------|---------|
| `/api/auth/register` | POST | No | Create user, set session cookie |
| `/api/auth/login` | POST | No | Authenticate, set session cookie |
| `/api/auth/logout` | POST | No | Clear session cookie |
| `/api/auth/me` | GET | Yes (JWT) | Current user info |
| `/api/restaurants` | GET | No | List/search restaurants + categories |
| `/api/restaurants/[id]` | GET | No | Restaurant detail with menu & reviews |
| `/api/cart` | GET, POST, PUT, DELETE | Yes (JWT) | Full cart CRUD |
| `/api/orders` | GET, POST | Yes (JWT) | Order history + place order |

**Missing APIs:** `/api/categories`, `/api/reviews`, `/api/orders/[id]`, `/api/food`, `/api/search`

### 1.9 Authentication Architecture

- **Password hashing:** bcrypt (10 rounds) via `bcryptjs`
- **Session:** JWT stored in `httpOnly` cookie `zomato_session` (7-day expiry)
- **Server validation:** `getSession()` in API routes verifies JWT via `jsonwebtoken`
- **Client state:** `AuthContext` fetches `/api/auth/me` on mount
- **Middleware:** Redirects unauthenticated users to `/login`; redirects authenticated users away from `/login` and `/register`

### 1.10 Styling & UI Utilities

- **Tailwind CSS v4** with custom utilities (`scrollbar-hide`, neutral/rose color palette)
- **Framer Motion** for animations (hero, cards, toasts, modals, tabs)
- **react-icons** (Feather icons subset)
- **Toast system** via `ToastContext` (success/error/info)
- **Skeleton loaders** for restaurant cards and food items

### 1.11 Context Providers (in `layout.tsx`)

```
ToastProvider → AuthProvider → CartProvider → {children}
```

---

## Step 2 — Feature Audit

### Authentication

| Feature | Status | Explanation |
|---------|--------|-------------|
| Register | ✅ Complete | Full UI + API with duplicate-email check, auto-login after registration |
| Login | ✅ Complete | Full UI + API with credential validation, demo account hint |
| Logout | ✅ Complete | API clears cookie; `AuthContext` resets state and redirects to `/login` |
| Password hashing | ✅ Complete | `bcrypt.hashSync` / `bcrypt.compareSync` in `lib/auth.ts` |
| Session management | 🟡 Partially Complete | JWT cookie works for API auth, but middleware only checks cookie **existence**, not validity. No `JWT_SECRET` in `.env`. No token refresh. |
| Protected routes | 🟡 Partially Complete | Middleware protects **all** pages except `/login` and `/register` — users cannot browse without logging in (unlike real Zomato). API routes excluded from middleware matcher. |

### Homepage

| Feature | Status | Explanation |
|---------|--------|-------------|
| Navbar | ✅ Complete | Logo, search, cart badge, user dropdown with profile/orders/logout |
| Search | ✅ Complete | Navbar search (desktop) + hero search (mobile); queries `/api/restaurants?search=` |
| Categories | ✅ Complete | Horizontal scrollable category chips from API; toggles `?category=` filter |
| Restaurant cards | ✅ Complete | `RestaurantCard` component with image, rating, delivery info |
| Featured restaurants | ✅ Complete | Section for rating ≥ 4.5 (top 3), hidden when filters active |
| Responsive layout | ✅ Complete | Grid breakpoints, mobile search, scrollable categories |

### Restaurant Page

| Feature | Status | Explanation |
|---------|--------|-------------|
| Dynamic routing | ✅ Complete | `/restaurants/[id]` with async `params` (Next.js 15 pattern) |
| Restaurant information | ✅ Complete | Banner, logo, cuisine, description, delivery stats |
| Menu | ✅ Complete | Grouped by category, sidebar nav (desktop), recommended dishes |
| Ratings | ✅ Complete | Restaurant rating displayed; per-item ratings on food cards |
| Reviews | 🟡 Partially Complete | Reviews tab displays seeded reviews (read-only). **No API or UI to submit reviews.** |
| Food cards | 🟡 Partially Complete | Food items rendered inline in page (not extracted to reusable `FoodCard` component), but fully functional with veg/non-veg indicators, price, add-to-cart |

### Search

| Feature | Status | Explanation |
|---------|--------|-------------|
| Restaurant search | ✅ Complete | By name, cuisine, description via API `OR` clause |
| Food search | 🟡 Partially Complete | API searches `foodItems.name` but results return **restaurants**, not individual dishes. No dedicated food results UI. |
| Category filters | ✅ Complete | URL param `?category=` + homepage category chips; API filters restaurants with matching food items |

### Cart

| Feature | Status | Explanation |
|---------|--------|-------------|
| Add item | ✅ Complete | POST `/api/cart` with restaurant-mismatch detection + modal |
| Remove item | ✅ Complete | DELETE `/api/cart?cartItemId=` |
| Quantity controls | ✅ Complete | PUT `/api/cart` with +/- buttons; qty ≤ 0 removes item |
| Total calculation | ✅ Complete | Subtotal, 5% tax, delivery fee computed in `CartContext` |
| Database persistence | ✅ Complete | `CartItem` model with `@@unique([userId, foodItemId])` |

### Checkout

| Feature | Status | Explanation |
|---------|--------|-------------|
| Checkout page | ✅ Complete | Address input + payment method selection |
| Order summary | ✅ Complete | Item list with quantities and price breakdown |
| Fake payment | ✅ Complete | COD / UPI / Card options (all simulated, no real gateway) |
| Place order | ✅ Complete | POST `/api/orders` creates order in Prisma transaction |
| Save order | ✅ Complete | `Order` + `OrderItem` records with price snapshot |
| Clear cart | ✅ Complete | Cart cleared in same transaction after order placement |

### Profile

| Feature | Status | Explanation |
|---------|--------|-------------|
| User profile | 🟡 Partially Complete | Shows name, email, avatar initial. **"Joined July 2026" is hardcoded**, not from `user.createdAt`. No edit profile. |
| Previous orders | ✅ Complete | Fetches `/api/orders`, displays restaurant, items, address, payment, total |
| Logout | ✅ Complete | Button in profile sidebar + navbar dropdown |

### Database

| Feature | Status | Explanation |
|---------|--------|-------------|
| Prisma schema | ✅ Complete | All required entities with relations and cascade deletes |
| Migrations | ✅ Complete | Initial migration applied; `dev.db` populated |
| Seed script | ✅ Complete | Rich seed: 10 restaurants × 15 items, categories, users, reviews |
| Relationships | ✅ Complete | User→Cart/Orders/Reviews, Restaurant→Food/Orders/Reviews, etc. |
| Data integrity | 🟡 Partially Complete | `Order.status` is plain `String` (not enum). No unique constraint on `Review(userId, restaurantId)`. Restaurant rating not recalculated from reviews. |

### API

| Feature | Status | Explanation |
|---------|--------|-------------|
| Authentication endpoints | ✅ Complete | register, login, logout, me — all implemented |
| Restaurant endpoints | ✅ Complete | List with search/filter + detail with menu/reviews |
| Cart endpoints | ✅ Complete | Full CRUD with restaurant-mismatch logic |
| Order endpoints | 🟡 Partially Complete | GET (list) + POST (create) work. **No GET `/api/orders/[id]`** for single order detail. |

### UI

| Feature | Status | Explanation |
|---------|--------|-------------|
| Responsive | ✅ Complete | Mobile-first grids, collapsible search, sticky sidebars |
| Animations | ✅ Complete | Framer Motion on cards, toasts, modals, tabs, hero |
| Loading states | ✅ Complete | Spinners, skeleton cards on homepage and restaurant page |
| Error states | 🟡 Partially Complete | Toast notifications for errors; no `error.tsx` boundaries; fetch failures often only `console.error` |
| Empty states | ✅ Complete | Empty cart, no orders, no search results, no reviews |
| Mobile support | ✅ Complete | Hero mobile search, responsive grids, touch-friendly controls |

---

## Step 3 — Code Quality Audit

### 3.1 TypeScript

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | ✅ **Passes with 0 errors** |

TypeScript is well-typed with shared interfaces in `types/index.ts`. API responses are consumed with proper types on the client.

### 3.2 ESLint

| Check | Result |
|-------|--------|
| `npm run lint` | ❌ **6 errors, 18 warnings** |

**Errors (blocking clean lint):**

| File | Issue |
|------|-------|
| `app/page.tsx:135` | Unescaped apostrophe in `What's on your mind?` |
| `app/page.tsx:272` | Unescaped apostrophe in `couldn't find` |
| `app/profile/page.tsx:94` | Unescaped apostrophe in `haven't placed` |
| `prisma/seed.js:1-3` | `require()` imports forbidden by `@typescript-eslint/no-require-imports` |

**Notable warnings:**

| Category | Count | Files |
|----------|-------|-------|
| `@next/next/no-img-element` | 9 | All pages using external Unsplash `<img>` instead of `next/image` |
| `react-hooks/exhaustive-deps` | 3 | `CartContext`, `checkout/page`, `restaurants/[id]/page` |
| `@typescript-eslint/no-unused-vars` | 6 | Unused imports (`FiSliders`, `Review`), unused `err` in catch blocks |

### 3.3 Build

| Check | Result |
|-------|--------|
| `npm run build` | ❌ **Failed** (environmental) |

Build failed fetching Google Fonts (`Geist`, `Geist Mono`) — network unavailable in audit environment. This is not necessarily a code defect; a machine with internet access may build successfully. No application TypeScript or compilation errors were reported before the font fetch failure.

### 3.4 Runtime Risks

| Risk | Severity | Details |
|------|----------|---------|
| Middleware token check | **High** | Only checks `!!token`, not JWT validity. Expired/invalid tokens pass middleware but fail API calls, causing confusing UX. |
| Hardcoded JWT secret | **High** | Default secret in source if `JWT_SECRET` unset — insecure for production. |
| Auth-gated browsing | **Medium** | Entire app requires login; unauthenticated users cannot browse restaurants (design mismatch with Zomato). |
| `Navbar` + `useSearchParams` | **Medium** | `Navbar` uses `useSearchParams()` but is not wrapped in `<Suspense>` on cart, profile, restaurant, checkout pages — may cause Next.js runtime warnings/errors. |
| `confirm()` for cart clear | **Low** | Native browser dialog; inconsistent with app design system. |
| Hardcoded DB path | **Low** | `lib/db.ts` uses `file:./dev.db` directly, not `process.env.DATABASE_URL`. |
| External image dependency | **Low** | All food/restaurant images are Unsplash URLs; offline or rate-limited access breaks images. |
| No `error.tsx` / `loading.tsx` | **Low** | Route-level error boundaries and loading UI not used. |

### 3.5 Broken Imports

**None found.** All `@/` path aliases resolve correctly. TypeScript compilation confirms import integrity.

### 3.6 Dead Code

| Item | Location | Notes |
|------|----------|-------|
| `FiSliders` import | `app/page.tsx:9` | Imported but never used |
| `Review` type import | `app/restaurants/[id]/page.tsx:9` | Imported but never used |
| Default Next.js SVGs | `public/*.svg` | Unused (app uses Unsplash images) |
| `FoodItemSkeleton` | `components/Skeleton.tsx` | Used only on restaurant page — not dead |

### 3.7 Duplicate Code

| Pattern | Locations | Recommendation |
|---------|-----------|----------------|
| Tax/total calculation | `CartContext.tsx`, `app/api/orders/route.ts` | Extract to `lib/pricing.ts` |
| Veg/non-veg indicator markup | `cart/page.tsx`, `restaurants/[id]/page.tsx`, `profile/page.tsx` | Extract to `VegIndicator` component |
| Food card layout | `restaurants/[id]/page.tsx` (recommended + menu sections) | Extract to `FoodCard` component |
| Order summary bill | `cart/page.tsx`, `checkout/page.tsx` | Extract to `OrderSummary` component |
| Auth form styling | `login/page.tsx`, `register/page.tsx` | Could share `AuthFormLayout` |

### 3.8 Unused Files

| File | Status |
|------|--------|
| `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` | Unused default assets |
| `tsconfig.tsbuildinfo` | Build artifact (gitignored in `.gitignore`) |

No orphaned route files or unused components beyond default public assets.

### 3.9 Missing Environment Variables

| Variable | Required | Impact if Missing |
|----------|----------|-------------------|
| `DATABASE_URL` | Yes | Prisma CLI operations fail |
| `JWT_SECRET` | **Strongly recommended** | Uses insecure hardcoded fallback |

---

## Step 4 — Architecture Review

### 4.1 Project Structure

**Strengths:**
- Clear separation: `app/` (routes), `components/`, `context/`, `lib/`, `types/`
- API routes colocated under `app/api/` following Next.js conventions
- Shared types prevent drift between client and server

**Weaknesses:**
- Only 3 reusable components; most UI is page-inline (restaurant food cards, order cards)
- No `hooks/` directory for shared client logic
- No `lib/validators.ts` or Zod schemas for API input validation
- Seed script is `.js` while rest of project is TypeScript

### 4.2 Scalability

| Area | Assessment |
|------|------------|
| Database | SQLite suitable for demo/dev only; would need PostgreSQL for production |
| Auth | Custom JWT works for MVP; consider NextAuth/Auth.js for OAuth, refresh tokens |
| State | React Context sufficient at current scale; would need optimization for large carts / real-time updates |
| API | RESTful route handlers scale with Next.js serverless; no pagination on restaurant list |
| Images | External URLs won't scale; needs CDN or `next/image` with configured domains |

### 4.3 Reusability

- **Good:** `RestaurantCard`, `Skeleton`, context providers, `lib/auth.ts`, `lib/db.ts`
- **Missing:** `FoodCard`, `OrderSummary`, `VegIndicator`, `AuthFormLayout`, `EmptyState`, `PageHeader`

### 4.4 Code Organization

- Consistent file naming (`page.tsx`, `route.ts`)
- API routes follow REST conventions
- Client components marked with `'use client'` appropriately
- Server-side session extraction via `getSession(req)` is clean

### 4.5 Naming Consistency

| Pattern | Consistency |
|---------|-------------|
| Components | PascalCase ✅ |
| API routes | kebab-case folders ✅ |
| Context hooks | `useAuth`, `useCart`, `useToast` ✅ |
| Cookie name | `zomato_session` ✅ |
| Status strings | Mixed: `"COMPLETED"`, `"PENDING"` as plain strings (no enum/type) 🟡 |

### 4.6 Best Practices — Gaps

1. **No input validation library** (Zod/Yup) on API routes — manual `if (!field)` checks only
2. **No tests** (unit, integration, or E2E)
3. **No `next/image`** — performance and LCP impact
4. **No route-level `loading.tsx` / `error.tsx`**
5. **README is default** `create-next-app` boilerplate — no setup instructions
6. **Middleware should verify JWT**, not just check cookie presence
7. **Prisma `Order.status`** should be an enum, not free-form string
8. **Profile page** hardcodes join date instead of using API data

### 4.7 Architectural Problems & Recommendations

| Problem | Impact | Recommendation |
|---------|--------|----------------|
| All pages require authentication | Users cannot browse like Zomato without account | Limit middleware matcher to `/cart`, `/checkout`, `/profile` only |
| Middleware doesn't validate JWT | Stale sessions cause silent API failures | Call `verifyToken()` in middleware or use Next.js middleware JWT library |
| Duplicate pricing logic | Drift risk between cart display and order creation | Single `calculateOrderTotals()` utility |
| Monolithic page components | Hard to maintain (restaurant page is ~480 lines) | Extract `FoodCard`, `ReviewsList`, `MenuSection`, `CartMismatchModal` |
| No API pagination | Performance degrades with more restaurants | Add `?page=&limit=` to restaurants API |
| SQLite in production config | Not suitable for deployed apps | Environment-based datasource switching |

---

## Step 5 — Missing Files

### 5.1 API Routes (Expected but Absent)

| File | Purpose |
|------|---------|
| `app/api/categories/route.ts` | Standalone category listing |
| `app/api/reviews/route.ts` | Create/list reviews |
| `app/api/orders/[id]/route.ts` | Single order detail |
| `app/api/food/route.ts` or `app/api/search/route.ts` | Dedicated food/dish search |

### 5.2 Pages (Expected but Absent)

| File | Purpose |
|------|---------|
| `app/search/page.tsx` | Dedicated search results page |
| `app/orders/[id]/page.tsx` | Order detail / tracking page |

### 5.3 Components (Expected but Absent)

| File | Purpose |
|------|---------|
| `components/FoodCard.tsx` | Reusable menu item card |
| `components/OrderSummary.tsx` | Shared bill breakdown (cart + checkout) |
| `components/VegIndicator.tsx` | Veg/non-veg badge |
| `components/EmptyState.tsx` | Standardized empty state UI |
| `components/Footer.tsx` | Site footer |

### 5.4 Utilities & Config (Expected but Absent)

| File | Purpose |
|------|---------|
| `.env.example` | Document required environment variables |
| `lib/validators.ts` | Shared Zod schemas for API input |
| `lib/pricing.ts` | Centralized tax/total calculation |
| `app/loading.tsx` | Root loading UI |
| `app/error.tsx` | Root error boundary |
| `app/not-found.tsx` | Custom 404 page |

### 5.5 Documentation & DevOps (Expected but Absent)

| File | Purpose |
|------|---------|
| Project-specific `README.md` | Setup, seed, demo credentials, architecture |
| Test files (`__tests__/` or `*.test.ts`) | Quality assurance |
| `docker-compose.yml` | Optional containerized dev environment |
| CI configuration | GitHub Actions / lint + build pipeline |

### 5.6 Prisma (Optional Enhancements)

| Item | Purpose |
|------|---------|
| `prisma/seed.ts` | TypeScript seed (replace `.js` for consistency) |
| Status enum in schema | Type-safe order statuses |

---

## Step 6 — Dependency Audit

### 6.1 Installed & Required — All Present ✅

All packages needed for current functionality are installed.

### 6.2 Missing Dependencies

| Package | Purpose | Required? |
|---------|---------|-----------|
| `dotenv` | Loaded by `prisma.config.ts` (`import "dotenv/config"`) | **Required** — may work via transitive dependency but should be explicit in `devDependencies` |
| `@types/better-sqlite3` | TypeScript types for `better-sqlite3` | Optional — Prisma adapter abstracts most usage |
| `zod` | Runtime API input validation | Optional — recommended for production |
| `next-auth` / `@auth/prisma-adapter` | Production-grade auth | Optional — current JWT solution works for MVP |

### 6.3 Potentially Unnecessary

| Package | Notes |
|---------|-------|
| Default `public/*.svg` assets | Not referenced in application code |

### 6.4 Dev Script Gaps (Not Packages)

These are not missing npm packages but missing `package.json` scripts that depend on installed tools:

```json
"db:generate": "prisma generate",
"db:migrate": "prisma migrate dev",
"db:seed": "prisma db seed",
"db:reset": "prisma migrate reset",
"typecheck": "tsc --noEmit"
```

---

## Step 7 — Final Completion Report

```
Authentication ............ 85%
Homepage .................. 95%
Restaurant Pages .......... 80%
Search .................... 70%
Cart ...................... 95%
Checkout .................. 90%
Profile ................... 75%
Database .................. 90%
API ....................... 75%
UI Polish ................. 70%
DevOps / Tooling .......... 35%
─────────────────────────────────
Overall Project ........... 78%
```

### Scoring Rationale

| Area | % | Key Gaps |
|------|---|----------|
| Authentication | 85% | Middleware doesn't verify JWT; entire app gated |
| Homepage | 95% | Minor ESLint issues; otherwise feature-complete |
| Restaurant Pages | 80% | No review submission; food cards not componentized |
| Search | 70% | No dedicated page; food search returns restaurants only |
| Cart | 95% | Fully functional with DB persistence |
| Checkout | 90% | Simulated payment works; no address book |
| Profile | 75% | Hardcoded join date; no profile editing |
| Database | 90% | Rich schema + seed; minor integrity gaps |
| API | 75% | Core CRUD done; missing reviews, order detail, categories |
| UI Polish | 70% | Good animations/responsive; ESLint errors, no `next/image`, no error boundaries |
| DevOps | 35% | Default README, no tests, no CI, no `.env.example`, lint errors |

---

## Step 8 — Roadmap

### Phase 1 — Fix Project Health
**Effort: 4–6 hours**

- [ ] Fix 6 ESLint errors (apostrophes, seed.js lint config exclusion)
- [ ] Add `JWT_SECRET` to `.env` and `.env.example`
- [ ] Add `db:generate`, `db:migrate`, `db:seed`, `typecheck` scripts
- [ ] Install `dotenv` explicitly as devDependency
- [ ] Verify production build with network access (or self-host fonts)
- [ ] Write project-specific README with setup steps and demo credentials

### Phase 2 — Harden Authentication & Middleware
**Effort: 4–8 hours**

- [ ] Validate JWT in middleware (not just cookie presence)
- [ ] Restrict middleware to truly protected routes (`/cart`, `/checkout`, `/profile`)
- [ ] Allow unauthenticated browsing of `/`, `/restaurants/[id]`
- [ ] Handle expired sessions gracefully (redirect + clear cookie)
- [ ] Add basic password strength rules on register API

### Phase 3 — Complete Database & API Gaps
**Effort: 6–10 hours**

- [ ] Add `GET /api/orders/[id]` endpoint
- [ ] Add `POST /api/reviews` endpoint with validation
- [ ] Convert `Order.status` to Prisma enum
- [ ] Add `@@unique([userId, restaurantId])` on Review (optional)
- [ ] Migrate seed script to TypeScript
- [ ] Use `DATABASE_URL` consistently in `lib/db.ts`

### Phase 4 — Refactor & Extract Components
**Effort: 8–12 hours**

- [ ] Extract `FoodCard`, `OrderSummary`, `VegIndicator` components
- [ ] Extract `lib/pricing.ts` for shared total calculation
- [ ] Add Zod validation schemas for all API POST/PUT bodies
- [ ] Wrap `Navbar` in `<Suspense>` or split search into child component
- [ ] Replace `<img>` with `next/image` + configure `remotePatterns` for Unsplash

### Phase 5 — Complete Remaining Features
**Effort: 10–16 hours**

- [ ] Review submission UI on restaurant page
- [ ] Dedicated `/search` page with food + restaurant results
- [ ] Order detail page `/orders/[id]`
- [ ] Profile: show real `createdAt`, optional edit name
- [ ] Dynamic order status display (not hardcoded "Delivered")
- [ ] Saved addresses (optional stretch)

### Phase 6 — UI Polish & Production Readiness
**Effort: 8–14 hours**

- [ ] Add `loading.tsx` and `error.tsx` at route levels
- [ ] Custom `not-found.tsx` page
- [ ] Replace `confirm()` with styled modal for cart clear
- [ ] Add Footer component
- [ ] Add basic test suite (API routes + auth flow)
- [ ] Set up CI pipeline (lint + typecheck + build)
- [ ] Prepare PostgreSQL migration path for deployment

---

## Appendix A — Demo Credentials (from Seed)

| Field | Value |
|-------|-------|
| Email | `user@example.com` |
| Password | `Password123` |

Additional seeded reviewer accounts: `alice@example.com`, `bob@example.com`, etc. (same password).

## Appendix B — Seeded Data Summary

| Entity | Count |
|--------|-------|
| Restaurants | 10 |
| Categories | 9 |
| Food Items | 150 (15 per restaurant) |
| Users | 5 (1 demo + 4 reviewers) |
| Reviews | 30 (3 per restaurant) |

## Appendix C — File Inventory

| Category | Count |
|----------|-------|
| Pages (`page.tsx`) | 8 |
| API Routes (`route.ts`) | 8 |
| Components | 3 |
| Context Providers | 3 |
| Lib utilities | 2 |
| Type definitions | 1 |
| Config files | 6 |
| Prisma files | 4 |

---

*End of audit report. No application code was modified during this analysis.*
