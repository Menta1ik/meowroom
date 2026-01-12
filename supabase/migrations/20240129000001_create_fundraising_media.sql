create table fundraising_media (
  id uuid default gen_random_uuid() primary key,
  fundraising_id uuid references fundraisings(id) on delete cascade not null,
  url text not null,
  type text not null check (type in ('image', 'video')),
  created_at timestamp with time zone default now()
);

alter table fundraising_media enable row level security;

create policy "Enable read access for all users"
on fundraising_media for select
using (true);

create policy "Enable insert for authenticated users only"
on fundraising_media for insert
with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users only"
on fundraising_media for update
using (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users only"
on fundraising_media for delete
using (auth.role() = 'authenticated');
