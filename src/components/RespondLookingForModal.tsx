import React, { useState } from 'react';
import {
  X, Send, PhoneCall, Mail, Instagram, ShieldCheck,
  ExternalLink, CheckCircle, Sparkles, AlertCircle
} from 'lucide-react';
import type { StartupLookingFor } from '@/data/types';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { LOOKING_FOR_CATEGORY_CONFIG } from '@/components/LookingForCard';

interface RespondLookingForModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: StartupLookingFor | null;
}

export const RespondLookingForModal: React.FC<RespondLookingForModalProps> = ({
  isOpen,
  onClose,
  request,
}) => {
  const { currentUser, addLookingForResponse } = useApp();
  const { showToast } = useToast();

  const [applicantName, setApplicantName] = useState(currentUser?.name || '');
  const [applicantEmail, setApplicantEmail] = useState(currentUser?.contactEmail || currentUser?.email || '');
  const [applicantWhatsapp, setApplicantWhatsapp] = useState(currentUser?.contactWhatsapp || '');
  const [applicantInstagram, setApplicantInstagram] = useState(currentUser?.contactInstagram || '');
  const [applicantCollege, setApplicantCollege] = useState(currentUser?.college || 'Main Campus');
  const [applicantMajor, setApplicantMajor] = useState(currentUser?.department || '');
  const [roleOrPitch, setRoleOrPitch] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !request) return null;

  const catConfig = LOOKING_FOR_CATEGORY_CONFIG[request.type] || LOOKING_FOR_CATEGORY_CONFIG.other;

  // Pre-fill message templates for direct contact
  const prefilledText = encodeURIComponent(
    `Hi ${request.startupName}! I saw your "${request.title}" opportunity on AMPLOFY. I'm a student at ${applicantCollege || 'campus'} and would love to connect!`
  );
  const whatsappUrl = request.contactWhatsapp
    ? `https://wa.me/${request.contactWhatsapp.replace(/[^0-9]/g, '')}?text=${prefilledText}`
    : null;
  const emailSubject = encodeURIComponent(`[AMPLOFY] Interested in: ${request.title}`);
  const emailBody = encodeURIComponent(
    `Hi ${request.startupName} Team,\n\nI saw your listing on AMPLOFY Looking For board: "${request.title}".\n\nI'd love to collaborate! Here is a bit about me:\n- Name: ${applicantName}\n- College: ${applicantCollege}\n- Major: ${applicantMajor}\n- Portfolio / Work: ${portfolioUrl}\n\nLooking forward to speaking with you!\n\nBest,\n${applicantName}`
  );
  const mailtoUrl = request.contactEmail
    ? `mailto:${request.contactEmail}?subject=${emailSubject}&body=${emailBody}`
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleOrPitch.trim()) {
      showToast('Please provide a short pitch or intro.', 'error');
      return;
    }
    if (!applicantEmail.trim()) {
      showToast('Please provide your contact email.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await addLookingForResponse({
        requestId: request.id,
        startupId: request.startupId,
        startupName: request.startupName,
        applicantName,
        applicantEmail,
        applicantWhatsapp,
        applicantInstagram,
        applicantCollege,
        applicantMajor,
        roleOrPitch,
        portfolioUrl,
      });

      if (res.error) {
        showToast(res.error, 'error');
      } else {
        setSubmitted(true);
        showToast(`Your response was sent to ${request.startupName}!`, 'success');
      }
    } catch (err) {
      showToast('Failed to submit response. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setRoleOrPitch('');
    setPortfolioUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <img
              src={request.startupLogo}
              alt={request.startupName}
              className="w-10 h-10 rounded-xl object-cover border border-slate-200"
            />
            <div>
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                <span>{request.startupName}</span>
                {request.isStartupVerified && (
                  <ShieldCheck size={14} className="text-teal-600 fill-teal-50" />
                )}
              </div>
              <p className="text-xs text-slate-500">{request.startupCollege}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-teal-100">
              <CheckCircle size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Connection Sent!</h3>
              <p className="text-slate-600 text-sm mt-1.5 max-w-sm mx-auto leading-relaxed">
                Your pitch and contact details have been shared directly with <span className="font-semibold text-slate-800">{request.startupName}</span>. They will review your application on their dashboard.
              </p>
            </div>

            {/* Direct contact recommendation */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left text-xs text-slate-600 space-y-2">
              <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" />
                Pro-tip: Reach out directly for faster response!
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <PhoneCall size={13} /> Message on WhatsApp
                  </a>
                )}
                {mailtoUrl && (
                  <a
                    href={mailtoUrl}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-lg transition-colors"
                  >
                    <Mail size={13} /> Send Email
                  </a>
                )}
              </div>
            </div>

            <Button variant="primary" onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            {/* Opportunity summary card */}
            <div className="bg-teal-50/50 rounded-xl p-3.5 border border-teal-100/80">
              <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold border ${catConfig.bg} ${catConfig.text} ${catConfig.border} mb-1.5`}>
                {catConfig.label}
              </span>
              <h4 className="font-bold text-slate-900 text-sm">{request.title}</h4>
              {request.compensationDetails && (
                <p className="text-xs text-teal-800 mt-1 font-medium">
                  Perks: {request.compensationDetails}
                </p>
              )}
            </div>

            {/* Direct fast-contact row */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs font-semibold text-slate-500">Quick Contact:</span>
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-md border border-emerald-200 transition-colors"
                >
                  <PhoneCall size={12} /> WhatsApp
                </a>
              )}
              {mailtoUrl && (
                <a
                  href={mailtoUrl}
                  className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-2 py-1 rounded-md border border-teal-200 transition-colors"
                >
                  <Mail size={12} /> Email
                </a>
              )}
              {request.contactInstagram && (
                <a
                  href={`https://instagram.com/${request.contactInstagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-pink-700 hover:text-pink-800 bg-pink-50 hover:bg-pink-100 px-2 py-1 rounded-md border border-pink-200 transition-colors"
                >
                  <Instagram size={12} /> @{request.contactInstagram.replace('@', '')}
                </a>
              )}
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-3.5">
              {/* Applicant Name & College */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={e => setApplicantName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500"
                    placeholder="e.g. Maya Chen"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Campus & Major
                  </label>
                  <input
                    type="text"
                    value={applicantMajor ? `${applicantCollege} (${applicantMajor})` : applicantCollege}
                    onChange={e => setApplicantCollege(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500"
                    placeholder="e.g. UC Berkeley, CS Junior"
                  />
                </div>
              </div>

              {/* Pitch / Message */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  How can you help? Pitch & Experience *
                </label>
                <textarea
                  required
                  rows={3}
                  value={roleOrPitch}
                  onChange={e => setRoleOrPitch(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500 resize-none"
                  placeholder="Tell the founder why you're interested, your background, and how you can contribute..."
                />
              </div>

              {/* Portfolio / Link */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Portfolio / GitHub / LinkedIn / Social Link
                </label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={e => setPortfolioUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500"
                  placeholder="https://github.com/yourhandle or Figma / Behance"
                />
              </div>

              {/* Contact info row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Campus Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={applicantEmail}
                    onChange={e => setApplicantEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500"
                    placeholder="you@campus.edu"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp / Phone (optional)
                  </label>
                  <input
                    type="tel"
                    value={applicantWhatsapp}
                    onChange={e => setApplicantWhatsapp(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>

            {/* Safety reminder */}
            <div className="flex items-start gap-2 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/60 text-[11px] text-amber-800">
              <AlertCircle size={14} className="shrink-0 mt-0.5 text-amber-600" />
              <span>AMPLOFY connects verified campus peers. Meet in public campus common spaces or official labs for initial collaborative chats.</span>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={submitting}
                className="flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white"
              >
                <Send size={14} />
                <span>{submitting ? 'Sending...' : 'Send Pitch to Founder'}</span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
