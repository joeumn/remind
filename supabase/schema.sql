# S-- =================================================================
-- RE:MIND - Database Schema
-- =================================================================
-- This file contains the SQL schema for RE:MIND. Run these commands in your Supabase SQL editor to set up the database.pabase Database Schema

## Overview
This file contains the SQL schema for Elite Reminder OS. Run these commands in your Supabase SQL editor to set up the database.

## Tables

### users (handled by Supabase Auth)

### events
```sql
create table public.events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  category text not null check (category in ('Court', 'Work', 'Family', 'Personal', 'Recovery', 'Other')),
  priority text not null check (priority in ('Low', 'Medium', 'High', 'Urgent')),
  start_date timestamptz not null,
  end_date timestamptz,
  location text,
  is_all_day boolean default false,
  recurrence_type text not null check (recurrence_type in ('None', 'Daily', 'Weekly', 'Monthly', 'Yearly')),
  recurrence_end_date timestamptz,
  prep_tasks text[],
  accountability_partner_email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.events enable row level security;

-- Create policies
create policy "Users can view their own events"
  on public.events for select
  using (auth.uid() = user_id);

create policy "Users can insert their own events"
  on public.events for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own events"
  on public.events for update
  using (auth.uid() = user_id);

create policy "Users can delete their own events"
  on public.events for delete
  using (auth.uid() = user_id);

-- Create index
create index events_user_id_idx on public.events(user_id);
create index events_start_date_idx on public.events(start_date);
```

### reminders
```sql
create table public.reminders (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  remind_at timestamptz not null,
  value integer not null,
  unit text not null check (unit in ('minutes', 'hours', 'days', 'weeks')),
  is_sent boolean default false,
  sent_at timestamptz,
  notification_channels text[] not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.reminders enable row level security;

-- Create policies
create policy "Users can view their own reminders"
  on public.reminders for select
  using (auth.uid() = user_id);

create policy "Users can insert their own reminders"
  on public.reminders for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reminders"
  on public.reminders for update
  using (auth.uid() = user_id);

create policy "Users can delete their own reminders"
  on public.reminders for delete
  using (auth.uid() = user_id);

-- Create indexes
create index reminders_event_id_idx on public.reminders(event_id);
create index reminders_remind_at_idx on public.reminders(remind_at);
create index reminders_is_sent_idx on public.reminders(is_sent);
```

### notifications
```sql
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  event_id uuid references public.events(id) on delete cascade,
  reminder_id uuid references public.reminders(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null check (type in ('reminder', 'info', 'alert')),
  is_read boolean default false,
  read_at timestamptz,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.notifications enable row level security;

-- Create policies
create policy "Users can view their own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can insert their own notifications"
  on public.notifications for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

-- Create index
create index notifications_user_id_idx on public.notifications(user_id);
create index notifications_is_read_idx on public.notifications(is_read);
```

### user_preferences
```sql
create table public.user_preferences (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  default_reminders jsonb not null default '[
    {"value": 14, "unit": "days"},
    {"value": 7, "unit": "days"},
    {"value": 3, "unit": "days"},
    {"value": 1, "unit": "days"},
    {"value": 2, "unit": "hours"},
    {"value": 1, "unit": "hours"}
  ]'::jsonb,
  notification_channels text[] not null default array['push'],
  email_notifications_enabled boolean default true,
  sms_notifications_enabled boolean default false,
  push_notifications_enabled boolean default true,
  daily_briefing_enabled boolean default true,
  daily_briefing_time time default '08:00:00',
  weekly_briefing_enabled boolean default true,
  weekly_briefing_day integer default 1 check (weekly_briefing_day between 0 and 6),
  timezone text default 'UTC',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.user_preferences enable row level security;

-- Create policies
create policy "Users can view their own preferences"
  on public.user_preferences for select
  using (auth.uid() = user_id);

create policy "Users can insert their own preferences"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own preferences"
  on public.user_preferences for update
  using (auth.uid() = user_id);

-- Create index
create index user_preferences_user_id_idx on public.user_preferences(user_id);
```

## Functions

### Auto-create user preferences
```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_preferences (user_id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### Auto-update timestamps
```sql
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers
create trigger set_updated_at
  before update on public.events
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at
  before update on public.user_preferences
  for each row execute procedure public.handle_updated_at();
```

## Setup Instructions

1. Create a Supabase project at https://supabase.com
2. Go to the SQL Editor
3. Run each table creation script in order
4. Run the functions and triggers
5. Copy your project URL and anon key to `.env.local`
6. Enable email authentication in Supabase Auth settings
7. (Optional) Configure OAuth providers
