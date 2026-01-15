import React, { useState, useEffect } from 'react';
import { User, MapPin, Lock, Globe, ChevronRight, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth-context';
import { useLanguage } from '../lib/language-context';
import { Language } from '../lib/translations';

type ClientProfile = {
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  ssn_last_four: string | null;
  company_name: string | null;
  company_ein: string | null;
};

const languages: Array<{ code: Language; name: string; nativeName: string }> = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
];

export default function Settings() {
  const { session } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [session]);

  const fetchProfile = async () => {
    if (!session?.user?.id) return;

    try {
      const { data, error } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setProfile({
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          address: data.address,
          ssn_last_four: data.ssn_last_four,
          company_name: data.company_name,
          company_ein: data.company_ein,
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id || !profile) return;

    setSaving(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('client_profiles')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
          address: profile.address,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', session.user.id);

      if (error) throw error;
      setMessage(t.settings.profileUpdated);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage(t.settings.passwordsDontMatch);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage(t.settings.passwordTooShort);
      return;
    }

    setChangingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;
      setMessage(t.settings.passwordChanged);
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Error changing password');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{t.settings.loading}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{t.settings.profileNotFound}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {message && (
        <div
          className={`p-4 rounded-2xl backdrop-blur-xl ${
            message.includes('success')
              ? 'bg-green-500/10 dark:bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/20'
              : 'bg-red-500/10 dark:bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/20'
          }`}
        >
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}

      <div className="relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl rounded-3xl overflow-hidden border border-gray-200/50 dark:border-gray-800/50 shadow-2xl shadow-black/5 dark:shadow-black/20">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-transparent to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50"></div>

        <div className="relative p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 flex items-center justify-center shadow-lg shadow-gray-900/20 dark:shadow-gray-100/20">
              <User className="w-5 h-5 text-white dark:text-gray-900" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
              {t.settings.personalInfo}
            </h3>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setShowEditProfile(!showEditProfile)}
              className="w-full flex items-center justify-between p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">{t.settings.editProfile}</span>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showEditProfile ? 'rotate-90' : ''}`} />
            </button>

            {showEditProfile && (
              <form onSubmit={handleProfileUpdate} className="p-5 space-y-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">
                      {t.settings.firstName}
                    </label>
                    <input
                      type="text"
                      value={profile.first_name}
                      onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/80 dark:bg-gray-900/80 border border-gray-200/60 dark:border-gray-700/60 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">
                      {t.settings.lastName}
                    </label>
                    <input
                      type="text"
                      value={profile.last_name}
                      onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/80 dark:bg-gray-900/80 border border-gray-200/60 dark:border-gray-700/60 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">{t.settings.phone}</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-900/80 border border-gray-200/60 dark:border-gray-700/60 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">{t.settings.address}</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-gray-900/80 border border-gray-200/60 dark:border-gray-700/60 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 transition-all"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 text-white dark:text-gray-900 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {saving ? t.settings.saving : t.settings.saveChanges}
                </button>
              </form>
            )}

            <button
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="w-full flex items-center justify-between p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">{t.settings.changePassword}</span>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showChangePassword ? 'rotate-90' : ''}`} />
            </button>

            {showChangePassword && (
              <form onSubmit={handlePasswordChange} className="p-5 space-y-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">
                    {t.settings.newPassword}
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-900/80 border border-gray-200/60 dark:border-gray-700/60 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 transition-all"
                    placeholder={t.settings.enterNewPassword}
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">
                    {t.settings.confirmPassword}
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-900/80 border border-gray-200/60 dark:border-gray-700/60 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 transition-all"
                    placeholder={t.settings.confirmNewPassword}
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  disabled={
                    changingPassword ||
                    !passwordData.newPassword ||
                    !passwordData.confirmPassword
                  }
                  className="w-full py-3 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 text-white dark:text-gray-900 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {changingPassword ? t.settings.changing : t.settings.changePassword}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl rounded-3xl overflow-hidden border border-gray-200/50 dark:border-gray-800/50 shadow-2xl shadow-black/5 dark:shadow-black/20">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-transparent to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50"></div>

        <div className="relative p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 flex items-center justify-center shadow-lg shadow-gray-900/20 dark:shadow-gray-100/20">
              <Globe className="w-5 h-5 text-white dark:text-gray-900" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
              {t.settings.language}
            </h3>
          </div>

          <button
            onClick={() => setShowLanguages(!showLanguages)}
            className="w-full flex items-center justify-between p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01]"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                {languages.find(l => l.code === language)?.nativeName}
              </span>
            </div>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showLanguages ? 'rotate-90' : ''}`} />
          </button>

          {showLanguages && (
            <div className="mt-2 space-y-1 p-2 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setShowLanguages(false);
                    setMessage(`${t.settings.languageChanged} ${lang.nativeName}`);
                    setTimeout(() => setMessage(''), 3000);
                  }}
                  className="w-full flex items-center justify-between p-3 hover:bg-white/60 dark:hover:bg-gray-700/60 rounded-xl transition-all"
                >
                  <span className="font-medium text-gray-900 dark:text-white">{lang.nativeName}</span>
                  {language === lang.code && (
                    <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
