import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import api from '../../lib/api';
import { useAuth } from '../../lib/auth-context';
import { User } from '../../lib/types';

interface LoginResponse extends User {
  accessToken: string;
}

interface FormState { email: string; password: string; }
interface FormErrors { email?: string; password?: string; }

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!values.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Enter a valid email address';
  if (!values.password) errors.password = 'Password is required';
  return errors;
}

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [values, setValues] = useState<FormState>({ email: '', password: '' });
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
      const { data } = await api.post<LoginResponse>('/auth/login', {
        email: values.email,
        password: values.password,
      });
      const { accessToken, ...user } = data;
      login(accessToken, user);
      navigate('/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setServerError('Invalid email or password');
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
        <h1 className="font-display text-[1.65rem] text-charcoal leading-snug">Welcome back</h1>
        <p className="text-[13px] text-charcoal/42 mt-1">Sign in to manage your reminders</p>
      </div>

      {/* OAuth buttons */}
      <div className="flex flex-col gap-2.5 mb-5">
        <Link
          to="/coming-soon"
          className="flex items-center justify-center gap-3 w-full px-4 h-12 rounded-xl border border-[#e0ddd6] bg-white text-[15px] font-medium text-charcoal/70 hover:bg-[#f5f3ef] transition-all duration-150 shadow-sm shadow-charcoal/4"
        >
          <GoogleIcon />
          Continue with Google
        </Link>
        <Link
          to="/coming-soon"
          className="flex items-center justify-center gap-3 w-full px-4 h-12 rounded-xl border border-[#e0ddd6] bg-white text-[15px] font-medium text-charcoal/70 hover:bg-[#f5f3ef] transition-all duration-150 shadow-sm shadow-charcoal/4"
        >
          <MicrosoftIcon />
          Continue with Microsoft
        </Link>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-charcoal/8" />
        <span className="text-[11px] text-charcoal/28 font-medium tracking-wide uppercase">or email</span>
        <div className="flex-1 h-px bg-charcoal/8" />
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
        <div className="flex flex-col gap-1">
          <Input
            label="Password"
            type="password"
            placeholder="Your password"
            value={values.password}
            onChange={set('password')}
            error={errors.password}
            disabled={isSubmitting}
            autoComplete="current-password"
          />
          <div className="flex justify-end">
            <Link
              to="/auth/forgot-password"
              className="text-[12px] text-charcoal/42 hover:text-charcoal/60 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {serverError && (
          <div className="rounded-xl bg-danger/6 border border-danger/18 px-4 py-3 text-[13px] text-danger">
            {serverError}
          </div>
        )}

        <Button type="submit" size="lg" className="w-full mt-1" disabled={isSubmitting}>
          {isSubmitting ? <><Spinner /> Signing in…</> : 'Sign in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-charcoal/42">
        Don't have an account?{' '}
        <Link to="/auth/signup" className="font-semibold text-amber-brand hover:text-amber-brand-dark transition-colors">
          Create one free
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

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
      <rect x="0" y="0" width="8.5" height="8.5" fill="#F25022" />
      <rect x="9.5" y="0" width="8.5" height="8.5" fill="#7FBA00" />
      <rect x="0" y="9.5" width="8.5" height="8.5" fill="#00A4EF" />
      <rect x="9.5" y="9.5" width="8.5" height="8.5" fill="#FFB900" />
    </svg>
  );
}
