import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'rounded';
}

export function Skeleton({
  variant = 'rounded',
  className = '',
  ...props
}: SkeletonProps) {
  const roundedClass = {
    rectangular: 'rounded-none',
    circular: 'rounded-full',
    rounded: 'rounded-lg',
  }[variant];

  return (
    <div
      className={`animate-pulse bg-slate-200/80 ${roundedClass} ${className}`}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
      {/* 4:3 image skeleton */}
      <Skeleton className="aspect-[4/3] w-full rounded-lg" />
      {/* Badge + Price row */}
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-4 w-16 rounded-full" />
        <Skeleton className="h-5 w-14 rounded" />
      </div>
      {/* Title */}
      <Skeleton className="h-4 w-3/4 rounded" />
      {/* Seller info */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        <Skeleton variant="circular" className="w-6 h-6" />
        <Skeleton className="h-3 w-28 rounded" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <CardSkeleton key={idx} />
      ))}
    </div>
  );
}

export default Skeleton;
