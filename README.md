# Diamond Deck Co.

A web application where sports coaches can purchase, design, and order custom physical trading cards for their teams.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: Supabase Auth
- **Database**: Supabase Postgres (via Drizzle ORM)
- **Storage**: Cloudflare R2 (for raw photos and rendered cards)
- **Payments**: Stripe Checkout & Webhooks
- **Background Removal**: Photoroom API
- **Image Generation**: Placid.app API
- **Print Fulfillment**: MakePlayingCards (MPC) API
- **Hosting**: Vercel (CI/CD + serverless runtime)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase project (Auth + Postgres database + service role key + connection string)
- Vercel account (for production hosting)
- Stripe account configured
- Cloudflare R2 bucket (optional – only required for the upload flow)
- API keys for Photoroom, Placid.app, and MakePlayingCards

### Installation

1. Copy the environment variables template:
```bash
cp .env.local.example .env.local
```

2. Fill in your environment variables in `.env.local` (see `.env.local.example` for the full list):
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_DB_URL` (Postgres connection string)
- `NEXT_PUBLIC_APP_URL`
- Stripe secret/publishable keys + webhook secret
- Cloudflare R2 credentials (if using R2 for uploads)
- Optional API keys for Photoroom, Placid.app, and MakePlayingCards

3. Install dependencies:
```bash
npm install
```

4. Run database migrations (requires `SUPABASE_DB_URL` to be set):
```bash
npx drizzle-kit push
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Database Schema

The application uses 4 core tables:

- **users**: Supabase Auth users with Stripe customer ID
- **teams**: Team information with payment status
- **players**: Player roster with image URLs and processing status
- **orders**: Payment and fulfillment tracking

## Application Flow

1. **Sign Up/Login**: Users authenticate via Supabase
2. **Create Team**: Coaches enter team details (name, sport, roster size)
3. **Payment**: Stripe Checkout processes payment ($25/player)
4. **Webhook**: Payment completion triggers team creation and player slot generation
5. **Roster Management**: Coaches edit player details and upload photos
6. **Image Processing**:
   - Photos uploaded to R2
   - Background removed via Photoroom API
   - Trading card proofs generated via Placid.app
7. **Proof Review**: Coaches review watermarked proofs
8. **Approval**: Final approval triggers high-res print generation
9. **Fulfillment**: Order submitted to MakePlayingCards for printing

## Business Rule

**Users MUST pay for a team package before they can upload photos or trigger expensive image processing APIs.** This is enforced by checking `payment_status` before allowing photo uploads or API calls.

## Project Structure

```
src/
├── app/
│   ├── actions/           # Server actions
│   ├── api/               # API routes (Stripe, webhooks, upload)
│   ├── dashboard/         # Protected dashboard
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   └── team/[id]/         # Team management pages
├── components/
│   ├── ui/                # shadcn/ui components
│   └── team-creation-modal.tsx
├── db/
│   ├── index.ts           # Database connection
│   └── schema.ts          # Drizzle schema
├── lib/
│   ├── supabase/          # Supabase clients
│   └── utils.ts           # Utility functions
└── types/
    └── supabase.ts        # TypeScript types
```

## Deployment

### Vercel Deployment

1. Connect the repository to Vercel (or run `vercel` locally to link the project).
2. In the Vercel dashboard, add the environment variables listed above (Production + Preview).
3. Push to `main` (or open a PR) and Vercel will run `npm install && npm run build` automatically.
4. Use `vercel logs <deployment-url>` to monitor runtime issues.

If you need to test production settings locally:

```bash
vercel env pull .env.production
npm run build && npm start
```

### Infrastructure

The application now runs on:
- **Frontend + APIs**: Next.js on Vercel Serverless Functions
- **Database**: Supabase Postgres (queried via Drizzle ORM)
- **Storage**: Cloudflare R2 (presigned uploads) – replaceable with other S3-compatible storage

## License

Private project for Diamond Deck Co.
