-- Drop existing table if it exists
drop table if exists public.check_ins;

-- Create users table
create table if not exists public.users (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create the check_ins table
create table public.check_ins (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references public.users(id),
  user_name text not null,
  mood text not null check (mood in ('happy', 'neutral', 'sad')),
  stress_level integer not null check (stress_level >= 0 and stress_level <= 10),
  productivity_level integer not null check (productivity_level >= 0 and productivity_level <= 10),
  notes text
);

-- Temporarily disable RLS for testing
alter table public.check_ins disable row level security;
alter table public.users disable row level security;

-- Create policies for testing
create policy "Allow all access to check_ins"
  on check_ins for all using (true) with check (true);

create policy "Allow all access to users"
  on users for all using (true) with check (true); 