-- Add FK from bookings.user_id to profiles.id if it doesn't exist
-- We use a DO block to check existence or just try to add it. 
-- Since we can't easily check in simple SQL script without procedural code, we'll try to add it.
-- However, standard practice here is just to run the ALTER. If it fails due to existing, user can ignore or we can make it idempotent.
-- We will use a safe approach:
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'bookings_user_id_profiles_fkey'
    ) THEN
        ALTER TABLE "public"."bookings" 
        ADD CONSTRAINT "bookings_user_id_profiles_fkey" 
        FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");
    END IF;
END $$;

-- Enable RLS
ALTER TABLE "public"."bookings" ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Admins can view all bookings
CREATE POLICY "Admins can view all bookings"
ON "public"."bookings"
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.user_type = 'admin'
  )
);

-- 2. Admins can update bookings
CREATE POLICY "Admins can update bookings"
ON "public"."bookings"
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.user_type = 'admin'
  )
);

-- 3. Users can view their own bookings
CREATE POLICY "Users can view own bookings"
ON "public"."bookings"
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
);
