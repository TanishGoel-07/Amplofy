import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles: rounded-lg, semibold, focus-ring, transition
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    // Variant styles:
    // primary: solid teal #0F766E (hover #115E59)
    // secondary: white with teal border #0F766E (hover #F0FDFA)
    // ghost: tertiary slate text with soft hover
    // danger: rose solid
    // outline: neutral slate border
    const variantStyles = {
      primary: 'bg-[#0F766E] hover:bg-[#115E59] text-white shadow-sm',
      secondary: 'bg-white border border-[#0F766E] text-[#0F766E] hover:bg-[#F0FDFA]',
      ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium active:bg-slate-200',
      danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-200',
      outline: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900',
    };

    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2 gap-2',
      lg: 'text-base px-5 py-2.5 gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
