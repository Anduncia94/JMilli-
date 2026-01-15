/*
  # Client Profiles Table

  1. New Tables
    - `client_profiles` - Store client information managed by admin
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users, unique)
      - `first_name` (text) - Client's first name
      - `last_name` (text) - Client's last name
      - `ssn_last_four` (text) - Last 4 digits of SSN
      - `phone` (text) - Phone number
      - `address` (text) - Full address
      - `company_name` (text) - Company name if applicable
      - `company_ein` (text) - Company EIN if applicable
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on client_profiles table
    - Users can only view their own profile
    - Only admin can insert/update profiles (managed through service role)
*/

CREATE TABLE IF NOT EXISTS client_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  ssn_last_four text,
  phone text,
  address text,
  company_name text,
  company_ein text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON client_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_client_profiles_user_id ON client_profiles(user_id);