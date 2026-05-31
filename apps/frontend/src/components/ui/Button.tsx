import { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'outline' | 'outline-invert' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: [
    'bg-gradient-to-b from-[#c98a10] to-[#c47f00] text-charcoal',
    'shadow-[0_4px_16px_rgba(196,127,0,0.40)]',
    'hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(196,127,0,0.50)]',
    'active:translate-y-0 active:shadow-sm',
  ].join(' '),
  outline: [
    'border border-charcoal/15 bg-white text-charcoal',
    'hover:border-charcoal/25 hover:bg-charcoal/3',
    'active:bg-charcoal/6',
  ].join(' '),
  'outline-invert': [
    'border border-white/22 bg-white/6 text-white',
    'hover:border-white/38 hover:bg-white/10',
    'active:bg-white/14',
  ].join(' '),
  ghost: [
    'text-charcoal/55',
    'hover:text-charcoal hover:bg-charcoal/6',
    'active:bg-charcoal/10',
  ].join(' '),
  danger: [
    'bg-danger text-white',
    'shadow-sm shadow-danger/20',
    'hover:-translate-y-[1px] hover:shadow-md hover:shadow-danger/25 hover:bg-danger/90',
    'active:translate-y-0',
  ].join(' '),
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3.5 py-1.5 text-[13px] rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-[15px] rounded-xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 font-semibold',
        'transition-all duration-150 cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-brand focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-45',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
