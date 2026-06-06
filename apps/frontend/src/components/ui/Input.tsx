import { Eye, EyeOff } from 'lucide-react';
import { forwardRef, InputHTMLAttributes, useState } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', type, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
    const isPassword = type === 'password';
    const [showPw, setShowPw] = useState(false);
    const resolvedType = isPassword ? (showPw ? 'text' : 'password') : type;

    return (
      <div className={`flex flex-col gap-1.5 ${error ? 'animate-shake' : ''}`}>
        <label htmlFor={inputId} className="text-[13px] font-medium text-charcoal/65">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            className={[
              'w-full rounded-xl border px-4 py-2.5 text-sm text-charcoal',
              'placeholder-charcoal/28 outline-none bg-stone-50',
              'transition-all duration-150',
              error
                ? 'border-danger focus:border-danger focus:ring-2 focus:ring-danger/18 bg-danger/6'
                : 'border-charcoal/15 focus:border-amber-brand focus:ring-2 focus:ring-amber-brand/15',
              'disabled:bg-stone-100 disabled:text-charcoal/30 disabled:cursor-not-allowed',
              isPassword ? 'pr-[3rem]' : '',
              className,
            ].join(' ')}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-charcoal/35 hover:text-charcoal/60 transition-colors duration-150 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          )}
        </div>
        {error && (
          <p className="text-xs text-danger flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-danger shrink-0" />
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
