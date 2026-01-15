import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInStandaloneMode, setIsInStandaloneMode] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsInStandaloneMode(isStandalone);

    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    const dismissed = localStorage.getItem('installPromptDismissed');
    if (!isStandalone && !dismissed) {
      setTimeout(() => setShowPrompt(true), 3000);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowPrompt(false);
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('installPromptDismissed', 'true');
  };

  if (isInStandaloneMode || !showPrompt) {
    return null;
  }

  if (isIOS) {
    return (
      <div className="fixed bottom-20 left-4 right-4 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 text-white dark:text-gray-900 rounded-2xl shadow-2xl p-4 z-40 animate-slide-up">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 hover:bg-white/20 dark:hover:bg-black/20 rounded-lg transition"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-start gap-3 pr-6">
          <Download className="w-6 h-6 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Instala la App</h3>
            <p className="text-sm opacity-90 mb-2">
              Para instalar: toca <span className="inline-block align-middle mx-1">⎙</span> y luego "Añadir a pantalla de inicio"
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (deferredPrompt) {
    return (
      <div className="fixed bottom-20 left-4 right-4 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 text-white dark:text-gray-900 rounded-2xl shadow-2xl p-4 z-40 animate-slide-up">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 hover:bg-white/20 dark:hover:bg-black/20 rounded-lg transition"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-3 pr-6">
          <Download className="w-6 h-6 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Instala la App</h3>
            <p className="text-sm opacity-90 mb-3">
              Acceso rápido desde tu pantalla de inicio
            </p>
            <button
              onClick={handleInstallClick}
              className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl font-semibold hover:shadow-lg transition text-sm"
            >
              Instalar Ahora
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
