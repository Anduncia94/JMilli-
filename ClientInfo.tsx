import React, { useEffect, useState } from 'react';
import { Phone, MapPin, Building2, CreditCard } from 'lucide-react';
import { supabase, ClientProfile } from '../lib/supabase';
import { useLanguage } from '../lib/language-context';
import ProfilePhoto from './ProfilePhoto';

type ClientInfoProps = {
  userId: string;
};

export default function ClientInfo({ userId }: ClientInfoProps) {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <p className="text-gray-500 dark:text-gray-400">{t.clientInfo.loading}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <p className="text-gray-500 dark:text-gray-400">{t.clientInfo.notFound}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl rounded-3xl overflow-hidden border border-gray-200/50 dark:border-gray-800/50 shadow-2xl shadow-black/5 dark:shadow-black/20 transition-all duration-500 hover:shadow-black/10 dark:hover:shadow-black/30">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-transparent to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50"></div>

        <div className="relative p-7">
          <div className="flex items-start gap-6 mb-6">
            <ProfilePhoto
              userId={userId}
              photoUrl={profile.profile_photo_url}
              onPhotoUpdate={(url) => setProfile({ ...profile, profile_photo_url: url })}
            />

            <div className="flex-1 min-w-0">
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-3 tracking-tight">
                {profile.first_name} {profile.last_name}
              </h2>
              {profile.ssn_last_four && (
                <div className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl px-3.5 py-2 border border-gray-200/50 dark:border-gray-700/50">
                  <CreditCard className="w-4 h-4" />
                  <span className="font-mono text-xs">***-**-{profile.ssn_last_four}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.phone && (
              <div className="flex items-start gap-3.5 p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Phone</p>
                  <p className="text-[15px] text-gray-900 dark:text-white font-medium">{profile.phone}</p>
                </div>
              </div>
            )}

            {profile.address && (
              <div className="flex items-start gap-3.5 p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Address</p>
                  <p className="text-[15px] text-gray-900 dark:text-white font-medium">{profile.address}</p>
                </div>
              </div>
            )}

            {profile.company_name && (
              <div className="flex items-start gap-3.5 md:col-span-2 p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Company</p>
                  <p className="text-[15px] text-gray-900 dark:text-white font-medium">
                    {profile.company_name}
                    {profile.company_ein && <span className="ml-2 text-gray-600 dark:text-gray-400 font-mono text-sm">(EIN: {profile.company_ein})</span>}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
