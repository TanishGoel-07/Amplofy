import React, { useState } from 'react';
import { User, Building2 } from 'lucide-react';

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'square';
  verified?: boolean;
  isStartup?: boolean;
  className?: string;
}

export function Avatar({
  src,
  alt = 'Avatar',
  name = '',
  size = 'md',
  shape = 'circle',
  verified = false,
  isStartup = false,
  className = '',
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-20 h-20 text-xl',
  }[size];

  const roundedClasses = shape === 'circle' ? 'rounded-full' : 'rounded-xl';

  // Get initials from name
  const initials = name
    ? name
        .split(' ')
        .slice(0, 2)
        .map(part => part[0])
        .join('')
        .toUpperCase()
    : '';

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      <div
        className={`${sizeClasses} ${roundedClasses} overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center font-semibold text-slate-700 select-none shadow-2xs`}
      >
        {src && !imgError ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : initials ? (
          <span className="font-medium text-slate-700">{initials}</span>
        ) : isStartup ? (
          <Building2 className="w-1/2 h-1/2 text-slate-400" />
        ) : (
          <User className="w-1/2 h-1/2 text-slate-400" />
        )}
      </div>

      {verified && (
        <span
          title="Verified"
          className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-xs"
        >
          <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
    </div>
  );
}

export default Avatar;
