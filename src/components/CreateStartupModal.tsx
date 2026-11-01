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
  Image as ImageIcon,
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsSubmitting(true);

    try {
      const finalLogo = customLogoUrl.trim() || selectedLogo;
      const finalCover = customCoverUrl.trim() || selectedCover;

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
      });

      if (res.error) {
        setError(res.error);
        setIsSubmitting(false);
        return;
      }

      toast.success(`${name} registered! You can now publish service packages under this venture.`);
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
                  Campus Founder Portal
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                Register Campus Startup
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Venture Overview */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              1. Venture Basics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700">
                  Startup / Studio Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Apex Design Collective, Nexus AI Lab"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700">
                  Tagline / One-Liner *
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                  placeholder="e.g. Building full-stack MVPs and web software for student ventures"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Primary Domain / Category *
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-[#0F766E]"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  College / University *
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={e => setCollege(e.target.value)}
                  placeholder="e.g. Stanford University, MIT, UC Berkeley"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Team Size
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={teamSize}
                    onChange={e => setTeamSize(Number(e.target.value))}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Website / Portfolio
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700">
                  About the Startup / Mission *
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe your startup, what services you build, past campus projects, and client deliverables..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Branding & Imagery */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              2. Branding &amp; Visuals
            </h3>

            {/* Logo Presets */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Choose a Venture Icon / Logo
              </label>
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {LOGO_PRESETS.map((p, idx) => {
                  const isSelected = selectedLogo === p.url && !customLogoUrl;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedLogo(p.url);
                        setCustomLogoUrl('');
                      }}
                      className={`relative w-14 h-14 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                        isSelected ? 'border-[#0F766E] ring-2 ring-[#0F766E]/20 scale-105' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#0F766E]/40 flex items-center justify-center text-white">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              <input
                type="url"
                value={customLogoUrl}
                onChange={e => setCustomLogoUrl(e.target.value)}
                placeholder="Or paste custom logo image URL..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0F766E]"
              />
            </div>

            {/* Cover Presets */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-700">
                Cover Photo
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {COVER_PRESETS.map((p, idx) => {
                  const isSelected = selectedCover === p.url && !customCoverUrl;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedCover(p.url);
                        setCustomCoverUrl('');
                      }}
                      className={`relative h-16 rounded-xl overflow-hidden border-2 transition-all ${
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
              <input
                type="url"
                value={customCoverUrl}
                onChange={e => setCustomCoverUrl(e.target.value)}
                placeholder="Or paste custom banner / cover image URL..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0F766E]"
              />
            </div>
          </div>

          {/* Section 3: Direct Client Contact Details */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                3. Direct Client Inquiries
              </h3>
              <p className="text-xs text-slate-500">
                Student clients can reach your team directly for project scopes and custom quotes.
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
                    placeholder="+1 555-0199 or +91 9876543210"
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

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Instagram Handle
                </label>
                <div className="relative">
                  <Instagram className="w-4 h-4 text-pink-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={contactInstagram}
                    onChange={e => setContactInstagram(e.target.value)}
                    placeholder="@yourstartup"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  LinkedIn Page URL
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={linkedin}
                    onChange={e => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/company/..."
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
              </div>
            </div>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-teal-50/50 border border-teal-100 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showContact}
                onChange={e => setShowContact(e.target.checked)}
                className="w-4 h-4 text-[#0F766E] rounded border-slate-300 focus:ring-[#0F766E]"
              />
              <span className="text-xs text-slate-700">
                Display 1-click WhatsApp and Email contact buttons prominently on startup profile
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
              leftIcon={<Rocket className="w-4 h-4" />}
            >
              {isSubmitting ? 'Registering...' : 'Register Venture'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
