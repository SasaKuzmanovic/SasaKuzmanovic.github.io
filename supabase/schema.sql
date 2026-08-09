-- Run this entire file in Supabase SQL Editor.
-- It creates the photo metadata table, enables RLS, creates safe public
-- upload/read policies, creates the storage bucket, and enables realtime.

create table if not exists public.wedding_photos (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  original_name text,
  created_at timestamptz not null default now()
);

alter table public.wedding_photos enable row level security;

-- Anyone with the wedding gallery URL can see the gallery.
drop policy if exists "Anyone can view wedding photos" on public.wedding_photos;
create policy "Anyone can view wedding photos"
on public.wedding_photos
for select
to anon, authenticated
using (true);

-- Guests can add photo metadata. The Storage policy below controls the actual file upload.
drop policy if exists "Anyone can add wedding photos" on public.wedding_photos;
create policy "Anyone can add wedding photos"
on public.wedding_photos
for insert
to anon, authenticated
with check (
  storage_path is not null
  and length(storage_path) between 1 and 300
);

-- Public bucket for wedding images.
insert into storage.buckets (id, name, public)
values ('wedding-photos', 'wedding-photos', true)
on conflict (id) do update set public = true;

-- Anyone can upload into the wedding-photos bucket.
drop policy if exists "Anyone can upload wedding photos" on storage.objects;
create policy "Anyone can upload wedding photos"
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'wedding-photos'
  and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'webp', 'heic', 'heif')
);

-- Anyone can view the files in the public bucket.
drop policy if exists "Anyone can view wedding photo files" on storage.objects;
create policy "Anyone can view wedding photo files"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'wedding-photos');

-- Allow the Realtime publication to receive inserts to this table.
alter publication supabase_realtime add table public.wedding_photos;
