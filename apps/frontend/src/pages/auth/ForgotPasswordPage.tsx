import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import api from '../../lib/api';

interface FormState { email: string; }
interface FormErrors { email?: string; }

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!values.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Enter a valid email address';
  return errors;
}

export function ForgotPasswordPage() {
  const [values, setValues] = useState<FormState>({ email: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
      await api.post('/auth/forgot-password', { email: values.email });
      setSubmitted(true);
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

  if (submitted) {
    return (
      <AuthLayout>
        <div className="text-center py-4">
          <div className="inline-flex w-14 h-14 rounded-full bg-amber-brand/10 items-center justify-center mb-5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-amber-brand" />
            </svg>
          </div>
          <h1 className="font-display text-[1.5rem] text-charcoal leading-snug mb-2">Check your email</h1>
          <p className="text-[13px] text-charcoal/55 leading-relaxed mb-7">
            If an account exists for <span className="font-medium text-charcoal/75">{values.email}</span>, we've sent a link to reset your password. It expires in 1 hour.
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

  return (
    <AuthLayout>
      <div className="mb-7">
        <h1 className="font-display text-[1.65rem] text-charcoal leading-snug">Forgot password?</h1>
        <p className="text-[13px] text-charcoal/42 mt-1">We'll send you a link to reset it</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="jane@example.com"
          value={values.email}
          onChange={set('email')}
          error={errors.email}
          disabled={isSubmitting}
          autoComplete="email"
          autoFocus
        />

        {serverError && (
          <div className="rounded-xl bg-danger/6 border border-danger/18 px-4 py-3 text-[13px] text-danger">
            {serverError}
          </div>
        )}

        <Button type="submit" size="lg" className="w-full mt-1" disabled={isSubmitting}>
          {isSubmitting ? <><Spinner /> Sending link…</> : 'Send reset link'}
        </Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-charcoal/42">
        Remembered it?{' '}
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
