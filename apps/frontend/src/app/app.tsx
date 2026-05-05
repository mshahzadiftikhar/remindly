import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from '../components/layout/ErrorBoundary';
import { PublicRoute } from '../components/layout/PublicRoute';
import { ToastProvider } from '../components/ui/Toast';
import { AuthProvider } from '../lib/auth-context';
import { DashboardPage } from '../pages/DashboardPage';
import { LandingPage } from '../pages/LandingPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { SettingsPage } from '../pages/SettingsPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { SignupPage } from '../pages/auth/SignupPage';
import { EditReminderPage } from '../pages/reminders/EditReminderPage';
import { NewReminderPage } from '../pages/reminders/NewReminderPage';

export function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
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
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/reminders/new" element={<NewReminderPage />} />
              <Route path="/reminders/:id" element={<EditReminderPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
