import { Link } from 'react-router-dom';
import { Star, Clock, ArrowRight, Building2, ShieldCheck } from 'lucide-react';
import type { Listing } from '@/data/types';
import { Avatar } from '@/components/ui/Avatar';
import { CategoryBadge } from '@/components/ui/Badge';

interface ServiceCardProps {
  service: Listing;
  className?: string;
}

export default function ServiceCard({ service, className = '' }: ServiceCardProps) {
  const isStartup = service.ownerType === 'startup';
  const sellerName = service.seller?.name || 'Campus Expert';
  const sellerAvatar = service.seller?.avatar || service.images?.[0];
  const sellerDept = service.seller?.department || (isStartup ? 'Startup' : 'Student');
  const deliveryDays = service.deliveryDays || 1;

  // Price label by price type: Hourly / Fixed / Starting at
  let priceLabel = 'Fixed Price';
  let priceSuffix = '';
  if (service.priceType === 'hourly') {
    priceLabel = 'Hourly';
    priceSuffix = '/hr';
  } else if (service.priceType === 'starting_at') {
    priceLabel = 'Starting at';
  }

  return (
    <div
      className={`group bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-slate-300 ${
        isStartup ? 'border-t-2 border-t-[#0F766E]' : ''
      } ${className}`}
    >
      <div>
        {/* Cover Image & Category tag */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
          <img
            src={service.images?.[0] || 'https://images.pexels.com/photos/3771074/pexels-photo-3771074.jpeg?auto=compress&cs=tinysrgb&w=800'}
            alt={service.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-2.5 left-2.5">
            <CategoryBadge category={service.category} />
          </div>
          {isStartup && (
            <div className="absolute top-2.5 right-2.5">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0F766E] text-white shadow-xs">
                Startup
              </span>
            </div>
          )}
        </div>

        {/* Content body */}
        <div className="p-4 space-y-3">
          {/* Seller row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Avatar
                src={sellerAvatar}
                name={sellerName}
                size="xs"
                isStartup={isStartup}
                verified={service.seller?.isVerified}
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {sellerName}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {sellerDept}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-slate-800 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{service.rating.toFixed(1)}</span>
              <span className="text-[10px] text-slate-400 font-normal">({service.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-1 group-hover:text-[#0F766E] transition-colors">
            {service.title}
          </h3>

          {/* One-line pitch */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {service.description}
          </p>

          {/* Delivery & turnaround time */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Delivers in ~{deliveryDays} {deliveryDays === 1 ? 'day' : 'days'}</span>
          </div>
        </div>
      </div>

      {/* Footer: Price + View Details CTA */}
      <div className="p-4 pt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
            {priceLabel}
          </span>
          <span className="text-base font-bold text-slate-900">
            ${Number(service.basePrice).toFixed(0)}{priceSuffix}
          </span>
        </div>

        <Link
          to={`/services?id=${service.id}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-[#0F766E] text-[#0F766E] hover:bg-teal-50 transition-colors shadow-2xs"
        >
          <span>View Details</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
