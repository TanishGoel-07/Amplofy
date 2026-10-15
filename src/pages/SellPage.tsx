import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, Recycle, Monitor, Briefcase, ChevronLeft, ChevronRight,
  Check, AlertTriangle, Image as ImageIcon, Tag, MapPin, X,
  ShieldCheck, ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { CATEGORIES } from '@/data/types';
import type { ListingType, Category, Condition } from '@/data/types';

const listingTypes: { value: ListingType; label: string; desc: string; icon: typeof Package }[] = [
  { value: 'product', label: 'Product', desc: 'New, handmade, or created items', icon: Package },
  { value: 'pre-owned', label: 'Pre-Owned Item', desc: 'Resell things you no longer need', icon: Recycle },
  { value: 'digital', label: 'Digital Product', desc: 'Templates, notes, designs, downloads', icon: Monitor },
  { value: 'service', label: 'Service', desc: 'Offer your skills and services', icon: Briefcase },
];

const conditions: Condition[] = ['New', 'Like New', 'Good', 'Fair', 'Digital', 'N/A'];

const sampleImages = [
  'https://images.pexels.com/photos/10605239/pexels-photo-10605239.jpeg?auto=compress&cs=tinysrgb&h=800&w=800',
  'https://images.pexels.com/photos/7695181/pexels-photo-7695181.jpeg?auto=compress&cs=tinysrgb&h=800&w=800',
  'https://images.pexels.com/photos/4937320/pexels-photo-4937320.jpeg?auto=compress&cs=tinysrgb&h=800&w=800',
  'https://images.pexels.com/photos/4708733/pexels-photo-4708733.jpeg?auto=compress&cs=tinysrgb&h=800&w=800',
];

