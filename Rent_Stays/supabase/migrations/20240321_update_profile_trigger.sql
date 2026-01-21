-- Update the function to read user_type from metadata
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, user_type)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    COALESCE(new.raw_user_meta_data->>'user_type', 'user') -- Use metadata or default to 'user'
  );
  return new;
end;
$$;
