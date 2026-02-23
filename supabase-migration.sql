-- Run this in Supabase SQL Editor (supabase.com/dashboard > SQL Editor)

-- Canvas configuration per user
create table if not exists canvas_configs (
  user_id uuid primary key references auth.users(id) on delete cascade,
  canvas_url text not null,
  access_token text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Courses
create table if not exists courses (
  id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  code text,
  updated_at timestamptz default now(),
  primary key (id, user_id)
);

-- Assignments
create table if not exists assignments (
  id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null,
  name text not null,
  due_at timestamptz,
  points_possible real,
  submission_status text,
  score real,
  submitted_at timestamptz,
  html_url text,
  assignment_type text default 'assignment',
  updated_at timestamptz default now(),
  primary key (id, user_id)
);

-- Announcements
create table if not exists announcements (
  id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null,
  title text not null,
  message text,
  posted_at timestamptz,
  html_url text,
  updated_at timestamptz default now(),
  primary key (id, user_id)
);

-- Enable RLS on all tables
alter table canvas_configs enable row level security;
alter table courses enable row level security;
alter table assignments enable row level security;
alter table announcements enable row level security;

-- RLS policies: users can read their own data via anon key
create policy "Users read own canvas_configs" on canvas_configs for select using (auth.uid() = user_id);
create policy "Users read own courses" on courses for select using (auth.uid() = user_id);
create policy "Users read own assignments" on assignments for select using (auth.uid() = user_id);
create policy "Users read own announcements" on announcements for select using (auth.uid() = user_id);

-- RLS policies: users can insert/update their own data via anon key
create policy "Users write own canvas_configs" on canvas_configs for insert with check (auth.uid() = user_id);
create policy "Users update own canvas_configs" on canvas_configs for update using (auth.uid() = user_id);
create policy "Users write own courses" on courses for insert with check (auth.uid() = user_id);
create policy "Users update own courses" on courses for update using (auth.uid() = user_id);
create policy "Users write own assignments" on assignments for insert with check (auth.uid() = user_id);
create policy "Users update own assignments" on assignments for update using (auth.uid() = user_id);
create policy "Users write own announcements" on announcements for insert with check (auth.uid() = user_id);
create policy "Users update own announcements" on announcements for update using (auth.uid() = user_id);

-- Service-role can do anything (used by the fly.io backend server)
-- Note: service_role key bypasses RLS by default in Supabase, so no extra policies needed.

-- Indexes
create index if not exists idx_assignments_user_course on assignments(user_id, course_id);
create index if not exists idx_assignments_due on assignments(user_id, due_at);
create index if not exists idx_announcements_user on announcements(user_id, posted_at desc);
create index if not exists idx_courses_user on courses(user_id);
