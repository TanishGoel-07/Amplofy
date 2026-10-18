import React, { useState } from 'react';
import {
  X, Plus, Sparkles, Building2, Coins, Clock, MapPin,
  CheckCircle, Rocket, Palette, Megaphone, FlaskConical,
  ShoppingBag, MessageSquareQuote, Handshake
} from 'lucide-react';
import type { LookingForCategory, CompensationType, LookingForLocationType } from '@/data/types';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';

interface CreateLookingForModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedStartupId?: string;
}

const CATEGORY_OPTIONS: { id: LookingForCategory; label: string; desc: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'co-founder', label: 'Co-Founder', desc: 'Find a technical or business co-founder', icon: Rocket },
  { id: 'designer-dev', label: 'Designer or Developer', desc: 'UI/UX, apparel, graphic, or web/mobile dev', icon: Palette },
  { id: 'marketing', label: 'Marketing Collaborators', desc: 'Campus ambassadors, TikTok, outreach leads', icon: Megaphone },
  { id: 'beta-testers', label: 'Beta Testers', desc: 'Students to test your app or prototype', icon: FlaskConical },
  { id: 'first-customers', label: 'First Customers', desc: 'Early campus adopters, pilot discounts', icon: ShoppingBag },
  { id: 'product-feedback', label: 'Product Feedback', desc: 'Review sessions on new features or designs', icon: MessageSquareQuote },
  { id: 'startup-collab', label: 'Startup Collaboration', desc: 'Cross-promote or partner with another venture', icon: Handshake },
];

const COMPENSATION_OPTIONS: { id: CompensationType; label: string }[] = [
  { id: 'paid', label: '💰 Paid / Hourly / Project' },
  { id: 'equity', label: '📈 Equity Pool' },
  { id: 'revenue-share', label: '🏷️ Revenue / Profit Share' },
  { id: 'free-product', label: '🎁 Free Product / Perks' },
  { id: 'college-credit', label: '🎓 College / Research Credit' },
  { id: 'unpaid-collab', label: '🤝 Mutual Creative Collab' },
];

export const CreateLookingForModal: React.FC<CreateLookingForModalProps> = ({
  isOpen,
  onClose,
  preselectedStartupId,
}) => {
  const { startups, currentUser, addLookingForRequest } = useApp();
  const { showToast } = useToast();

  // Find user's startups or default to list
  const userStartups = startups.filter(s => s.ownerId === currentUser?.id);
  const availableStartups = userStartups.length > 0 ? userStartups : startups;

  const [selectedStartupId, setSelectedStartupId] = useState(
    preselectedStartupId || availableStartups[0]?.id || ''
  );
  const [type, setType] = useState<LookingForCategory>('designer-dev');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [compensationType, setCompensationType] = useState<CompensationType>('paid');
  const [compensationDetails, setCompensationDetails] = useState('');
  const [timeCommitment, setTimeCommitment] = useState('5-10 hrs/week');
  const [locationType, setLocationType] = useState<LookingForLocationType>('hybrid');
  const [campus, setCampus] = useState(currentUser?.college || 'Main Campus');
  const [contactWhatsapp, setContactWhatsapp] = useState(currentUser?.contactWhatsapp || '');
  const [contactEmail, setContactEmail] = useState(currentUser?.contactEmail || currentUser?.email || '');
  const [contactInstagram, setContactInstagram] = useState(currentUser?.contactInstagram || '');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Please fill out the title and description.', 'error');
      return;
    }

    const startup = startups.find(s => s.id === selectedStartupId) || availableStartups[0];
    if (!startup) {
      showToast('Please select a startup.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const skillsNeeded = skillsInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const res = await addLookingForRequest({
        startupId: startup.id,
        startupName: startup.name,
        startupSlug: startup.slug,
        startupLogo: startup.logoUrl,
        startupCollege: startup.college,
        startupCategory: startup.category,
        isStartupVerified: startup.isVerified,
        type,
        title,
        description,
        skillsNeeded,
        compensationType,
        compensationDetails,
        timeCommitment,
        locationType,
        campus,
        contactWhatsapp,
        contactEmail,
        contactInstagram,
        showContact: true,
      });

      if (res.error) {
        showToast(res.error, 'error');
      } else {
        showToast('Looking For opportunity posted to campus board!', 'success');
        onClose();
      }
    } catch (err) {
      showToast('Failed to create request. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Sparkles size={18} className="text-teal-600" />
              Post a "Looking For" Request
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Publish structured collaborator, co-founder, or feedback requests for your startup.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Select Startup */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Publishing As Startup *
            </label>
            <select
              value={selectedStartupId}
              onChange={e => setSelectedStartupId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500 font-medium"
            >
              {availableStartups.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.college} • {s.category})
                </option>
              ))}
            </select>
          </div>

          {/* Opportunity Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              What are you looking for? *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CATEGORY_OPTIONS.map(cat => {
                const Icon = cat.icon;
                const isSelected = type === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setType(cat.id)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/70 text-teal-900 ring-1 ring-teal-500'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Icon size={16} className={`shrink-0 mt-0.5 ${isSelected ? 'text-teal-700' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs font-bold">{cat.label}</div>
                      <div className="text-[11px] text-slate-500 leading-tight">{cat.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Opportunity Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Looking for a Streetwear & Graphic Apparel Designer for Fall Drop"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500 font-medium"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description & Expectations *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Explain what your startup is building, what the collaborator will work on, and who would be a great fit..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500 resize-none"
            />
          </div>

          {/* Skills Needed */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Skills / Tags Needed (comma separated)
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={e => setSkillsInput(e.target.value)}
              placeholder="e.g. Figma, Illustrator, Streetwear, Screenprinting"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Compensation & Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Perks / Compensation *
              </label>
              <select
                value={compensationType}
                onChange={e => setCompensationType(e.target.value as CompensationType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500 font-medium"
              >
                {COMPENSATION_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Compensation Details
              </label>
              <input
                type="text"
                value={compensationDetails}
                onChange={e => setCompensationDetails(e.target.value)}
                placeholder="e.g. $20/hr, 12% revenue share, or free drops"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Time Commitment & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Time Commitment
              </label>
              <input
                type="text"
                value={timeCommitment}
                onChange={e => setTimeCommitment(e.target.value)}
                placeholder="e.g. 5-8 hrs/week"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Work Setting
              </label>
              <select
                value={locationType}
                onChange={e => setLocationType(e.target.value as LookingForLocationType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500 capitalize"
              >
                <option value="hybrid">Hybrid</option>
                <option value="on-campus">On Campus</option>
                <option value="remote">Remote</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Campus / Location
              </label>
              <input
                type="text"
                value={campus}
                onChange={e => setCampus(e.target.value)}
                placeholder="e.g. Main Quad / Campus"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Direct Contact Methods for Students */}
          <div className="border-t border-slate-100 pt-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact Channels for Applicants
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={contactWhatsapp}
                onChange={e => setContactWhatsapp(e.target.value)}
                placeholder="WhatsApp (e.g. +1...)"
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500"
              />
              <input
                type="email"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                placeholder="Campus Email"
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500"
              />
              <input
                type="text"
                value={contactInstagram}
                onChange={e => setContactInstagram(e.target.value)}
                placeholder="Instagram @handle"
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={submitting}
              className="flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white"
            >
              <Plus size={15} />
              <span>{submitting ? 'Publishing...' : 'Publish to Looking For Board'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
