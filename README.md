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

 1. Create a project at [supabase.com](https://supabase.com), then open **Project Settings -> Data API**. Copy the **Project URL** and the **Publishable key** (the key beginning with `sb_publishable_`).
 2. Create `.env.local` in the project root:

	 ```env
	 NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
	 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your-key
	 ```

 3. In **SQL Editor**, paste the complete contents of `supabase/schema.sql` and click **Run**. This creates the profile, memory, people, tags, media, and relationship tables, the new-user profile trigger, indexes, and row-level security policies. Run it once per project; if you already ran an older version, run the changed statements separately or recreate the development database.
 4. In **Authentication -> Providers -> Email**, keep **Email** enabled. For local development, you can disable **Confirm email** to sign in immediately. For production, leave confirmation enabled.
 5. In **Authentication -> URL Configuration**, set **Site URL** to `http://localhost:3000` while developing. Add your deployed URL to **Redirect URLs** before deploying. Email confirmation links must point to a URL in this allowlist.
 6. Restart `npm run dev` after changing `.env.local`. Visit `/auth`, create an account, confirm the email if required, and sign in. The profile row is created automatically by the `on_auth_user_created` trigger.

 The app uses the publishable key in the browser and relies on RLS for data protection. Never put a `service_role` key in `.env.local` or client code. Every journal page reads only the signed-in user's rows, and the save dialog inserts `user_id` from the current Supabase session.

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

 Journal content is loaded from Supabase. New accounts start with an empty archive and can add memories from the dashboard.
