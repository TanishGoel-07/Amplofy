import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Package,
  Briefcase,
  Rocket,
  User as UserIcon,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Upload,
  X,
  Plus,
  Trash2,
  DollarSign,
  Clock,
  Sparkles,
  MapPin,
  FileText,
  AlertCircle,
  Eye,
  Check,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { CategoryBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useToast } from '@/components/ui/Toast';
import type { ServicePackage } from '@/data/types';

// Curated campus photo presets for quick testing & realistic listings
const PHOTO_PRESETS = {
  product: [
    { label: 'MacBook / Tech', url: 'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { label: 'Textbooks', url: 'https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { label: 'Desk Chair', url: 'https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { label: 'Camera / Gear', url: 'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { label: 'Dorm Decor', url: 'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=800' },
  ],
  service: [
    { label: 'Coding / Web Dev', url: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { label: 'Design / UI/UX', url: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { label: 'Tutoring / Math', url: 'https://images.pexels.com/photos/3771074/pexels-photo-3771074.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { label: 'Photography', url: 'https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { label: 'Dorm Moving', url: 'https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=800' },
  ],
};

const PRODUCT_CATEGORIES = [
  'Textbooks',
  'Electronics',
  'Dorm',
  'Fashion',
  'Books',
  'Handmade',
  'Other',
];

const SERVICE_CATEGORIES = [
  'Tutoring',
  'Design',
  'Development',
  'Photography',
  'Labor',
  'Coaching',
  'Music',
  'Marketing',
  'Other',
];

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Pre-Owned'];

export default function SellPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, isAuthed, startups, addListing } = useApp();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // STEP 1: TYPE & OWNER
  const [listingType, setListingType] = useState<'product' | 'service'>('product');
  const [ownerType, setOwnerType] = useState<'profile' | 'startup'>('profile');
  const [selectedStartupId, setSelectedStartupId] = useState<string>(() => startups[0]?.id || '');
  const [customStartupName, setCustomStartupName] = useState('');

  // STEP 2: DETAILS & MEDIA
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Textbooks');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([PHOTO_PRESETS.product[0].url]);
  const [isUploading, setIsUploading] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');

  // STEP 3: PRICING & DELIVERY
  // Product fields
  const [productPrice, setProductPrice] = useState('45');
  const [condition, setCondition] = useState('Good');
  const [location, setLocation] = useState(currentUser?.location || 'Main Quad / Campus Union');

  // Service fields
  const [servicePricingMode, setServicePricingMode] = useState<'packages' | 'rate'>('packages');
  const [priceType, setPriceType] = useState<'fixed' | 'hourly' | 'starting_at'>('fixed');
  const [basePrice, setBasePrice] = useState('50');
  const [deliveryDays, setDeliveryDays] = useState(3);
  const [acceptCustomQuotes, setAcceptCustomQuotes] = useState(true);

  // 3 Service Packages (Basic, Standard, Premium)
  const [enableStandard, setEnableStandard] = useState(true);
  const [enablePremium, setEnablePremium] = useState(false);

  const [basicPackage, setBasicPackage] = useState({
    title: 'Basic Session',
    price: 40,
    deliveryDays: 1,
    revisions: 1,
    features: ['1-on-1 Consultation', 'Initial Assessment Notes'],
  });

  const [standardPackage, setStandardPackage] = useState({
    title: 'Standard Package',
    price: 80,
    deliveryDays: 3,
    revisions: 2,
    features: ['Comprehensive Delivery', 'Source Files & Review', 'Priority Messaging'],
  });

  const [premiumPackage, setPremiumPackage] = useState({
    title: 'Premium Full-Suite',
    price: 150,
    deliveryDays: 5,
    revisions: 3,
    features: ['Full Turnkey Solution', 'Unlimited Minor Revisions', '24/7 Dedicated Support', 'Post-Delivery Follow-Up'],
  });

  // Feature input scratchpad
  const [newFeatureText, setNewFeatureText] = useState('');
  const [activeFeatureTier, setActiveFeatureTier] = useState<'basic' | 'standard' | 'premium'>('basic');

  // STEP 4: SUBMISSION & DRAFT
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // When switching listing type, adjust default category and images
  const handleTypeChange = (type: 'product' | 'service') => {
    setListingType(type);
    if (type === 'product') {
      setCategory('Textbooks');
      setImages([PHOTO_PRESETS.product[0].url]);
    } else {
      setCategory('Tutoring');
      setImages([PHOTO_PRESETS.service[0].url]);
    }
  };

  // Image Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const filePath = `listings/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const { data, error: uploadErr } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadErr || !data) {
        // Fallback to object URL for local preview
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
  const validateStep2 = () => {
    if (!title.trim()) {
      setError('Please provide a listing title.');
      return false;
    }
    if (!description.trim()) {
      setError('Please write a short description.');
      return false;
    }
    if (images.length === 0) {
      setError('Please add at least one photo or cover image.');
      return false;
    }
    setError(null);
    return true;
  };

  const validateStep3 = () => {
    if (listingType === 'product') {
      if (!productPrice || Number(productPrice) <= 0) {
        setError('Please enter a valid product price.');
        return false;
      }
    } else {
      if (servicePricingMode === 'rate') {
        if (!basePrice || Number(basePrice) <= 0) {
          setError('Please enter a valid starting price.');
          return false;
        }
      }
    }
    setError(null);
    return true;
  };

  // Publish / Save
  const handleSubmitListing = async (status: 'live' | 'draft') => {
    setIsSubmitting(true);
    setError(null);

    // Build packages if service
    let packages: ServicePackage[] = [];
    let calculatedBasePrice = Number(productPrice);

    if (listingType === 'service') {
      if (servicePricingMode === 'packages') {
        calculatedBasePrice = basicPackage.price;
        packages.push({
          id: `pkg-${Date.now()}-1`,
          listingId: '',
          tier: 'basic',
          title: basicPackage.title,
          price: basicPackage.price,
          deliveryDays: basicPackage.deliveryDays,
          revisions: basicPackage.revisions,
          features: basicPackage.features,
        });

        if (enableStandard) {
          packages.push({
            id: `pkg-${Date.now()}-2`,
            listingId: '',
            tier: 'standard',
            title: standardPackage.title,
            price: standardPackage.price,
            deliveryDays: standardPackage.deliveryDays,
            revisions: standardPackage.revisions,
            features: standardPackage.features,
          });
        }

        if (enablePremium) {
          packages.push({
            id: `pkg-${Date.now()}-3`,
            listingId: '',
            tier: 'premium',
            title: premiumPackage.title,
            price: premiumPackage.price,
            deliveryDays: premiumPackage.deliveryDays,
            revisions: premiumPackage.revisions,
            features: premiumPackage.features,
          });
        }
      } else {
        calculatedBasePrice = Number(basePrice);
      }
    }

    const targetStartup = ownerType === 'startup' ? startups.find(s => s.id === selectedStartupId) : undefined;

    const res = await addListing({
      type: listingType,
      ownerType,
      startupId: ownerType === 'startup' ? selectedStartupId || null : null,
      startup: targetStartup,
      title: title.trim(),
      description: description.trim(),
      category,
      condition: listingType === 'product' ? condition : undefined,
      status,
      priceType: listingType === 'product' ? 'fixed' : priceType,
      basePrice: calculatedBasePrice,
      deliveryDays: listingType === 'service' ? (packages[0]?.deliveryDays || deliveryDays) : 1,
      images,
      location,
      acceptCustomQuotes,
      packages: packages.length > 0 ? packages : undefined,
    });

    setIsSubmitting(false);

    if (res.error) {
      setError(res.error);
      toast.error(res.error);
    } else {
      toast.success(
        status === 'draft'
          ? 'Listing saved to drafts in your Dashboard.'
          : 'Your campus listing is now live!'
      );
      if (status === 'draft') {
        navigate('/dashboard');
      } else if (listingType === 'service' && res.id) {
        navigate(`/service/${res.id}`);
      } else if (res.id) {
        navigate(`/product/${res.id}`);
      } else {
        navigate('/dashboard');
      }
    }
  };

  // Logged-out safety check
  if (!isAuthed || !currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0F766E] flex items-center justify-center mx-auto border border-teal-100">
          <Briefcase className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Sign in to create a listing</h2>
        <p className="text-xs text-slate-500">
          Please log in or create your campus account to post products or offer student services.
        </p>
        <div className="flex flex-col gap-2 pt-2">
          <Link to="/signin">
            <Button variant="primary" size="md" className="w-full">
              Sign In
            </Button>
          </Link>
          <Link to="/join">
            <Button variant="secondary" size="md" className="w-full">
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Wizard Page Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-[#0F766E] border border-teal-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campus Listing Wizard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create a New Campus Listing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Publish products or professional student services to verified campus peers.
          </p>
        </div>

        {/* 4-Step Progress Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="grid grid-cols-4 text-center text-xs font-semibold text-slate-500">
            <span className={currentStep >= 1 ? 'text-[#0F766E]' : ''}>1. Type & Owner</span>
            <span className={currentStep >= 2 ? 'text-[#0F766E]' : ''}>2. Details</span>
            <span className={currentStep >= 3 ? 'text-[#0F766E]' : ''}>3. Pricing</span>
            <span className={currentStep >= 4 ? 'text-[#0F766E]' : ''}>4. Preview</span>
          </div>

          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0F766E] rounded-full transition-all duration-300"
              style={{
                width:
                  currentStep === 1
                    ? '25%'
                    : currentStep === 2
                    ? '50%'
                    : currentStep === 3
                    ? '75%'
                    : '100%',
              }}
            />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3.5 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="font-medium leading-relaxed">{error}</p>
          </div>
        )}

        {/* ========================================================
            STEP 1: TYPE & OWNER
           ======================================================== */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
            {/* Listing Type */}
            <div className="space-y-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">What are you listing?</h2>
                <p className="text-xs text-slate-500">
                  Select whether you are selling physical/digital items or offering a skill/service.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleTypeChange('product')}
                  className={`p-5 rounded-xl border-2 text-left transition-all flex items-start gap-4 ${
                    listingType === 'product'
                      ? 'border-[#0F766E] bg-teal-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      listingType === 'product'
                        ? 'bg-[#0F766E] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Package className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-slate-900">Physical / Digital Product</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Textbooks, calculators, dorm furniture, electronics, bikes, or study guides.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleTypeChange('service')}
                  className={`p-5 rounded-xl border-2 text-left transition-all flex items-start gap-4 ${
                    listingType === 'service'
                      ? 'border-[#0F766E] bg-teal-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      listingType === 'service'
                        ? 'bg-[#0F766E] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-slate-900">Campus Service</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Tutoring, web dev, graphic design, graduation photos, moving labor, or audio mixing.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Owner Selection: Me or My startup */}
            <div className="space-y-3 pt-6 border-t border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Who is offering this?</h2>
                <p className="text-xs text-slate-500">
                  You can list under your personal student account or on behalf of a student-founded startup.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setOwnerType('profile')}
                  className={`p-5 rounded-xl border-2 text-left transition-all flex items-start gap-4 ${
                    ownerType === 'profile'
                      ? 'border-[#0F766E] bg-teal-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <Avatar
                    src={currentUser.avatar}
                    name={currentUser.name}
                    size="md"
                    className="shrink-0"
                  />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm text-slate-900">Me (Individual Student)</h3>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                        Student
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Listed directly under {currentUser.name} ({currentUser.college || 'Campus Member'})
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setOwnerType('startup')}
                  className={`p-5 rounded-xl border-2 text-left transition-all flex items-start gap-4 ${
                    ownerType === 'startup'
                      ? 'border-[#0F766E] bg-teal-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      ownerType === 'startup'
                        ? 'bg-amber-500 text-white'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    <Rocket className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm text-slate-900">My Startup / Venture</h3>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold">
                        Startup
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Attach this listing to your student-founded team directory and venture profile.
                    </p>
                  </div>
                </button>
              </div>

              {/* Startup Selector if ownerType === 'startup' */}
              {ownerType === 'startup' && (
                <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-900">
                    Select Your Campus Startup
                  </label>
                  <select
                    value={selectedStartupId}
                    onChange={e => setSelectedStartupId(e.target.value)}
                    className="w-full bg-white rounded-xl px-3 py-2.5 text-xs text-slate-900 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  >
                    {startups.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.category} • {s.college})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setError(null);
                  setCurrentStep(2);
                }}
                className="inline-flex items-center gap-1.5"
              >
                <span>Continue to Details</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 2: DETAILS & MEDIA
           ======================================================== */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Listing Information & Media</h2>
              <p className="text-xs text-slate-500 mt-1">
                Provide clear titles and accurate photos to attract campus buyers.
              </p>
            </div>

            {/* Title & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Listing Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder={
                    listingType === 'product'
                      ? 'e.g. TI-84 Plus CE Color Graphing Calculator'
                      : 'e.g. Fullstack React & Supabase MVP Development'
                  }
                  className="w-full bg-slate-50 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-slate-50 rounded-xl px-3 py-2.5 text-xs text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                >
                  {(listingType === 'product' ? PRODUCT_CATEGORIES : SERVICE_CATEGORIES).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder={
                  listingType === 'product'
                    ? 'Describe condition, battery life, included accessories, course codes used for, and campus pickup details...'
                    : 'Describe your expertise, past projects, what the client receives, and what courses or tools you specialize in...'
                }
                className="w-full bg-slate-50 rounded-xl p-3.5 text-xs text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] leading-relaxed"
              />
            </div>

            {/* Image Upload & Presets */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-semibold text-slate-900">
                    Photos & Imagery ({images.length} added)
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Upload your own photo or choose a realistic preset.
                  </p>
                </div>

                {/* Upload Button */}
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-[#0F766E] border border-teal-200 text-xs font-semibold hover:bg-teal-100/70 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>

              {/* Photo presets strip */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-medium text-slate-400">Quick Presets:</span>
                {(listingType === 'product' ? PHOTO_PRESETS.product : PHOTO_PRESETS.service).map(p => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setImages(prev => [...prev, p.url])}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    + {p.label}
                  </button>
                ))}
              </div>

              {/* Image Previews */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 bg-slate-100 group"
                  >
                    <img
                      src={img}
                      alt={`Upload preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-slate-900/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setCurrentStep(1)}
                className="inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  if (validateStep2()) {
                    setCurrentStep(3);
                  }
                }}
                className="inline-flex items-center gap-1.5"
              >
                <span>Continue to Pricing</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 3: PRICING & DELIVERY
           ======================================================== */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Pricing & Delivery Logistics</h2>
              <p className="text-xs text-slate-500 mt-1">
                Set fair student-friendly pricing and transparent timelines.
              </p>
            </div>

            {/* PRODUCT PRICING FORM */}
            {listingType === 'product' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Price ($ USD) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="number"
                        min="1"
                        step="0.5"
                        required
                        value={productPrice}
                        onChange={e => setProductPrice(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-slate-50 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Item Condition
                    </label>
                    <select
                      value={condition}
                      onChange={e => setCondition(e.target.value)}
                      className="w-full bg-slate-50 rounded-xl px-3 py-2.5 text-xs text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20"
                    >
                      {CONDITIONS.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Pickup Spot on Campus
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        placeholder="e.g. Student Union Quad"
                        className="w-full bg-slate-50 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 border border-slate-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SERVICE PRICING FORM */}
            {listingType === 'service' && (
              <div className="space-y-6">
                {/* Pricing Mode Toggle */}
                <div className="flex items-center gap-3 p-1.5 bg-slate-100 rounded-xl max-w-sm">
                  <button
                    type="button"
                    onClick={() => setServicePricingMode('packages')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      servicePricingMode === 'packages'
                        ? 'bg-white text-[#0F766E] shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    3 Tier Packages (Basic/Std/Prem)
                  </button>

                  <button
                    type="button"
                    onClick={() => setServicePricingMode('rate')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      servicePricingMode === 'rate'
                        ? 'bg-white text-[#0F766E] shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Single Rate / Hourly
                  </button>
                </div>

                {/* 3-Tier Packages */}
                {servicePricingMode === 'packages' ? (
                  <div className="space-y-4">
                    {/* Basic Tier (Mandatory) */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          1. Basic Tier (Required)
                        </span>
                        <span className="text-[11px] font-semibold text-[#0F766E]">
                          ${basicPackage.price}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">
                            Tier Title
                          </label>
                          <input
                            type="text"
                            value={basicPackage.title}
                            onChange={e => setBasicPackage(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full bg-white rounded-lg px-3 py-1.5 text-xs border border-slate-200"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">
                            Price ($)
                          </label>
                          <input
                            type="number"
                            min="5"
                            value={basicPackage.price}
                            onChange={e => setBasicPackage(prev => ({ ...prev, price: Number(e.target.value) }))}
                            className="w-full bg-white rounded-lg px-3 py-1.5 text-xs border border-slate-200"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">
                            Delivery (Days)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={basicPackage.deliveryDays}
                            onChange={e => setBasicPackage(prev => ({ ...prev, deliveryDays: Number(e.target.value) }))}
                            className="w-full bg-white rounded-lg px-3 py-1.5 text-xs border border-slate-200"
                          />
                        </div>
                      </div>

                      {/* Basic Features Checklist */}
                      <div className="space-y-1.5 pt-2">
                        <label className="block text-[11px] font-medium text-slate-600">
                          Inclusions / Deliverables
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {basicPackage.features.map((feat, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] bg-white border border-slate-200 text-slate-700"
                            >
                              <Check className="w-3 h-3 text-[#0F766E]" />
                              <span>{feat}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveFeature('basic', idx)}
                                className="text-slate-400 hover:text-red-500 ml-1"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            placeholder="Add inclusion (e.g. 1 hour live tutoring)..."
                            value={activeFeatureTier === 'basic' ? newFeatureText : ''}
                            onFocus={() => setActiveFeatureTier('basic')}
                            onChange={e => setNewFeatureText(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddFeature('basic');
                              }
                            }}
                            className="flex-1 bg-white rounded-lg px-3 py-1 text-xs border border-slate-200"
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => handleAddFeature('basic')}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Standard Tier (Optional) */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="inline-flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={enableStandard}
                            onChange={e => setEnableStandard(e.target.checked)}
                            className="rounded text-[#0F766E] focus:ring-[#0F766E]"
                          />
                          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            2. Standard Tier
                          </span>
                        </label>
                        {enableStandard && (
                          <span className="text-[11px] font-semibold text-[#0F766E]">
                            ${standardPackage.price}
                          </span>
                        )}
                      </div>

                      {enableStandard && (
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-medium text-slate-600 mb-1">
                              Tier Title
                            </label>
                            <input
                              type="text"
                              value={standardPackage.title}
                              onChange={e => setStandardPackage(prev => ({ ...prev, title: e.target.value }))}
                              className="w-full bg-white rounded-lg px-3 py-1.5 text-xs border border-slate-200"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-medium text-slate-600 mb-1">
                              Price ($)
                            </label>
                            <input
                              type="number"
                              min="5"
                              value={standardPackage.price}
                              onChange={e => setStandardPackage(prev => ({ ...prev, price: Number(e.target.value) }))}
                              className="w-full bg-white rounded-lg px-3 py-1.5 text-xs border border-slate-200"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-medium text-slate-600 mb-1">
                              Delivery (Days)
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={standardPackage.deliveryDays}
                              onChange={e => setStandardPackage(prev => ({ ...prev, deliveryDays: Number(e.target.value) }))}
                              className="w-full bg-white rounded-lg px-3 py-1.5 text-xs border border-slate-200"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Premium Tier (Optional) */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="inline-flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={enablePremium}
                            onChange={e => setEnablePremium(e.target.checked)}
                            className="rounded text-[#0F766E] focus:ring-[#0F766E]"
                          />
                          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            3. Premium Tier
                          </span>
                        </label>
                        {enablePremium && (
                          <span className="text-[11px] font-semibold text-[#0F766E]">
                            ${premiumPackage.price}
                          </span>
                        )}
                      </div>

                      {enablePremium && (
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-medium text-slate-600 mb-1">
                              Tier Title
                            </label>
                            <input
                              type="text"
                              value={premiumPackage.title}
                              onChange={e => setPremiumPackage(prev => ({ ...prev, title: e.target.value }))}
                              className="w-full bg-white rounded-lg px-3 py-1.5 text-xs border border-slate-200"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-medium text-slate-600 mb-1">
                              Price ($)
                            </label>
                            <input
                              type="number"
                              min="5"
                              value={premiumPackage.price}
                              onChange={e => setPremiumPackage(prev => ({ ...prev, price: Number(e.target.value) }))}
                              className="w-full bg-white rounded-lg px-3 py-1.5 text-xs border border-slate-200"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-medium text-slate-600 mb-1">
                              Delivery (Days)
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={premiumPackage.deliveryDays}
                              onChange={e => setPremiumPackage(prev => ({ ...prev, deliveryDays: Number(e.target.value) }))}
                              className="w-full bg-white rounded-lg px-3 py-1.5 text-xs border border-slate-200"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Single Rate Mode */
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Pricing Model
                      </label>
                      <select
                        value={priceType}
                        onChange={e => setPriceType(e.target.value as any)}
                        className="w-full bg-white rounded-lg px-3 py-2 text-xs border border-slate-200"
                      >
                        <option value="fixed">Fixed Price</option>
                        <option value="hourly">Hourly Rate (/hr)</option>
                        <option value="starting_at">Starting at</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Base Amount ($)
                      </label>
                      <input
                        type="number"
                        min="5"
                        value={basePrice}
                        onChange={e => setBasePrice(e.target.value)}
                        className="w-full bg-white rounded-lg px-3 py-2 text-xs border border-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Typical Delivery (Days)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={deliveryDays}
                        onChange={e => setDeliveryDays(Number(e.target.value))}
                        className="w-full bg-white rounded-lg px-3 py-2 text-xs border border-slate-200"
                      />
                    </div>
                  </div>
                )}

                {/* Accept Custom Quotes Toggle */}
                <div className="flex items-center justify-between p-3.5 bg-teal-50/50 rounded-xl border border-teal-200">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900">
                      Accept Custom Quotes
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Allow clients to request bespoke project quotes and timeline estimates.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAcceptCustomQuotes(!acceptCustomQuotes)}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                      acceptCustomQuotes ? 'bg-[#0F766E]' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                        acceptCustomQuotes ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  if (validateStep3()) {
                    setCurrentStep(4);
                  }
                }}
                className="inline-flex items-center gap-1.5"
              >
                <span>Continue to Preview</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 4: PREVIEW & PUBLISH
           ======================================================== */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Step 4: Preview & Publish</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Review your listing before making it visible to campus buyers.
                  </p>
                </div>

                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Ready to Publish
                </span>
              </div>

              {/* Realistic Preview Card */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-5">
                <div className="flex flex-col sm:flex-row gap-5">
                  <div className="w-full sm:w-48 aspect-[4/3] rounded-lg overflow-hidden bg-slate-200 shrink-0">
                    <img
                      src={images[0]}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <CategoryBadge category={category} />
                      {ownerType === 'startup' ? (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          Startup Venture
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-[#0F766E] border border-teal-200">
                          Student Listing
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
                      {title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {description}
                    </p>

                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-800 pt-2 border-t border-slate-200/60">
                      <div>
                        Price:{' '}
                        <span className="text-sm font-extrabold text-[#0F766E]">
                          ${listingType === 'product' ? productPrice : (servicePricingMode === 'packages' ? basicPackage.price : basePrice)}
                        </span>
                        {listingType === 'service' && priceType === 'hourly' && ' /hr'}
                        {listingType === 'service' && servicePricingMode === 'packages' && ' (Starting at)'}
                      </div>

                      {listingType === 'product' && (
                        <div>
                          Condition: <span className="font-normal text-slate-600">{condition}</span>
                        </div>
                      )}

                      {listingType === 'service' && (
                        <div className="flex items-center gap-1 text-slate-600">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{listingType === 'service' ? `${basicPackage.deliveryDays}d delivery` : 'Local pickup'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Seller Mini Profile */}
                <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <Avatar
                      src={currentUser.avatar}
                      name={currentUser.name}
                      size="sm"
                    />
                    <div>
                      <span className="font-bold text-slate-900">{currentUser.name}</span>
                      <span className="text-slate-400 ml-1.5">• {currentUser.college}</span>
                    </div>
                  </div>
                  <span className="text-slate-500 font-medium">
                    Pickup: {location}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => setCurrentStep(3)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Edit Pricing</span>
                </Button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => handleSubmitListing('draft')}
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none"
                  >
                    Save as Draft
                  </Button>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleSubmitListing('live')}
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5"
                  >
                    <span>{isSubmitting ? 'Publishing...' : 'Publish Listing'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
