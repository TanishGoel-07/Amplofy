import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import type { Listing, Product } from '@/data/types';
import { Avatar } from '@/components/ui/Avatar';
import { PromoBadge } from '@/components/ui/Badge';

interface ProductCardProps {
  product: Product | Listing;
  className?: string;
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  // Support both Product and Listing shapes
  const price = 'basePrice' in product ? product.basePrice : product.price;
  const sellerName = 'seller' in product && product.seller ? product.seller.name : product.sellerName || 'Campus Student';
  const sellerAvatar = 'seller' in product && product.seller ? product.seller.avatar : product.sellerAvatar;
  const sellerDept = ('seller' in product && product.seller?.department) || 'Campus Member';
  const distance = ('distance' in product && product.distance) || '0.3 mi';
  const isStartup = ('ownerType' in product && product.ownerType === 'startup');
  const isHotDeal = price >= 100 && ('featured' in product && product.featured);
  const isNew = !isHotDeal && ('featured' in product && product.featured);

  return (
    <Link
      to={`/product/${product.id}`}
      className={`group block bg-white rounded-xl border border-slate-200 p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-slate-300 ${className}`}
    >
      {/* 4:3 Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-100 mb-3">
        <img
          src={product.images?.[0] || 'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=800'}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Promo Badge on top-left (no heart icon anywhere per specifications) */}
        {isHotDeal ? (
          <div className="absolute top-2.5 left-2.5">
            <PromoBadge label="Hot Deal" variant="amber" />
          </div>
        ) : isNew ? (
          <div className="absolute top-2.5 left-2.5">
            <PromoBadge label="New Listing" variant="teal" />
          </div>
        ) : null}

        {isStartup && (
          <div className="absolute top-2.5 right-2.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-teal-800 border border-teal-200 shadow-xs">
              Startup
            </span>
          </div>
        )}
      </div>

      {/* Seller info */}
      <div className="flex items-center gap-2 mb-1.5 min-w-0">
        <Avatar
          src={sellerAvatar}
          name={sellerName}
          size="xs"
          isStartup={isStartup}
        />
        <p className="text-xs text-slate-500 truncate">
          <span className="font-medium text-slate-700">{sellerName}</span>
          <span className="mx-1">•</span>
          <span>{sellerDept}</span>
        </p>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-[#0F766E] transition-colors mb-2">
        {product.title}
      </h3>

      {/* Price & Location Row */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-auto">
        <span className="text-base font-bold text-slate-900 tracking-tight">
          ${Number(price).toFixed(0)}
        </span>
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <MapPin className="w-3 h-3 text-slate-400" />
          <span>{distance}</span>
        </div>
      </div>
    </Link>
  );
}
