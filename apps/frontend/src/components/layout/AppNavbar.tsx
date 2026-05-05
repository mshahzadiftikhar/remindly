import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth-context';
import { Button } from '../ui/Button';

export function AppNavbar() {
  const { user, logout } = useAuth();
  const displayName = user ? (user.fullName ?? user.email.split('@')[0]) : '';

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="text-xl font-bold tracking-tight text-gray-900">
            Remind<span className="text-indigo-600">ly</span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            <Link
              to="/dashboard"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              Dashboard
            </Link>
            <Link
              to="/settings"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              Settings
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {displayName && (
            <span className="hidden text-sm text-gray-600 sm:block">{displayName}</span>
          )}
          <Button variant="ghost" size="sm" onClick={logout}>
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
