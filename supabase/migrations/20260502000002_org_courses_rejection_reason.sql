alter table public.org_courses
  add column if not exists rejection_reason text;
