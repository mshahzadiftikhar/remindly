import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function ComingSoonPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-charcoal dot-grid-dark px-4 text-center relative overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-amber-brand/15 -translate-y-1/2 translate-x-1/3 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-brand/8 translate-y-1/2 -translate-x-1/4 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center">
        <Link to="/" className="flex items-center gap-2.5 mb-10">
          <span className="inline-flex w-7 h-7 rounded-full bg-amber-brand items-center justify-center shadow-lg shadow-amber-brand/30">
            <span className="w-2.5 h-2.5 rounded-full bg-charcoal/80" />
          </span>
          <span className="font-display text-xl text-white tracking-tight">Remindly</span>
        </Link>

        <span className="text-6xl mb-5">🚧</span>
        <h1 className="text-3xl font-display text-white mb-2">Coming Soon</h1>
        <p className="text-[14px] text-white/45 max-w-xs leading-relaxed mb-8">
          Social login is on its way. Use email and password for now.
        </p>
        <Link to="/auth/login">
          <Button size="lg">Back to login</Button>
        </Link>
      </div>
    </div>
  );
}
