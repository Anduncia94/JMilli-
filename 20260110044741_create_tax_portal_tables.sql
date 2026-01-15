/*
  # Tax Portal Database Schema

  1. New Tables
    - `documents` - Store tax documents and forms
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text) - Document title
      - `type` (text) - Type of document (W2, 1040, etc)
      - `file_url` (text) - URL to the stored file
      - `uploaded_at` (timestamp)
      - `category` (text) - Category for organization
    
    - `refund_tracker` - Track refund status
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `tin` (text) - Tax ID Number (encrypted)
      - `filing_status` (text) - Current filing status
      - `last_checked` (timestamp)
      - `estimated_refund` (numeric) - Estimated refund amount

  2. Security
    - Enable RLS on all tables
    - Users can only see their own documents and refund info
*/

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text NOT NULL,
  file_url text NOT NULL,
  category text DEFAULT 'other',
  uploaded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS refund_tracker (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  tin text NOT NULL,
  filing_status text DEFAULT 'unknown',
  last_checked timestamptz,
  estimated_refund numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE refund_tracker ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents"
  ON documents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload documents"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON documents FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own refund info"
  ON refund_tracker FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own refund info"
  ON refund_tracker FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own refund info"
  ON refund_tracker FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_refund_tracker_user_id ON refund_tracker(user_id);