import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export function Navbar() {
  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-0.5 text-xl">
          <span className="font-medium text-gray-900">Remind</span>
          <span className="font-bold text-indigo-600">ly</span>
        </Link>

        <div className="hidden sm:flex items-center gap-8">
          <a
            href="#features"
            onClick={scrollTo('features')}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={scrollTo('how-it-works')}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            How It Works
          </a>
        </div>

        <Link to="/auth/signup">
          <Button size="sm">Get Started Free</Button>
        </Link>
      </nav>
    </header>
  );
}
