import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { Listing } from '@/data/types';
import { Avatar } from '@/components/ui/Avatar';

interface ServiceListCardProps {
  service: Listing;
  className?: string;
}

export default function ServiceListCard({ service, className = '' }: ServiceListCardProps) {
  const sellerName = service.seller?.name || 'Campus Expert';
  const sellerAvatar = service.seller?.avatar || service.images[0];
  const sellerDept = service.seller?.department || (service.ownerType === 'startup' ? 'Startup' : 'Student');
  const priceType = service.priceType === 'hourly' ? '/hr' : service.priceType === 'starting_at' ? ' from' : '';

  return (
    <Link
      to={`/services?id=${service.id}`}
      className={`group flex items-start gap-4 p-3.5 bg-white rounded-xl border border-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300 ${className}`}
    >
      {/* Thumbnail or Avatar */}
      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
        <img
          src={service.images?.[0] || sellerAvatar}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {service.ownerType === 'startup' && (
          <span className="absolute bottom-0 right-0 bg-[#0F766E] text-white text-[8px] font-bold px-1 rounded-tl-md">
            PRO
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-sm text-slate-900 group-hover:text-[#0F766E] transition-colors line-clamp-1">
            {service.title}
          </h4>
          <span className="font-bold text-sm text-slate-900 shrink-0">
            ${Number(service.basePrice).toFixed(0)}{priceType}
          </span>
        </div>

        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 leading-snug">
          {service.description}
        </p>

        {/* Metadata row */}
        <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-0.5 font-semibold text-amber-600">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span>{service.rating.toFixed(1)}</span>
          </div>
          <span>•</span>
          <span className="text-slate-600 truncate">{sellerDept}</span>
          <span>•</span>
          <span className="text-slate-400">Today</span>
        </div>
      </div>
    </Link>
  );
}
