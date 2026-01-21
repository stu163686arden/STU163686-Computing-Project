
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);


