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

  if (normalized.includes('tutor') || normalized.includes('math') || normalized.includes('science')) {
    // Tutoring: teal
    colorClasses = 'bg-teal-50 text-teal-700 border-teal-200';
  } else if (normalized.includes('photo') || normalized.includes('event')) {
    // Photography: amber
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (normalized.includes('dev') || normalized.includes('tech') || normalized.includes('code') || normalized.includes('software')) {
    // Development: indigo
    colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200';
  } else if (normalized.includes('labor') || normalized.includes('move') || normalized.includes('packing') || normalized.includes('handy')) {
    // Labor: lime
    colorClasses = 'bg-lime-50 text-lime-800 border-lime-200';
  } else if (normalized.includes('coach') || normalized.includes('career') || normalized.includes('resume') || normalized.includes('fitness')) {
    // Coaching: rose
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (normalized.includes('music') || normalized.includes('audio') || normalized.includes('guitar')) {
    // Music: orange
    colorClasses = 'bg-orange-50 text-orange-700 border-orange-200';
  } else if (normalized.includes('design') || normalized.includes('art') || normalized.includes('ui/ux') || normalized.includes('creative')) {
    // Design: violet
    colorClasses = 'bg-violet-50 text-violet-700 border-violet-200';
  } else if (normalized.includes('market') || normalized.includes('social') || normalized.includes('growth')) {
    // Marketing: sky
    colorClasses = 'bg-sky-50 text-sky-700 border-sky-200';
  } else if (normalized.includes('textbook') || normalized.includes('book')) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (normalized.includes('dorm') || normalized.includes('decor')) {
    colorClasses = 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200';
  } else if (normalized.includes('electronic')) {
    colorClasses = 'bg-cyan-50 text-cyan-700 border-cyan-200';
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

