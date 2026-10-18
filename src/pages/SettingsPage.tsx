import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Phone,
  Mail,
  Instagram,
  ShieldCheck,
  Rocket,
  Lock,
  LogOut,
  Building2,
  Globe,
  CheckCircle2,
  Star,
  ExternalLink,
  Save,
  Check,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { VerificationBadge, TopRatedBadge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';

const CAMPUSES = [
  'MIT',
  'Stanford University',
  'UC Berkeley',
  'UT Austin',
  'NYU Tisch',
  'Columbia University',
  'RISD / Brown',
  'UCLA',
  'University of Michigan',
  'Other Campus',
];

const DEPARTMENTS = [
  'Computer Science',
  'Design & Fine Arts',
  'Business Administration',
  'Applied Mathematics',
  'EECS & Engineering',
  'Film & Media Studies',
  'Music Production',
  'Psychology',
  'Economics',
  'Other',
];

const YEARS = [
  'Freshman (Year 1)',
  'Sophomore (Year 2)',
  'Junior (Year 3)',
  'Senior (Year 4)',
  'Graduate / Masters / PhD',
  'Campus Staff',
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    isAuthed,
    currentUser,
    signOut,
    updateProfile,
    startups,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'contact' | 'account' | 'startup' | 'security'>('profile');
  const [isSaving, setIsSaving] = useState(false);

  // Profile fields
  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [college, setCollege] = useState(currentUser?.college || 'Stanford University');
  const [department, setDepartment] = useState(currentUser?.department || 'Computer Science');
  const [year, setYear] = useState(currentUser?.year || 'Junior (Year 3)');

  // Contact fields
  const [contactWhatsapp, setContactWhatsapp] = useState(currentUser?.contactWhatsapp || '');
  const [contactEmail, setContactEmail] = useState(currentUser?.contactEmail || currentUser?.email || '');
  const [contactInstagram, setContactInstagram] = useState(currentUser?.contactInstagram || '');
  const [showContact, setShowContact] = useState(currentUser?.showContact ?? true);

  // Startup fields (if startup account)
  const userStartup = startups.find(s => s.ownerId === currentUser?.id) || startups[0];
  const [startupName, setStartupName] = useState(userStartup?.name || 'My Campus Venture');
  const [startupTagline, setStartupTagline] = useState(userStartup?.tagline || '');
  const [startupWebsite, setStartupWebsite] = useState(userStartup?.website || '');
  const [startupCategory, setStartupCategory] = useState(userStartup?.category || 'Development');

  if (!isAuthed || !currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Sign in to access settings</h2>
        <Link to="/signin">
          <Button variant="primary" size="md">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const res = await updateProfile({
      name: name.trim(),
      bio: bio.trim(),
      college,
      department,
      year,
    });

    setIsSaving(false);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success('Profile details saved successfully.');
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const res = await updateProfile({
      contactWhatsapp: contactWhatsapp.trim(),
      contactEmail: contactEmail.trim(),
      contactInstagram: contactInstagram.trim(),
      showContact,
    });

    setIsSaving(false);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success('Direct contact preferences updated.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your personal campus profile, contact methods, and venture details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Nav Tabs */}
        <aside className="md:col-span-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs space-y-1">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'profile'
                  ? 'bg-teal-50 text-[#0F766E]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Profile & Campus</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('contact')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'contact'
                  ? 'bg-teal-50 text-[#0F766E]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>Contact Methods</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('account')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'account'
                  ? 'bg-teal-50 text-[#0F766E]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Account Type & Badges</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('startup')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'startup'
                  ? 'bg-teal-50 text-[#0F766E]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Rocket className="w-4 h-4" />
              <span>Startup Venture</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'security'
                  ? 'bg-teal-50 text-[#0F766E]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Security & Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Right Content */}
        <main className="md:col-span-8">
          {/* TAB 1: PROFILE DETAILS */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Profile & Academic Affiliation</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Visible to campus peers and potential buyers on your listings.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-50 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Bio / Introduction
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Tell campus members about your skills, hobbies, or what courses you're taking..."
                    className="w-full bg-slate-50 rounded-xl p-3 text-xs text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      College / Campus
                    </label>
                    <select
                      value={college}
                      onChange={e => setCollege(e.target.value)}
                      className="w-full bg-slate-50 rounded-xl px-3 py-2.5 text-xs text-slate-900 border border-slate-200"
                    >
                      {CAMPUSES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Department / Major
                    </label>
                    <select
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
                      className="w-full bg-slate-50 rounded-xl px-3 py-2.5 text-xs text-slate-900 border border-slate-200"
                    >
                      {DEPARTMENTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Year of Study
                    </label>
                    <select
                      value={year}
                      onChange={e => setYear(e.target.value)}
                      className="w-full bg-slate-50 rounded-xl px-3 py-2.5 text-xs text-slate-900 border border-slate-200"
                    >
                      {YEARS.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button variant="primary" size="sm" disabled={isSaving} type="submit">
                  {isSaving ? 'Saving...' : 'Save Profile Changes'}
                </Button>
              </div>
            </form>
          )}

          {/* TAB 2: CONTACT METHODS */}
          {activeTab === 'contact' && (
            <form onSubmit={handleSaveContact} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Direct Contact Preferences</h2>
                <p className="text-xs text-slate-500 mt-1">
                  How buyers reach you via the "Contact seller" modal on your listings.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    WhatsApp Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={contactWhatsapp}
                      onChange={e => setContactWhatsapp(e.target.value)}
                      placeholder="+1 555-0199"
                      className="w-full bg-slate-50 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Public Contact Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                      placeholder="alex.j@campus.edu"
                      className="w-full bg-slate-50 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Instagram Handle
                  </label>
                  <div className="relative">
                    <Instagram className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={contactInstagram}
                      onChange={e => setContactInstagram(e.target.value)}
                      placeholder="username"
                      className="w-full bg-slate-50 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 border border-slate-200"
                    />
                  </div>
                </div>

                {/* Show/Hide Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-slate-900">
                      Show contact methods to campus buyers
                    </span>
                    <p className="text-[11px] text-slate-500">
                      When enabled, verified buyers can view your WhatsApp, email, or Instagram directly.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowContact(!showContact)}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                      showContact ? 'bg-[#0F766E]' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                        showContact ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button variant="primary" size="sm" disabled={isSaving} type="submit">
                  {isSaving ? 'Saving...' : 'Update Contact Info'}
                </Button>
              </div>
            </form>
          )}

          {/* TAB 3: ACCOUNT TYPE & BADGES */}
          {activeTab === 'account' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Account Type & Campus Badges</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Your campus privileges, verification status, and reputation score.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Account Classification
                  </span>
                  <div className="text-base font-extrabold text-slate-900 capitalize">
                    {currentUser.accountType || 'Student'} Account
                  </div>
                  <p className="text-xs text-slate-500">
                    Zero fees on goods & services. Dedicated campus profile and listing wizard.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Active Badges
                  </span>
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    {currentUser.accountType === 'startup' ? (
                      <VerificationBadge type="startup" size="md" />
                    ) : (
                      <VerificationBadge type="student" size="md" />
                    )}
                    <TopRatedBadge rating={currentUser.rating} reviewCount={currentUser.reviewCount || 15} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STARTUP VENTURE */}
          {activeTab === 'startup' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Startup Venture Profile</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage your student venture details, public directory card, and team listings.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Startup Name
                  </label>
                  <input
                    type="text"
                    value={startupName}
                    onChange={e => setStartupName(e.target.value)}
                    className="w-full bg-slate-50 rounded-xl px-3.5 py-2 text-xs text-slate-900 border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Venture Tagline
                  </label>
                  <input
                    type="text"
                    value={startupTagline}
                    onChange={e => setStartupTagline(e.target.value)}
                    className="w-full bg-slate-50 rounded-xl px-3.5 py-2 text-xs text-slate-900 border border-slate-200"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={startupWebsite}
                      onChange={e => setStartupWebsite(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-slate-50 rounded-xl px-3.5 py-2 text-xs text-slate-900 border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Category
                    </label>
                    <input
                      type="text"
                      value={startupCategory}
                      onChange={e => setStartupCategory(e.target.value)}
                      className="w-full bg-slate-50 rounded-xl px-3.5 py-2 text-xs text-slate-900 border border-slate-200"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <Link
                  to={`/startups/${userStartup?.slug || 'technexus-labs'}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F766E] hover:underline"
                >
                  <span>View Public Venture Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => toast.success('Venture details updated!')}
                >
                  Save Venture Details
                </Button>
              </div>
            </div>
          )}

          {/* TAB 5: SECURITY & SIGN OUT */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Security & Sign Out</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage your credentials and active session.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs text-slate-900">Signed In As</div>
                    <div className="text-xs text-slate-500">{currentUser.email || currentUser.name}</div>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={async () => {
                      await signOut();
                      navigate('/');
                    }}
                    className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 hover:border-red-200"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
