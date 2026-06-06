import { Bell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/auth-context';

export function AppNavbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const displayName = user ? (user.fullName?.split(' ')[0] ?? user.email.split('@')[0]) : '';

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      className={[
        'relative px-3.5 py-1.5 text-[13.5px] font-medium rounded-lg transition-all duration-150',
        pathname === to
          ? 'text-amber-brand font-semibold after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-[2px] after:rounded-full after:bg-amber-brand'
          : 'text-white/60 hover:text-white hover:bg-white/8',
      ].join(' ')}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 bg-charcoal">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 h-16">
        {/* Left: logo + nav */}
        <div className="flex items-center gap-7">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-brand flex items-center justify-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] shrink-0">
              <Bell size={13} className="text-charcoal" strokeWidth={2.5} />
            </div>
            <span className="text-[17px] font-bold tracking-tight text-white">Remindly</span>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            {navLink('/dashboard', 'Dashboard')}
            {navLink('/settings', 'Settings')}
          </nav>
        </div>

        {/* Right: user + actions */}
        <div className="flex items-center gap-1">
          {displayName && (
            <>
              <span className="hidden text-[13px] text-white/70 sm:block font-medium px-2">
                {displayName}
              </span>
              <span className="hidden sm:block w-px h-4 bg-white/15 mx-1" />
            </>
          )}
          <button
            onClick={logout}
            className="px-3 py-1.5 text-[13px] font-medium text-white/50 hover:text-white/80 rounded-lg transition-colors duration-150"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
