# Multi Tenant SaaS Boilerplate

This is a boilerplate for those who wanted to create a SaaS app.

## Tech Stack

- Next 15.3.5
- Clerk 6.25.0
- Prisma 6.11.1
- Tailwind 4.1.11
- React 19.1.0
- Ngrok 3.23.3
- Node 22.13.1
- Supabase (PostgreSQL 17.4)

## Run app

### Local

1. Run `ngrok http 3000` (Update Clerk's webhook domain with ngrok generated domain if using free account)
2. Run `npm run dev`
3. Sign in
4. You will be redirected to your team dashboard