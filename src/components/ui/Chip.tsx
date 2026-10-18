import React from 'react';

export type StatusChipType =
  | 'Live'
  | 'live'
  | 'Featured'
  | 'featured'
  | 'Draft'
  | 'draft'
  | 'Pending'
  | 'pending'
  | 'Cancelled'
  | 'cancelled'
  | 'Completed'
  | 'completed'
  | 'In Progress'
  | 'in_progress';

export interface StatusChipProps {
  status: StatusChipType;
  className?: string;
  dot?: boolean;
}

export function StatusChip({ status, className = '', dot = true }: StatusChipProps) {
  const norm = status.toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';
  let displayLabel = status;

  if (norm === 'live' || norm === 'published' || norm === 'available') {
    // Live: green
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotColor = 'bg-emerald-500';
    displayLabel = 'Live';
  } else if (norm === 'featured') {
    // Featured: amber
    styles = 'bg-amber-50 text-amber-800 border-amber-200';
    dotColor = 'bg-amber-500';
    displayLabel = 'Featured';
  } else if (norm === 'draft') {
    // Draft: slate
    styles = 'bg-slate-100 text-slate-700 border-slate-200';
    dotColor = 'bg-slate-400';
    displayLabel = 'Draft';
  } else if (norm === 'pending' || norm === 'inquiry' || norm === 'quote sent' || norm === 'quote_sent') {
    // Pending: blue
    styles = 'bg-blue-50 text-blue-700 border-blue-200';
    dotColor = 'bg-blue-500';
    displayLabel = (norm === 'quote sent' || norm === 'quote_sent') ? 'Quote Sent' : norm === 'inquiry' ? 'Inquiry' : 'Pending';
  } else if (norm === 'cancelled' || norm === 'rejected') {
    // Cancelled: red
    styles = 'bg-rose-50 text-rose-700 border-rose-200';
    dotColor = 'bg-rose-500';
    displayLabel = 'Cancelled';
  } else if (norm === 'accepted') {
    styles = 'bg-cyan-50 text-cyan-700 border-cyan-200';
    dotColor = 'bg-cyan-500';
    displayLabel = 'Accepted';
  } else if (norm === 'in progress' || norm === 'in_progress') {
    styles = 'bg-amber-50 text-amber-800 border-amber-300';
    dotColor = 'bg-amber-500';
    displayLabel = 'In Progress';
  } else if (norm === 'delivered') {
    styles = 'bg-purple-50 text-purple-700 border-purple-200';
    dotColor = 'bg-purple-500';
    displayLabel = 'Delivered';
  } else if (norm === 'completed') {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotColor = 'bg-emerald-500';
    displayLabel = 'Completed';
  } else if (norm === 'reviewed') {
    styles = 'bg-teal-50 text-[#0F766E] border-teal-300';
    dotColor = 'bg-[#0F766E]';
    displayLabel = 'Reviewed';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      <span>{displayLabel}</span>
    </span>
  );
}

export interface FilterChipProps {
  label: string;
  active?: boolean;
  count?: number;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function FilterChip({
  label,
  active = false,
  count,
  onClick,
  icon,
  className = '',
}: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer border select-none ${
        active
          ? 'bg-[#0F766E] text-white border-[#0F766E] shadow-sm'
          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
      } ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
            active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export default {
  StatusChip,
  FilterChip,
};
