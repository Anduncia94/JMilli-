import React, { useState } from 'react';
import { useAuth } from '../lib/auth-context';
import { supabase } from '../lib/supabase';
import { Lock, Mail } from 'lucide-react';
import Logo from '../components/Logo';

type AuthMode = 'signin' | 'signup' | 'reset';

export default function Auth() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else if (mode === 'signup') {
        await signUp(email, password);
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}`,
        });
        if (error) throw error;
        setMessage('Password reset link sent to your email');
        setTimeout(() => setMode('signin'), 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Logo className="w-16 h-16 mb-4" showText={false} />
          <h1 className="text-3xl font-light tracking-tight text-gray-900 mb-2">
            JMilli Tax Services
          </h1>
          <p className="text-gray-600">
            {mode === 'reset' ? 'Reset your password' : 'Professional tax document management'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {mode !== 'reset' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          )}

          {mode === 'signin' && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setMode('reset');
                  setError('');
                  setMessage('');
                }}
                className="text-sm text-gray-600 hover:text-black transition"
              >
                Forgot password?
              </button>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {message && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-900 transition disabled:opacity-50"
          >
            {loading
              ? 'Loading...'
              : mode === 'signin'
              ? 'Sign In'
              : mode === 'signup'
              ? 'Sign Up'
              : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-center">
          {mode === 'reset' ? (
            <p className="text-sm text-gray-600">
              Remember your password?
              <button
                onClick={() => {
                  setMode('signin');
                  setError('');
                  setMessage('');
                }}
                className="ml-2 font-medium text-black hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setError('');
                  setMessage('');
                }}
                className="ml-2 font-medium text-black hover:underline"
              >
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
