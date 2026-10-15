import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  reviewCount?: number;
  className?: string;
}

export default function StarRating({ rating, size = 'sm', showNumber = false, reviewCount, className = '' }: StarRatingProps) {
  const sizes = { sm: 12, md: 16, lg: 20 };
  const starSize = sizes[size];
  const textSize = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }[size];

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(n => {
          const fill = Math.max(0, Math.min(1, rating - (n - 1)));
          return (
            <div key={n} className="relative" style={{ width: starSize, height: starSize }}>
              <Star size={starSize} className="absolute inset-0 text-amber-300" fill="currentColor" />
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${(1 - fill) * 100}%` }}>
                <Star size={starSize} className="text-gray-300" fill="currentColor" />
              </div>
            </div>
          );
        })}
      </div>
      {showNumber && (
        <span className={`font-semibold text-ink-700 ${textSize}`}>{rating.toFixed(1)}</span>
      )}
      {reviewCount !== undefined && (
        <span className={`text-ink-400 ${textSize}`}>({reviewCount})</span>
      )}
    </div>
  );
}
