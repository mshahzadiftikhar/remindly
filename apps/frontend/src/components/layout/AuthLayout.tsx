import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 to-white flex flex-col items-center justify-center px-4 py-12">
      <Link to="/" className="flex items-center gap-0.5 text-2xl mb-8">
        <span className="font-medium text-gray-900">Remind</span>
        <span className="font-bold text-indigo-600">ly</span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        {children}
      </div>
    </div>
  );
}
