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

-- RLS policies: users can only see/modify their own data
create policy "Users manage own canvas_configs" on canvas_configs for all using (auth.uid() = user_id);
create policy "Users manage own courses" on courses for all using (auth.uid() = user_id);
create policy "Users manage own assignments" on assignments for all using (auth.uid() = user_id);
create policy "Users manage own announcements" on announcements for all using (auth.uid() = user_id);

-- Indexes
create index if not exists idx_assignments_user_course on assignments(user_id, course_id);
create index if not exists idx_assignments_due on assignments(user_id, due_at);
create index if not exists idx_announcements_user on announcements(user_id, posted_at desc);
create index if not exists idx_courses_user on courses(user_id);
