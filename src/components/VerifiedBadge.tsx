import { BadgeCheck } from 'lucide-react';

interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function VerifiedBadge({ size = 'sm', showText = false, className = '' }: VerifiedBadgeProps) {
  const sizes = {
    sm: { icon: 14, text: 'text-xs', gap: 'gap-1', pad: 'px-2 py-0.5' },
    md: { icon: 16, text: 'text-sm', gap: 'gap-1.5', pad: 'px-2.5 py-1' },
    lg: { icon: 18, text: 'text-base', gap: 'gap-1.5', pad: 'px-3 py-1.5' },
  };
  const s = sizes[size];

  if (showText) {
    return (
      <span
        className={`inline-flex items-center ${s.gap} ${s.pad} bg-brand-50 text-brand-700 rounded-full font-semibold ${s.text} ${className}`}
      >
        <BadgeCheck size={s.icon} className="text-brand-600 shrink-0" />
        Student Verified
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center bg-brand-500 text-white rounded-full shrink-0 ${className}`}
      title="Student Verified"
      style={{ width: s.icon + 4, height: s.icon + 4 }}
    >
      <BadgeCheck size={s.icon} />
    </span>
  );
}
