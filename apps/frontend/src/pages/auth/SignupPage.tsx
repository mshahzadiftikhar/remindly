import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import api from '../../lib/api';
import { useAuth } from '../../lib/auth-context';
import { User } from '../../lib/types';

interface FormState {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!values.fullName.trim()) errors.fullName = 'Full name is required';
  if (!values.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Enter a valid email address';
  if (!values.password) errors.password = 'Password is required';
  else if (values.password.length < 8) errors.password = 'Must be at least 8 characters';
  if (!values.confirmPassword) errors.confirmPassword = 'Please confirm your password';
  else if (values.password !== values.confirmPassword) errors.confirmPassword = 'Passwords do not match';
  return errors;
}

export function SignupPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [values, setValues] = useState<FormState>({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await api.post('/auth/register', { fullName: values.fullName, email: values.email, password: values.password });
      const { data } = await api.get<User>('/auth/me');
      setUser(data);
      navigate('/dashboard');
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

  return (
    <AuthLayout>
      <div className="mb-7">
        <h1 className="font-display text-[1.65rem] text-charcoal leading-snug">Create your account</h1>
        <p className="text-[13px] text-charcoal/42 mt-1">Start tracking your expiry dates for free</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="Full name"
          type="text"
          placeholder="Jane Smith"
          value={values.fullName}
          onChange={set('fullName')}
          error={errors.fullName}
          disabled={isSubmitting}
          autoComplete="name"
          autoFocus
        />
        <Input
          label="Email"
          type="email"
          placeholder="jane@example.com"
          value={values.email}
          onChange={set('email')}
          error={errors.email}
          disabled={isSubmitting}
          autoComplete="email"
        />
        <Input
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          value={values.password}
          onChange={set('password')}
          error={errors.password}
          disabled={isSubmitting}
          autoComplete="new-password"
        />
        <Input
          label="Confirm password"
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
          {isSubmitting ? <><Spinner /> Creating account…</> : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-charcoal/42">
        Already have an account?{' '}
        <Link to="/auth/login" className="font-semibold text-amber-brand hover:text-amber-brand-dark transition-colors">
          Sign in
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
