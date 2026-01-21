-- Create a profiles table to store user roles and extra data
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  user_type text not null default 'user', -- 'user' or 'admin'
  full_name text,
  updated_at timestamp with time zone,
  
  primary key (id),
  constraint type_check check (user_type in ('user', 'admin'))
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Function to handle new user signup automatically
-- This ensures every new user gets a profile entry
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, user_type)
  values (new.id, new.raw_user_meta_data->>'full_name', 'user');
  return new;
end;
$$;

-- Trigger to call the function on new user creation
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
