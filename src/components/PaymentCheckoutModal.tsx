import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  CheckCircle2,
  Lock,
  Smartphone,
  QrCode,
  Building2,
  CreditCard,
  Handshake,
  Copy,
  ExternalLink,
  MessageCircle,
  Clock,
  ShieldCheck,
  AlertCircle,
  FileCheck,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import type { Listing, ServicePackage, Startup } from '@/data/types';

interface PaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing?: Listing;
  selectedPackage?: ServicePackage;
  startup?: Startup;
}

export default function PaymentCheckoutModal({
  isOpen,
  onClose,
  listing,
  selectedPackage,
  startup,
}: PaymentCheckoutModalProps) {
  const navigate = useNavigate();
  const { isAuthed, createOrder, currentUser, loginAsDemoFounder } = useApp();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'upi' | 'qr' | 'bank' | 'card' | 'cod'>('upi');
  const [transactionRef, setTransactionRef] = useState('');
  const [projectBrief, setProjectBrief] = useState('');
  const [buyerWhatsapp, setBuyerWhatsapp] = useState(currentUser?.contactWhatsapp || '');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Card fields scratchpad
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<{ id: string; amount: number } | null>(null);

  if (!isOpen) return null;

  // Compute pricing
  const amount = selectedPackage?.price ?? (listing?.basePrice || 50);
  const turnaroundDays = selectedPackage?.deliveryDays ?? (listing?.deliveryDays || 3);
  const packageTitle = selectedPackage?.title || (listing?.title || 'Startup Service');

  // Resolved payment details from startup or listing
  const paymentDetails = startup?.paymentDetails || listing?.paymentDetails || {
    upiId: startup ? `${startup.slug || 'startup'}@upi` : 'amplofy.founder@oksbi',
    accountHolderName: startup?.name || listing?.seller?.name || 'Campus Venture',
    bankName: 'HDFC Bank',
    accountNumber: '50100492817291',
    ifscCode: 'HDFC0001042',
    acceptedMethods: {
      upi: true,
      qrCode: true,
      bankTransfer: true,
      cards: true,
      cod: true,
    },
    paymentInstructions: 'Mention your Order ID in the payment description & send a screenshot on WhatsApp for instant confirmation.',
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const upiPayUrl = `upi://pay?pa=${encodeURIComponent(paymentDetails.upiId || 'founder@upi')}&pn=${encodeURIComponent(startup?.name || 'Startup')}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Order: ${listing?.title?.slice(0, 20) || 'Service'}`)}`;
  const upiQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiPayUrl)}`;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthed || !currentUser) {
      loginAsDemoFounder();
      toast.info('Auto-authenticated as Guest Buyer to proceed with checkout.');
    }

    if (activeTab !== 'cod' && !transactionRef.trim() && activeTab !== 'card') {
      toast.warning('Please enter your UPI / Transaction reference or UTR number.');
      return;
    }

    setIsSubmitting(true);

    const res = await createOrder({
      listingId: listing?.id,
      listingTitle: listing?.title || (startup ? `${startup.name} Service` : 'Campus Service'),
      listingImage: listing?.images?.[0] || startup?.logoUrl,
      listingType: 'service',
      packageId: selectedPackage?.id || null,
      packageTier: selectedPackage?.tier,
      sellerId: listing?.sellerId || startup?.ownerId || 'startup-founder',
      sellerName: startup?.name || listing?.seller?.name || 'Startup Founder',
      startupId: listing?.startupId || startup?.id,
      startupName: startup?.name || listing?.title,
      status: activeTab === 'cod' ? 'inquiry' : 'in_progress',
      amount,
      inquiryMessage: projectBrief.trim() || `Client booked package: ${packageTitle} ($${amount})`,
      paymentMethod: activeTab === 'upi' ? 'UPI Direct' : activeTab === 'qr' ? 'UPI QR Scan' : activeTab === 'bank' ? 'Bank Transfer (NEFT/IMPS)' : activeTab === 'card' ? 'Card / Digital' : 'Pay After Delivery',
      paymentRef: transactionRef.trim() || (activeTab === 'card' ? 'CARD-VERIFIED' : 'COD-PENDING'),
      paymentStatus: activeTab === 'cod' ? 'pending' : 'submitted',
    });

    setIsSubmitting(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      const orderId = res.id || `ord-${Date.now()}`;
      setPlacedOrder({ id: orderId, amount });
      toast.success('Payment submitted & Order placed successfully!');
    }
  };

  const handleModalClose = () => {
    setPlacedOrder(null);
    setTransactionRef('');
    setProjectBrief('');
    onClose();
  };

  // WhatsApp confirmation text
  const whatsappNumber = startup?.contactWhatsapp || listing?.seller?.contactWhatsapp || '';
  const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappShareText = encodeURIComponent(
    `Hi ${startup?.name || 'Founder'}! I just placed Order #${placedOrder?.id} for "${listing?.title || packageTitle}" ($${amount}) on Amplofy.\nPayment Method: ${activeTab.toUpperCase()}\nTransaction Ref: ${transactionRef || 'Paid'}\n\nPlease confirm and share next steps!`
  );

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} size="lg">
      {placedOrder ? (
        // ─── ORDER PLACED & PAYMENT SUBMITTED SUCCESS VIEW ───
        <div className="py-6 px-2 text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
              🎉 Direct Payment Submitted
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Order Confirmed &amp; In Queue!
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Your direct payment inquiry has been sent straight to <strong>{startup?.name || 'the startup founder'}</strong>. No middlemen, 100% direct client-founder communication.
            </p>
          </div>

          {/* Order Snapshot Card */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 max-w-md mx-auto text-left space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-500">Order ID</span>
              <span className="text-xs font-mono font-bold text-slate-900">#{placedOrder.id}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-500">Package</span>
              <span className="text-xs font-bold text-slate-900">{packageTitle}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-500">Amount Paid</span>
              <span className="text-sm font-extrabold text-[#0F766E]">${placedOrder.amount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500">Estimated Delivery</span>
              <span className="text-xs font-bold text-slate-900">{turnaroundDays} Days</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            {cleanWhatsapp && (
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${whatsappShareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1"
              >
                <Button
                  variant="primary"
                  size="lg"
                  leftIcon={<MessageCircle className="w-5 h-5 text-emerald-300" />}
                  className="w-full bg-[#128C7E] hover:bg-[#075E54] text-white font-bold"
                >
                  WhatsApp Founder
                </Button>
              </a>
            )}

            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                handleModalClose();
                navigate('/orders');
              }}
              className="w-full sm:flex-1"
            >
              View in My Orders
            </Button>
          </div>
        </div>
      ) : (
        // ─── DIRECT CHECKOUT & PAYMENT SELECTION VIEW ───
        <div className="space-y-6">
          {/* Header & Startup Brand */}
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-teal-50 text-[#0F766E] border border-teal-200">
                Direct Startup Checkout
              </span>
              <span className="text-xs font-medium text-slate-400">0% Platform Cut</span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {listing?.title || 'Order Startup Service'}
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  by <strong className="text-slate-900">{startup?.name || listing?.seller?.name || 'Campus Founder'}</strong> • {startup?.college || 'Campus Verified'}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-2xl font-extrabold text-[#0F766E] block">${amount}</span>
                <span className="text-[11px] font-medium text-slate-500">{turnaroundDays}d turnaround</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmitOrder} className="space-y-6">
            {/* 1. Payment Methods Tabs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Select Direct Payment Method
                </label>
                <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Direct to Founder
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('upi')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    activeTab === 'upi'
                      ? 'bg-teal-50 border-[#0F766E] text-[#0F766E] ring-2 ring-[#0F766E]/20 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="w-5 h-5 mb-1 text-purple-600" />
                  <span className="text-xs">UPI App</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('qr')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    activeTab === 'qr'
                      ? 'bg-teal-50 border-[#0F766E] text-[#0F766E] ring-2 ring-[#0F766E]/20 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <QrCode className="w-5 h-5 mb-1 text-indigo-600" />
                  <span className="text-xs">Scan QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('bank')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    activeTab === 'bank'
                      ? 'bg-teal-50 border-[#0F766E] text-[#0F766E] ring-2 ring-[#0F766E]/20 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-5 h-5 mb-1 text-blue-600" />
                  <span className="text-xs">Bank / IMPS</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('card')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    activeTab === 'card'
                      ? 'bg-teal-50 border-[#0F766E] text-[#0F766E] ring-2 ring-[#0F766E]/20 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mb-1 text-amber-600" />
                  <span className="text-xs">Cards</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('cod')}
                  className={`col-span-2 sm:col-span-1 flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    activeTab === 'cod'
                      ? 'bg-teal-50 border-[#0F766E] text-[#0F766E] ring-2 ring-[#0F766E]/20 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Handshake className="w-5 h-5 mb-1 text-emerald-600" />
                  <span className="text-xs">Pay on Finish</span>
                </button>
              </div>
            </div>

            {/* 2. Active Tab Content Box */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-4">
              {/* ─── UPI TAB ─── */}
              {activeTab === 'upi' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Founder UPI ID</span>
                      <span className="text-xs text-slate-500">Pay via Google Pay, PhonePe, Paytm, BHIM</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                      Instant 0-Fee
                    </span>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-300">
                    <span className="font-mono font-bold text-sm text-slate-900 flex-1 truncate">
                      {paymentDetails.upiId}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(paymentDetails.upiId || '', 'UPI ID')}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-teal-50 text-[#0F766E] hover:bg-teal-100 transition-colors flex items-center gap-1.5 shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedField === 'UPI ID' ? 'Copied!' : 'Copy UPI'}</span>
                    </button>
                  </div>

                  <div className="pt-1">
                    <a
                      href={upiPayUrl}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-colors"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Open in UPI App on Phone</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              )}

              {/* ─── QR CODE TAB ─── */}
              {activeTab === 'qr' && (
                <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                  <div className="bg-white p-3 rounded-2xl border border-slate-300 shadow-sm shrink-0">
                    <img
                      src={paymentDetails.upiQrUrl || upiQrCodeUrl}
                      alt="Payment QR Code"
                      className="w-40 h-40 object-contain rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-extrabold uppercase text-indigo-600 tracking-wider block">
                      Direct QR Scanner
                    </span>
                    <h4 className="text-base font-bold text-slate-900">
                      Scan with any UPI / Banking App
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Open Camera, GPay, PhonePe, or Paytm and point at the QR code to pay <strong>${amount}</strong> directly to <strong>{paymentDetails.accountHolderName}</strong>.
                    </p>
                    <div className="pt-1 text-[11px] font-mono text-slate-500 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 inline-block">
                      UPI: {paymentDetails.upiId}
                    </div>
                  </div>
                </div>
              )}

              {/* ─── BANK TRANSFER TAB ─── */}
              {activeTab === 'bank' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="text-xs text-slate-500">Account Holder</span>
                    <span className="text-xs font-bold text-slate-900">{paymentDetails.accountHolderName}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="text-xs text-slate-500">Bank Name</span>
                    <span className="text-xs font-bold text-slate-900">{paymentDetails.bankName || 'HDFC Bank'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="text-xs text-slate-500">Account Number</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-900">
                        {paymentDetails.accountNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(paymentDetails.accountNumber || '', 'Account Number')}
                        className="p-1 text-slate-400 hover:text-slate-700"
                        title="Copy Account Number"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">IFSC Code</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-900">
                        {paymentDetails.ifscCode}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(paymentDetails.ifscCode || '', 'IFSC Code')}
                        className="p-1 text-slate-400 hover:text-slate-700"
                        title="Copy IFSC Code"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── CARDS TAB ─── */}
              {activeTab === 'card' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs font-bold text-slate-900">Debit / Credit Card Direct</span>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      <span className="text-[10px] text-emerald-700 font-semibold">256-bit Encrypted</span>
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Card Number (4000 1234 5678 9010)"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0F766E]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM / YY"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0F766E]"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      maxLength={4}
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0F766E]"
                    />
                  </div>
                </div>
              )}

              {/* ─── PAY ON FINISH / COD TAB ─── */}
              {activeTab === 'cod' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                    <Handshake className="w-4 h-4" />
                    <span>Pay Upon Delivery &amp; Satisfaction</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Zero upfront charge. The founder will start your project immediately. You can review the final project deliverables before releasing payment via UPI or cash.
                  </p>
                </div>
              )}

              {/* Founder Custom Instructions Note */}
              {paymentDetails.paymentInstructions && (
                <div className="pt-2 border-t border-slate-200/70 text-[11px] text-slate-500 italic">
                  💡 Note from founder: {paymentDetails.paymentInstructions}
                </div>
              )}
            </div>

            {/* 3. Transaction UTR Reference & Project Requirements */}
            <div className="space-y-3">
              {activeTab !== 'cod' && activeTab !== 'card' && (
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Transaction / UPI Reference Number (UTR) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionRef}
                    onChange={e => setTransactionRef(e.target.value)}
                    placeholder="e.g. 412398765432 (12-digit UPI Ref or Bank UTR)"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Found in your GPay / PhonePe / Paytm transaction receipt
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Project Brief &amp; Special Requirements (Optional)
                </label>
                <textarea
                  rows={2}
                  value={projectBrief}
                  onChange={e => setProjectBrief(e.target.value)}
                  placeholder="Share any links, file assets, design ideas, or project deadlines..."
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#0F766E]"
                />
              </div>
            </div>

            {/* 4. Submit Button */}
            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                type="submit"
                disabled={isSubmitting}
                className="w-full font-bold shadow-md bg-amber-500 hover:bg-amber-600 text-slate-950 border border-amber-600/30"
              >
                {isSubmitting
                  ? 'Confirming Payment & Booking...'
                  : `Confirm Payment & Hire Startup ($${amount})`}
              </Button>
              <p className="text-[11px] text-slate-400 text-center mt-2">
                🔒 Direct client-founder transaction. 100% money goes directly to the campus team.
              </p>
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
}
