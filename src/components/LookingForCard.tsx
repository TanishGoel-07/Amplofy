import React from 'react';
import { Link } from 'react-router-dom';
import {
  Rocket, Palette, Megaphone, FlaskConical, ShoppingBag,
  MessageSquareQuote, Handshake, ShieldCheck, MapPin, Clock,
  Coins, ArrowRight, ExternalLink, Sparkles
} from 'lucide-react';
import type { StartupLookingFor } from '@/data/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface LookingForCardProps {
  request: StartupLookingFor;
  onRespond: (request: StartupLookingFor) => void;
  isOwner?: boolean;
  onStatusChange?: (id: string, status: 'open' | 'filled' | 'paused') => void;
}

export const LOOKING_FOR_CATEGORY_CONFIG: Record<
  StartupLookingFor['type'],
  { label: string; icon: React.ComponentType<{ size?: number; className?: string }>; bg: string; text: string; border: string }
> = {
  'co-founder': {
    label: 'Co-Founder',
    icon: Rocket,
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
  'designer-dev': {
    label: 'Design & Dev',
    icon: Palette,
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200',
  },
  'marketing': {
    label: 'Marketing & Growth',
    icon: Megaphone,
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  'beta-testers': {
    label: 'Beta Testers',
    icon: FlaskConical,
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  'first-customers': {
    label: 'First Customers',
    icon: ShoppingBag,
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
  },
  'product-feedback': {
    label: 'Product Feedback',
    icon: MessageSquareQuote,
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
  },
  'startup-collab': {
    label: 'Startup Collab',
    icon: Handshake,
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
  },
  'other': {
    label: 'Opportunity',
    icon: Sparkles,
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
  },
};

export const COMPENSATION_LABELS: Record<StartupLookingFor['compensationType'], { label: string; color: string }> = {
  'equity': { label: 'Equity Pool', color: 'text-purple-700 bg-purple-50 border-purple-200' },
  'paid': { label: 'Paid / Hourly', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  'stipend': { label: 'Stipend', color: 'text-teal-700 bg-teal-50 border-teal-200' },
  'revenue-share': { label: 'Revenue Share', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  'free-product': { label: 'Free Product / Perks', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  'college-credit': { label: 'College Credit', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  'unpaid-collab': { label: 'Mutual Collab', color: 'text-slate-700 bg-slate-100 border-slate-200' },
};

export const LookingForCard: React.FC<LookingForCardProps> = ({
  request,
  onRespond,
  isOwner = false,
  onStatusChange,
}) => {
  const catConfig = LOOKING_FOR_CATEGORY_CONFIG[request.type] || LOOKING_FOR_CATEGORY_CONFIG.other;
  const CategoryIcon = catConfig.icon;
  const compConfig = COMPENSATION_LABELS[request.compensationType] || { label: 'Collab', color: 'text-slate-700 bg-slate-100' };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      <div className="p-5 sm:p-6">
        {/* Top bar: Startup avatar + category badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <Link
            to={`/startups/${request.startupSlug}`}
            className="flex items-center gap-3 group-hover:opacity-95 transition-opacity"
          >
            <img
              src={request.startupLogo}
              alt={request.startupName}
              className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-1.5 font-bold text-slate-900 group-hover:text-teal-700 text-sm sm:text-base">
                <span>{request.startupName}</span>
                {request.isStartupVerified && (
                  <ShieldCheck size={15} className="text-teal-600 fill-teal-50 shrink-0" title="Verified Campus Startup" />
                )}
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <span>{request.startupCollege}</span>
                <span>•</span>
                <span>{request.startupCategory}</span>
              </p>
            </div>
          </Link>

          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${catConfig.bg} ${catConfig.text} ${catConfig.border}`}>
            <CategoryIcon size={13} />
            {catConfig.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-teal-800 transition-colors">
          {request.title}
        </h3>

        {/* Description */}
        <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {request.description}
        </p>

        {/* Skills needed tags */}
        {request.skillsNeeded && request.skillsNeeded.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {request.skillsNeeded.map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/60"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Perks & Commitment Details Pill Grid */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Coins size={14} className="text-amber-500" />
              Perks / Compensation:
            </span>
            <span className={`px-2 py-0.5 rounded-full font-semibold border ${compConfig.color}`}>
              {compConfig.label}
            </span>
          </div>
          {request.compensationDetails && (
            <p className="text-slate-700 font-medium pl-5 text-[11px] truncate">
              {request.compensationDetails}
            </p>
          )}

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Clock size={13} className="text-slate-400" />
              {request.timeCommitment}
            </span>
            <span className="flex items-center gap-1 text-slate-500 capitalize">
              <MapPin size={13} className="text-slate-400" />
              {request.locationType}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
        <span className="text-xs text-slate-500 font-medium">
          {request.responseCount > 0 ? (
            <span className="text-teal-700 font-semibold">{request.responseCount} {request.responseCount === 1 ? 'student connected' : 'students connected'}</span>
          ) : (
            'Be the first to connect!'
          )}
        </span>

        {isOwner ? (
          <div className="flex items-center gap-2">
            {request.status === 'open' ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusChange?.(request.id, 'filled')}
                className="text-xs"
              >
                Mark Filled
              </Button>
            ) : (
              <Badge variant="neutral">Filled</Badge>
            )}
          </div>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onRespond(request)}
            className="flex items-center gap-1.5 text-xs font-semibold bg-teal-700 hover:bg-teal-800 text-white shadow-xs"
          >
            <span>Respond & Connect</span>
            <ArrowRight size={13} />
          </Button>
        )}
      </div>
    </div>
  );
};
