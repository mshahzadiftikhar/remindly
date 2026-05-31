import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-warm-bg px-4 text-center">
      <Link to="/" className="font-display text-2xl text-charcoal mb-8">
        Remindly
      </Link>
      <div className="w-20 h-20 rounded-full bg-amber-brand-light flex items-center justify-center mb-4">
        <span className="text-4xl">🔍</span>
      </div>
      <h1 className="mt-2 text-3xl font-bold text-charcoal">Page not found</h1>
      <p className="mt-2 text-sm text-charcoal/50">
        This page doesn't exist or may have been moved.
      </p>
      <Link to="/" className="mt-6">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
}
