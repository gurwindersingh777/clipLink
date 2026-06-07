# ClipLink — URL Shortener

A full-stack URL shortener built with Next.js 16, TypeScript, and PostgreSQL. Create branded short links, track clicks with detailed analytics, generate QR codes, and manage everything from a clean dashboard.

**Live Demo → [cliplink-app.vercel.app](https://cliplink-app.vercel.app)**

---

## Tech Stack

<p align="left">
  <img src="https://skillicons.dev/icons?i=nextjs" height="40" title="Next.js" />
  <img src="https://skillicons.dev/icons?i=ts" height="40" title="TypeScript" />
  <img src="https://skillicons.dev/icons?i=tailwind" height="40" title="Tailwind CSS" />
  <img src="https://skillicons.dev/icons?i=react" height="40" title="React" />
  <img src="https://skillicons.dev/icons?i=prisma" height="40" title="Prisma" />
  <img src="https://skillicons.dev/icons?i=postgres" height="40" title="PostgreSQL" />
  <img src="https://skillicons.dev/icons?i=redis" height="40" title="Upstash Redis" />
  <img src="https://skillicons.dev/icons?i=vercel" height="40" title="Vercel" />
  <img src="https://skillicons.dev/icons?i=github" height="40" title="GitHub" />
</p>

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Auth | Better Auth |
| Database | Prisma + Neon PostgreSQL |
| Server State | TanStack Query + Axios |
| Charts | Recharts |
| Rate Limiting | Upstash Redis |
| Forms | React Hook Form + Zod |
| QR Codes | react-qr-code |
| Deployment | Vercel |

---

## Features

- **URL Shortening** — Paste any long URL and get a clean short link instantly
- **Custom Slugs** — Pro users can create branded links like `cliplink.com/my-portfolio`
- **Click Analytics** — Track clicks over time, referrer sources, and country breakdown with interactive charts
- **QR Code Generation** — Generate and download a PNG QR code for every link
- **Free / Pro Tiers** — Free users get 15 links. Pro users get unlimited links and custom slugs
- **Rate Limiting** — Protects link creation and redirect endpoints from abuse
- **Auth** — Email and password authentication with secure httpOnly sessions

---

## Screenshots

> Dashboard, analytics, and landing page screenshots can go here.

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Login and register pages
│   ├── (protected)/         # Dashboard and pricing pages
│   ├── [slug]/              # Redirect engine
│   └── api/
│       ├── auth/            # Better Auth handler
│       ├── links/           # Link CRUD endpoints
│       └── upgrade/         # Tier upgrade endpoint
├── components/
│   ├── landing/             # Landing page sections
│   ├── shared/              # Reusable components
│   └── ui/                  # shadcn/ui components
├── hooks/                   # TanStack Query hooks
├── lib/                     # db, auth, utils, constants
└── schemas/                 # Zod validation schemas
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database
- An [Upstash](https://upstash.com) Redis database

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/gurwindersingh777/cliplink.git
cd cliplink
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**

Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

```env
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

**4. Run database migrations**
```bash
npx prisma migrate dev
```

**5. Start the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Architecture

### Redirect Engine

When a user visits `cliplink.com/abc123`:

```
[slug]/page.tsx
  → rate limit check (Upstash Redis)
  → query DB for shortCode or customSlug
  → check active status and expiry
  → insert Click row + increment count (transaction)
  → redirect() to original URL
```

### Auth Flow

Better Auth handles sessions via httpOnly cookies. Middleware checks the cookie on every request — no database call on each page load. Session verification only happens in API routes when needed.

### Tier Enforcement

Free users are limited to 15 links. The limit is enforced server-side in `POST /api/links` — never client-side. The client UI disables the form when the limit is reached, but the API always has the final say.

### Rate Limiting

Two Upstash Redis sliding window limiters:
- **Link creation** — 10 requests per 10 minutes per IP
- **Redirects** — 60 requests per minute per IP

Sliding window is used over fixed window to prevent boundary burst attacks.

---

## API Routes

| Method | Route | Description |
|---|---|---|
| POST | `/api/links` | Create a short link |
| GET | `/api/links` | Get all links for current user |
| DELETE | `/api/links/[id]` | Delete a link |
| GET | `/api/links/[id]` | Get link with click analytics |
| POST | `/api/upgrade` | Upgrade user to Pro tier |
| ALL | `/api/auth/[...all]` | Better Auth handler |

---

## Database Schema

```
User          — id, email, name, tier, emailVerified
Session       — id, token, userId, expiresAt
Account       — id, userId, providerId, password
Verification  — id, identifier, value, expiresAt
Link          — id, shortCode, customSlug, url, userId, active, count, expireAt
Click         — id, linkId, ipAddress, userAgent, referer, country, createdAt
```

---

## Security

- **IDOR Protection** — Every link operation verifies `link.userId === session.user.id`
- **Rate Limiting** — Upstash Redis sliding window on critical endpoints
- **Auth** — httpOnly cookies, no tokens in localStorage
- **Validation** — Zod schema validation on all API inputs
- **Ownership Checks** — 403 returned before 404 on protected resources

---

## Payment Integration

The Pro tier upgrade flow is architected for a real payment gateway with the following structure:

```
User clicks Upgrade
→ POST /api/upgrade (validates session)
→ Updates user.tier = "PRO" in database
→ Session refresh
→ UI updates to reflect Pro status
```

In production this would be replaced with:
1. `POST /api/stripe/checkout` → Stripe hosted checkout page
2. Stripe webhook → signature verification → tier update in DB

Simulated for demo purposes. Razorpay would be used for Indian market production deployment.

---

## Deployment

Deployed on Vercel with:
- Neon PostgreSQL (serverless, connection pooling enabled)
- Upstash Redis (serverless rate limiting)
- Automatic deployments on push to `main`

---

## What I Learned

- Next.js App Router patterns — server vs client components, route groups, dynamic segments
- Full auth system implementation with Better Auth and Prisma adapter
- IDOR security and ownership checks on every mutation
- TanStack Query patterns — `useQuery`, `useMutation`, cache invalidation
- Rate limiting with sliding window algorithm
- Prisma transactions for atomic database operations
- Serverless deployment considerations — connection pooling, stateless functions

---

## Author

**Gurwinder Singh**

<p align="left">
  <a href="https://github.com/gurwindersingh777">
    <img src="https://skillicons.dev/icons?i=github" height="35" title="GitHub" />
  </a>
</p>

