import { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-white/5 rounded-2xl border border-white/8 shadow-[0_2px_16px_rgba(0,0,0,0.25)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
