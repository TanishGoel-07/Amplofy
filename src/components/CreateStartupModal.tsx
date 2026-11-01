import React, { useState } from 'react';
import {
  X,
  Rocket,
  Building2,
  Sparkles,
  Globe,
  Instagram,
  MessageCircle,
  Mail,
  Users,
  Check,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  QrCode,
  CreditCard,
  Handshake,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { CATEGORIES, type Startup } from '@/data/types';
import { useToast } from '@/components/ui/Toast';

interface CreateStartupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (startup: Startup) => void;
}

const LOGO_PRESETS = [
  { label: 'Tech & AI', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=compress&cs=tinysrgb&w=300' },
  { label: 'Design Studio', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=compress&cs=tinysrgb&w=300' },
  { label: 'Creative Media', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=compress&cs=tinysrgb&w=300' },
  { label: 'Venture & Growth', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=compress&cs=tinysrgb&w=300' },
  { label: 'Robotics & Hardware', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=compress&cs=tinysrgb&w=300' },
];

const COVER_PRESETS = [
  { label: 'Modern Studio', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=compress&cs=tinysrgb&w=1200' },
  { label: 'Tech Workspace', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=compress&cs=tinysrgb&w=1200' },
  { label: 'Design Lab', url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=compress&cs=tinysrgb&w=1200' },
  { label: 'Code & Systems', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=compress&cs=tinysrgb&w=1200' },
];

export default function CreateStartupModal({ isOpen, onClose, onSuccess }: CreateStartupModalProps) {
  const { currentUser, createStartup } = useApp();
  const { toast } = useToast();

  const [step, setStep] = useState<1 | 2>(1);

  // STEP 1: Basic info
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]?.name || 'Development');
  const [college, setCollege] = useState(currentUser?.college || 'Stanford University');
  const [teamSize, setTeamSize] = useState(2);
  const [description, setDescription] = useState('');

  // Media
  const [selectedLogo, setSelectedLogo] = useState(LOGO_PRESETS[0].url);
  const [customLogoUrl, setCustomLogoUrl] = useState('');
  const [selectedCover, setSelectedCover] = useState(COVER_PRESETS[0].url);
  const [customCoverUrl, setCustomCoverUrl] = useState('');

  // Contact & Social
  const [contactWhatsapp, setContactWhatsapp] = useState(currentUser?.contactWhatsapp || '');
  const [contactEmail, setContactEmail] = useState(currentUser?.contactEmail || currentUser?.email || '');
  const [contactInstagram, setContactInstagram] = useState(currentUser?.contactInstagram || '');
  const [website, setWebsite] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [showContact, setShowContact] = useState(true);

  // STEP 2: Payment Details (Direct Payout Setup)
  const [upiId, setUpiId] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [bankName, setBankName] = useState('HDFC Bank');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [customQrUrl, setCustomQrUrl] = useState('');
  const [acceptUpi, setAcceptUpi] = useState(true);
  const [acceptQr, setAcceptQr] = useState(true);
  const [acceptBank, setAcceptBank] = useState(true);
  const [acceptCard, setAcceptCard] = useState(true);
  const [acceptCod, setAcceptCod] = useState(true);
  const [paymentInstructions, setPaymentInstructions] = useState(
    'Mention your Order ID in the payment description & send a screenshot on WhatsApp for instant confirmation.'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter a name for your campus venture.');
      return;
    }
    if (!tagline.trim()) {
      setError('Please provide a punchy one-line tagline.');
      return;
    }
    if (!description.trim()) {
      setError('Please write a brief description of what your startup offers.');
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    setIsSubmitting(true);

    try {
      const finalLogo = customLogoUrl.trim() || selectedLogo;
      const finalCover = customCoverUrl.trim() || selectedCover;

      const paymentDetails = {
        upiId: upiId.trim() || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@upi`,
        accountHolderName: accountHolderName.trim() || name.trim(),
        bankName: bankName.trim() || 'HDFC Bank',
        accountNumber: accountNumber.trim() || '50100492817291',
        ifscCode: ifscCode.trim() || 'HDFC0001042',
        upiQrUrl: customQrUrl.trim() || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${encodeURIComponent(upiId.trim() || 'founder@upi')}&pn=${encodeURIComponent(name.trim())}`,
        acceptedMethods: {
          upi: acceptUpi,
          qrCode: acceptQr,
          bankTransfer: acceptBank,
          cards: acceptCard,
          cod: acceptCod,
        },
        paymentInstructions: paymentInstructions.trim(),
      };

      const res = await createStartup({
        name: name.trim(),
        tagline: tagline.trim(),
        category,
        college: college.trim() || 'Campus University',
        teamSize: Number(teamSize) || 1,
        description: description.trim(),
        logoUrl: finalLogo,
        coverUrl: finalCover,
        contactWhatsapp: contactWhatsapp.trim(),
        contactEmail: contactEmail.trim(),
        contactInstagram: contactInstagram.trim().replace(/^@/, ''),
        website: website.trim(),
        socialLinks: {
          instagram: contactInstagram.trim().replace(/^@/, ''),
          linkedin: linkedin.trim(),
        },
        showContact,
        paymentDetails,
      });

      if (res.error) {
        setError(res.error);
        setIsSubmitting(false);
        return;
      }

      toast.success(`🎉 ${name} registered with live payment channels! Buyers can now hire you directly.`);
      if (res.startup && onSuccess) {
        onSuccess(res.startup);
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to register startup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-teal-50/50 via-white to-amber-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0F766E] text-white flex items-center justify-center shadow-xs">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  {step === 1 ? 'Step 1 of 2: Venture Basics' : 'Step 2 of 2: Payment & Payout Setup'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                {step === 1 ? 'Register Campus Startup' : 'Setup Direct Client Payments'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={step === 1 ? handleNextStep : handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 ? (
            // ─── STEP 1: VENTURE BASICS ───
            <div className="space-y-6">
              {/* Section 1: Venture Overview */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  1. Venture Basics
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Startup / Agency Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Apex Design Labs, CodeCrafters"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Punchy One-Line Tagline <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={tagline}
                    onChange={e => setTagline(e.target.value)}
                    placeholder="e.g. Full-stack web & mobile apps engineered by top CS seniors"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      College / University Campus
                    </label>
                    <input
                      type="text"
                      value={college}
                      onChange={e => setCollege(e.target.value)}
                      placeholder="e.g. Stanford University"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Team Size (Co-founders &amp; Members)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={teamSize}
                      onChange={e => setTeamSize(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    About the Venture <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe your startup's core mission, capabilities, past projects, and services offered to campus clients..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
              </div>

              {/* Section 2: Logo & Visual Identity */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  2. Visual Branding
                </h3>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Choose Brand Avatar
                  </label>
                  <div className="grid grid-cols-5 gap-2.5">
                    {LOGO_PRESETS.map(p => {
                      const isSelected = selectedLogo === p.url && !customLogoUrl;
                      return (
                        <button
                          key={p.url}
                          type="button"
                          onClick={() => {
                            setSelectedLogo(p.url);
                            setCustomLogoUrl('');
                          }}
                          className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                            isSelected ? 'border-[#0F766E] ring-2 ring-[#0F766E]/20' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#0F766E] text-white flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Banner / Cover */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Choose Cover Banner
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {COVER_PRESETS.map(p => {
                      const isSelected = selectedCover === p.url && !customCoverUrl;
                      return (
                        <button
                          key={p.url}
                          type="button"
                          onClick={() => {
                            setSelectedCover(p.url);
                            setCustomCoverUrl('');
                          }}
                          className={`relative h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                            isSelected ? 'border-[#0F766E] ring-2 ring-[#0F766E]/20' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                          <div className="absolute inset-x-0 bottom-0 bg-slate-900/60 text-white text-[10px] font-semibold py-0.5 text-center">
                            {p.label}
                          </div>
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#0F766E] text-white flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Section 3: Direct Client Contact Details */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    3. Direct Client Channels
                  </h3>
                  <p className="text-xs text-slate-500">
                    Student clients reach your team directly over WhatsApp &amp; Email.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      WhatsApp Contact Number
                    </label>
                    <div className="relative">
                      <MessageCircle className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={contactWhatsapp}
                        onChange={e => setContactWhatsapp(e.target.value)}
                        placeholder="+91 9876543210"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Official Venture Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-sky-600 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={e => setContactEmail(e.target.value)}
                        placeholder="team@yourventure.co"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 1 Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button type="button" variant="ghost" size="md" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="font-bold bg-[#0F766E] hover:bg-[#115E59]"
                >
                  Next: Setup Payment Methods
                </Button>
              </div>
            </div>
          ) : (
            // ─── STEP 2: PAYMENT & PAYOUT DETAILS ───
            <div className="space-y-6 animate-fade-in">
              <div className="bg-gradient-to-r from-teal-50 to-amber-50 p-4 rounded-2xl border border-teal-100 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">
                    How will clients pay your startup?
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    When buyers hire your services, they will be directed to pay you directly via these payment options. <strong>Zero commission or platform cuts.</strong>
                  </p>
                </div>
              </div>

              {/* UPI & Payee Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Startup UPI ID (GPay / PhonePe / Paytm) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-purple-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      placeholder="e.g. yourstartup@oksbi or 9876543210@paytm"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Account Holder / Payee Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={accountHolderName}
                    onChange={e => setAccountHolderName(e.target.value)}
                    placeholder={name || 'Full legal name or startup entity'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
              </div>

              {/* Bank Details */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Bank Account for IMPS / NEFT Direct Transfer
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={e => setBankName(e.target.value)}
                      placeholder="e.g. HDFC Bank, SBI"
                      className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-slate-200 focus:outline-none focus:border-[#0F766E]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">Account Number</label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={e => setAccountNumber(e.target.value)}
                      placeholder="e.g. 50100492817291"
                      className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-slate-200 focus:outline-none focus:border-[#0F766E]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">IFSC Code</label>
                    <input
                      type="text"
                      value={ifscCode}
                      onChange={e => setIfscCode(e.target.value)}
                      placeholder="e.g. HDFC0001042"
                      className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-slate-200 focus:outline-none focus:border-[#0F766E]"
                    />
                  </div>
                </div>
              </div>

              {/* Accepted Methods Checkboxes */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Accepted Payment Methods
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <label className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={acceptUpi}
                      onChange={e => setAcceptUpi(e.target.checked)}
                      className="w-4 h-4 text-[#0F766E] rounded"
                    />
                    <span>UPI (GPay / PhonePe)</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={acceptQr}
                      onChange={e => setAcceptQr(e.target.checked)}
                      className="w-4 h-4 text-[#0F766E] rounded"
                    />
                    <span>Direct QR Scan</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={acceptBank}
                      onChange={e => setAcceptBank(e.target.checked)}
                      className="w-4 h-4 text-[#0F766E] rounded"
                    />
                    <span>Bank Transfer (IMPS)</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={acceptCard}
                      onChange={e => setAcceptCard(e.target.checked)}
                      className="w-4 h-4 text-[#0F766E] rounded"
                    />
                    <span>Debit &amp; Credit Cards</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer text-xs font-medium text-slate-700 col-span-2 sm:col-span-1">
                    <input
                      type="checkbox"
                      checked={acceptCod}
                      onChange={e => setAcceptCod(e.target.checked)}
                      className="w-4 h-4 text-[#0F766E] rounded"
                    />
                    <span>Pay After Delivery</span>
                  </label>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Payment Instructions / Notes for Clients
                </label>
                <input
                  type="text"
                  value={paymentInstructions}
                  onChange={e => setPaymentInstructions(e.target.value)}
                  placeholder="e.g. Mention Order ID in UPI remark & send screenshot on WhatsApp"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              {/* Step 2 Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => setStep(1)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  leftIcon={<Rocket className="w-4 h-4" />}
                  className="font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 border border-amber-600/30"
                >
                  {isSubmitting ? 'Registering...' : 'Launch Startup & Activate Payments'}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
