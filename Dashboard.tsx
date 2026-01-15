import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth-context';
import { useLanguage } from '../lib/language-context';
import { LogOut, FileText, ExternalLink, Settings as SettingsIcon, Moon, Sun, X, Lock } from 'lucide-react';
import ClientInfo from '../components/ClientInfo';
import DocumentList from '../components/DocumentList';
import PasswordList from '../components/PasswordList';
import AIChatWidget from '../components/AIChatWidget';
import InstallPrompt from '../components/InstallPrompt';
import IRSTools from '../components/IRSTools';
import Settings from '../components/Settings';
import Logo from '../components/Logo';

export default function Dashboard() {
  const { session, signOut } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'documents' | 'irs'>('documents');
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors">
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm shadow-black/5 dark:shadow-black/10">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Logo className="w-10 h-10" showText={true} />
          <div className="flex items-center gap-2">
            <div className="hidden sm:block px-3 py-1.5 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 mr-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{session.user.email}</p>
            </div>
            <button
              onClick={toggleDarkMode}
              className="w-9 h-9 flex items-center justify-center hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-xl transition-all duration-300 hover:scale-105"
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="w-9 h-9 flex items-center justify-center hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-xl transition-all duration-300 hover:scale-105"
              title="Settings"
            >
              <SettingsIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={handleLogout}
              className="w-9 h-9 flex items-center justify-center hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-xl transition-all duration-300 hover:scale-105"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-8">
            <ClientInfo userId={session.user.id} />

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 flex items-center justify-center shadow-lg shadow-gray-900/20 dark:shadow-gray-100/20">
                  <FileText className="w-6 h-6 text-white dark:text-gray-900" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                  {t.dashboard.documents}
                </h2>
              </div>
              <DocumentList userId={session.user.id} />
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 flex items-center justify-center shadow-lg shadow-gray-900/20 dark:shadow-gray-100/20">
                  <Lock className="w-6 h-6 text-white dark:text-gray-900" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                  {t.dashboard.passwords}
                </h2>
              </div>
              <PasswordList userId={session.user.id} />
            </div>
          </div>

          <aside className="lg:w-96 lg:sticky lg:top-8 lg:self-start">
            <IRSTools />
          </aside>
        </div>
      </main>

      <AIChatWidget userId={session.user.id} />
      <InstallPrompt />

      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-end">
          <div className="bg-white dark:bg-gray-900 h-full w-full max-w-2xl shadow-2xl overflow-y-auto animate-slide-in">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t.settings.title}</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-6">
              <Settings />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
