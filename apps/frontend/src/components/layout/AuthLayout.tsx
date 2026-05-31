import { Bell, CheckCircle, Clock } from 'lucide-react';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
}

function BrandPanel() {
  return (
    <div className="relative hidden md:flex md:w-[46%] xl:w-[42%] shrink-0 flex-col justify-between bg-charcoal overflow-hidden p-12">
      {/* Background texture */}
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-[0.14]" />
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-0 right-0 w-80 h-80 rounded-full bg-amber-brand/10 -translate-y-1/3 translate-x-1/3 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-64 h-64 rounded-full bg-amber-brand/6 translate-y-1/3 -translate-x-1/4 blur-3xl" />

      {/* Top: wordmark */}
      <div className="relative z-10">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <span className="inline-flex w-7 h-7 rounded-full bg-amber-brand items-center justify-center shadow-lg shadow-amber-brand/30">
            <span className="w-2.5 h-2.5 rounded-full bg-charcoal/80" />
          </span>
          <span className="font-display text-xl text-white tracking-tight">Remindly</span>
        </Link>
      </div>

      {/* Middle: hero copy + mock card */}
      <div className="relative z-10 flex flex-col gap-8">
        <div>
          <h2 className="font-display text-[2.4rem] leading-[1.1] text-white mb-4">
            Never miss what
            <br />
            <span className="text-amber-brand">matters most.</span>
          </h2>
          <p className="text-white/45 text-[15px] leading-relaxed max-w-xs">
            Track passports, warranties, subscriptions — anything with an expiry date.
            We'll remind you before it's too late.
          </p>
        </div>

        {/* Mock reminder card preview */}
        <div className="w-full max-w-[360px] bg-white/8 border border-white/10 rounded-2xl p-7 backdrop-blur-sm">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-2">Days remaining</p>
              <p className="text-[3.5rem] font-black tabular text-amber-brand leading-none">28</p>
            </div>
            <span className="flex items-center gap-1.5 text-[12px] font-medium text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Active
            </span>
          </div>
          <p className="text-[16px] font-semibold text-white mb-1">UK Passport</p>
          <p className="text-[13px] text-white/35 mb-5">Expires 15 Jan 2026</p>
          <div className="flex items-center gap-2 pt-4 border-t border-white/8">
            <Bell size={13} className="text-amber-brand shrink-0" />
            <span className="text-[12px] text-white/35">Reminding 30, 7, 1 days before</span>
          </div>
        </div>
      </div>

      {/* Bottom: trust indicators */}
      <div className="relative z-10 space-y-2.5">
        {[
          { icon: CheckCircle, text: 'Free forever — no credit card required' },
          { icon: Clock, text: 'Setup takes less than 2 minutes' },
          { icon: Bell, text: 'Email reminders on the exact days you pick' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-3 text-white/75">
            <Icon size={14} className="text-amber-brand/70 shrink-0" />
            <span className="text-[14px] leading-[1.6]">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      <BrandPanel />

      {/* Right: form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 md:px-5 md:py-12 bg-warm-bg relative overflow-hidden">
        {/* Subtle ambient glow */}
        <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 rounded-full bg-amber-brand/8 -translate-y-1/2 translate-x-1/4 blur-3xl" />

        {/* Mobile-only logo */}
        <Link to="/" className="flex items-center gap-2 mb-8 md:hidden">
          <span className="inline-flex w-6 h-6 rounded-full bg-amber-brand items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-charcoal/80" />
          </span>
          <span className="font-display text-xl text-charcoal tracking-tight">Remindly</span>
        </Link>

        <div className="relative z-10 w-full max-w-[440px]">
          <div className="bg-white rounded-2xl border border-charcoal/8 shadow-xl shadow-charcoal/6 p-8 max-sm:px-6 max-sm:py-8">
            {children}
          </div>
          <p className="mt-5 text-center text-xs text-charcoal/28">
            Secure · No spam · Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
