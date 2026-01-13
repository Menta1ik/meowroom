-- Create expenses table
create table if not exists expenses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  amount decimal(12,2) not null,
  currency text default 'UAH',
  category text not null check (category in ('monthly', 'target', 'operational')),
  expense_date date not null default current_date,
  receipt_urls text[] default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS (Row Level Security)
alter table expenses enable row level security;

-- Create policies
create policy "Expenses are viewable by everyone"
  on expenses for select
  using (true);

create policy "Expenses are insertable by authenticated users only"
  on expenses for insert
  with check (auth.role() = 'authenticated');

create policy "Expenses are updatable by authenticated users only"
  on expenses for update
  using (auth.role() = 'authenticated');

create policy "Expenses are deletable by authenticated users only"
  on expenses for delete
  using (auth.role() = 'authenticated');

-- Create storage bucket for receipts if it doesn't exist
insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Receipts are viewable by everyone"
  on storage.objects for select
  using ( bucket_id = 'receipts' );

create policy "Authenticated users can upload receipts"
  on storage.objects for insert
  with check ( bucket_id = 'receipts' and auth.role() = 'authenticated' );

create policy "Authenticated users can update receipts"
  on storage.objects for update
  with check ( bucket_id = 'receipts' and auth.role() = 'authenticated' );

create policy "Authenticated users can delete receipts"
  on storage.objects for delete
  using ( bucket_id = 'receipts' and auth.role() = 'authenticated' );
