import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Briefcase,
  Rocket,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Upload,
  X,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  AlertCircle,
  Eye,
  Check,
  Building2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useUserMode } from '@/hooks/useUserMode';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { CategoryBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useToast } from '@/components/ui/Toast';
import type { ServicePackage } from '@/data/types';

// Curated startup service photo presets
const SERVICE_PHOTO_PRESETS = [
  { label: 'Web & App Development', url: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { label: 'UI/UX & Product Design', url: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { label: 'Pitch Deck & Strategy', url: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { label: 'Portrait & Studio Photography', url: 'https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { label: 'Marketing & Campus Growth', url: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { label: 'STEM & Academic Tutoring', url: 'https://images.pexels.com/photos/3771074/pexels-photo-3771074.jpeg?auto=compress&cs=tinysrgb&w=800' },
];

const SERVICE_CATEGORIES = [
  'Development',
  'Design',
  'Photography',
  'Marketing',
  'Pitch Decks',
  'Tutoring',
  'Music',
  'Labor',
  'Coaching',
  'Other',
];

export default function SellPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, isAuthed, startups, addListing } = useApp();
  const { mode, setMode } = useUserMode();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // STEP 1: VENTURE & TITLE
  const [selectedStartupId, setSelectedStartupId] = useState<string>(() => startups[0]?.id || '');
  const [customStartupName, setCustomStartupName] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Development');

  // STEP 2: SCOPE & MEDIA
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([SERVICE_PHOTO_PRESETS[0].url]);
  const [isUploading, setIsUploading] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');

  // STEP 3: TIERED PACKAGES & PRICING
  const [servicePricingMode, setServicePricingMode] = useState<'packages' | 'rate'>('packages');
  const [basePrice, setBasePrice] = useState('60');
  const [deliveryDays, setDeliveryDays] = useState(3);
  const [acceptCustomQuotes, setAcceptCustomQuotes] = useState(true);

  const [enableStandard, setEnableStandard] = useState(true);
  const [enablePremium, setEnablePremium] = useState(false);

  const [basicPackage, setBasicPackage] = useState({
    title: 'Starter / Consultation',
    price: 45,
    deliveryDays: 2,
    revisions: 1,
    features: ['Initial Project Scope & Consultation', 'Core Deliverable Draft', 'Direct WhatsApp / Email Support'],
  });

  const [standardPackage, setStandardPackage] = useState({
    title: 'Standard Project',
    price: 95,
    deliveryDays: 4,
    revisions: 2,
    features: ['Complete Production Deliverable', 'Source Files & Assets Included', '2 Rounds of Revisions', 'Priority Turnaround'],
  });

  const [premiumPackage, setPremiumPackage] = useState({
    title: 'Enterprise / Full-Suite',
    price: 190,
    deliveryDays: 7,
    revisions: 3,
    features: ['Full Turnkey Solution', 'Unlimited Consultations During Project', 'Commercial License & Full IP Transfer', 'Post-Launch Maintenance Support'],
  });

  // Feature input scratchpad
  const [newFeatureText, setNewFeatureText] = useState('');
  const [activeFeatureTier, setActiveFeatureTier] = useState<'basic' | 'standard' | 'premium'>('basic');

  // STEP 4: SUBMISSION
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If user is in Buyer Mode, show the Mode Guard
  if (mode === 'buyer') {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-teal-50 text-[#0F766E] border border-teal-200 flex items-center justify-center mx-auto shadow-sm">
          <Rocket className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Startup Founder Interface
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Founder Mode Required
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            You are currently in <strong>Buyer Mode</strong> (optimized exclusively for hiring campus startup services and exploring collegiate talent).
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            To publish your startup's service offerings, package pricing, and receive client inquiries, switch to <strong>Founder Mode</strong>.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setMode('seller')}
            className="w-full sm:w-auto"
          >
            Switch to Founder Mode &amp; Post Service
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/services')}
            className="w-full sm:w-auto"
          >
            Browse Services Instead
          </Button>
        </div>
      </div>
    );
  }

  // Auth Guard
  if (!isAuthed || !currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0F766E] flex items-center justify-center mx-auto border border-teal-100">
          <Briefcase className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Sign in to list startup services</h2>
        <p className="text-xs text-slate-500">
          Connect your verified campus account to publish offerings and start earning.
        </p>
        <Link to="/signin">
          <Button variant="primary" size="md" className="w-full">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  // Image Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const filePath = `services/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const { data, error: uploadErr } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadErr || !data) {
        const localUrl = URL.createObjectURL(file);
        setImages(prev => [...prev, localUrl]);
        toast.info('Image added for preview.');
      } else {
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
        setImages(prev => [...prev, publicUrlData.publicUrl]);
        toast.success('Image uploaded successfully!');
      }
    } catch {
      const localUrl = URL.createObjectURL(file);
      setImages(prev => [...prev, localUrl]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddCustomUrl = () => {
    if (customImageUrl.trim()) {
      setImages(prev => [...prev, customImageUrl.trim()]);
      setCustomImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Feature list helper for packages
  const handleAddFeature = (tier: 'basic' | 'standard' | 'premium') => {
    if (!newFeatureText.trim()) return;
    if (tier === 'basic') {
      setBasicPackage(prev => ({ ...prev, features: [...prev.features, newFeatureText.trim()] }));
    } else if (tier === 'standard') {
      setStandardPackage(prev => ({ ...prev, features: [...prev.features, newFeatureText.trim()] }));
    } else {
      setPremiumPackage(prev => ({ ...prev, features: [...prev.features, newFeatureText.trim()] }));
    }
    setNewFeatureText('');
  };

  const handleRemoveFeature = (tier: 'basic' | 'standard' | 'premium', index: number) => {
    if (tier === 'basic') {
      setBasicPackage(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
    } else if (tier === 'standard') {
      setStandardPackage(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
    } else {
      setPremiumPackage(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
    }
  };

  // Validation
  const validateStep1 = () => {
    if (!title.trim()) {
      setError('Please provide a title for your startup service offering.');
      return false;
    }
    setError(null);
    return true;
  };

  const validateStep2 = () => {
    if (!description.trim()) {
      setError('Please write a scope description for this service.');
      return false;
    }
    if (images.length === 0) {
      setError('Please add at least one showcase or portfolio image.');
      return false;
    }
    setError(null);
    return true;
  };

  const validateStep3 = () => {
    if (servicePricingMode === 'rate') {
      if (!basePrice || Number(basePrice) <= 0) {
        setError('Please enter a valid starting price.');
        return false;
      }
    } else {
      if (basicPackage.price <= 0) {
        setError('Please set a valid price for the Starter package.');
        return false;
      }
      if (enableStandard && standardPackage.price <= 0) {
        setError('Please set a valid price for the Standard package.');
        return false;
      }
      if (enablePremium && premiumPackage.price <= 0) {
        setError('Please set a valid price for the Premium package.');
        return false;
      }
    }
    setError(null);
    return true;
  };

  // Final Submit Handler
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const activeStartup = startups.find(s => s.id === selectedStartupId);
      const startupName = activeStartup ? activeStartup.name : customStartupName.trim() || `${currentUser.name}'s Studio`;

      // Build packages array
      const packagesList: ServicePackage[] = [
        {
          id: 'pkg-basic',
          name: basicPackage.title,
          price: Number(basicPackage.price),
          deliveryDays: Number(basicPackage.deliveryDays),
          revisions: Number(basicPackage.revisions),
          features: basicPackage.features,
        },
      ];

      if (enableStandard) {
        packagesList.push({
          id: 'pkg-standard',
          name: standardPackage.title,
          price: Number(standardPackage.price),
          deliveryDays: Number(standardPackage.deliveryDays),
          revisions: Number(standardPackage.revisions),
          features: standardPackage.features,
        });
      }

      if (enablePremium) {
        packagesList.push({
          id: 'pkg-premium',
          name: premiumPackage.title,
          price: Number(premiumPackage.price),
          deliveryDays: Number(premiumPackage.deliveryDays),
          revisions: Number(premiumPackage.revisions),
          features: premiumPackage.features,
        });
      }

      const startingPrice = servicePricingMode === 'packages'
        ? Math.min(...packagesList.map(p => p.price))
        : Number(basePrice);

      const turnaroundEst = servicePricingMode === 'packages'
        ? `${basicPackage.deliveryDays}-${enablePremium ? premiumPackage.deliveryDays : standardPackage.deliveryDays} days`
        : `${deliveryDays} days`;

      // 1. Save to Supabase listings table
      const { data: dbListing, error: dbErr } = await supabase
        .from('listings')
        .insert({
          title,
          category,
          price: startingPrice,
          type: 'service',
          description,
          images,
          seller_id: currentUser.id,
          startup_id: selectedStartupId || null,
          location: currentUser.location || 'Campus / Online',
          status: 'live',
          delivery_days: deliveryDays,
          packages: servicePricingMode === 'packages' ? packagesList : null,
          accept_custom_quotes: acceptCustomQuotes,
          pricing_mode: servicePricingMode,
        })
        .select()
        .single();

      if (dbErr) {
        console.warn('Supabase listing insert notice:', dbErr.message);
      }

      // 2. Also register in local AppContext for instant state reactivity
      addListing({
        title,
        category,
        price: startingPrice,
        type: 'service',
        description,
        images,
        sellerId: currentUser.id,
        sellerName: currentUser.name,
        sellerAvatar: currentUser.avatar,
        startupId: selectedStartupId || undefined,
        startupName: startupName,
        location: currentUser.location || 'Campus / Online',
        status: 'live',
        pricingMode: servicePricingMode,
        packages: servicePricingMode === 'packages' ? packagesList : undefined,
        acceptCustomQuotes,
        deliveryDays,
        views: 1,
        featured: false,
      });

      toast.success('Your startup service is now live on AMPLOFY!');
      navigate('/dashboard?tab=listings');
    } catch (err: unknown) {
      console.error('Error publishing service:', err);
      toast.error('Could not publish service. Please check fields and retry.');
      setError('Failed to publish. Please verify your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeStartup = startups.find(s => s.id === selectedStartupId);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* 4-Step Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {[
            { step: 1, label: '1. Venture & Scope' },
            { step: 2, label: '2. Media & Details' },
            { step: 3, label: '3. Packages & Pricing' },
            { step: 4, label: '4. Preview & Launch' },
          ].map(s => (
            <div
              key={s.step}
              className={`flex items-center gap-1.5 text-xs font-semibold ${
                currentStep === s.step
                  ? 'text-[#0F766E]'
                  : currentStep > s.step
                  ? 'text-emerald-600'
                  : 'text-slate-400'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep === s.step
                    ? 'bg-[#0F766E] text-white shadow-2xs'
                    : currentStep > s.step
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {currentStep > s.step ? <Check className="w-3.5 h-3.5" /> : s.step}
              </div>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0F766E] transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Wizard Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        {/* Error notification */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: VENTURE & SCOPE */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                Step 1 of 4
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Select Venture &amp; Service Title
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Attach this service to one of your campus startups or create an independent collegiate studio offering.
              </p>
            </div>

            {/* Startup Association */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Operating Venture / Studio
              </label>
              {startups.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {startups.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedStartupId(s.id)}
                      className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                        selectedStartupId === s.id
                          ? 'border-[#0F766E] bg-teal-50/50 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <Avatar src={s.logoUrl} name={s.name} size="md" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{s.name}</div>
                        <div className="text-[11px] text-slate-500">{s.college}</div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  value={customStartupName}
                  onChange={e => setCustomStartupName(e.target.value)}
                  placeholder="e.g. Athena Creative Lab, PixelCraft Studio"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#0F766E]"
                />
              )}
            </div>

            {/* Service Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Service Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Full-Stack Web App Development & MVP Deployment"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#0F766E]"
              />
              <p className="text-[11px] text-slate-400">
                Be specific and descriptive. Avoid vague titles like "I will code for you".
              </p>
            </div>

            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Primary Category *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#0F766E] bg-white"
              >
                {SERVICE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 1 Actions */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  if (validateStep1()) setCurrentStep(2);
                }}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Details &amp; Media
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: MEDIA & DETAILS */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                Step 2 of 4
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Showcase Media &amp; Scope Description
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Showcase previous client work, wireframes, code repos, or studio photography.
              </p>
            </div>

            {/* Tagline */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                One-Sentence Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                placeholder="e.g. Modern responsive React & Tailwind web apps with clean architecture"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#0F766E]"
              />
            </div>

            {/* Scope / Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Detailed Scope of Work *
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Explain what's included in this service, client prerequisites, deliverables provided, tech stack, and workflow..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#0F766E]"
              />
            </div>

            {/* Media Showcase Presets & Upload */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Showcase &amp; Portfolio Media *
              </label>

              {/* Preset Buttons */}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="text-slate-500 font-medium py-1">Quick Presets:</span>
                {SERVICE_PHOTO_PRESETS.map(preset => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setImages(prev => [...prev, preset.url])}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-[#0F766E] border border-slate-200 text-slate-700 transition-colors"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>

              {/* Upload or Custom URL */}
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={customImageUrl}
                    onChange={e => setCustomImageUrl(e.target.value)}
                    placeholder="Or paste an image URL directly..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
                <Button variant="secondary" size="sm" onClick={handleAddCustomUrl}>
                  Add URL
                </Button>
                <label className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>

              {/* Thumbnail Previews */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group"
                  >
                    <img src={img} alt="Showcase preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-teal-600/90 text-white text-[10px] font-bold">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2 Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setCurrentStep(1)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  if (validateStep2()) setCurrentStep(3);
                }}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Packages &amp; Pricing
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: TIERED PACKAGES & PRICING */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                Step 3 of 4
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Tiered Packages &amp; Pricing
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Offer transparent Starter, Standard, and Premium packages with clear delivery timelines.
              </p>
            </div>

            {/* Pricing Mode Toggle */}
            <div className="flex items-center gap-3 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setServicePricingMode('packages')}
                className={`flex-1 py-2 rounded-lg transition-all text-center ${
                  servicePricingMode === 'packages'
                    ? 'bg-white text-[#0F766E] shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3-Tier Packages (Recommended)
              </button>
              <button
                type="button"
                onClick={() => setServicePricingMode('rate')}
                className={`flex-1 py-2 rounded-lg transition-all text-center ${
                  servicePricingMode === 'rate'
                    ? 'bg-white text-[#0F766E] shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Single Starting Price
              </button>
            </div>

            {servicePricingMode === 'packages' ? (
              <div className="space-y-6">
                {/* 1. Basic Package */}
                <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                      Tier 1: Starter Package
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-[#0F766E]">
                      Always Included
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Package Title
                      </label>
                      <input
                        type="text"
                        value={basicPackage.title}
                        onChange={e => setBasicPackage({ ...basicPackage, title: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        min="5"
                        value={basicPackage.price}
                        onChange={e => setBasicPackage({ ...basicPackage, price: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Delivery (Days)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={basicPackage.deliveryDays}
                        onChange={e => setBasicPackage({ ...basicPackage, deliveryDays: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Basic Features list */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-semibold text-slate-700">
                      Deliverables Included:
                    </label>
                    <div className="space-y-1.5">
                      {basicPackage.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-slate-700">{feat}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature('basic', idx)}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Standard Package */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Tier 2: Standard Package
                    </span>
                    <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableStandard}
                        onChange={e => setEnableStandard(e.target.checked)}
                        className="rounded text-[#0F766E] focus:ring-[#0F766E]"
                      />
                      <span>Enable Tier</span>
                    </label>
                  </div>
                  {enableStandard && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Package Title
                        </label>
                        <input
                          type="text"
                          value={standardPackage.title}
                          onChange={e => setStandardPackage({ ...standardPackage, title: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Price ($)
                        </label>
                        <input
                          type="number"
                          min="5"
                          value={standardPackage.price}
                          onChange={e => setStandardPackage({ ...standardPackage, price: Number(e.target.value) })}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Delivery (Days)
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={standardPackage.deliveryDays}
                          onChange={e => setStandardPackage({ ...standardPackage, deliveryDays: Number(e.target.value) })}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Premium Package */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Tier 3: Premium Full-Suite
                    </span>
                    <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enablePremium}
                        onChange={e => setEnablePremium(e.target.checked)}
                        className="rounded text-[#0F766E] focus:ring-[#0F766E]"
                      />
                      <span>Enable Tier</span>
                    </label>
                  </div>
                  {enablePremium && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Package Title
                        </label>
                        <input
                          type="text"
                          value={premiumPackage.title}
                          onChange={e => setPremiumPackage({ ...premiumPackage, title: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Price ($)
                        </label>
                        <input
                          type="number"
                          min="5"
                          value={premiumPackage.price}
                          onChange={e => setPremiumPackage({ ...premiumPackage, price: Number(e.target.value) })}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Delivery (Days)
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={premiumPackage.deliveryDays}
                          onChange={e => setPremiumPackage({ ...premiumPackage, deliveryDays: Number(e.target.value) })}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Feature Add Input */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-semibold text-slate-700 block">
                    Add Deliverable Bullet Point to Package:
                  </span>
                  <div className="flex gap-2">
                    <select
                      value={activeFeatureTier}
                      onChange={e => setActiveFeatureTier(e.target.value as 'basic' | 'standard' | 'premium')}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800"
                    >
                      <option value="basic">Starter</option>
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                    </select>
                    <input
                      type="text"
                      value={newFeatureText}
                      onChange={e => setNewFeatureText(e.target.value)}
                      placeholder="e.g. Includes full Next.js source code + GitHub repo transfer"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900"
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAddFeature(activeFeatureTier)}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Starting Price ($) *
                    </label>
                    <input
                      type="number"
                      min="5"
                      value={basePrice}
                      onChange={e => setBasePrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Estimated Turnaround (Days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={deliveryDays}
                      onChange={e => setDeliveryDays(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Accept Custom Quotes Checkbox */}
            <div className="pt-2">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptCustomQuotes}
                  onChange={e => setAcceptCustomQuotes(e.target.checked)}
                  className="rounded text-[#0F766E] focus:ring-[#0F766E]"
                />
                <span className="text-xs font-semibold text-slate-700">
                  Allow clients to request custom project quotes outside standard packages
                </span>
              </label>
            </div>

            {/* Step 3 Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setCurrentStep(2)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  if (validateStep3()) setCurrentStep(4);
                }}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Preview &amp; Launch
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: PREVIEW & LAUNCH */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                Step 4 of 4
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Preview &amp; Launch Service
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Review your offering details before publishing it to the collegiate marketplace.
              </p>
            </div>

            {/* Live Preview Card */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                  <img src={images[0]} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0F766E] uppercase">
                      {category}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-medium text-slate-500">
                      {activeStartup ? activeStartup.name : customStartupName || currentUser.name}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">{title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{description}</p>
                </div>
              </div>

              {/* Package Summary Pills */}
              <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 font-medium">
                    Turnaround: {servicePricingMode === 'packages' ? `${basicPackage.deliveryDays}d starter` : `${deliveryDays} days`}
                  </span>
                </div>
                <div className="font-extrabold text-slate-900 text-sm">
                  Starting at ${servicePricingMode === 'packages' ? basicPackage.price : basePrice}
                </div>
              </div>
            </div>

            {/* Student Founder Pledge */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 space-y-1 leading-relaxed">
                <span className="font-bold block">Collegiate Marketplace Standards</span>
                <span>
                  By launching this service, you confirm this offering represents authentic student work, respects intellectual property, and fulfills orders in good faith.
                </span>
              </div>
            </div>

            {/* Step 4 Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setCurrentStep(3)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                disabled={isSubmitting}
              >
                Back
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                disabled={isSubmitting}
                rightIcon={<Sparkles className="w-4 h-4" />}
              >
                {isSubmitting ? 'Launching...' : '🚀 Launch Startup Service'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
