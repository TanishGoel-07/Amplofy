import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Rocket,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Mail,
  User as UserIcon,
  Lock,
  Phone,
  Instagram,
  Globe,
  Sparkles,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Upload,
  Link as LinkIcon,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { VerificationBadge } from '@/components/ui/Badge';
import type { AccountType } from '@/data/types';

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
  'Georgia Tech',
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
  'Architecture',
  'General Studies / Other',
];

const YEARS = [
  'Freshman (Year 1)',
  'Sophomore (Year 2)',
  'Junior (Year 3)',
  'Senior (Year 4)',
  'Graduate / Masters / PhD',
  'Faculty / Campus Staff',
];

const STARTUP_CATEGORIES = [
  'Development',
  'Design',
  'Photography',
  'Labor',
  'Tutoring',
  'Music',
  'Marketing',
  'Coaching',
  'Other',
];

export default function JoinPage() {
  const { registerCampusUser } = useApp();
  const navigate = useNavigate();

  // Onboarding Step: 1 | 2 | 3 | 4 (success)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Role
  const [accountType, setAccountType] = useState<AccountType>('student');

  // Step 2: Basic Details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [college, setCollege] = useState('Stanford University');
  const [customCollege, setCustomCollege] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [year, setYear] = useState('Junior (Year 3)');

  // Contact Preferences
  const [contactWhatsapp, setContactWhatsapp] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactInstagram, setContactInstagram] = useState('');
  const [showContact, setShowContact] = useState(true);

  // Startup Fields (if role === 'startup')
  const [startupName, setStartupName] = useState('');
  const [startupTagline, setStartupTagline] = useState('');
  const [startupCategory, setStartupCategory] = useState('Development');
  const [startupTeamSize, setStartupTeamSize] = useState(3);
  const [startupWebsite, setStartupWebsite] = useState('');
  const [startupInstagram, setStartupInstagram] = useState('');
  const [startupLogoUrl, setStartupLogoUrl] = useState(
    'https://images.pexels.com/photos/256514/pexels-photo-256514.jpeg?auto=compress&cs=tinysrgb&w=200'
  );

  // Step 3: Verification
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'proof'>('email');
  const [proofUrl, setProofUrl] = useState('');
  const [studentIdNumber, setStudentIdNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCollege = college === 'Other Campus' ? customCollege || 'Campus University' : college;

  // Step 1 validation
  const handleProceedToStep2 = () => {
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2 validation
  const handleProceedToStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (accountType === 'startup') {
      if (!startupName.trim()) {
        setError('Please enter your startup name.');
        return;
      }
      if (!startupTagline.trim()) {
        setError('Please enter a one-line tagline for your venture.');
        return;
      }
    }
    setError(null);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Final submission on Step 3
  const handleCompleteRegistration = async () => {
    setError(null);
    setIsSubmitting(true);

    const isEduEmail = email.toLowerCase().includes('.edu') || email.toLowerCase().includes('.ac.') || email.toLowerCase().includes('campus');
    const isVerified = isEduEmail || Boolean(proofUrl) || Boolean(studentIdNumber) || accountType === 'buyer';

    const res = await registerCampusUser({
      name: name.trim(),
      email: email.trim(),
      password,
      accountType,
      college: selectedCollege,
      department: accountType !== 'buyer' ? department : undefined,
      year: accountType !== 'buyer' ? year : undefined,
      contactWhatsapp: contactWhatsapp.trim() || undefined,
      contactEmail: contactEmail.trim() || email.trim(),
      contactInstagram: contactInstagram.trim() || undefined,
      showContact,
      isVerified,
      startupData:
        accountType === 'startup'
          ? {
              name: startupName.trim(),
              tagline: startupTagline.trim(),
              category: startupCategory,
              teamSize: startupTeamSize,
              website: startupWebsite.trim() || undefined,
              logoUrl: startupLogoUrl,
              contactInstagram: startupInstagram.trim() || contactInstagram.trim() || undefined,
            }
          : undefined,
    });

    setIsSubmitting(false);

    if (res.error) {
      setError(res.error);
    } else {
      setCurrentStep(4); // Success Celebration
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2 group">
            <div className="w-10 h-10 rounded-xl bg-[#0F766E] flex items-center justify-center text-white font-extrabold shadow-sm group-hover:scale-105 transition-transform">
              A
            </div>
            <span className="font-extrabold text-xl text-slate-900 tracking-tight">AMPLOFY</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Join the Campus Marketplace
          </h1>
          <p className="text-sm text-slate-500">
            Buy, sell, hire talent, and trade goods across verified universities.
          </p>
        </div>

        {/* 3-Step Progress Bar (only visible during steps 1-3) */}
        {currentStep <= 3 && (
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span className={currentStep >= 1 ? 'text-[#0F766E]' : ''}>1. Choose Role</span>
              <span className={currentStep >= 2 ? 'text-[#0F766E]' : ''}>2. Basic Details</span>
              <span className={currentStep >= 3 ? 'text-[#0F766E]' : ''}>3. Campus Verification</span>
            </div>

            {/* Bar track */}
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0F766E] rounded-full transition-all duration-300"
                style={{
                  width: currentStep === 1 ? '33.3%' : currentStep === 2 ? '66.6%' : '100%',
                }}
              />
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3.5 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="font-medium leading-relaxed">{error}</p>
          </div>
        )}

        {/* ========================================================
            STEP 1: CHOOSE ROLE
           ======================================================== */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 1: Choose your campus role</h2>
              <p className="text-xs text-slate-500 mt-1">
                Select how you primarily intend to use AMPLOFY on campus.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Option 1: Student */}
              <button
                type="button"
                onClick={() => setAccountType('student')}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all flex items-start gap-4 ${
                  accountType === 'student'
                    ? 'border-[#0F766E] bg-teal-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    accountType === 'student'
                      ? 'bg-[#0F766E] text-white shadow-sm'
                      : 'bg-teal-50 text-[#0F766E]'
                  }`}
                >
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">I'm a student</h3>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Verified Student Badge
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Sell dorm essentials, pre-owned tech, and textbooks, or offer peer tutoring and freelance services with zero fees.
                  </p>
                </div>
              </button>

              {/* Option 2: Startup */}
              <button
                type="button"
                onClick={() => setAccountType('startup')}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all flex items-start gap-4 ${
                  accountType === 'startup'
                    ? 'border-[#0F766E] bg-teal-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    accountType === 'startup'
                      ? 'bg-[#0F766E] text-white shadow-sm'
                      : 'bg-amber-50 text-amber-600'
                  }`}
                >
                  <Rocket className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">I run a startup</h3>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      Verified Startup Badge
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Showcase your student-founded agency, dev lab, or product studio with a dedicated venture profile and custom quotes.
                  </p>
                </div>
              </button>

              {/* Option 3: Buyer */}
              <button
                type="button"
                onClick={() => setAccountType('buyer')}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all flex items-start gap-4 ${
                  accountType === 'buyer'
                    ? 'border-[#0F766E] bg-teal-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    accountType === 'buyer'
                      ? 'bg-[#0F766E] text-white shadow-sm'
                      : 'bg-indigo-50 text-indigo-600'
                  }`}
                >
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">I just want to hire or buy</h3>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      Campus Buyer
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Browse campus products, hire expert student talent, and trade goods safely with verified university peers.
                  </p>
                </div>
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Already have an account?{' '}
                <Link to="/signin" className="text-[#0F766E] font-semibold hover:underline">
                  Sign in
                </Link>
              </span>

              <Button
                variant="primary"
                size="md"
                onClick={handleProceedToStep2}
                className="inline-flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 2: BASIC DETAILS & CONTACT PREFERENCES
           ======================================================== */}
        {currentStep === 2 && (
          <form onSubmit={handleProceedToStep3} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Step 2: Account Details & Contact Preferences
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Tell us about yourself and how buyers can reach you.
              </p>
            </div>

            {/* Account Credentials */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Login Credentials
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full bg-slate-50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    College / University Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@university.edu"
                      className="w-full bg-slate-50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full bg-slate-50 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Campus Affiliation */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Campus Affiliation
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    College / Campus
                  </label>
                  <select
                    value={college}
                    onChange={e => setCollege(e.target.value)}
                    className="w-full bg-slate-50 rounded-xl px-3 py-2.5 text-xs text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                  >
                    {CAMPUSES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {college === 'Other Campus' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Enter Campus Name
                    </label>
                    <input
                      type="text"
                      value={customCollege}
                      onChange={e => setCustomCollege(e.target.value)}
                      placeholder="Your university name"
                      className="w-full bg-slate-50 rounded-xl px-3 py-2.5 text-xs text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                    />
                  </div>
                )}

                {accountType !== 'buyer' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Academic Department / Major
                    </label>
                    <select
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
                      className="w-full bg-slate-50 rounded-xl px-3 py-2.5 text-xs text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                    >
                      {DEPARTMENTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                )}

                {accountType !== 'buyer' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Year of Study
                    </label>
                    <select
                      value={year}
                      onChange={e => setYear(e.target.value)}
                      className="w-full bg-slate-50 rounded-xl px-3 py-2.5 text-xs text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                    >
                      {YEARS.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* STARTUP FIELDS (if role === 'startup') */}
            {accountType === 'startup' && (
              <div className="space-y-4 pt-2 border-t border-slate-100 bg-amber-50/50 p-5 rounded-xl border border-amber-200">
                <div className="flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Venture Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                      Startup Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={startupName}
                      onChange={e => setStartupName(e.target.value)}
                      placeholder="e.g. Apex STEM Mentors"
                      className="w-full bg-white rounded-xl px-3 py-2 text-xs text-slate-900 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                      Industry / Category
                    </label>
                    <select
                      value={startupCategory}
                      onChange={e => setStartupCategory(e.target.value)}
                      className="w-full bg-white rounded-xl px-3 py-2 text-xs text-slate-900 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    >
                      {STARTUP_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Tagline (One sentence pitch) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={startupTagline}
                    onChange={e => setStartupTagline(e.target.value)}
                    placeholder="e.g. Top 1% student peer tutors in Math, Physics, and CS."
                    className="w-full bg-white rounded-xl px-3 py-2 text-xs text-slate-900 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                      Team Size
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={startupTeamSize}
                      onChange={e => setStartupTeamSize(Number(e.target.value))}
                      className="w-full bg-white rounded-xl px-3 py-2 text-xs text-slate-900 border border-amber-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                      Website (Optional)
                    </label>
                    <input
                      type="url"
                      value={startupWebsite}
                      onChange={e => setStartupWebsite(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-white rounded-xl px-3 py-2 text-xs text-slate-900 border border-amber-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                      Venture Instagram
                    </label>
                    <input
                      type="text"
                      value={startupInstagram}
                      onChange={e => setStartupInstagram(e.target.value)}
                      placeholder="handle_name"
                      className="w-full bg-white rounded-xl px-3 py-2 text-xs text-slate-900 border border-amber-300"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Contact Preferences */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Direct Contact Preferences
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Buyers reach you directly via these channels (all optional).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    WhatsApp (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Contact Email (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                      placeholder="contact@campus.edu"
                      className="w-full bg-slate-50 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Instagram Handle (Optional)
                  </label>
                  <div className="relative">
                    <Instagram className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={contactInstagram}
                      onChange={e => setContactInstagram(e.target.value)}
                      placeholder="username"
                      className="w-full bg-slate-50 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 border border-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Show contact to buyers toggle */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-slate-900">
                    Show contact info to campus buyers
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Enables the "Contact seller" modal button on your items.
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

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setCurrentStep(1)}
                className="inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="inline-flex items-center gap-1.5"
              >
                <span>Continue to Verification</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        )}

        {/* ========================================================
            STEP 3: VERIFICATION
           ======================================================== */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Step 3: Campus Trust & Verification
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                AMPLOFY is built on student trust. Verify your status to unlock badges and instant buyer trust.
              </p>
            </div>

            {/* Badge Preview Callout */}
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#0F766E]">Eligible Badge:</span>
                <div className="flex items-center gap-2">
                  {accountType === 'startup' ? (
                    <VerificationBadge type="startup" size="md" />
                  ) : (
                    <VerificationBadge type="student" size="md" />
                  )}
                  <span className="text-xs font-bold text-slate-900">
                    {accountType === 'startup' ? 'Verified Campus Venture' : 'Verified Student'}
                  </span>
                </div>
              </div>
              <ShieldCheck className="w-8 h-8 text-[#0F766E] shrink-0" />
            </div>

            {/* STUDENT VERIFICATION PATHWAY */}
            {accountType === 'student' && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-[#0F766E]" />
                    <span>College Email Check</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Signing up with <span className="font-semibold text-slate-900">{email}</span>. A quick confirmation link will be sent to confirm enrollment.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Student ID Number (Optional, for instant badge)
                  </label>
                  <input
                    type="text"
                    value={studentIdNumber}
                    onChange={e => setStudentIdNumber(e.target.value)}
                    placeholder="e.g. S902148"
                    className="w-full bg-slate-50 rounded-xl px-3 py-2.5 text-xs text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Your student ID is kept confidential and never displayed on public listings.
                  </p>
                </div>
              </div>
            )}

            {/* STARTUP VERIFICATION PATHWAY */}
            {accountType === 'startup' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600">
                  Student-founded startups are verified when the founder has a verified student profile OR submits a short proof:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setVerificationMethod('email')}
                    className={`p-4 rounded-xl border text-left text-xs space-y-1 transition-all ${
                      verificationMethod === 'email'
                        ? 'border-[#0F766E] bg-teal-50/50 font-semibold'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-slate-900">
                      <GraduationCap className="w-4 h-4 text-[#0F766E]" />
                      <span>Founder is a Verified Student</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal">
                      Verified automatically via your university email ({email}).
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVerificationMethod('proof')}
                    className={`p-4 rounded-xl border text-left text-xs space-y-1 transition-all ${
                      verificationMethod === 'proof'
                        ? 'border-[#0F766E] bg-teal-50/50 font-semibold'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-slate-900">
                      <LinkIcon className="w-4 h-4 text-[#0F766E]" />
                      <span>Incubator or Portfolio Proof</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal">
                      Link your campus incubator demo, GitHub repo, or portfolio.
                    </p>
                  </button>
                </div>

                {verificationMethod === 'proof' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Venture Link / Portfolio / Pitch Deck
                    </label>
                    <input
                      type="url"
                      value={proofUrl}
                      onChange={e => setProofUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-slate-50 rounded-xl px-3 py-2.5 text-xs text-slate-900 border border-slate-200"
                    />
                  </div>
                )}
              </div>
            )}

            {/* BUYER VERIFICATION */}
            {accountType === 'buyer' && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-[#0F766E]" />
                  <span>Campus Buyer Account Ready</span>
                </div>
                <p>
                  You are all set to browse campus products, hire expert talent, and place orders directly with verified students and startups.
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={handleCompleteRegistration}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5"
              >
                <span>{isSubmitting ? 'Creating account...' : 'Complete Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 4: CELEBRATION / SUCCESS SCREEN
           ======================================================== */}
        {currentStep === 4 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-xs text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Welcome to AMPLOFY, {name}!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Your campus account is active at <span className="font-semibold text-slate-800">{selectedCollege}</span>.
              </p>
            </div>

            {/* Badges Box */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 max-w-sm mx-auto space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Badges Awarded
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {accountType === 'startup' ? (
                  <VerificationBadge type="startup" size="md" />
                ) : (
                  <VerificationBadge type="student" size="md" />
                )}
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-200/80 text-slate-700 font-semibold">
                  {selectedCollege}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto"
              >
                Go to Dashboard
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate('/services')}
                className="w-full sm:w-auto"
              >
                Explore Services
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
