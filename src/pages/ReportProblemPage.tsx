import { useState } from 'react';
import { Flag, Send, Bug, ShieldAlert, User, Lock, AlertCircle } from 'lucide-react';

export default function ReportProblemPage() {
  const [submitted, setSubmitted] = useState(false);
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');

  const types = [
    { value: 'technical', label: 'Technical Problem', icon: Bug },
    { value: 'safety', label: 'Safety Problem', icon: ShieldAlert },
    { value: 'account', label: 'Account Problem', icon: User },
    { value: 'verification', label: 'Verification Problem', icon: Lock },
    { value: 'illegal', label: 'Illegal Content', icon: AlertCircle },
    { value: 'harassment', label: 'Harassment', icon: ShieldAlert },
    { value: 'scam', label: 'Scam/Fraud', icon: AlertCircle },
    { value: 'other', label: 'Other', icon: Flag },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-error-50 rounded-3xl flex items-center justify-center mb-4">
          <Flag size={32} className="text-error-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 mb-2">Report a Problem</h1>
        <p className="text-ink-500">Help us keep AMPLOFY safe and working properly.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-ink-100 p-6">
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
              <Send size={28} className="text-emerald-600" />
            </div>
            <h2 className="font-bold text-ink-800 mb-2">Thank you. Your report has been submitted for review.</h2>
            <p className="text-sm text-ink-500 mb-4">We take all reports seriously and will review your submission.</p>
            <button
              onClick={() => { setSubmitted(false); setType(''); setDescription(''); }}
              className="px-5 py-2.5 border border-ink-200 rounded-xl text-sm font-semibold text-ink-700 hover:bg-ink-50"
            >
              Submit Another Report
            </button>
          </div>
        ) : (
          <>
            <h2 className="font-bold text-ink-800 mb-4">What type of problem?</h2>
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {types.map(t => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={`flex items-center gap-3 text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${type === t.value ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-ink-200 text-ink-600 hover:border-brand-300'}`}
                >
                  <t.icon size={18} /> {t.label}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink-700 mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe the problem in detail. Include any relevant information that may help us investigate."
                rows={4}
                className="w-full bg-ink-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-ink-200 focus:border-brand-300 focus:ring-2 focus:ring-brand-100 resize-none mb-4"
              />
            </div>

            <button
              onClick={() => { if (description.trim() && type) setSubmitted(true); }}
              disabled={!description.trim() || !type}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-error-500 text-white rounded-xl text-sm font-semibold hover:bg-error-600 disabled:opacity-50"
            >
              <Send size={16} /> Submit Report
            </button>
          </>
        )}
      </div>
    </div>
  );
}
