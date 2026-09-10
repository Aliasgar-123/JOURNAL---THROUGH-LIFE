create extension if not exists pgcrypto;

create type public.memory_category as enum (
  'Travel',
  'Academia',
  'Daily Life',
  'Career',
  'Personal Growth',
  'People',
  'Other'
);

create type public.memory_mood as enum (
  'Excited',
  'Reflective',
  'Joyful',
  'Calm',
  'Nostalgic',
  'Proud'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) > 0),
  memory_date date not null default current_date,
  category public.memory_category not null default 'Other',
  location text not null default '',
  description text not null default '',
  mood public.memory_mood not null default 'Reflective',
  favorite boolean not null default false,
  locked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.people (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  relationship text not null default '',
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table public.memory_people (
  memory_id uuid not null references public.memories(id) on delete cascade,
  person_id uuid not null references public.people(id) on delete cascade,
  primary key (memory_id, person_id)
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table public.memory_tags (
  memory_id uuid not null references public.memories(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (memory_id, tag_id)
);

create table public.media (
  id uuid primary key default gen_random_uuid(),
  memory_id uuid not null references public.memories(id) on delete cascade,
  storage_path text not null,
  media_type text not null default 'image',
  caption text not null default '',
  created_at timestamptz not null default now()
);

create index memories_user_date_idx on public.memories (user_id, memory_date desc);
create index memories_user_category_idx on public.memories (user_id, category);
create index memory_people_person_idx on public.memory_people (person_id);
create index memory_tags_tag_idx on public.memory_tags (tag_id);
create index media_memory_idx on public.media (memory_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger memories_set_updated_at
before update on public.memories
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.memories enable row level security;
alter table public.people enable row level security;
alter table public.memory_people enable row level security;
alter table public.tags enable row level security;
alter table public.memory_tags enable row level security;
alter table public.media enable row level security;

create policy "Users can manage their own profile"
on public.profiles for all
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can manage their own memories"
on public.memories for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage their own people"
on public.people for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage people attached to their memories"
on public.memory_people for all
using (
  exists (
    select 1 from public.memories
    where memories.id = memory_people.memory_id
      and memories.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.memories
    where memories.id = memory_people.memory_id
      and memories.user_id = auth.uid()
  )
  and exists (
    select 1 from public.people
    where people.id = memory_people.person_id
      and people.user_id = auth.uid()
  )
);

create policy "Users can manage their own tags"
on public.tags for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage tags attached to their memories"
on public.memory_tags for all
using (
  exists (
    select 1 from public.memories
    where memories.id = memory_tags.memory_id
      and memories.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.memories
    where memories.id = memory_tags.memory_id
      and memories.user_id = auth.uid()
  )
  and exists (
    select 1 from public.tags
    where tags.id = memory_tags.tag_id
      and tags.user_id = auth.uid()
  )
);

create policy "Users can manage media on their memories"
on public.media for all
using (
  exists (
    select 1 from public.memories
    where memories.id = media.memory_id
      and memories.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.memories
    where memories.id = media.memory_id
      and memories.user_id = auth.uid()
  )
);
