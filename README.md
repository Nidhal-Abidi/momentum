# Momentum

A modern habit tracking application that helps you visualize and maintain balance across all areas of your life. View multiple life domains side-by-side in calendar grids to instantly spot which areas need attention.

## Features

- **Side-by-Side Calendar View** — Track multiple life domains simultaneously with visual completion indicators
- **Domain Management** — Create and customize life areas (Career, Health, Learning, etc.) with colors and icons
- **Goals & Streaks** — Set weekly targets and maintain consecutive goal achievement streaks
- **Analytics Dashboard** — Visualize completion rates and identify patterns across all domains
- **Yearly Views** — Zoom into any domain to see a full year of progress at a glance

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Database:** PostgreSQL with Prisma ORM (Neon serverless)
- **Authentication:** NextAuth v5 with credential-based auth
- **State Management:** TanStack Query (React Query)
- **Styling:** Tailwind CSS v4 + Shadcn components
- **Charts:** Recharts for analytics visualization
- **Testing:** Vitest + React Testing Library

## Project Structure

```
app/
├── (auth)/           # Login & signup pages
├── (protected)/      # Authenticated routes (calendar, domains, goals, analytics)
└── api/              # REST API routes
components/           # Feature-based components
├── analytics/        # Dashboard & charts
├── calendar/         # Calendar views & interactions
├── domains/          # Domain management
└── goals-and-streaks/
lib/
├── hooks/            # Custom React Query hooks
├── types/            # TypeScript definitions
└── utils/            # Helper functions
prisma/               # Database schema & migrations
```

## Getting Started

### Prerequisites

- Node.js 20+ and pnpm
- PostgreSQL database (or Neon account)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
# .env.local
DATABASE_URL="postgresql://..."
AUTH_SECRET="your-secret-key"
```

4. Run database migrations:

```bash
pnpm prisma migrate dev
```

5. Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Available Scripts

- `pnpm dev` — Start development server
- `pnpm build` — Build for production
- `pnpm start` — Run production server
- `pnpm test` — Run tests with Vitest
- `pnpm lint` — Run ESLint

## Architecture Highlights

- **Server Components** — Leverages React Server Components for optimal performance
- **API Routes** — RESTful endpoints with proper error handling and validation
- **Optimistic Updates** — Instant UI feedback with React Query optimistic updates
- **Type Safety** — End-to-end TypeScript with Prisma-generated types
- **Component Architecture** — Modular, feature-based organization with clear separation of concerns

## License

Private project.
