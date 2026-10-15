import { useState } from 'react';
import { Mail, MessageCircle, ShieldAlert, Lock, Send } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');

  const topics = [
    'Account problems',
    'Verification problems',
    'Safety issues',
    'Reports',
    'Prohibited listings',
    'Privacy',
    'Terms',
    'General support',
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-brand-50 rounded-3xl flex items-center justify-center mb-4">
          <MessageCircle size={32} className="text-brand-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 mb-2">Contact &amp; Help</h1>
        <p className="text-ink-500">Get help with your account, verification, safety, or general questions.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-ink-100 p-6 mb-6">
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          {topics.map(t => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              className={`text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${topic === t ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-ink-200 text-ink-600 hover:border-brand-300'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink-700 mb-1.5">Your Message</label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Describe your issue or question..."
            rows={4}
            className="w-full bg-ink-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-ink-200 focus:border-brand-300 focus:ring-2 focus:ring-brand-100 resize-none mb-4"
          />
          <button
            onClick={() => { if (message.trim()) setSubmitted(true); }}
            disabled={!message.trim() || !topic}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 disabled:opacity-50"
          >
            <Send size={16} /> Send Message
          </button>
        </div>

        {submitted && (
          <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4 animate-fade-in">
            <p className="text-sm text-emerald-800 font-semibold">Thank you. Your message has been received.</p>
            <p className="text-xs text-emerald-700 mt-1">We'll get back to you as soon as possible.</p>
          </div>
        )}
      </div>

      <div className="bg-ink-50 rounded-2xl p-5 text-center">
        <Mail size={20} className="text-ink-400 mx-auto mb-2" />
        <p className="text-sm text-ink-500">
          Support email: <span className="text-ink-400">[To be established before public launch]</span>
        </p>
        <p className="text-xs text-ink-400 mt-2">This is a prototype contact form. Messages are not yet processed by a support team.</p>
      </div>
    </div>
  );
}
