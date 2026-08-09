# Wedding Gallery — Supabase version

This is a fully shared React/Vite wedding gallery.

## What it does

- Guests can upload multiple photos from phones or computers.
- Photos are stored in Supabase Storage.
- Photo metadata is stored in Supabase Postgres.
- The gallery loads the same shared photos after refresh.
- New uploads can appear automatically for everyone via Supabase Realtime.
- Full-screen gallery slideshow with previous/next controls.
- Mobile responsive wedding design.
- No login is required for guests.
- Upload limit in the frontend is 10 MB per image.

## 1. Create the Supabase project

Create a project at:

https://supabase.com/

Then open **SQL Editor** and run:

`supabase/schema.sql`

The SQL creates the `wedding_photos` table, public Storage bucket, RLS policies, and Realtime configuration.

## 2. Configure the React app

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then put your Supabase project URL and publishable/anon key in `.env`.

Example:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Do NOT put a Supabase secret/service-role key in this file or in browser code.

## 3. Install and run

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## 4. Deploy

This is a normal Vite React site and can be deployed to Vercel, Netlify, Cloudflare Pages, GitHub Pages (with appropriate SPA configuration), or another static host.

For Vercel/Netlify/etc., add the same two environment variables in the host's project settings before deploying.

## Security note

This version intentionally allows anonymous uploads because the goal is a frictionless wedding guest experience. Anyone who has the URL can upload images.

For a public wedding website, consider:
- a private/unlisted wedding URL,
- a simple wedding access code,
- CAPTCHA/rate limiting,
- moderation/admin approval,
- server-side file-size/type validation,
- image compression/resizing before storage.

The browser uses only the Supabase publishable/anon key. Never expose a Supabase secret/service-role key in frontend code.
