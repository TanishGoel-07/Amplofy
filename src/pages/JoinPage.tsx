import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, User, Mail, Lock, ArrowRight, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function JoinPage() {
  const { signUp } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) return;
    setError(null);
    setLoading(true);
    const { error: signUpError } = await signUp(email, password, name);
    setLoading(false);
    if (signUpError) {
      setError(signUpError);
    } else {
      navigate('/verify');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8 bg-gradient-to-br from-brand-50/50 to-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-soft">
              <Store size={24} className="text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-ink-900 mb-2">Join AMPLOFY</h1>
          <p className="text-ink-500">Buy. Sell. Create. Connect — with students.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-ink-100 p-6">
          {error && (
            <div className="mb-4 bg-error-50 border border-error-200 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle size={18} className="text-error-500 shrink-0 mt-0.5" />
              <p className="text-sm text-error-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-ink-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-ink-50 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none border border-ink-200 focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-ink-50 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none border border-ink-200 focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all"
                  placeholder="you@university.edu"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-ink-50 rounded-xl pl-10 pr-10 py-2.5 text-sm outline-none border border-ink-200 focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all"
                  placeholder="Create a password (min 6 characters)"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 shrink-0 transition-colors ${agreeTerms ? 'bg-brand-600 border-brand-600' : 'border-ink-300'}`}>
                {agreeTerms && <Check size={12} className="text-white" />}
              </div>
              <input type="checkbox" checked={agreeTerms} onChange={() => setAgreeTerms(!agreeTerms)} className="sr-only" />
              <span className="text-xs text-ink-500 leading-relaxed">
                I agree to the Terms of Service, Privacy Policy, and Safety Guidelines. I understand this is a student-only platform and I will only list legal, permitted products.
              </span>
            </label>

            <button
              type="submit"
              disabled={!agreeTerms || loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : <>Create Account <ArrowRight size={18} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-ink-500 mt-5">
            Already have an account?{' '}
            <Link to="/signin" className="font-semibold text-brand-600 hover:text-brand-700">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
