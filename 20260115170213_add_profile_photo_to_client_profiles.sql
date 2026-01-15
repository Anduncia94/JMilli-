/*
  # Add Profile Photo to Client Profiles

  1. Changes
    - Add `profile_photo_url` column to `client_profiles` table to store user profile photos
    - Column allows NULL values since not all users may have a profile photo initially
  
  2. Notes
    - Profile photos will be stored in Supabase Storage
    - URLs will reference the storage bucket path
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'client_profiles' AND column_name = 'profile_photo_url'
  ) THEN
    ALTER TABLE client_profiles ADD COLUMN profile_photo_url text;
  END IF;
END $$;