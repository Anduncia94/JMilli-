import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Document = {
  id: string;
  user_id: string;
  title: string;
  type: string;
  file_url: string;
  category: string;
  uploaded_at: string;
  created_at: string;
};

export type RefundTracker = {
  id: string;
  user_id: string;
  tin: string;
  filing_status: string;
  last_checked: string | null;
  estimated_refund: number;
  created_at: string;
};

export type ClientProfile = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  ssn_last_four: string | null;
  phone: string | null;
  address: string | null;
  company_name: string | null;
  company_ein: string | null;
  profile_photo_url: string | null;
  created_at: string;
  updated_at: string;
};
