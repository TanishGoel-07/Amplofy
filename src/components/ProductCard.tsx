import { Link } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';
import type { Product } from '@/data/types';
import { useApp } from '@/context/AppContext';
import VerifiedBadge from './VerifiedBadge';
import StarRating from './StarRating';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const { favouriteProducts, toggleProductFavourite } = useApp();
  const isFav = favouriteProducts.includes(product.id);

  return (
    <Link
      to={`/product/${product.id}`}
      className={`group block bg-white rounded-2xl shadow-soft hover:shadow-float transition-all duration-300 overflow-hidden border border-ink-100 ${className}`}
    >
      <div className="relative aspect-square overflow-hidden bg-ink-100">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleProductFavourite(product.id);
          }}
          className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-transform"
          aria-label="Toggle favourite"
        >
          <Heart
            size={18}
            className={isFav ? 'text-error-500' : 'text-ink-400'}
            fill={isFav ? 'currentColor' : 'none'}
          />
        </button>
        {product.featured && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-accent-500 text-white text-xs font-semibold rounded-full shadow-sm">
            Featured
          </span>
        )}
      </div>

      <div className="p-3.5">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
            {product.category}
          </span>
          {product.listingType === 'pre-owned' && (
            <span className="text-xs font-medium text-ink-500 bg-ink-100 px-2 py-0.5 rounded-full">
              Pre-Owned
            </span>
          )}
        </div>

        <h3 className="font-semibold text-ink-800 text-sm leading-snug line-clamp-2 mb-1.5 group-hover:text-brand-700 transition-colors">
          {product.title}
        </h3>

        <p className="text-lg font-bold text-ink-900 mb-1.5">
          ₹{product.price}
        </p>

        <div className="flex items-center gap-1 text-xs text-ink-400 mb-2">
          <MapPin size={12} className="shrink-0" />
          <span className="truncate">{product.location}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-ink-100">
          <div className="flex items-center gap-1.5 min-w-0">
            <img
              src={product.sellerAvatar}
              alt={product.sellerName}
              className="w-5 h-5 rounded-full object-cover shrink-0"
            />
            <span className="text-xs text-ink-600 truncate">{product.sellerName}</span>
            {product.sellerVerified && <VerifiedBadge size="sm" />}
          </div>
          {product.rating > 0 && (
            <StarRating rating={product.rating} size="sm" showNumber className="shrink-0" />
          )}
        </div>
      </div>
    </Link>
  );
}
