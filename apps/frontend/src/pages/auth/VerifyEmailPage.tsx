import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AuthLayout } from '../../components/layout/AuthLayout';
import api from '../../lib/api';
import { useAuth } from '../../lib/auth-context';

type Status = 'verifying' | 'success' | 'error';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const { setUser } = useAuth();
  const [status, setStatus] = useState<Status>('verifying');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    api.get(`/auth/verify-email?token=${token}`)
      .then(async () => {
        try {
          const { data } = await api.get('/auth/me');
          setUser(data);
        } catch {
          // user not logged in — that's fine, still show success
        }
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  }, [token, setUser]);

  if (status === 'verifying') {
    return (
      <AuthLayout>
        <div className="text-center py-6">
          <div className="inline-flex w-14 h-14 rounded-full bg-amber-brand/10 items-center justify-center mb-5">
            <svg className="animate-spin h-6 w-6 text-amber-brand" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <h1 className="font-display text-[1.5rem] text-charcoal leading-snug mb-2">Verifying…</h1>
          <p className="text-[13px] text-charcoal/50">Just a moment</p>
        </div>
      </AuthLayout>
    );
  }

  if (status === 'success') {
    return (
      <AuthLayout>
        <div className="text-center py-4">
          <div className="inline-flex w-14 h-14 rounded-full bg-amber-brand/10 items-center justify-center mb-5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-brand" />
            </svg>
          </div>
          <h1 className="font-display text-[1.5rem] text-charcoal leading-snug mb-2">Email verified</h1>
          <p className="text-[13px] text-charcoal/55 leading-relaxed mb-7">
            Your email is confirmed. You'll now receive reminders when they're due.
          </p>
          <Link
            to="/dashboard"
            className="text-[13px] font-semibold text-amber-brand hover:text-amber-brand-dark transition-colors"
          >
            Go to dashboard
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="text-center py-4">
        <div className="inline-flex w-14 h-14 rounded-full bg-danger/8 items-center justify-center mb-5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-danger" />
          </svg>
        </div>
        <h1 className="font-display text-[1.5rem] text-charcoal leading-snug mb-2">Link invalid or expired</h1>
        <p className="text-[13px] text-charcoal/55 leading-relaxed mb-7">
          This verification link is no longer valid. Sign in and request a new one from your dashboard.
        </p>
        <Link
          to="/auth/login"
          className="text-[13px] font-semibold text-amber-brand hover:text-amber-brand-dark transition-colors"
        >
          Back to sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
