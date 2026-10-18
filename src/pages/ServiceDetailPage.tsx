import { useState, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import {
  Star,
  Clock,
  RotateCcw,
  Check,
  ShieldCheck,
  ChevronDown,
  MessageSquare,
  Send,
  ArrowRight,
  Share2,
  Calendar,
  Lock,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { CategoryBadge } from '@/components/ui/Badge';
import ServiceCard from '@/components/ServiceCard';
import ContactSellerModal from '@/components/ContactSellerModal';
import OrderQuoteModal from '@/components/OrderQuoteModal';
import { useToast } from '@/components/ui/Toast';
import type { ServicePackage } from '@/data/types';

export default function ServiceDetailPage() {
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get('id');
  const serviceId = paramId || queryId;

  const { services, listings, reviews } = useApp();
  const { toast } = useToast();

  const allServices = services.length > 0 ? services : listings.filter(l => l.type === 'service');
  const service = allServices.find(s => s.id === serviceId) || allServices[0];

  // Selected package tab
  const [selectedTier, setSelectedTier] = useState<'basic' | 'standard' | 'premium'>('standard');
  const [activeImage, setActiveImage] = useState(0);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderModalMode, setOrderModalMode] = useState<'order' | 'quote'>('order');

  // FAQ accordion open states
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Fallback default packages if none specified
  const packages: ServicePackage[] = useMemo(() => {
    if (service.packages && service.packages.length > 0) {
      return service.packages;
    }
    const base = service.basePrice || 35;
    return [
      {
        id: `pkg-${service.id}-basic`,
        listingId: service.id,
        tier: 'basic',
        title: 'Basic Service Starter',
        price: base,
        deliveryDays: service.deliveryDays || 1,
        revisions: 1,
        features: ['Initial consultation & kickoff', 'Core deliverable delivery', '1 revision included'],
      },
      {
        id: `pkg-${service.id}-standard`,
        listingId: service.id,
        tier: 'standard',
        title: 'Standard Comprehensive Package',
        price: Math.round(base * 2.2),
        deliveryDays: Math.min((service.deliveryDays || 1) * 3, 7),
        revisions: 3,
        features: ['Full project execution', 'Direct campus meetup or digital delivery', 'Source deliverables / notes included', '3 revisions included'],
      },
      {
        id: `pkg-${service.id}-premium`,
        listingId: service.id,
        tier: 'premium',
        title: 'Premium Master Suite',
        price: Math.round(base * 4.5),
        deliveryDays: Math.min((service.deliveryDays || 1) * 5, 14),
        revisions: 6,
        features: ['End-to-end priority fulfillment', 'Unlimited WhatsApp Q&A support', 'Extended post-delivery assistance', 'Priority rush turnaround'],
      },
    ];
  }, [service]);

  const activePackage = packages.find(p => p.tier === selectedTier) || packages[0];

  const faqs = [
    {
      q: 'How does scheduling and delivery work?',
      a: 'Once you place an inquiry or quote request, you and the provider coordinate directly on campus or via order notes. Deliverables can be provided in person or uploaded as digital files to order notes.',
    },
    {
      q: 'What if I need revisions on deliverables?',
      a: `This package includes ${activePackage.revisions} revision rounds. You can request revisions directly on the Order page timeline after delivery.`,
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
    name: 'Campus Provider',
    avatar: service.images[0],
    department: service.ownerType === 'startup' ? 'Startup Agency' : 'Student Freelancer',
    college: 'University Campus',
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
                src={service.images[activeImage] || 'https://images.pexels.com/photos/3771074/pexels-photo-3771074.jpeg?auto=compress&cs=tinysrgb&w=1200'}
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
          </div>

          {/* Title & Metadata */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {service.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{service.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-normal">({service.reviewCount} campus reviews)</span>
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

          {/* Seller Mini-Card */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3.5">
              <Avatar
                src={seller.avatar}
                name={seller.name}
                size="md"
                verified={seller.isVerified}
                isStartup={service.ownerType === 'startup'}
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

            {service.ownerType === 'startup' && service.startupId ? (
              <Link
                to={`/startups/${service.startup?.slug || 'technexus-labs'}`}
                className="text-xs font-semibold text-[#0F766E] hover:underline"
              >
                View Startup Profile →
              </Link>
            ) : null}
          </div>

          {/* About this service */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
              About This Service
            </h2>
            <div className="text-sm text-slate-600 leading-relaxed space-y-3 bg-white p-5 rounded-xl border border-slate-200">
              <p>{service.description}</p>
              <p>
                Whether you need assistance preparing for exams, polishing your portfolio, creating digital assets, or building a startup project, this service is backed by peer reviews and verified campus credentials.
              </p>
            </div>
          </div>

          {/* Package Selector Tabs (Basic / Standard / Premium) */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
              Compare Packages
            </h2>

            {/* Tab Buttons */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-xl">
              {(['basic', 'standard', 'premium'] as const).map(tier => {
                const pkg = packages.find(p => p.tier === tier);
                const isActive = selectedTier === tier;
                return (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setSelectedTier(tier)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white text-[#0F766E] shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {tier} (${pkg?.price})
                  </button>
                );
              })}
            </div>

            {/* Active Package Details Box */}
            <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {activePackage.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tier: <span className="uppercase font-semibold text-[#0F766E]">{activePackage.tier}</span>
                  </p>
                </div>
                <span className="text-2xl font-extrabold text-slate-900">
                  ${activePackage.price}
                </span>
              </div>

              <div className="flex items-center gap-6 text-xs text-slate-600 font-medium pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#0F766E]" />
                  <span>{activePackage.deliveryDays} Days Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4 text-[#0F766E]" />
                  <span>{activePackage.revisions} Revisions</span>
                </div>
              </div>

              {/* Inclusions list */}
              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold text-slate-700">What's Included:</p>
                <ul className="space-y-1.5">
                  {activePackage.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                      <Check className="w-4 h-4 text-[#0F766E] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
              Frequently Asked Questions
            </h2>
            <div className="space-y-2">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-4 text-left font-semibold text-xs text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          isOpen ? 'rotate-180 text-[#0F766E]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviews Breakdown & List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
                Student &amp; Client Reviews
              </h2>
              <span className="text-xs text-slate-500 font-semibold">
                {service.reviewCount} total reviews
              </span>
            </div>

            {/* Rating breakdown summary */}
            <div className="p-5 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-6">
              <div className="text-center sm:border-r sm:border-slate-100 sm:pr-6 shrink-0">
                <span className="text-4xl font-extrabold text-slate-900">{service.rating.toFixed(1)}</span>
                <div className="flex items-center justify-center gap-1 my-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <span className="text-[11px] text-slate-400">Campus Rating</span>
              </div>

              {/* Progress bars */}
              <div className="w-full space-y-1.5 text-xs text-slate-600">
                {[
                  { stars: 5, pct: '92%' },
                  { stars: 4, pct: '8%' },
                  { stars: 3, pct: '0%' },
                  { stars: 2, pct: '0%' },
                  { stars: 1, pct: '0%' },
                ].map(r => (
                  <div key={r.stars} className="flex items-center gap-2">
                    <span className="w-12 text-slate-500">{r.stars} stars</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: r.pct }} />
                    </div>
                    <span className="w-8 text-right text-[11px] text-slate-400">{r.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review List */}
            <div className="space-y-3">
              {serviceReviews.map(rev => (
                <div key={rev.id} className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar src={rev.reviewerAvatar} name={rev.reviewerName} size="xs" />
                      <span className="text-xs font-bold text-slate-900">{rev.reviewerName}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{rev.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />
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

        {/* Right Sticky Order Card (NO save/favourite button) */}
        <div className="lg:col-span-4 sticky top-20">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-5">
            {/* Header: Selected Tier & Price */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                  {activePackage.tier} Tier
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
              {/* Place Order Button */}
              <Button
                variant="primary"
                size="lg"
                className="w-full shadow-sm"
                onClick={() => {
                  setOrderModalMode('order');
                  setOrderModalOpen(true);
                }}
              >
                Place order
              </Button>

              {/* Request Custom Quote */}
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

              {/* Contact Seller Button */}
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
                <span>Verified student / startup account</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Chronological order notes tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero fees for students</span>
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
