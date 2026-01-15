import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './lib/auth-context';
import { LanguageProvider } from './lib/language-context';
import { supabase } from './lib/supabase';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ProfileSetup from './pages/ProfileSetup';

function AppContent() {
  const { session, loading } = useAuth();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      checkProfile();
    } else {
      setCheckingProfile(false);
      setHasProfile(null);
    }
  }, [session]);

  const checkProfile = async () => {
    if (!session?.user?.id) return;

    try {
      const { data, error } = await supabase
        .from('client_profiles')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) throw error;
      setHasProfile(!!data);
    } catch (err) {
      console.error('Error checking profile:', err);
      setHasProfile(false);
    } finally {
      setCheckingProfile(false);
    }
  };

  if (loading || checkingProfile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  if (hasProfile === false) {
    return <ProfileSetup onComplete={() => setHasProfile(true)} />;
  }

  return <Dashboard />;
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