export default function SellPage() {
  const navigate = useNavigate();
  const { currentUser, addProduct, verificationStatus } = useApp();
  const [step, setStep] = useState(1);
  const [listingType, setListingType] = useState<ListingType | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '' as Category | '',
    description: '',
    price: '',
    condition: 'New' as Condition,
    location: currentUser?.location || '',
    quantity: '1',
    tags: '',
    selectedImages: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!formData.title.trim()) e.title = 'Product name is required';
    if (!formData.category) e.category = 'Category is required';
    if (!formData.description.trim()) e.description = 'Description is required';
    if (!formData.price || Number(formData.price) <= 0) e.price = 'Valid price is required';
    if (formData.selectedImages.length === 0) e.images = 'At least one photo is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  const handlePublish = async () => {
    if (!listingType || !formData.category || !currentUser) return;
    setPublishing(true);
    setPublishError(null);
    const { error, id } = await addProduct({
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      category: formData.category,
      condition: formData.condition,
      listingType,
      listingStatus: 'pending-review',
      transactionStatus: 'available',
      images: formData.selectedImages,
      location: formData.location,
      campus: currentUser.campus,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerAvatar: currentUser.avatar,
      sellerVerified: currentUser.verified,
      rating: currentUser.rating,
      reviewCount: 0,
      quantity: Number(formData.quantity),
      tags: formData.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
      views: 0,
      favourites: 0,
    });
    setPublishing(false);
    if (error) {
      setPublishError(error);
      return;
    }
    if (id) navigate(`/product/${id}`);
  };

  const steps = ['Listing Type', 'Details', 'Preview', 'Publish'];

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-ink-500 mb-4">Please sign in to create a listing.</p>
        <Link to="/signin" className="text-brand-600 font-semibold">Sign In</Link>
      </div>
    );
  }

  if (verificationStatus !== 'verified') {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-16 h-16 mx-auto bg-brand-50 rounded-3xl flex items-center justify-center mb-5">
          <ShieldCheck size={32} className="text-brand-600" />
        </div>
        <h1 className="text-2xl font-bold text-ink-900 mb-2">Verification Required</h1>
        <p className="text-ink-500 mb-6">You need to verify your student status before you can create listings on AMPLOFY.</p>
        <Link to="/verify" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors">
          Get Verified <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 mb-2">Sell Something</h1>
      <p className="text-ink-500 mb-6">List your product, pre-owned item, digital product, or service for other students to discover.</p>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1 last:flex-none">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step > i + 1 ? 'bg-brand-600 text-white' : step === i + 1 ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-400'}`}>
              {step > i + 1 ? <Check size={16} /> : i + 1}
            </div>
            <span className={`text-sm font-medium hidden sm:block ${step >= i + 1 ? 'text-ink-700' : 'text-ink-400'}`}>{label}</span>
            {i < steps.length - 1 && <div className={`flex-1 h-px ${step > i + 1 ? 'bg-brand-600' : 'bg-ink-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Listing Type */}
      {step === 1 && (
        <div className="animate-fade-in">
          <h2 className="font-bold text-lg text-ink-800 mb-4">Choose listing type</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {listingTypes.map(lt => (
              <button
                key={lt.value}
                onClick={() => { setListingType(lt.value); setStep(2); }}
                className={`text-left p-5 rounded-2xl border-2 transition-all hover:shadow-soft ${listingType === lt.value ? 'border-brand-600 bg-brand-50' : 'border-ink-200 bg-white hover:border-brand-300'}`}
              >
                <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center mb-3">
                  <lt.icon size={22} className="text-brand-600" />
                </div>
                <h3 className="font-semibold text-ink-800 mb-1">{lt.label}</h3>
                <p className="text-sm text-ink-500">{lt.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <div className="animate-fade-in space-y-5">
          <h2 className="font-bold text-lg text-ink-800">Add details</h2>

          {/* Prohibited items warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 leading-relaxed">
              Only list legal and permitted products/services. Do not list prohibited, dangerous, counterfeit, stolen, or illegal items.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-700 mb-1.5">Product/Service Name *</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Handmade Pearl Bracelet"
              className={`w-full bg-white rounded-xl px-4 py-2.5 text-sm outline-none border ${errors.title ? 'border-error-300 ring-2 ring-error-100' : 'border-ink-200 focus:border-brand-300 focus:ring-2 focus:ring-brand-100'} transition-all`}
            />
            {errors.title && <p className="text-xs text-error-500 mt-1">{errors.title}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-ink-700 mb-1.5">Category *</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
                className={`w-full bg-white rounded-xl px-4 py-2.5 text-sm outline-none border ${errors.category ? 'border-error-300' : 'border-ink-200 focus:border-brand-300 focus:ring-2 focus:ring-brand-100'} transition-all`}
              >
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
              {errors.category && <p className="text-xs text-error-500 mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink-700 mb-1.5">Price (₹) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                placeholder="e.g. 199"
                className={`w-full bg-white rounded-xl px-4 py-2.5 text-sm outline-none border ${errors.price ? 'border-error-300' : 'border-ink-200 focus:border-brand-300 focus:ring-2 focus:ring-brand-100'} transition-all`}
              />
              {errors.price && <p className="text-xs text-error-500 mt-1">{errors.price}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-700 mb-1.5">Description *</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your product or service in detail..."
              rows={4}
              className={`w-full bg-white rounded-xl px-4 py-2.5 text-sm outline-none border resize-none ${errors.description ? 'border-error-300' : 'border-ink-200 focus:border-brand-300 focus:ring-2 focus:ring-brand-100'} transition-all`}
            />
            {errors.description && <p className="text-xs text-error-500 mt-1">{errors.description}</p>}
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-ink-700 mb-1.5">Condition</label>
              <select
                value={formData.condition}
                onChange={e => setFormData({ ...formData, condition: e.target.value as Condition })}
                className="w-full bg-white rounded-xl px-4 py-2.5 text-sm outline-none border border-ink-200 focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all"
              >
                {conditions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink-700 mb-1.5">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Delhi"
                className="w-full bg-white rounded-xl px-4 py-2.5 text-sm outline-none border border-ink-200 focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink-700 mb-1.5">Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                min="1"
                className="w-full bg-white rounded-xl px-4 py-2.5 text-sm outline-none border border-ink-200 focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-700 mb-1.5">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={e => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g. handmade, gift, accessory"
              className="w-full bg-white rounded-xl px-4 py-2.5 text-sm outline-none border border-ink-200 focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all"
            />
          </div>

          {/* Photo selection */}
          <div>
            <label className="block text-sm font-semibold text-ink-700 mb-2">Photos * <span className="text-ink-400 font-normal">(select sample images for prototype)</span></label>
            <div className="grid grid-cols-4 gap-2">
              {sampleImages.map((img, i) => {
                const selected = formData.selectedImages.includes(img);
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        selectedImages: selected
                          ? prev.selectedImages.filter(s => s !== img)
                          : [...prev.selectedImages, img],
                      }));
                    }}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${selected ? 'border-brand-600 ring-2 ring-brand-200' : 'border-ink-200 hover:border-brand-300'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    {selected && (
                      <div className="absolute inset-0 bg-brand-600/20 flex items-center justify-center">
                        <div className="w-7 h-7 bg-brand-600 rounded-full flex items-center justify-center">
                          <Check size={16} className="text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            {errors.images && <p className="text-xs text-error-500 mt-1">{errors.images}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setStep(1)} className="flex items-center gap-1.5 px-5 py-2.5 border border-ink-200 rounded-xl text-sm font-semibold text-ink-700 hover:bg-ink-50 transition-colors">
              <ChevronLeft size={18} /> Back
            </button>
            <button
              onClick={() => { if (validateStep2()) setStep(3); }}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors"
            >
              Preview Listing <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Preview */}
      {step === 3 && (
        <div className="animate-fade-in">
          <h2 className="font-bold text-lg text-ink-800 mb-4">Preview your listing</h2>
          <div className="bg-white rounded-2xl shadow-soft border border-ink-100 overflow-hidden">
            <div className="aspect-[4/3] bg-ink-100 overflow-hidden">
              <img src={formData.selectedImages[0]} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">{formData.category}</span>
                <span className="text-xs font-semibold text-ink-500 bg-ink-100 px-2.5 py-1 rounded-full">{formData.condition}</span>
              </div>
              <h3 className="text-xl font-bold text-ink-900 mb-2">{formData.title || 'Untitled'}</h3>
              <p className="text-2xl font-extrabold text-ink-900 mb-3">₹{formData.price || '0'}</p>
              <p className="text-sm text-ink-600 leading-relaxed mb-3">{formData.description || 'No description provided.'}</p>
              <div className="flex items-center gap-3 text-sm text-ink-400">
                <span className="inline-flex items-center gap-1"><MapPin size={14} /> {formData.location}</span>
                <span className="inline-flex items-center gap-1"><Tag size={14} /> {formData.quantity} available</span>
              </div>
              {formData.tags && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {formData.tags.split(',').map(t => t.trim()).filter(Boolean).map((t, i) => (
                    <span key={i} className="px-2 py-0.5 bg-ink-100 text-ink-600 text-xs rounded-full">#{t.toLowerCase()}</span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-ink-100">
                {currentUser.avatar ? <img src={currentUser.avatar} alt="" className="w-7 h-7 rounded-full object-cover" /> : <div className="w-7 h-7 rounded-full bg-brand-50" />}
                <span className="text-sm text-ink-700 font-medium">{currentUser.name || 'You'}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button onClick={() => setStep(2)} className="flex items-center gap-1.5 px-5 py-2.5 border border-ink-200 rounded-xl text-sm font-semibold text-ink-700 hover:bg-ink-50 transition-colors">
              <ChevronLeft size={18} /> Edit
            </button>
            <button
              onClick={() => setStep(4)}
              className="flex-1 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors"
            >
              Continue to Publish
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Publish */}
      {step === 4 && (
        <div className="animate-fade-in text-center py-8">
          <div className="w-20 h-20 mx-auto bg-brand-50 rounded-3xl flex items-center justify-center mb-5">
            <Check size={40} className="text-brand-600" />
          </div>
          <h2 className="text-2xl font-bold text-ink-900 mb-3">Ready to publish!</h2>
          <p className="text-ink-500 mb-6 max-w-md mx-auto">Your listing will be submitted for review before becoming visible on AMPLOFY. Make sure all details are correct.</p>

          <div className="bg-ink-50 rounded-xl p-4 text-left max-w-md mx-auto mb-6">
            <h3 className="text-sm font-semibold text-ink-700 mb-2">Listing Summary</h3>
            <div className="space-y-1.5 text-sm text-ink-600">
              <p><span className="text-ink-400">Title:</span> {formData.title}</p>
              <p><span className="text-ink-400">Price:</span> ₹{formData.price}</p>
              <p><span className="text-ink-400">Category:</span> {formData.category}</p>
              <p><span className="text-ink-400">Type:</span> {listingTypes.find(lt => lt.value === listingType)?.label}</p>
              <p><span className="text-ink-400">Photos:</span> {formData.selectedImages.length} selected</p>
            </div>
          </div>

          <div className="flex gap-3 max-w-md mx-auto">
            <button onClick={() => setStep(3)} className="flex-1 px-5 py-2.5 border border-ink-200 rounded-xl text-sm font-semibold text-ink-700 hover:bg-ink-50 transition-colors">
              Back
            </button>
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="flex-1 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {publishing ? 'Publishing...' : 'Publish Listing'}
            </button>
          </div>
          {publishError && (
            <p className="text-sm text-error-500 mt-3">{publishError}</p>
          )}
        </div>
      )}
    </div>
  );
}
