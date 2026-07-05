import { HashRouter, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from '../components/layout/ErrorBoundary';
import { PublicRoute } from '../components/layout/PublicRoute';
import { ToastProvider } from '../components/ui/Toast';
import { AuthProvider } from '../lib/auth-context';
import { DashboardPage } from '../pages/DashboardPage';
import { LandingPage } from '../pages/LandingPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { SettingsPage } from '../pages/SettingsPage';
import { ComingSoonPage } from '../pages/ComingSoonPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { OAuthCallbackPage } from '../pages/auth/OAuthCallbackPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import { SignupPage } from '../pages/auth/SignupPage';
import { VerifyEmailPage } from '../pages/auth/VerifyEmailPage';
import { EditReminderPage } from '../pages/reminders/EditReminderPage';
import { NewReminderPage } from '../pages/reminders/NewReminderPage';

export function App() {
  return (
    <HashRouter>
      <ErrorBoundary>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/coming-soon" element={<ComingSoonPage />} />
              <Route
                path="/auth/signup"
                element={
                  <PublicRoute>
                    <SignupPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/auth/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/auth/forgot-password"
                element={
                  <PublicRoute>
                    <ForgotPasswordPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/auth/reset-password"
                element={
                  <PublicRoute>
                    <ResetPasswordPage />
                  </PublicRoute>
                }
              />
              <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
              <Route path="/auth/oauth-callback" element={<OAuthCallbackPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/reminders/new" element={<NewReminderPage />} />
              <Route path="/reminders/:id" element={<EditReminderPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </ErrorBoundary>
    </HashRouter>
  );
}

export default App;
