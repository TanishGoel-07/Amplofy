import { Link } from 'react-router-dom';
import { Star, ArrowRight, Building2, CheckCircle2 } from 'lucide-react';
import type { Startup } from '@/data/types';
import { Avatar } from '@/components/ui/Avatar';
import { CategoryBadge } from '@/components/ui/Badge';

interface StartupCardProps {
  startup: Startup;
  className?: string;
}

export default function StartupCard({ startup, className = '' }: StartupCardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-slate-300 flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Top: Logo & Category */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <Avatar
            src={startup.logoUrl}
            name={startup.name}
            size="lg"
            shape="square"
            isStartup
          />
          <CategoryBadge category={startup.category} />
        </div>

        {/* Title + Verified */}
        <div className="flex items-center gap-1.5 mb-1">
          <h4 className="font-bold text-base text-slate-900 tracking-tight leading-snug">
            {startup.name}
          </h4>
          {startup.isVerified && (
            <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0" title="Verified Campus Startup" />
          )}
        </div>

        {/* College */}
        <p className="text-xs text-slate-400 font-medium mb-2">
          Founded at {startup.college}
        </p>

        {/* Tagline */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {startup.tagline}
        </p>
      </div>

      {/* Footer: Rating & Link */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>{startup.rating.toFixed(1)}</span>
          <span className="text-[11px] text-slate-400 font-normal">({startup.reviewCount})</span>
        </div>

        <Link
          to={`/startups/${startup.slug}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F766E] hover:text-[#115E59] group transition-colors"
        >
          <span>View profile</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
