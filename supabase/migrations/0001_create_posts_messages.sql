create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  content text not null,
  platform text not null,
  status text not null,
  engagement jsonb,
  created_at timestamp with time zone default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  content text not null,
  platform text not null,
  status text not null,
  engagement jsonb,
  created_at timestamp with time zone default now()
);
