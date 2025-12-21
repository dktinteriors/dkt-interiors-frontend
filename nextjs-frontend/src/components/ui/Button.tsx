'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import type { ButtonProps, ButtonVariant, ButtonSize } from '@/types';

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-black text-white border-black hover:bg-gold hover:text-black hover:border-gold',
  secondary: 'bg-neutral-100 text-black border-neutral-100 hover:bg-neutral-200 hover:border-neutral-200',
  outline: 'bg-transparent text-black border-black hover:bg-black hover:text-white',
  gold: 'bg-gold text-black border-gold hover:bg-black hover:text-white hover:border-black',
  ghost: 'bg-transparent text-black border-transparent hover:bg-neutral-100',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'font-sans font-medium uppercase tracking-widest',
          'border-2 transition-all duration-300',
          'focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

const LoadingSpinner = () => (
  <svg
    className="h-4 w-4 animate-spin"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export default Button;
