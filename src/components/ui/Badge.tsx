import React from 'react';
import { CheckCircle2, ShieldCheck, Sparkles, Star, Rocket } from 'lucide-react';

export type CategoryType =
  | 'Tutoring'
  | 'Photography'
  | 'Development'
  | 'Labor'
  | 'Coaching'
  | 'Music'
  | 'Design'
  | 'Marketing'
  | string;

export interface CategoryBadgeProps {
  category: CategoryType;
  className?: string;
}

export function CategoryBadge({ category, className = '' }: CategoryBadgeProps) {
  const normalized = category.trim().toLowerCase();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  if (normalized.includes('dev') || normalized.includes('tech') || normalized.includes('code') || normalized.includes('software')) {
    // Development: indigo
    colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200';
  } else if (normalized.includes('pitch') || normalized.includes('deck') || normalized.includes('investor')) {
    // Pitch Decks: amber
    colorClasses = 'bg-amber-50 text-amber-800 border-amber-200';
  } else if (normalized.includes('brand') || normalized.includes('logo') || normalized.includes('merch')) {
    // Branding: pink
    colorClasses = 'bg-pink-50 text-pink-700 border-pink-200';
  } else if (normalized.includes('write') || normalized.includes('editorial') || normalized.includes('resume') || normalized.includes('sop')) {
    // Writing & Editorial: emerald
    colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  } else if (normalized.includes('hardware') || normalized.includes('3d') || normalized.includes('cad') || normalized.includes('iot') || normalized.includes('robot')) {
    // Hardware & 3D: cyan
    colorClasses = 'bg-cyan-50 text-cyan-800 border-cyan-200';
  } else if (normalized.includes('event') || normalized.includes('hackathon') || normalized.includes('stage')) {
    // Event Production: yellow
    colorClasses = 'bg-yellow-50 text-yellow-800 border-yellow-200';
  } else if (normalized.includes('legal') || normalized.includes('compliance') || normalized.includes('incorporation')) {
    // Legal & Compliance: purple
    colorClasses = 'bg-purple-50 text-purple-800 border-purple-200';
  } else if (normalized.includes('logistic') || normalized.includes('labor') || normalized.includes('move') || normalized.includes('packing')) {
    // Campus Logistics: stone
    colorClasses = 'bg-stone-100 text-stone-800 border-stone-200';
  } else if (normalized.includes('tutor') || normalized.includes('math') || normalized.includes('science') || normalized.includes('stem')) {
    // Tutoring: teal
    colorClasses = 'bg-teal-50 text-teal-700 border-teal-200';
  } else if (normalized.includes('photo') || normalized.includes('film') || normalized.includes('video') || normalized.includes('portrait')) {
    // Photography & Film: rose
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (normalized.includes('music') || normalized.includes('audio') || normalized.includes('sound') || normalized.includes('dj')) {
    // Music: orange
    colorClasses = 'bg-orange-50 text-orange-700 border-orange-200';
  } else if (normalized.includes('design') || normalized.includes('art') || normalized.includes('ui/ux') || normalized.includes('figma')) {
    // Design: violet
    colorClasses = 'bg-violet-50 text-violet-700 border-violet-200';
  } else if (normalized.includes('market') || normalized.includes('social') || normalized.includes('growth') || normalized.includes('pr')) {
    // Marketing: sky
    colorClasses = 'bg-sky-50 text-sky-700 border-sky-200';
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${colorClasses} tracking-tight ${className}`}
    >
      {category}
    </span>
  );
}

export interface VerificationBadgeProps {
  type: 'student' | 'startup';
  size?: 'sm' | 'md';
  className?: string;
}

export function VerificationBadge({ type, size = 'md', className = '' }: VerificationBadgeProps) {
  const isStartup = type === 'startup';
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5';

  if (isStartup) {
    return (
      <span
        title="Verified Student-Founded Startup"
        className={`inline-flex items-center font-semibold rounded-full bg-teal-50 text-teal-800 border border-teal-300 shadow-2xs ${sizeClasses} ${className}`}
      >
        <Rocket className={size === 'sm' ? 'w-3 h-3 text-teal-600' : 'w-3.5 h-3.5 text-teal-600'} />
        <span>Verified Startup</span>
      </span>
    );
  }

  return (
    <span
      title="Verified Student Account"
      className={`inline-flex items-center font-semibold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs ${sizeClasses} ${className}`}
    >
      <ShieldCheck className={size === 'sm' ? 'w-3 h-3 text-emerald-600' : 'w-3.5 h-3.5 text-emerald-600'} />
      <span>Verified Student</span>
    </span>
  );
}

export interface TopRatedBadgeProps {
  rating?: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export function TopRatedBadge({ rating = 4.9, reviewCount = 12, size = 'md', className = '' }: TopRatedBadgeProps) {
  // Shown when rating >= 4.8 and review count >= 10
  if (rating < 4.8 || (reviewCount && reviewCount < 10)) {
    return null;
  }

  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      title={`Top Rated (${rating.toFixed(1)} rating from ${reviewCount} reviews)`}
      className={`inline-flex items-center font-semibold rounded-full bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs ${sizeClasses} ${className}`}
    >
      <Star className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} fill-amber-500 text-amber-500`} />
      <span>Top Rated</span>
    </span>
  );
}

export interface PromoBadgeProps {
  label: 'Hot Deal' | 'New Listing' | string;
  variant?: 'amber' | 'teal' | 'slate';
  className?: string;
}

export function PromoBadge({ label, variant = 'amber', className = '' }: PromoBadgeProps) {
  const styles = {
    amber: 'bg-amber-500 text-white font-bold',
    teal: 'bg-[#0F766E] text-white font-bold',
    slate: 'bg-slate-800 text-white font-semibold',
  }[variant];

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] tracking-wide uppercase shadow-sm ${styles} ${className}`}
    >
      {label === 'Hot Deal' && <Sparkles className="w-3 h-3 mr-1" />}
      {label}
    </span>
  );
}

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'success' | 'warning' | 'primary';
  className?: string;
}

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  const styles = {
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    primary: 'bg-teal-50 text-teal-700 border-teal-200',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}

export default {
  CategoryBadge,
  VerificationBadge,
  TopRatedBadge,
  PromoBadge,
  Badge,
};

