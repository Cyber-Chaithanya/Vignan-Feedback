-- UniFeedback Supabase Schema
-- Run in Supabase SQL Editor

-- Profiles
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  email text not null,
  full_name text not null,
  role text not null check (role in ('student', 'faculty', 'parent', 'admin')),
  created_at timestamptz default now()
);

-- Feedback
create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in ('student', 'faculty', 'parent', 'admin')),
  category text not null check (category in (
    'Curriculum & Academics',
    'Campus Life & Infrastructure',
    'Placement & Career',
    'Research & Resources',
    'Safety & Discipline'
  )),
  rating int not null check (rating between 1 and 5),
  comments text not null,
  status text not null default 'Open' check (status in ('Open', 'In Progress', 'Resolved')),
  ai_sentiment text not null default 'Neutral' check (ai_sentiment in ('Positive', 'Neutral', 'Negative')),
  created_at timestamptz default now()
);

-- Action Items
create table if not exists action_items (
  id uuid primary key default gen_random_uuid(),
  feedback_id uuid references feedback(id) on delete cascade not null,
  title text not null,
  assigned_department text not null,
  status text not null default 'Pending' check (status in ('Pending', 'In Progress', 'Completed')),
  target_date date not null,
  created_at timestamptz default now()
);

-- RLS (basic)
alter table profiles enable row level security;
alter table feedback enable row level security;
alter table action_items enable row level security;

create policy "Users can read own profile" on profiles for select using (auth.uid() = user_id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = user_id);
create policy "Users can read own feedback" on feedback for select using (auth.uid() = user_id);
create policy "Users can insert feedback" on feedback for insert with check (auth.uid() = user_id);
-- Admins would need broader policies via a custom claim or service role in production
