import { Link } from 'react-router-dom';
import { Mail, MessageCircle, Instagram, ShieldCheck, AlertTriangle, ExternalLink, Lock } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';

interface ContactSellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  seller?: {
    id?: string;
    name: string;
    avatar?: string;
    department?: string;
    college?: string;
    accountType?: string;
    isVerified?: boolean;
    contactWhatsapp?: string;
    contactEmail?: string;
    contactInstagram?: string;
    showContact?: boolean;
  };
  listingTitle?: string;
}

export default function ContactSellerModal({
  isOpen,
  onClose,
  seller,
  listingTitle = 'Campus Listing',
}: ContactSellerModalProps) {
  const { isAuthed } = useApp();

  if (!isOpen) return null;

  // If visitor is logged out, prompt login
  if (!isAuthed) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <div className="text-center py-4 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0F766E] flex items-center justify-center mx-auto border border-teal-100">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Sign in to contact seller
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              To keep our campus marketplace safe, please log in with your campus account to view seller contact details.
            </p>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <Link to="/signin" onClick={onClose}>
              <Button variant="primary" size="md" className="w-full">
                Log in to continue
              </Button>
            </Link>
            <Link to="/join" onClick={onClose}>
              <Button variant="secondary" size="md" className="w-full">
                Create free account
              </Button>
            </Link>
          </div>
        </div>
      </Modal>
    );
  }

  const cleanWhatsapp = seller?.contactWhatsapp?.replace(/[^0-9]/g, '') || '';
  const prefilledText = encodeURIComponent(`Hi ${seller?.name || 'there'}, I saw your listing for "${listingTitle}" on AMPLOFY and I am interested!`);
  const whatsappUrl = cleanWhatsapp ? `https://wa.me/${cleanWhatsapp}?text=${prefilledText}` : null;
  const emailUrl = seller?.contactEmail
    ? `mailto:${seller.contactEmail}?subject=${encodeURIComponent(`AMPLOFY Inquiry: ${listingTitle}`)}&body=${prefilledText}`
    : null;
  const instagramUrl = seller?.contactInstagram
    ? `https://instagram.com/${seller.contactInstagram.replace('@', '')}`
    : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Contact Seller"
      subtitle="Connect directly through verified campus channels"
      size="md"
    >
      <div className="space-y-5">
        {/* Seller Mini Profile */}
        <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <Avatar
            src={seller?.avatar}
            name={seller?.name}
            size="lg"
            verified={seller?.isVerified}
            isStartup={seller?.accountType === 'startup'}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-slate-900 text-sm truncate">
                {seller?.name || 'Campus Member'}
              </h4>
              {seller?.isVerified && (
                <ShieldCheck className="w-4 h-4 text-[#0F766E] shrink-0" title="Verified Campus Member" />
              )}
            </div>
            <p className="text-xs text-slate-500 truncate">
              {seller?.department} • {seller?.college || 'University Campus'}
            </p>
          </div>
        </div>

        {/* Contact Methods List */}
        <div className="space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Available Contact Channels
          </p>

          {/* WhatsApp */}
          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-950 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-950">Chat on WhatsApp</p>
                  <p className="text-xs text-emerald-700">{seller?.contactWhatsapp}</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
            </a>
          ) : null}

          {/* Email */}
          {emailUrl ? (
            <a
              href={emailUrl}
              className="flex items-center justify-between p-3.5 rounded-xl border border-teal-200 bg-teal-50/50 hover:bg-teal-50 text-teal-950 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#0F766E] text-white flex items-center justify-center shadow-xs">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-teal-950">Send Campus Email</p>
                  <p className="text-xs text-teal-700">{seller?.contactEmail}</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#0F766E] group-hover:translate-x-0.5 transition-transform" />
            </a>
          ) : null}

          {/* Instagram */}
          {instagramUrl ? (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-rose-950 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xs">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-rose-950">Instagram Profile</p>
                  <p className="text-xs text-rose-700">@{seller?.contactInstagram?.replace('@', '')}</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-rose-600 group-hover:translate-x-0.5 transition-transform" />
            </a>
          ) : null}

          {!whatsappUrl && !emailUrl && !instagramUrl && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
              This seller has chosen to keep direct contact private. You can place a formal order or custom quote request below.
            </div>
          )}
        </div>

        {/* Safety Tips Box */}
        <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-bold">Campus Safety Note:</span> Meet in public campus places (such as the student center, library lobby, or dining hall) and never pay outside the platform for services.
          </p>
        </div>
      </div>
    </Modal>
  );
}
