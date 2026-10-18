import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  ShieldCheck,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Calendar,
  Share2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { CategoryBadge } from '@/components/ui/Badge';
import ProductCard from '@/components/ProductCard';
import ContactSellerModal from '@/components/ContactSellerModal';
import { useToast } from '@/components/ui/Toast';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listings } = useApp();
  const { toast } = useToast();

  const [activeImage, setActiveImage] = useState(0);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // Find product from listings or fallback to first product
  const product = listings.find(l => l.id === id) || listings.find(l => l.type === 'product');

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Product not found</h2>
        <p className="text-sm text-slate-500">This listing may have been sold or removed.</p>
        <Link to="/products">
          <Button variant="primary" size="md">
            Browse All Products
          </Button>
        </Link>
      </div>
    );
  }

  const seller = product.seller || {
    name: 'Campus Student',
    avatar: product.images[0],
    department: 'Campus Member',
    college: 'University Campus',
    isVerified: true,
    accountType: 'student',
    showContact: true,
  };

  const similarProducts = listings
    .filter(l => l.type === 'product' && l.id !== product.id && (l.category === product.category || l.sellerId === product.sellerId))
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Listing link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium">
        <Link to="/" className="hover:text-slate-700 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-slate-700 transition-colors">Products</Link>
        <span>/</span>
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-slate-700 transition-colors">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-slate-700 truncate max-w-[200px]">{product.title}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Image Gallery (4:3 ratio) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="relative aspect-[4/3] w-full bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <img
              src={product.images[activeImage] || 'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=800'}
              alt={product.title}
              className="w-full h-full object-cover"
            />

            {product.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveImage((activeImage - 1 + product.images.length) % product.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-700 shadow-md hover:bg-white transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImage((activeImage + 1) % product.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-700 shadow-md hover:bg-white transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImage === idx ? 'border-[#0F766E] shadow-xs' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details, Seller Mini-Card, CTAs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            {/* Category & Condition tags */}
            <div className="flex items-center gap-2">
              <CategoryBadge category={product.category} />
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {product.condition || 'Like New'}
              </span>
              {product.ownerType === 'startup' && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-[#0F766E] border border-teal-200">
                  Student Startup
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                ${Number(product.basePrice).toFixed(0)}
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Available for pickup
              </span>
            </div>

            {/* Location & Distance */}
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{product.location} • {product.distance || '0.2 mi'} from your campus center</span>
            </div>
          </div>

          {/* Description */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Description
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Seller Mini-Card */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Seller Information
              </span>
              <span className="text-xs text-slate-400">Campus Verified</span>
            </div>

            <div className="flex items-center gap-3">
              <Avatar
                src={seller.avatar}
                name={seller.name}
                size="md"
                verified={seller.isVerified}
                isStartup={product.ownerType === 'startup'}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-slate-900 truncate">
                    {seller.name}
                  </h4>
                  {seller.isVerified && (
                    <ShieldCheck className="w-4 h-4 text-[#0F766E] shrink-0" title="Verified Campus Member" />
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate">
                  {seller.department} • {seller.college}
                </p>
              </div>
            </div>
          </div>

          {/* Actions: "Contact seller" (NO heart / wishlist button per scope decision) */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              leftIcon={<MessageSquare className="w-4 h-4" />}
              onClick={() => setContactModalOpen(true)}
            >
              Contact seller
            </Button>
            <button
              type="button"
              onClick={handleShare}
              className="p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
              title="Share Listing"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Safety Tips Box */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-950">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Campus Safety Tips</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-amber-800 leading-relaxed pl-1">
              <li>Meet in public campus areas (student center, library, dining halls).</li>
              <li>Inspect item condition thoroughly before completing payment.</li>
              <li>Never pay outside the platform for delivery services.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section className="pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Similar Campus Listings
            </h2>
            <Link
              to={`/products?category=${encodeURIComponent(product.category)}`}
              className="text-xs font-semibold text-[#0F766E] hover:underline inline-flex items-center gap-1"
            >
              <span>See more</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {similarProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Contact Seller Modal */}
      <ContactSellerModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        seller={seller}
        listingTitle={product.title}
      />
    </div>
  );
}
