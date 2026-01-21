-- Enable RLS (if not already enabled, though error suggests it is)
ALTER TABLE featured_properties ENABLE ROW LEVEL SECURITY;

-- Policy to allow viewing featured properties (publicly accessible)
CREATE POLICY "Allow public read access"
ON featured_properties
FOR SELECT
TO public
USING (true);

-- Policy to allow authenticated users (Admins) to insert
CREATE POLICY "Allow authenticated insert"
ON featured_properties
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy to allow authenticated users (Admins) to delete
CREATE POLICY "Allow authenticated delete"
ON featured_properties
FOR DELETE
TO authenticated
USING (true);
