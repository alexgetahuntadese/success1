create table if not exists public.payment_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(10, 2) not null check (amount > 0),
  bank_name text not null,
  account_number text not null,
  payment_method text not null check (payment_method in ('cbe', 'telebirr')),
  transaction_ref text not null,
  receipt_path text,
  receipt_content_type text,
  receipt_size_bytes integer,
  status text not null default 'pending' check (status in ('pending', 'verified', 'rejected')),
  reviewer_notes text,
  submitted_at timestamptz not null default now(),
  verified_at timestamptz,
  verified_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payment_submissions_user_id_submitted_at_idx
  on public.payment_submissions (user_id, submitted_at desc);

create index if not exists payment_submissions_status_submitted_at_idx
  on public.payment_submissions (status, submitted_at desc);

drop trigger if exists payment_submissions_set_updated_at on public.payment_submissions;
create trigger payment_submissions_set_updated_at
before update on public.payment_submissions
for each row
execute function public.set_updated_at();

alter table public.payment_submissions enable row level security;

drop policy if exists "payment_submissions_select_own" on public.payment_submissions;
create policy "payment_submissions_select_own"
on public.payment_submissions
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "payment_submissions_insert_own" on public.payment_submissions;
create policy "payment_submissions_insert_own"
on public.payment_submissions
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "payment_submissions_select_admin_all" on public.payment_submissions;
create policy "payment_submissions_select_admin_all"
on public.payment_submissions
for select
to authenticated
using (public.is_admin_user());

drop policy if exists "payment_submissions_update_admin_all" on public.payment_submissions;
create policy "payment_submissions_update_admin_all"
on public.payment_submissions
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'payment-receipts',
  'payment-receipts',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "payment_receipts_select_own_or_admin" on storage.objects;
create policy "payment_receipts_select_own_or_admin"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'payment-receipts'
  and (
    coalesce((storage.foldername(name))[1], '') = auth.uid()::text
    or public.is_admin_user()
  )
);

drop policy if exists "payment_receipts_insert_own" on storage.objects;
create policy "payment_receipts_insert_own"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'payment-receipts'
  and coalesce((storage.foldername(name))[1], '') = auth.uid()::text
);

drop policy if exists "payment_receipts_update_own_or_admin" on storage.objects;
create policy "payment_receipts_update_own_or_admin"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'payment-receipts'
  and (
    coalesce((storage.foldername(name))[1], '') = auth.uid()::text
    or public.is_admin_user()
  )
)
with check (
  bucket_id = 'payment-receipts'
  and (
    coalesce((storage.foldername(name))[1], '') = auth.uid()::text
    or public.is_admin_user()
  )
);

drop policy if exists "payment_receipts_delete_own_or_admin" on storage.objects;
create policy "payment_receipts_delete_own_or_admin"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'payment-receipts'
  and (
    coalesce((storage.foldername(name))[1], '') = auth.uid()::text
    or public.is_admin_user()
  )
);
