import React, { useEffect, useState } from 'react';
import { FileText, Download, Calendar } from 'lucide-react';
import { supabase, Document } from '../lib/supabase';

type DocumentListProps = {
  userId: string;
};

export default function DocumentList({ userId }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tax' | 'other'>('tax');

  useEffect(() => {
    fetchDocuments();
  }, [userId]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', userId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const taxDocTypes = ['W2', '1040', 'Schedule A', 'Schedule C', 'Schedule D', '1099-NEC', '1099-MISC'];
  const taxDocs = documents.filter((d) => taxDocTypes.includes(d.type));
  const otherDocs = documents.filter((d) => !taxDocTypes.includes(d.type));

  const displayDocs = activeTab === 'tax' ? taxDocs : otherDocs;

  return (
    <div className="space-y-5">
      <div className="inline-flex gap-1 p-1 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
        <button
          onClick={() => setActiveTab('tax')}
          className={`px-5 py-2.5 font-medium text-sm transition-all duration-300 rounded-xl ${
            activeTab === 'tax'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Tax Documents ({taxDocs.length})
        </button>
        <button
          onClick={() => setActiveTab('other')}
          className={`px-5 py-2.5 font-medium text-sm transition-all duration-300 rounded-xl ${
            activeTab === 'other'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Other Documents ({otherDocs.length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block w-8 h-8 border-3 border-gray-300 dark:border-gray-700 border-t-gray-900 dark:border-t-white rounded-full animate-spin mb-3"></div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Loading documents...</p>
        </div>
      ) : displayDocs.length === 0 ? (
        <div className="relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl rounded-3xl overflow-hidden border border-gray-200/50 dark:border-gray-800/50 shadow-xl shadow-black/5 dark:shadow-black/20">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-transparent to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50"></div>
          <div className="relative text-center py-16 px-6">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400 dark:text-gray-600" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              {activeTab === 'tax' ? 'No tax documents yet' : 'No other documents yet'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {displayDocs.map((doc, index) => (
            <div
              key={doc.id}
              className="group relative"
              style={{
                animation: `slideIn 0.3s ease-out ${index * 0.05}s both`
              }}
            >
              <div className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/10 hover:scale-[1.01] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/40 to-transparent dark:from-white/5 dark:via-white/3 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white truncate text-[15px] mb-2">
                          {doc.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 rounded-lg font-medium">
                            {doc.type}
                          </span>
                          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(doc.uploaded_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700/80 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 flex-shrink-0"
                      title="Download"
                    >
                      <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
