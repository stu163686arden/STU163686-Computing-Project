-- Update the bookings status check constraint to include all valid statuses
ALTER TABLE "public"."bookings" DROP CONSTRAINT IF EXISTS "bookings_status_check";

ALTER TABLE "public"."bookings" ADD CONSTRAINT "bookings_status_check" 
CHECK (status IN ('under_review', 'approved', 'rejected', 'request_additional_details', 'confirmed'));
