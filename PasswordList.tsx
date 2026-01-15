import React, { useEffect, useState } from 'react';
import { Plus, Eye, EyeOff, Copy, Trash2, Lock, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../lib/language-context';

type Password = {
  id: string;
  website: string;
  username: string;
  password: string;
  notes: string;
  created_at: string;
};

type PasswordListProps = {
  userId: string;
};

export default function PasswordList({ userId }: PasswordListProps) {
  const { t } = useLanguage();
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    website: '',
    username: '',
    password: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPasswords();
  }, [userId]);

  const fetchPasswords = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('passwords')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPasswords(data || []);
    } catch (err) {
      console.error('Error fetching passwords:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase.from('passwords').insert([
        {
          user_id: userId,
          website: formData.website,
          username: formData.username,
          password: formData.password,
          notes: formData.notes,
        },
      ]);

      if (error) throw error;

      setFormData({ website: '', username: '', password: '', notes: '' });
      setShowModal(false);
      fetchPasswords();
    } catch (err) {
      console.error('Error saving password:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('passwords').delete().eq('id', id);

      if (error) throw error;
      fetchPasswords();
    } catch (err) {
      console.error('Error deleting password:', err);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-2 border-gray-900 dark:border-gray-100 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 text-white dark:text-gray-900 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          {t.passwords.addNew}
        </button>
      </div>

      {passwords.length === 0 ? (
        <div className="text-center py-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-gray-700/60">
          <Lock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 mb-2">{t.passwords.noPasswords}</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">{t.passwords.addFirst}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {passwords.map((pwd) => (
            <div
              key={pwd.id}
              className="p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-gray-700/60 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate mb-1">
                    {pwd.website}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-2">
                    {pwd.username}
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type={visiblePasswords.has(pwd.id) ? 'text' : 'password'}
                      value={pwd.password}
                      readOnly
                      className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg border-0 font-mono flex-1"
                    />
                  </div>
                  {pwd.notes && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{pwd.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePasswordVisibility(pwd.id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                    title={visiblePasswords.has(pwd.id) ? t.passwords.hide : t.passwords.show}
                  >
                    {visiblePasswords.has(pwd.id) ? (
                      <EyeOff className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() => copyToClipboard(pwd.password, pwd.id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition relative"
                    title={t.passwords.copy}
                  >
                    {copiedId === pwd.id ? (
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(pwd.id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                    title={t.passwords.delete}
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t.passwords.addPassword}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.passwords.website}
                </label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder={t.passwords.websitePlaceholder}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.passwords.username}
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder={t.passwords.usernamePlaceholder}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.passwords.password}
                </label>
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={t.passwords.passwordPlaceholder}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.passwords.notes}
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={t.passwords.notesPlaceholder}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 resize-none"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  {t.passwords.cancel}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 text-white dark:text-gray-900 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                  {saving ? t.passwords.saving : t.passwords.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t.passwords.confirmDelete}
            </h3>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                {t.passwords.cancel}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
              >
                {t.passwords.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
