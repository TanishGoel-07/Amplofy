import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Lock, Bell, Ban, Trash2, ShieldCheck, LogOut, ChevronRight,
  Eye, EyeOff,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

type Tab = 'profile' | 'security' | 'notifications' | 'blocked' | 'account';

export default function SettingsPage() {
  const { isAuthed, currentUser, signOut, blockedUsers, unblockUser, updateProfile, verificationStatus, deleteAccount } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    bio: currentUser?.bio || '',
    location: currentUser?.location || '',
    campus: currentUser?.campus || '',
    course: currentUser?.course || '',
    yearOfStudy: currentUser?.yearOfStudy || '',
  });

  if (!isAuthed || !currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-ink-500 mb-4">Please sign in to access settings.</p>
        <Link to="/signin" className="text-brand-600 font-semibold">Sign In</Link>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: typeof User }[] = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'security', label: 'Security', icon: Lock },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'blocked', label: 'Blocked Users', icon: Ban },
    { key: 'account', label: 'Account', icon: ShieldCheck },
  ];

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    const { error } = await updateProfile(profileForm);
    setSavingProfile(false);
    if (!error) {
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    await deleteAccount();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 mb-6">Settings</h1>

      <div className="grid lg:grid-cols-[200px_1fr] gap-6">
        <aside>
          <div className="bg-white rounded-2xl shadow-soft border border-ink-100 p-2 lg:sticky top-20">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${tab === t.key ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-ink-50'}`}
              >
                <t.icon size={18} /> {t.label}
              </button>
            ))}
          </div>
        </aside>

        <div>
          {tab === 'profile' && (
            <div className="bg-white rounded-2xl shadow-soft border border-ink-100 p-6 space-y-4">
              <h2 className="font-bold text-ink-800 mb-2">Edit Profile</h2>
              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-1.5">Display Name</label>
                <input type="text" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} className="w-full bg-ink-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-ink-200 focus:border-brand-300 focus:ring-2 focus:ring-brand-100" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-1.5">Bio</label>
                <textarea value={profileForm.bio} onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })} rows={3} className="w-full bg-ink-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-ink-200 focus:border-brand-300 focus:ring-2 focus:ring-brand-100 resize-none" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-ink-700 mb-1.5">Location</label>
                  <input type="text" value={profileForm.location} onChange={e => setProfileForm({ ...profileForm, location: e.target.value })} className="w-full bg-ink-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-ink-200 focus:border-brand-300" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink-700 mb-1.5">Campus/Institution</label>
                  <input type="text" value={profileForm.campus} onChange={e => setProfileForm({ ...profileForm, campus: e.target.value })} className="w-full bg-ink-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-ink-200 focus:border-brand-300" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-ink-700 mb-1.5">Course/Field of Study</label>
                  <input type="text" value={profileForm.course} onChange={e => setProfileForm({ ...profileForm, course: e.target.value })} className="w-full bg-ink-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-ink-200 focus:border-brand-300" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink-700 mb-1.5">Year of Study</label>
                  <input type="text" value={profileForm.yearOfStudy} onChange={e => setProfileForm({ ...profileForm, yearOfStudy: e.target.value })} className="w-full bg-ink-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-ink-200 focus:border-brand-300" />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button onClick={handleSaveProfile} disabled={savingProfile} className="px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 disabled:opacity-50">
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </button>
                {profileSaved && <span className="text-sm text-emerald-600 font-semibold">Saved!</span>}
                <Link to="/verify" className="text-sm text-brand-600 font-semibold hover:text-brand-700">Verification status: {verificationStatus}</Link>
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div className="bg-white rounded-2xl shadow-soft border border-ink-100 p-6 space-y-4">
              <h2 className="font-bold text-ink-800 mb-2">Account Security</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-ink-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Lock size={18} className="text-ink-400" />
                    <div>
                      <p className="text-sm font-semibold text-ink-700">Password</p>
                      <p className="text-xs text-ink-400">Change your password</p>
                    </div>
                  </div>
                  <button className="text-sm text-brand-600 font-semibold">Change</button>
                </div>
                <div className="flex items-center justify-between p-3 bg-ink-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className="text-ink-400" />
                    <div>
                      <p className="text-sm font-semibold text-ink-700">Verification</p>
                      <p className="text-xs text-ink-400">Status: {verificationStatus}</p>
                    </div>
                  </div>
                  <Link to="/verify" className="text-sm text-brand-600 font-semibold">Manage</Link>
                </div>
                <div className="flex items-center justify-between p-3 bg-ink-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <LogOut size={18} className="text-ink-400" />
                    <div>
                      <p className="text-sm font-semibold text-ink-700">Sign Out</p>
                      <p className="text-xs text-ink-400">Sign out of your account</p>
                    </div>
                  </div>
                  <button onClick={async () => { await signOut(); navigate('/'); }} className="text-sm text-error-500 font-semibold">Sign Out</button>
                </div>
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="bg-white rounded-2xl shadow-soft border border-ink-100 p-6">
              <h2 className="font-bold text-ink-800 mb-2">Notification Preferences</h2>
              <p className="text-sm text-ink-400 mb-4">Manage which notifications you receive.</p>
              <div className="space-y-3">
                {['New messages', 'New offers', 'Offer accepted/rejected', 'Listing approved', 'Listing rejected', 'Verification updates', 'Verification expiring'].map(n => (
                  <label key={n} className="flex items-center justify-between p-3 bg-ink-50 rounded-xl cursor-pointer">
                    <span className="text-sm text-ink-700">{n}</span>
                    <input type="checkbox" defaultChecked className="accent-brand-600 w-5 h-5" />
                  </label>
                ))}
              </div>
            </div>
          )}

          {tab === 'blocked' && (
            <div className="bg-white rounded-2xl shadow-soft border border-ink-100 p-6">
              <h2 className="font-bold text-ink-800 mb-2">Blocked Users</h2>
              <p className="text-sm text-ink-400 mb-4">Blocked users cannot message or interact with you.</p>
              {blockedUsers.length > 0 ? (
                <div className="space-y-2">
                  {blockedUsers.map(b => (
                    <div key={b.id} className="flex items-center gap-3 p-3 bg-ink-50 rounded-xl">
                      {b.userAvatar ? <img src={b.userAvatar} alt="" className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-ink-200" />}
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-ink-700">{b.userName || 'Unknown'}</p>
                        <p className="text-xs text-ink-400">Blocked {new Date(b.blockedDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
                      </div>
                      <button onClick={() => unblockUser(b.userId)} className="text-sm text-brand-600 font-semibold hover:text-brand-700">Unblock</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Ban size={28} className="text-ink-300 mx-auto mb-2" />
                  <p className="text-sm text-ink-400">You haven't blocked anyone.</p>
                </div>
              )}
            </div>
          )}

          {tab === 'account' && (
            <div className="bg-white rounded-2xl shadow-soft border border-ink-100 p-6">
              <h2 className="font-bold text-ink-800 mb-2">Account Management</h2>
              <div className="space-y-4">
                <div className="p-4 bg-ink-50 rounded-xl">
                  <h3 className="text-sm font-semibold text-ink-700 mb-1">Export Your Data</h3>
                  <p className="text-xs text-ink-400 mb-2">Download a copy of your profile and listing data.</p>
                  <button className="text-sm text-brand-600 font-semibold">Request Export</button>
                </div>
                <div className="p-4 bg-error-50 rounded-xl border border-error-100">
                  <h3 className="text-sm font-semibold text-error-700 mb-1">Delete Account</h3>
                  <p className="text-xs text-error-600 mb-2">Permanently delete your account, listings, messages, reviews, and other content. This action cannot be undone.</p>
                  {!showDeleteConfirm ? (
                    <button onClick={() => setShowDeleteConfirm(true)} className="inline-flex items-center gap-1.5 text-sm text-error-600 font-semibold">
                      <Trash2 size={14} /> Delete My Account
                    </button>
                  ) : (
                    <div className="mt-3 p-3 bg-white rounded-xl border border-error-200">
                      <p className="text-sm text-ink-700 mb-3">Are you sure? This will permanently delete your account and all associated data.</p>
                      <div className="flex gap-2">
                        <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-3 py-2 border border-ink-200 rounded-lg text-sm font-semibold text-ink-700">Cancel</button>
                        <button onClick={handleDeleteAccount} className="flex-1 px-3 py-2 bg-error-500 text-white rounded-lg text-sm font-semibold hover:bg-error-600">Confirm Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
