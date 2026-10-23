create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  created_at timestamptz not null default now()
);

alter table public.memories
  add column if not exists trip_id uuid references public.trips(id) on delete set null;

create index if not exists trips_user_created_idx on public.trips (user_id, created_at desc);

alter table public.trips enable row level security;

drop policy if exists "Users can manage their own trips" on public.trips;
create policy "Users can manage their own trips"
on public.trips for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can manage their own memories" on public.memories;
create policy "Users can manage their own memories"
on public.memories for all
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and (
    trip_id is null
    or exists (
      select 1 from public.trips
      where trips.id = memories.trip_id
        and trips.user_id = auth.uid()
    )
  )
);
