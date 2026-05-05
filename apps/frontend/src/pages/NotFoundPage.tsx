import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <Link to="/" className="mb-8 text-2xl font-bold tracking-tight text-gray-900">
        Remind<span className="text-indigo-600">ly</span>
      </Link>
      <span className="text-7xl">🔍</span>
      <h1 className="mt-4 text-3xl font-bold text-gray-900">Page not found</h1>
      <p className="mt-2 text-sm text-gray-500">
        This page doesn't exist or may have been moved.
      </p>
      <Link to="/" className="mt-6">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
}
