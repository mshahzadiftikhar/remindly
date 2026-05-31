import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-charcoal dot-grid-dark px-6 py-12 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-amber-brand/18 -translate-y-1/2 translate-x-1/3 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-brand/10 translate-y-1/2 -translate-x-1/4 blur-3xl" />

      {/* Logo */}
      <Link to="/" className="relative z-10 flex items-center gap-2.5 mb-8">
        <span className="inline-flex w-7 h-7 rounded-full bg-amber-brand items-center justify-center shadow-lg shadow-amber-brand/30">
          <span className="w-2.5 h-2.5 rounded-full bg-charcoal/80" />
        </span>
        <span className="font-display text-xl text-white tracking-tight">Remindly</span>
      </Link>

      <div className="relative z-10 w-full max-w-[440px]">
        <div className="bg-white rounded-2xl border border-white/10 shadow-2xl shadow-black/35 p-8">
          {children}
        </div>
        <p className="mt-5 text-center text-xs text-white/28">
          Secure · No spam · Cancel anytime
        </p>
      </div>
    </div>
  );
}
