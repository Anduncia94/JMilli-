/*
  # Update Client Profile Policies
  
  1. Changes
    - Allow users to insert their own profile
    - Allow users to update their own profile (except company fields)
    - Admin can update all fields including company info
  
  2. Security
    - Users can only modify their own profile
    - Users cannot modify company_name or company_ein
    - Only admin (via service role) can set company fields
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON client_profiles;

-- Create new policies
CREATE POLICY "Users can view own profile"
  ON client_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON client_profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id 
    AND company_name IS NULL 
    AND company_ein IS NULL
  );

CREATE POLICY "Users can update own profile except company"
  ON client_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND (
      company_name IS NULL OR company_name = (SELECT company_name FROM client_profiles WHERE user_id = auth.uid())
    )
    AND (
      company_ein IS NULL OR company_ein = (SELECT company_ein FROM client_profiles WHERE user_id = auth.uid())
    )
  );