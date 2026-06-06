import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import api from '../../lib/api';

interface FormState { password: string; confirmPassword: string; }
interface FormErrors { password?: string; confirmPassword?: string; }

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!values.password) errors.password = 'Password is required';
  else if (values.password.length < 8) errors.password = 'Must be at least 8 characters';
  if (!values.confirmPassword) errors.confirmPassword = 'Please confirm your password';
  else if (values.password !== values.confirmPassword) errors.confirmPassword = 'Passwords do not match';
  return errors;
}

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [values, setValues] = useState<FormState>({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setIsSubmitting(true);
    setServerError('');
    try {
      await api.post('/auth/reset-password', { token, password: values.password });
      setSuccess(true);
      setTimeout(() => navigate('/auth/login'), 2500);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message;
        setServerError(Array.isArray(msg) ? msg[0] : (msg ?? 'Something went wrong. Please try again.'));
      } else {
        setServerError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout>
        <div className="text-center py-4">
          <h1 className="font-display text-[1.5rem] text-charcoal leading-snug mb-2">Invalid link</h1>
          <p className="text-[13px] text-charcoal/55 leading-relaxed mb-7">
            This password reset link is missing or malformed.
          </p>
          <Link
            to="/auth/forgot-password"
            className="text-[13px] font-semibold text-amber-brand hover:text-amber-brand-dark transition-colors"
          >
            Request a new link
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (success) {
    return (
      <AuthLayout>
        <div className="text-center py-4">
          <div className="inline-flex w-14 h-14 rounded-full bg-amber-brand/10 items-center justify-center mb-5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-brand" />
            </svg>
          </div>
          <h1 className="font-display text-[1.5rem] text-charcoal leading-snug mb-2">Password updated</h1>
          <p className="text-[13px] text-charcoal/55 leading-relaxed">
            Redirecting you to sign in…
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="mb-7">
        <h1 className="font-display text-[1.65rem] text-charcoal leading-snug">Set new password</h1>
        <p className="text-[13px] text-charcoal/42 mt-1">Choose a strong password for your account</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="New password"
          type="password"
          placeholder="At least 8 characters"
          value={values.password}
          onChange={set('password')}
          error={errors.password}
          disabled={isSubmitting}
          autoComplete="new-password"
          autoFocus
        />
        <Input
          label="Confirm new password"
          type="password"
          placeholder="Repeat your password"
          value={values.confirmPassword}
          onChange={set('confirmPassword')}
          error={errors.confirmPassword}
          disabled={isSubmitting}
          autoComplete="new-password"
        />

        {serverError && (
          <div className="rounded-xl bg-danger/6 border border-danger/18 px-4 py-3 text-[13px] text-danger">
            {serverError}
          </div>
        )}

        <Button type="submit" size="lg" className="w-full mt-1" disabled={isSubmitting}>
          {isSubmitting ? <><Spinner /> Updating…</> : 'Update password'}
        </Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-charcoal/42">
        <Link to="/auth/login" className="font-semibold text-amber-brand hover:text-amber-brand-dark transition-colors">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
