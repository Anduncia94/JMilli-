/*
  # Create Storage Bucket for Tax Documents
  
  1. Storage Setup
    - Create 'tax-documents' bucket for storing uploaded files
    - Set up RLS policies for secure access
    
  2. Security
    - Users can only upload/access their own documents
    - Files are private by default
*/

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('tax-documents', 'tax-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create policies for tax-documents bucket
CREATE POLICY "Users can upload their own documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'tax-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can read their own documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'tax-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete their own documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'tax-documents' AND (storage.foldername(name))[1] = auth.uid()::text);