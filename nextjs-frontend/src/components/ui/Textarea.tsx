'use client';

import { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, id: providedId, ...props }, ref) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    const hasError = Boolean(error);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-2 block text-xs font-medium uppercase tracking-widest text-neutral-700"
          >
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={id}
          aria-invalid={hasError}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={cn(
            'w-full resize-y border-0 border-b-2 bg-transparent px-0 py-3',
            'font-sans text-base text-black placeholder:text-neutral-400',
            'transition-colors duration-300',
            'focus:outline-none focus:ring-0',
            'min-h-[120px]',
            hasError
              ? 'border-red-500 focus:border-red-500'
              : 'border-neutral-300 focus:border-gold',
            className
          )}
          {...props}
        />

        {error && (
          <p id={errorId} className="mt-2 text-xs text-red-500" role="alert">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={helperId} className="mt-2 text-xs text-neutral-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
