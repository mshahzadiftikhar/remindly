import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth-context';

// Equivalent of Next.js middleware: redirects authenticated users away from
// public-only pages like /auth/login and /auth/signup.
export function PublicRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  // Wait for auth to resolve to prevent flash of login page for logged-in users.
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
