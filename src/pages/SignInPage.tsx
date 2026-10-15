import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function SignInPage() {
  const { signIn, resetPassword } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signInError } = await signIn(email, password);
    setLoading(false);
    if (signInError) {
      setError(signInError);
    } else {
      navigate('/');
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Enter your email above first, then click reset password.');
      return;
    }
    setError(null);
    const { error: resetError } = await resetPassword(email);
    if (resetError) {
      setError(resetError);
    } else {
      setResetSent(true);
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
          <h1 className="text-2xl font-bold text-ink-900 mb-2">Welcome back</h1>
          <p className="text-ink-500">Sign in to your AMPLOFY account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-ink-100 p-6">
          {error && (
            <div className="mb-4 bg-error-50 border border-error-200 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle size={18} className="text-error-500 shrink-0 mt-0.5" />
              <p className="text-sm text-error-700">{error}</p>
            </div>
          )}

          {resetSent && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm text-emerald-700">
              Password reset instructions have been sent to your email.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Enter your password"
                  required
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

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : <>Sign In <ArrowRight size={18} /></>}
            </button>
          </form>

          <button
            onClick={handleResetPassword}
            className="w-full text-center text-sm text-ink-500 hover:text-brand-600 mt-3 transition-colors"
          >
            Forgot your password?
          </button>

          <p className="text-center text-sm text-ink-500 mt-5">
            Don't have an account?{' '}
            <Link to="/join" className="font-semibold text-brand-600 hover:text-brand-700">Join AMPLOFY</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
