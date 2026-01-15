/*
  # Create Passwords Table

  1. New Tables
    - `passwords`
      - `id` (uuid, primary key) - Unique identifier for each password entry
      - `user_id` (uuid, foreign key) - References auth.users
      - `website` (text) - Name of the website/service/platform
      - `username` (text) - Username/email for the account
      - `password` (text) - Encrypted password
      - `notes` (text, optional) - Additional notes about the password
      - `created_at` (timestamptz) - When the password was created
      - `updated_at` (timestamptz) - When the password was last updated

  2. Security
    - Enable RLS on `passwords` table
    - Add policy for users to read their own passwords
    - Add policy for users to insert their own passwords
    - Add policy for users to update their own passwords
    - Add policy for users to delete their own passwords
*/

CREATE TABLE IF NOT EXISTS passwords (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  website text NOT NULL,
  username text NOT NULL,
  password text NOT NULL,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE passwords ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own passwords"
  ON passwords FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own passwords"
  ON passwords FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own passwords"
  ON passwords FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own passwords"
  ON passwords FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS passwords_user_id_idx ON passwords(user_id);
CREATE INDEX IF NOT EXISTS passwords_created_at_idx ON passwords(created_at DESC);