 # Journal Through Life

 A private-feeling personal archive for keeping memories, milestones, travel, and academic moments together in one calm dashboard.

 ## Development

 Install dependencies and start the local development server:

 ```bash
 npm install
 npm run dev
 ```

 Open [http://localhost:3000](http://localhost:3000) in a browser. The app uses Next.js App Router and Tailwind CSS v4.

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

 The current pages use local sample data from `lib/data.ts`. Supabase client helpers are included for the next step of connecting the archive to persistent storage.
