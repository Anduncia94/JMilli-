/*
  # Setup Profile Photos Storage Policies

  1. New Policies
    - Allow users to upload their own profile photos
    - Allow users to update their own profile photos
    - Allow users to view their own profile photos
    - Allow public read access to profile photos (for display purposes)
  
  2. Security
    - Users can only upload to their own user_id folder
    - File size limits and type restrictions should be handled at application level
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload own profile photo" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own profile photo" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own profile photo" ON storage.objects;
DROP POLICY IF EXISTS "Public can view profile photos" ON storage.objects;

-- Allow authenticated users to upload their profile photos
CREATE POLICY "Users can upload own profile photo"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'documents' AND
    (storage.foldername(name))[1] = auth.uid()::text AND
    (storage.foldername(name))[2] = 'profile'
  );

-- Allow authenticated users to update their profile photos
CREATE POLICY "Users can update own profile photo"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'documents' AND
    (storage.foldername(name))[1] = auth.uid()::text AND
    (storage.foldername(name))[2] = 'profile'
  );

-- Allow authenticated users to delete their profile photos
CREATE POLICY "Users can delete own profile photo"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'documents' AND
    (storage.foldername(name))[1] = auth.uid()::text AND
    (storage.foldername(name))[2] = 'profile'
  );

-- Allow public read access to profile photos
CREATE POLICY "Public can view profile photos"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'documents');