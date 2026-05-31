import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export function Navbar() {
  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-charcoal border-b border-white/8">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="inline-flex w-6 h-6 rounded-full bg-amber-brand items-center justify-center shadow-md shadow-amber-brand/30">
            <span className="w-2 h-2 rounded-full bg-charcoal/80" />
          </span>
          <span className="font-display text-[1.15rem] text-white tracking-tight">Remindly</span>
        </Link>

        <div className="hidden sm:flex items-center gap-8">
          <a
            href="#features"
            onClick={scrollTo('features')}
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={scrollTo('how-it-works')}
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            How It Works
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/auth/login" className="hidden sm:block text-sm font-medium text-white/55 hover:text-white transition-colors">
            Log in
          </Link>
          <Link to="/auth/signup">
            <Button size="sm">Get started free</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
