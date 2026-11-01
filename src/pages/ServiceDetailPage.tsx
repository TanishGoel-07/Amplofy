import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import {
  Star,
  Clock,
  RotateCcw,
  Check,
  ShieldCheck,
  ChevronDown,
  MessageSquare,
  ArrowRight,
  Share2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { mockServices } from '@/data/mockData';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { CategoryBadge } from '@/components/ui/Badge';
import ServiceCard from '@/components/ServiceCard';
import ContactSellerModal from '@/components/ContactSellerModal';
import OrderQuoteModal from '@/components/OrderQuoteModal';
import PaymentCheckoutModal from '@/components/PaymentCheckoutModal';
import { useToast } from '@/components/ui/Toast';
import type { ServicePackage } from '@/data/types';

export default function ServiceDetailPage() {
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get('id');
  const serviceId = paramId || queryId;

  const { services, listings, reviews, startups } = useApp();
  const { toast } = useToast();

  const appServices = services.length > 0 ? services : listings.filter(l => l.type === 'service');
  const allServices = appServices.length > 0 ? appServices : mockServices;
  const service = allServices.find(s => s.id === serviceId) || allServices[0];

  // Selected package tab
  const [selectedTier, setSelectedTier] = useState<'basic' | 'standard' | 'premium'>('standard');
  const [activeImage, setActiveImage] = useState(0);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(() => searchParams.get('pay') === 'true');

  useEffect(() => {
    if (searchParams.get('pay') === 'true') {
      setCheckoutModalOpen(true);
    }
  }, [searchParams]);
  const [orderModalMode, setOrderModalMode] = useState<'order' | 'quote'>('order');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Safe fallback packages
  const packages: ServicePackage[] = useMemo(() => {
    if (!service) return [];
    if (service.packages && service.packages.length > 0) {
      return service.packages;
    }
    const base = Number(service.basePrice || service.price || 40);
    return [
      {
        id: `pkg-${service.id}-basic`,
        listingId: service.id,
        tier: 'basic',
        title: 'Starter / Consultation',
        price: base,
        deliveryDays: service.deliveryDays || 1,
        revisions: 1,
        features: ['Initial consultation & kickoff', 'Core deliverable draft', '1 revision round included'],
      },
      {
        id: `pkg-${service.id}-standard`,
        listingId: service.id,
        tier: 'standard',
        title: 'Standard Comprehensive Package',
        price: Math.round(base * 2.2),
        deliveryDays: Math.min((service.deliveryDays || 1) * 3, 5),
        revisions: 2,
        features: ['Full production execution', 'Source deliverables & files included', '2 revision rounds included', 'Direct campus coordination'],
      },
      {
        id: `pkg-${service.id}-premium`,
        listingId: service.id,
        tier: 'premium',
        title: 'Enterprise / Full-Suite',
        price: Math.round(base * 4.2),
        deliveryDays: Math.min((service.deliveryDays || 1) * 5, 10),
        revisions: 3,
        features: ['End-to-end priority fulfillment', 'Unlimited project messaging support', 'Commercial license & IP rights transfer', 'Post-delivery follow-up'],
      },
    ];
  }, [service]);

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Service Offering Not Found</h2>
        <p className="text-sm text-slate-500">
          The requested startup service offering does not exist or may have been updated.
        </p>
        <Link to="/services">
          <Button variant="primary" size="md">
            Browse All Startup Services
          </Button>
        </Link>
      </div>
    );
  }

  const activePackage = packages.find(p => p.tier === selectedTier) || packages[0] || {
    id: 'pkg-default',
    title: 'Standard Service Offering',
    price: Number(service.basePrice || service.price || 45),
    deliveryDays: service.deliveryDays || 3,
    revisions: 2,
    features: ['Standard Scope Delivery', 'Direct Founder Notes Tracking'],
  };

  const ratingVal = service.rating ? Number(service.rating) : 5.0;
  const reviewCount = service.reviewCount ?? 0;
  const serviceImages = (service.images && service.images.length > 0)
    ? service.images
    : ['https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1200'];

  const linkedStartup = startups.find(
    st => st.id === service.startupId || st.name === service.startupName
  );
  const startupSlug = linkedStartup?.slug || service.startup?.slug || 'technexus-labs';

  const faqs = [
    {
      q: 'How does scheduling and delivery work?',
      a: 'Once you place an order or quote request, you and the provider coordinate directly on campus or via order notes. Deliverables can be provided in person or uploaded as digital files to order notes.',
    },
    {
      q: 'What if I need revisions on deliverables?',
      a: `This package includes ${activePackage.revisions || 2} revision rounds. You can request revisions directly on the Order page timeline after delivery.`,
    },
    {
      q: 'Can I request a custom scope or budget?',
      a: 'Yes! Use the "Request custom quote" button to outline your specific project needs, deadlines, and budget.',
    },
  ];

  // Reviews for this service
  const serviceReviews = reviews.filter(r => r.listingId === service.id || r.revieweeId === service.sellerId);

  const relatedServices = allServices
    .filter(s => s.id !== service.id && (s.category === service.category || s.sellerId === service.sellerId))
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Service link copied to clipboard!');
    }
  };

  const seller = service.seller || {
    name: service.startupName || 'Campus Provider',
    avatar: serviceImages[0],
    department: service.ownerType === 'startup' ? 'Startup Agency' : 'Student Specialist',
    college: service.location || 'University Campus',
    isVerified: true,
    accountType: service.ownerType === 'startup' ? 'startup' : 'student',
    showContact: true,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium">
        <Link to="/" className="hover:text-slate-700 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/services" className="hover:text-slate-700 transition-colors">Services</Link>
        <span>/</span>
        <Link to={`/services?category=${encodeURIComponent(service.category)}`} className="hover:text-slate-700 transition-colors">
          {service.category}
        </Link>
        <span>/</span>
        <span className="text-slate-700 truncate max-w-[200px]">{service.title}</span>
      </nav>

      {/* Main Grid: Left Details (8 cols) + Sticky Right Card (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Cover & Gallery Carousel */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
              <img
                src={serviceImages[activeImage] || serviceImages[0]}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <CategoryBadge category={service.category} />
              </div>
              {service.ownerType === 'startup' && (
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#0F766E] text-white shadow-xs">
                    Verified Startup
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail selector */}
            {serviceImages.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {serviceImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      activeImage === idx
                        ? 'border-[#0F766E] shadow-sm'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Metadata */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {service.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{ratingVal.toFixed(1)}</span>
                <span className="text-slate-400 font-normal">({reviewCount} campus reviews)</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1 text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Average delivery: ~{service.deliveryDays || 1} day(s)</span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Accepting new orders
              </span>
            </div>
          </div>

          {/* Seller / Venture Mini-Card */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3.5">
              <Avatar
                src={seller.avatar}
                name={seller.name}
                size="md"
                isStartup={service.ownerType === 'startup'}
                verified={seller.isVerified}
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-slate-900">
                    {seller.name}
                  </h4>
                  {seller.isVerified && (
                    <ShieldCheck className="w-4 h-4 text-[#0F766E]" title="Verified Provider" />
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  {seller.department} • {seller.college}
                </p>
              </div>
            </div>

            {service.ownerType === 'startup' ? (
              <Link
                to={`/startups/${startupSlug}`}
                className="text-xs font-semibold text-[#0F766E] hover:underline"
              >
                View Startup Profile →
              </Link>
            ) : null}
          </div>

          {/* About this service */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
              About this Service
            </h2>
            <div className="prose prose-sm text-slate-600 max-w-none leading-relaxed whitespace-pre-line">
              {service.description}
            </div>
          </div>

          {/* 3 Package Tiers Comparison Table */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
                Compare Packages
              </h2>
              <span className="text-xs text-slate-400 font-medium">Select a tier to order</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {packages.map(pkg => {
                const isSelected = selectedTier === pkg.tier;
                return (
                  <div
                    key={pkg.id || pkg.tier}
                    onClick={() => pkg.tier && setSelectedTier(pkg.tier as 'basic' | 'standard' | 'premium')}
                    className={`rounded-2xl border p-5 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#0F766E] ring-2 ring-[#0F766E]/20 bg-teal-50/20 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {pkg.tier || 'Package'}
                      </span>
                      {pkg.tier === 'standard' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0F766E] text-white">
                          Popular
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm mb-1">{pkg.title}</h3>
                    <div className="text-2xl font-extrabold text-slate-900 mb-3">
                      ${pkg.price}
                    </div>

                    <div className="space-y-2 text-xs text-slate-600 mb-4 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#0F766E]" />
                        <span>{pkg.deliveryDays} Days Turnaround</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium">
                        <RotateCcw className="w-3.5 h-3.5 text-[#0F766E]" />
                        <span>{pkg.revisions} Revisions Included</span>
                      </div>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-600">
                      {pkg.features?.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FAQs Accordion */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
              Frequently Asked Questions
            </h2>
            <div className="space-y-2">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 overflow-hidden bg-white"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-4 flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        openFaq === idx ? 'rotate-180 text-[#0F766E]' : ''
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Client Reviews Section */}
          <div className="space-y-6 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
                Student &amp; Client Reviews
              </h2>
              <span className="text-xs text-slate-500 font-semibold">
                {reviewCount} total reviews
              </span>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-6">
              <div className="text-center sm:border-r sm:border-slate-100 sm:pr-6 shrink-0">
                <span className="text-4xl font-extrabold text-slate-900">{ratingVal.toFixed(1)}</span>
                <div className="flex items-center justify-center gap-1 my-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <span className="text-[11px] text-slate-400">Campus Rating</span>
              </div>

              <div className="w-full space-y-1.5 text-xs text-slate-600">
                {[
                  { stars: 5, pct: '92%' },
                  { stars: 4, pct: '8%' },
                  { stars: 3, pct: '0%' },
                  { stars: 2, pct: '0%' },
                  { stars: 1, pct: '0%' },
                ].map(r => (
                  <div key={r.stars} className="flex items-center gap-2">
                    <span className="w-12 text-slate-400">{r.stars} stars</span>
                    <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: r.pct }} />
                    </div>
                    <span className="w-8 text-right text-slate-400">{r.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {serviceReviews.map(rev => (
                <div key={rev.id} className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar src={rev.reviewerAvatar} name={rev.reviewerName} size="xs" />
                      <span className="font-bold text-xs text-slate-900">{rev.reviewerName}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{rev.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Services */}
          {relatedServices.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-slate-200">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Related Campus Services
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {relatedServices.map(rel => (
                  <ServiceCard key={rel.id} service={rel} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Order Card */}
        <div className="lg:col-span-4 sticky top-20">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-5">
            {/* Header: Selected Tier & Price */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                  {activePackage.tier || 'Selected'} Tier
                </span>
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-baseline justify-between">
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  ${activePackage.price}
                </h3>
                <span className="text-xs font-medium text-slate-500">
                  {service.priceType === 'hourly' ? 'per hour' : 'fixed package'}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600 mt-1">
                {activePackage.title}
              </p>
            </div>

            {/* Quick specs */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#0F766E]" />
                {activePackage.deliveryDays} Days Turnaround
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <RotateCcw className="w-3.5 h-3.5 text-[#0F766E]" />
                {activePackage.revisions} Revisions
              </span>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <Button
                variant="primary"
                size="lg"
                className="w-full shadow-sm font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 border border-amber-600/30"
                onClick={() => {
                  setCheckoutModalOpen(true);
                }}
              >
                Buy Service &amp; Pay (${activePackage.price})
              </Button>

              <Button
                variant="secondary"
                size="md"
                className="w-full"
                onClick={() => {
                  setOrderModalMode('quote');
                  setOrderModalOpen(true);
                }}
              >
                Request custom quote
              </Button>

              <Button
                variant="ghost"
                size="md"
                className="w-full"
                leftIcon={<MessageSquare className="w-4 h-4" />}
                onClick={() => setContactModalOpen(true)}
              >
                Contact seller
              </Button>
            </div>

            {/* Trust list */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified student / startup venture</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Chronological order notes tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero commission middleman fees</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Seller Modal */}
      <ContactSellerModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        seller={seller}
        listingTitle={service.title}
      />

      {/* Direct Payment Checkout Modal */}
      <PaymentCheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        listing={service}
        selectedPackage={activePackage}
        startup={linkedStartup}
      />

      {/* Place Order & Custom Quote Modal */}
      <OrderQuoteModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        listing={service}
        selectedPackage={activePackage}
        mode={orderModalMode}
      />
    </div>
  );
}
