import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search as SearchIcon, Plus, MapPin, Tag, Clock, Trash2,
  MessageCircle, Package,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { Category } from '@/data/types';
import { CATEGORIES } from '@/data/types';

export default function WantedPage() {
  const { wantedRequests, addWantedRequest, deleteWantedRequest, isAuthed, currentUser, verificationStatus, startConversation } = useApp();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as Category | '',
    budgetMin: '',
    budgetMax: '',
    location: '',
    expiryDays: '30',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!currentUser) return;
    setSubmitting(true);
    const now = new Date();
    const expiry = new Date(now.getTime() + Number(formData.expiryDays) * 24 * 60 * 60 * 1000);
    await addWantedRequest({
      title: formData.title,
      description: formData.description,
      category: formData.category as Category,
      budgetMin: formData.budgetMin ? Number(formData.budgetMin) : undefined,
      budgetMax: formData.budgetMax ? Number(formData.budgetMax) : undefined,
      location: formData.location || undefined,
      requesterId: currentUser.id,
      requesterName: currentUser.name || 'You',
      requesterAvatar: currentUser.avatar,
      requesterVerified: currentUser.verified,
      expiryDate: expiry.toISOString().split('T')[0],
      status: 'active',
    });
    setSubmitting(false);
    setShowForm(false);
    setFormData({ title: '', description: '', category: '' as Category | '', budgetMin: '', budgetMax: '', location: '', expiryDays: '30' });
  };

  if (!isAuthed) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-16 h-16 mx-auto bg-brand-50 rounded-3xl flex items-center justify-center mb-5">
          <SearchIcon size={32} className="text-brand-600" />
        </div>
        <h1 className="text-2xl font-bold text-ink-900 mb-2">Wanted Board</h1>
        <p className="text-ink-500 mb-6">Sign in to post requests for items you're looking for and see what other students need.</p>
        <Link to="/join" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors">
          Join AMPLOFY
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900">Wanted Board</h1>
          <p className="text-ink-500 mt-1">Post something you're looking for. Other students can reach out if they have it.</p>
        </div>
        {verificationStatus === 'verified' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors"
          >
            <Plus size={18} /> Post a Request
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-soft border border-ink-100 p-6 mb-6 animate-fade-in">
          <h2 className="font-bold text-ink-800 mb-4">New Request</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-ink-700 mb-1.5">What are you looking for? *</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Used copy of Principles of Microeconomics"
                className="w-full bg-ink-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-ink-200 focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-700 mb-1.5">Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add details about condition, edition, etc."
                rows={3}
                className="w-full bg-ink-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-ink-200 focus:border-brand-300 focus:ring-2 focus:ring-brand-100 resize-none"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-1.5">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
                  className="w-full bg-ink-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-ink-200 focus:border-brand-300"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-1.5">Location/Campus (optional)</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Delhi"
                  className="w-full bg-ink-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-ink-200 focus:border-brand-300"
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-1.5">Budget Min (₹)</label>
                <input type="number" value={formData.budgetMin} onChange={e => setFormData({ ...formData, budgetMin: e.target.value })} placeholder="0" className="w-full bg-ink-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-ink-200 focus:border-brand-300" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-1.5">Budget Max (₹)</label>
                <input type="number" value={formData.budgetMax} onChange={e => setFormData({ ...formData, budgetMax: e.target.value })} placeholder="500" className="w-full bg-ink-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-ink-200 focus:border-brand-300" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-1.5">Expires in (days)</label>
                <input type="number" value={formData.expiryDays} onChange={e => setFormData({ ...formData, expiryDays: e.target.value })} min="1" className="w-full bg-ink-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-ink-200 focus:border-brand-300" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-ink-200 rounded-xl text-sm font-semibold text-ink-700 hover:bg-ink-50">Cancel</button>
              <button
                onClick={handleSubmit}
                disabled={!formData.title.trim() || submitting}
                className="flex-1 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 disabled:opacity-50"
              >
                {submitting ? 'Posting...' : 'Post Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {wantedRequests.length > 0 ? (
        <div className="space-y-3">
          {wantedRequests.map(req => (
            <div key={req.id} className="bg-white rounded-2xl shadow-soft border border-ink-100 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">{req.category}</span>
                    {req.budgetMin && req.budgetMax && (
                      <span className="text-xs font-semibold text-ink-500 bg-ink-100 px-2.5 py-1 rounded-full">₹{req.budgetMin}–₹{req.budgetMax}</span>
                    )}
                    {req.budgetMax && !req.budgetMin && (
                      <span className="text-xs font-semibold text-ink-500 bg-ink-100 px-2.5 py-1 rounded-full">Under ₹{req.budgetMax}</span>
                    )}
                  </div>
                  <h3 className="font-bold text-ink-800 mb-1">{req.title}</h3>
                  {req.description && <p className="text-sm text-ink-600 mb-2">{req.description}</p>}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-ink-400">
                    {req.location && <span className="inline-flex items-center gap-1"><MapPin size={12} /> {req.location}</span>}
                    <span className="inline-flex items-center gap-1"><Clock size={12} /> Expires {new Date(req.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>
                {req.requesterId === currentUser?.id && (
                  <button
                    onClick={() => deleteWantedRequest(req.id)}
                    className="w-9 h-9 rounded-lg text-ink-400 hover:text-error-500 hover:bg-error-50 flex items-center justify-center transition-colors"
                    title="Delete request"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-ink-50">
                <div className="flex items-center gap-2">
                  {req.requesterAvatar ? (
                    <img src={req.requesterAvatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-brand-50" />
                  )}
                  <span className="text-xs text-ink-500">{req.requesterName}</span>
                </div>
                {req.requesterId !== currentUser?.id && (
                  <button
                    onClick={async () => {
                      const convId = await startConversation(req.requesterId);
                      if (convId) navigate(`/messages?c=${convId}`);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-700 rounded-lg text-xs font-semibold hover:bg-brand-100 transition-colors"
                  >
                    <MessageCircle size={14} /> Contact
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-ink-100">
          <SearchIcon size={32} className="text-ink-300 mx-auto mb-3" />
          <p className="font-semibold text-ink-700 mb-1">No requests yet</p>
          <p className="text-sm text-ink-500 mb-4">Be the first to post what you're looking for.</p>
          {verificationStatus === 'verified' && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors"
            >
              <Plus size={16} /> Post a Request
            </button>
          )}
        </div>
      )}
    </div>
  );
}
