import React, { useEffect, useState, useRef } from 'react';
import { Send, Bot, User, Trash2, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../lib/language-context';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};

type AIChatProps = {
  userId: string;
};

export default function AIChat({ userId }: AIChatProps) {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    setInitialLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    try {
      const { error: userError } = await supabase.from('chat_messages').insert([
        {
          user_id: userId,
          role: 'user',
          content: userMessage,
        },
      ]);

      if (userError) throw userError;

      await fetchMessages();

      const conversationHistory = messages.slice(-6).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
      const headers = {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: userMessage,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiResponse = data.response || t.chat.errorMessage;

      const { error: aiError } = await supabase.from('chat_messages').insert([
        {
          user_id: userId,
          role: 'assistant',
          content: aiResponse,
        },
      ]);

      if (aiError) throw aiError;

      await fetchMessages();
    } catch (err) {
      console.error('Error sending message:', err);

      const { error: errorMsgError } = await supabase.from('chat_messages').insert([
        {
          user_id: userId,
          role: 'assistant',
          content: t.chat.errorMessage,
        },
      ]);

      if (!errorMsgError) {
        await fetchMessages();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (!confirm(t.chat.clearChat + '?')) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      setMessages([]);
    } catch (err) {
      console.error('Error clearing chat:', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (initialLoading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-2 border-gray-900 dark:border-gray-100 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-gray-700/60 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-200/60 dark:border-gray-700/60">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          <span className="font-medium text-gray-900 dark:text-white">{t.chat.subtitle}</span>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            title={t.chat.clearChat}
          >
            <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">{t.chat.noMessages}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">{t.chat.startConversation}</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 text-white dark:text-gray-900" />
                ) : (
                  <Bot className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                )}
              </div>
              <div
                className={`flex-1 px-4 py-2.5 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 text-white dark:text-gray-900'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                } max-w-[80%]`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-200 dark:bg-gray-700">
              <Bot className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="flex-1 px-4 py-2.5 rounded-2xl bg-gray-100 dark:bg-gray-700 max-w-[80%]">
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">{t.chat.thinking}</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200/60 dark:border-gray-700/60">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t.chat.placeholder}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="px-4 py-2.5 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 text-white dark:text-gray-900 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
