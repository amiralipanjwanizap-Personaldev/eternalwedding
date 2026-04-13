# Eternal Wedding Suite

A full-stack wedding website platform built with **Next.js 14**, **Supabase**, deployed on **Vercel**.

Features: wedding websites, digital invitations, guest RSVP, photo galleries, guestbook, schedule management, and a complete couple dashboard.

---

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | Next.js 14 (App Router)           |
| Styling     | Tailwind CSS                      |
| Database    | Supabase (PostgreSQL)             |
| Auth        | Supabase Auth                     |
| Storage     | Supabase Storage                  |
| Deployment  | Vercel                            |
| Repo        | GitHub                            |

---

## Project Structure

```
eternal-wedding/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Marketing homepage
│   │   ├── auth/
│   │   │   ├── login/page.tsx        # Login
│   │   │   └── signup/page.tsx       # Sign up
│   │   ├── dashboard/
│   │   │   ├── layout.tsx            # Dashboard shell + sidebar
│   │   │   ├── page.tsx              # Overview + stats
│   │   │   ├── guests/page.tsx       # Guest list & RSVP manager
│   │   │   ├── photos/page.tsx       # Photo gallery manager
│   │   │   ├── rsvp/page.tsx         # Schedule/events manager
│   │   │   └── settings/page.tsx     # Wedding settings
│   │   └── wedding/[slug]/page.tsx   # Public wedding page
│   ├── components/
│   │   ├── layout/                   # Nav, sidebar, footer, sections
│   │   └── wedding/                  # Feature components
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser client
│   │   │   ├── server.ts             # Server client
│   │   │   └── middleware.ts         # Session refresh
│   │   ├── actions.ts                # Server actions (mutations)
│   │   ├── data.ts                   # Server data fetching
│   │   └── utils.ts                  # Helpers & constants
│   ├── types/index.ts                # TypeScript types
│   └── middleware.ts                 # Route protection
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql    # Full DB schema
├── .github/workflows/ci.yml          # GitHub Actions CI
├── vercel.json                       # Vercel config
└── .env.local.example                # Environment template
```

---

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/eternal-wedding.git
cd eternal-wedding
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the dashboard, go to **SQL Editor**
3. Copy the contents of `supabase/migrations/001_initial_schema.sql` and run it
4. Go to **Storage** → create two buckets:
   - `wedding-photos` — set to **Public**
   - `wedding-covers` — set to **Public**
5. For each bucket, add storage policies (in Storage > Policies):
   ```sql
   -- Allow public reads
   create policy "Public read" on storage.objects
     for select using (bucket_id in ('wedding-photos', 'wedding-covers'));

   -- Allow authenticated uploads
   create policy "Auth upload" on storage.objects
     for insert with check (
       bucket_id in ('wedding-photos', 'wedding-covers')
       and auth.uid() is not null
     );

   -- Allow owners to delete
   create policy "Owner delete" on storage.objects
     for delete using (auth.uid()::text = (storage.foldername(name))[1]);
   ```

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Find these values in Supabase: **Settings → API**

### 4. Run locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

### Option A — Vercel CLI (recommended)

```bash
npm i -g vercel
vercel login
vercel
```

Follow the prompts, then add environment variables:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_APP_URL   # set to your Vercel URL
```

Deploy to production:
```bash
vercel --prod
```

### Option B — GitHub integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo
4. Add the four environment variables in the Vercel dashboard
5. Click **Deploy**

Every push to `main` will auto-deploy.

---

## Push to GitHub

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit — Eternal Wedding Suite"

# Create a repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/eternal-wedding.git
git branch -M main
git push -u origin main
```

### Add GitHub Secrets for CI

In your GitHub repo → **Settings → Secrets and variables → Actions**, add:

| Secret | Value |
|--------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |

---

## Update Supabase Auth Redirect URLs

In Supabase → **Authentication → URL Configuration**:

- **Site URL**: `https://your-app.vercel.app`
- **Redirect URLs**: `https://your-app.vercel.app/**`

---

## Features Overview

### For couples (Dashboard)
- ✅ Create wedding site with custom URL (`/wedding/amara-and-james`)
- ✅ Choose from 8 design themes
- ✅ Edit story, venue, date, events
- ✅ Manage guest list with full CRUD
- ✅ Export guest list to CSV
- ✅ Upload & manage photos (drag & drop)
- ✅ Publish / unpublish site with one click
- ✅ Live countdown on public page

### For guests (Public page)
- ✅ Beautiful themed wedding page
- ✅ Live countdown timer
- ✅ RSVP by email lookup (no account needed)
- ✅ Meal choice + song request + dietary notes
- ✅ Photo gallery with lightbox
- ✅ Guestbook messages
- ✅ Schedule / events
- ✅ Travel & accommodation info
- ✅ Registry links

---

## Database Schema

| Table | Purpose |
|-------|---------|
| `profiles` | Extended user data (auto-created on signup) |
| `weddings` | Wedding site data, theme, publish status |
| `events` | Ceremony, reception, etc. |
| `guests` | Guest list with RSVP tracking |
| `rsvp_tokens` | Secure per-guest RSVP links |
| `photos` | Photo gallery with Supabase Storage |
| `travel_info` | Hotels, transport, airport info |
| `registry_links` | Gift registry URLs |
| `guestbook_entries` | Guest messages |

All tables have **Row Level Security (RLS)** enabled.

---

## Development

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run typecheck    # TypeScript check
npm run lint         # ESLint
```

---

## Extending the App

Some ideas for next features:
- **Email sending** — integrate Resend or SendGrid for invitation emails
- **Custom domains** — map `wedding.yourname.com` to the Vercel deployment
- **AI photo suggestions** — auto-caption uploaded photos
- **Video cover pages** — embed a video hero on the wedding page
- **Address collection** — gather mailing addresses from guests
- **Seating chart** — drag-and-drop table planner

---

## License

MIT — built with ♥ for couples everywhere.
