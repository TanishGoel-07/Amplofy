import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, GraduationCap, School, Check, Clock, ArrowRight,
  Info, BadgeCheck, Upload, AlertCircle, RefreshCw,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

type Step = 'choose' | 'details' | 'submitting' | 'verified' | 'failed';
type StudentType = 'school' | 'college';

export default function VerificationPage() {
  const { currentUser, verificationStatus, submitVerification } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(verificationStatus === 'verified' ? 'verified' : 'choose');
  const [studentType, setStudentType] = useState<StudentType | null>(null);
  const [institution, setInstitution] = useState(currentUser?.campus || '');
  const [studentName, setStudentName] = useState(currentUser?.name || '');
  const [studentIdUploaded, setStudentIdUploaded] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setStep('submitting');
    setSubmitError(null);
    const { error } = await submitVerification({
      studentType: studentType || 'college',
      campus: institution,
      documentFile: documentFile || undefined,
    });
    if (error) {
      setSubmitError(error);
      setStep('details');
      return;
    }
    // After submission, status is 'pending' — show the verified screen as a confirmation
    // that the submission was received (actual verification happens via admin review)
    setStep('verified');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocumentFile(file);
      setStudentIdUploaded(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-brand-50 rounded-3xl flex items-center justify-center mb-4">
          <ShieldCheck size={32} className="text-brand-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 mb-2">Verify Your Student Status</h1>
        <p className="text-ink-500 max-w-md mx-auto">
          Student verification helps keep AMPLOFY within the student community.
        </p>
      </div>

      <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-6 flex items-start gap-3">
        <Info size={20} className="text-brand-600 shrink-0 mt-0.5" />
        <div className="text-sm text-brand-800">
          <p className="font-semibold mb-1">Your privacy is protected</p>
          <p className="text-brand-700 leading-relaxed">
            Your student ID and verification documents are never publicly visible. Student ID numbers, date of birth, address, and other sensitive information from your ID will not appear on your public profile. Verification documents are only accessible to the verification/moderation system.
          </p>
        </div>
      </div>

      {verificationStatus === 'verified' && step === 'verified' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold mb-1">Verification expiry</p>
            <p className="text-amber-700 leading-relaxed">
              Your student verification is valid for the current academic year. You may be asked to re-verify your student status periodically.
            </p>
          </div>
        </div>
      )}

      {step === 'choose' && (
        <div className="bg-white rounded-2xl shadow-soft border border-ink-100 p-6 animate-fade-in">
          <h2 className="font-bold text-ink-800 mb-4">I am a...</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <button
              onClick={() => { setStudentType('school'); setStep('details'); }}
              className="flex flex-col items-center p-6 rounded-2xl border-2 border-ink-200 hover:border-brand-400 hover:bg-brand-50/50 transition-all text-center"
            >
              <School size={32} className="text-brand-600 mb-3" />
              <h3 className="font-semibold text-ink-800 mb-1">School Student</h3>
              <p className="text-sm text-ink-500">Currently in school</p>
            </button>
            <button
              onClick={() => { setStudentType('college'); setStep('details'); }}
              className="flex flex-col items-center p-6 rounded-2xl border-2 border-ink-200 hover:border-brand-400 hover:bg-brand-50/50 transition-all text-center"
            >
              <GraduationCap size={32} className="text-brand-600 mb-3" />
              <h3 className="font-semibold text-ink-800 mb-1">College Student</h3>
              <p className="text-sm text-ink-500">Currently enrolled in college/university</p>
            </button>
          </div>
        </div>
      )}

      {step === 'details' && studentType && (
        <div className="bg-white rounded-2xl shadow-soft border border-ink-100 p-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-5">
            {studentType === 'school' ? <School size={20} className="text-brand-600" /> : <GraduationCap size={20} className="text-brand-600" />}
            <h2 className="font-bold text-ink-800">
              {studentType === 'school' ? 'School Student Verification' : 'College Student Verification'}
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-ink-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                placeholder="Your full name"
                className="w-full bg-ink-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-ink-200 focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-700 mb-1.5">
                {studentType === 'school' ? 'School Name' : 'College/University Name'}
              </label>
              <input
                type="text"
                value={institution}
                onChange={e => setInstitution(e.target.value)}
                placeholder={studentType === 'school' ? 'e.g. Delhi Public School' : 'e.g. Delhi University'}
                className="w-full bg-ink-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-ink-200 focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-700 mb-1.5">Student Email (optional)</label>
              <input
                type="email"
                placeholder="your@university.edu"
                className="w-full bg-ink-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-ink-200 focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all"
              />
              <p className="text-xs text-ink-400 mt-1">A university email helps speed up verification in the future.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink-700 mb-1.5">Upload Student ID *</label>
              <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${studentIdUploaded ? 'border-brand-600 bg-brand-50' : 'border-ink-200 hover:border-brand-300'}`}>
                {studentIdUploaded ? (
                  <div className="flex flex-col items-center gap-2">
                    <Check size={24} className="text-brand-600" />
                    <p className="text-sm font-semibold text-brand-700">{documentFile?.name || 'Student ID uploaded'}</p>
                    <button onClick={() => { setStudentIdUploaded(false); setDocumentFile(null); }} className="text-xs text-ink-500 hover:text-error-500">Remove and re-upload</button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center gap-2 cursor-pointer">
                    <Upload size={24} className="text-ink-400" />
                    <p className="text-sm font-medium text-ink-600">Click to upload your student ID</p>
                    <p className="text-xs text-ink-400">Current student ID showing current enrollment</p>
                    <input type="file" accept="image/*,.pdf" onChange={handleFileSelect} className="sr-only" />
                  </label>
                )}
              </div>
              <p className="text-xs text-ink-400 mt-2">Your student ID is not publicly visible and is only used for verification purposes.</p>
            </div>

            <div className="bg-ink-50 rounded-xl p-4">
              <p className="text-xs text-ink-500 leading-relaxed">
                By submitting, you confirm that the information provided is accurate and that you are a currently enrolled student. Verification is valid for the current academic year and may need to be renewed periodically.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('choose')}
                className="px-5 py-2.5 border border-ink-200 rounded-xl text-sm font-semibold text-ink-700 hover:bg-ink-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!studentName.trim() || !institution.trim() || !studentIdUploaded}
                className="flex-1 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit for Verification
              </button>
            </div>
            {submitError && (
              <p className="text-sm text-error-500">{submitError}</p>
            )}
          </div>
        </div>
      )}

      {step === 'submitting' && (
        <div className="bg-white rounded-2xl shadow-soft border border-ink-100 p-8 text-center animate-fade-in">
          <div className="relative w-20 h-20 mx-auto mb-5">
            <div className="absolute inset-0 rounded-full border-4 border-brand-100" />
            <div className="absolute inset-0 rounded-full border-4 border-brand-600 border-t-transparent animate-spin" />
            <Clock size={28} className="absolute inset-0 m-auto text-brand-600" />
          </div>
          <h2 className="text-xl font-bold text-ink-900 mb-2">Verification submitted</h2>
          <p className="text-ink-500 text-sm">Your student status is being reviewed. You'll be notified when verification is complete.</p>
        </div>
      )}

      {step === 'verified' && (
        <div className="bg-white rounded-2xl shadow-soft border border-ink-100 p-8 text-center animate-scale-in">
          <div className="w-20 h-20 mx-auto bg-brand-50 rounded-3xl flex items-center justify-center mb-5">
            <BadgeCheck size={40} className="text-brand-600" />
          </div>
          <h2 className="text-xl font-bold text-ink-900 mb-2">Verification submitted!</h2>
          <p className="text-ink-500 mb-1">Your student status is being reviewed.</p>
          <p className="text-sm text-ink-400 mb-6">
            {studentName || currentUser?.name || 'Student'} · {institution || currentUser?.campus || 'Institution'}
          </p>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-6 max-w-md mx-auto">
            <p className="text-xs text-amber-700 leading-relaxed">
              The Verified Student badge means only that your student status has been verified. It does not imply that AMPLOFY guarantees your behaviour, products, or transactions.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Check size={16} /> Verified Student
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/explore')}
              className="px-5 py-2.5 border border-ink-200 rounded-xl text-sm font-semibold text-ink-700 hover:bg-ink-50 transition-colors"
            >
              Explore Marketplace
            </button>
            <button
              onClick={() => navigate('/sell')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors"
            >
              Start Selling <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
