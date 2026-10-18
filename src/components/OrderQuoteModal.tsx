import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, Send, AlertCircle, Lock } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import type { Listing, ServicePackage, Startup } from '@/data/types';

interface OrderQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing?: Listing;
  selectedPackage?: ServicePackage;
  startup?: Startup;
  mode: 'order' | 'quote';
}

export default function OrderQuoteModal({
  isOpen,
  onClose,
  listing,
  selectedPackage,
  startup,
  mode,
}: OrderQuoteModalProps) {
  const { isAuthed, createOrder, currentUser } = useApp();
  const { toast } = useToast();

  const [inquiryMessage, setInquiryMessage] = useState('');
  const [customBudget, setCustomBudget] = useState(
    selectedPackage ? String(selectedPackage.price) : listing ? String(listing.basePrice) : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  if (!isAuthed) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <div className="text-center py-4 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0F766E] flex items-center justify-center mx-auto border border-teal-100">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Sign in to {mode === 'order' ? 'place an order' : 'request a quote'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Please sign in with your campus account to submit this order inquiry to the seller.
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryMessage.trim()) {
      toast.error('Please describe what you need in the message.');
      return;
    }

    setIsSubmitting(true);
    const amount = parseFloat(customBudget) || (selectedPackage ? selectedPackage.price : listing?.basePrice || 0);

    const res = await createOrder({
      listingId: listing?.id,
      listingTitle: listing?.title || (startup ? `${startup.name} Custom Project` : 'Campus Service'),
      listingType: listing?.type || 'service',
      packageId: selectedPackage?.id || null,
      packageTier: selectedPackage?.tier,
      sellerId: listing?.sellerId || startup?.ownerId,
      startupId: listing?.startupId || startup?.id,
      status: 'inquiry',
      amount,
      inquiryMessage: inquiryMessage.trim(),
    });

    setIsSubmitting(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      setSuccess(true);
      toast.success(
        mode === 'order'
          ? 'Order inquiry submitted to seller!'
          : 'Custom quote request sent to seller!'
      );
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setInquiryMessage('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        success
          ? 'Inquiry Submitted!'
          : mode === 'order'
          ? 'Place Order Inquiry'
          : 'Request Custom Quote'
      }
      subtitle={
        success
          ? 'The seller has been notified'
          : `For: ${listing?.title || startup?.name || 'Campus Service'}`
      }
      size="md"
    >
      {success ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">
              {mode === 'order' ? 'Your order inquiry has been sent!' : 'Quote request submitted!'}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
              The seller will review your requirements and respond via order notes or direct contact. You can track this inquiry anytime under Orders.
            </p>
          </div>
          <div className="pt-3 flex gap-2 justify-center">
            <Link to="/orders" onClick={handleClose}>
              <Button variant="primary" size="md">
                View in Orders
              </Button>
            </Link>
            <Button variant="outline" size="md" onClick={handleClose}>
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Order Summary Pill */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-900 truncate">
                {selectedPackage ? `${selectedPackage.tier.toUpperCase()} TIER: ${selectedPackage.title}` : listing?.title}
              </p>
              <p className="text-[11px] text-slate-500">
                Provider: {listing?.seller?.name || 'Campus Student'}
              </p>
            </div>
            <span className="font-bold text-sm text-[#0F766E] shrink-0">
              ${selectedPackage ? selectedPackage.price : listing?.basePrice}
            </span>
          </div>

          {/* Custom Budget for Quote mode */}
          {mode === 'quote' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Target Budget ($)
              </label>
              <input
                type="number"
                value={customBudget}
                onChange={e => setCustomBudget(e.target.value)}
                placeholder="e.g. 150"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0F766E]"
                required
              />
            </div>
          )}

          {/* Inquiry Message Textbox */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Project Details &amp; Requirements *
            </label>
            <textarea
              rows={4}
              value={inquiryMessage}
              onChange={e => setInquiryMessage(e.target.value)}
              placeholder="Describe your requirements, schedule expectations, deadlines, or any questions you have for the provider..."
              className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0F766E]"
              required
            />
          </div>

          {/* Safety Notice */}
          <div className="p-3 bg-teal-50/50 rounded-lg border border-teal-100 flex items-start gap-2 text-xs text-teal-900">
            <AlertCircle className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
            <p className="leading-snug">
              Order notes track progress chronologically with deliverables. Zero fee for students.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="md" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              leftIcon={<Send className="w-4 h-4" />}
            >
              {mode === 'order' ? 'Submit Order Inquiry' : 'Send Quote Request'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
