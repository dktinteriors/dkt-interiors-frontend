'use client';

import { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, helperText, options, placeholder, className, id: providedId, ...props },
    ref
  ) => {
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

        <div className="relative">
          <select
            ref={ref}
            id={id}
            aria-invalid={hasError}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={cn(
              'w-full appearance-none border-0 border-b-2 bg-transparent px-0 py-3 pr-8',
              'font-sans text-base text-black',
              'transition-colors duration-300',
              'focus:outline-none focus:ring-0',
              'cursor-pointer',
              hasError
                ? 'border-red-500 focus:border-red-500'
                : 'border-neutral-300 focus:border-gold',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown
            className="pointer-events-none absolute right-0 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
            aria-hidden="true"
          />
        </div>

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

Select.displayName = 'Select';

export default Select;
