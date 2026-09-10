 # Journal Through Life

 A private-feeling personal archive for keeping memories, milestones, travel, and academic moments together in one calm dashboard.

 ## Development

 Install dependencies and start the local development server:

 ```bash
 npm install
 npm run dev
 ```

 Open [http://localhost:3000](http://localhost:3000) in a browser. The app uses Next.js App Router and Tailwind CSS v4.

 ## Supabase setup

 The local Supabase connection is stored in `.env.local` (which is ignored by git). The existing client helpers read `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

 In the Supabase dashboard, open **SQL Editor**, paste the contents of `supabase/schema.sql`, and run it. The schema creates the profile, memory, people, tags, media, and relationship tables with row-level security so users can only access their own data.

 ## Available routes

 - `/` - Dashboard with recent memories, statistics, and timeline highlights
 - `/memories` - Saved memory archive
 - `/timeline` - Chronological life events
 - `/travel` - Countries and travel memories
 - `/academia` - Education and achievement highlights

 ## Checks

 ```bash
 npm run lint
 npm run build
 ```

 The current pages still use local sample data from `lib/data.ts`; the Supabase connection and database schema are now ready for the persistence wiring.
