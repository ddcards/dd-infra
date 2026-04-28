# Diamond Deck Co.

A web application where sports coaches can purchase, design, and order custom physical trading cards for their teams.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: Supabase Auth
- **Database**: Cloudflare D1 (accessed via Drizzle ORM)
- **Storage**: Cloudflare R2 (for raw photos and rendered cards)
- **Payments**: Stripe Checkout & Webhooks
- **Background Removal**: Photoroom API
- **Image Generation**: Placid.app API
- **Print Fulfillment**: MakePlayingCards (MPC) API
- **Hosting**: Cloudflare Pages (Frontend) & Cloudflare Workers (Backend APIs/Webhooks)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase project created
- Cloudflare account with D1 and R2 configured
- Stripe account configured
- API keys for Photoroom, Placid.app, and MakePlayingCards

### Installation

1. Copy the environment variables template:
```bash
cp .env.local.example .env.local
```

2. Fill in your environment variables in `.env.local`:
- Supabase URL and anon key
- Stripe secret and publishable keys
- Cloudflare credentials (account ID, API token, R2 credentials)
- API keys for Photoroom, Placid.app, and MakePlayingCards

3. Install dependencies:
```bash
npm install
```

4. Run database migrations:
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

### GitHub Integration

The application is set up for automatic deployment to Cloudflare Pages via GitHub Actions. When you push to the `main` branch, the workflow will:

1. Build the Next.js application
2. Deploy to Cloudflare Pages

#### Required GitHub Secrets

Configure these secrets in your GitHub repository settings (Settings → Secrets and variables → Actions):

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
- `NEXT_PUBLIC_APP_URL` - Your production app URL
- `CLOUDFLARE_API_TOKEN` - Your Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID

#### Manual Deployment

To manually trigger a deployment:
1. Go to the Actions tab in GitHub
2. Select "Deploy to Cloudflare Pages"
3. Click "Run workflow"

### Infrastructure

The application is designed to be deployed on:
- **Frontend**: Cloudflare Pages
- **Backend APIs**: Cloudflare Workers
- **Database**: Cloudflare D1
- **Storage**: Cloudflare R2

## License

Private project for Diamond Deck Co.
