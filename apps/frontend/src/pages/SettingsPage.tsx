import { useEffect, useRef, useState } from 'react';
import { AppNavbar } from '../components/layout/AppNavbar';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { SettingsSkeleton } from '../components/skeletons/SettingsSkeleton';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Toggle } from '../components/ui/Toggle';
import api from '../lib/api';
import { useAuth } from '../lib/auth-context';
import { UserSettings } from '../lib/types';

function SettingsContent() {
  const { user, logout } = useAuth();

  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  const [emailEnabled, setEmailEnabled] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    api
      .get<UserSettings>('/settings')
      .then((res) => {
        setSettings(res.data);
        setEmailEnabled(!!res.data.notificationEmail);
        setNotificationEmail(res.data.notificationEmail ?? '');
      })
      .finally(() => setLoadingSettings(false));

    return () => {
      if (savedTimer.current) clearTimeout(savedTimer.current);
    };
  }, []);

  const handleSave = async () => {
    setEmailError('');
    setSaveError('');

    if (emailEnabled && !notificationEmail.trim()) {
      setEmailError('Please enter a notification email address.');
      return;
    }
    if (emailEnabled && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(notificationEmail.trim())) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setSaving(true);
    try {
      const res = await api.patch<UserSettings>('/settings', {
        notificationEmail: emailEnabled ? notificationEmail.trim() : null,
      });
      setSettings(res.data);
      setSaved(true);
      if (savedTimer.current) clearTimeout(savedTimer.current);
      savedTimer.current = setTimeout(() => setSaved(false), 3000);
    } catch {
      setSaveError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loadingSettings || !settings) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppNavbar />
        <div className="mx-auto max-w-2xl px-4 py-8">
          <SettingsSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavbar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Settings</h1>

        <div className="space-y-6">
          {/* Profile */}
          <Card className="p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Profile
            </h2>
            <div className="divide-y divide-gray-100">
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-gray-500">Name</span>
                <span className="text-sm font-medium text-gray-900">
                  {user?.fullName ?? '—'}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-gray-500">Email</span>
                <span className="text-sm font-medium text-gray-900">{user?.email}</span>
              </div>
            </div>
          </Card>

          {/* Notification Preferences */}
          <Card className="p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Notification Preferences
            </h2>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Send email reminders</p>
                  <p className="text-xs text-gray-400">
                    Receive reminders by email before items expire
                  </p>
                </div>
                <Toggle
                  checked={emailEnabled}
                  onChange={(v) => {
                    setEmailEnabled(v);
                    setEmailError('');
                  }}
                  label="Toggle email reminders"
                />
              </div>

              {emailEnabled && (
                <Input
                  label="Send reminders to this email"
                  type="email"
                  placeholder={user?.email}
                  value={notificationEmail}
                  onChange={(e) => {
                    setNotificationEmail(e.target.value);
                    setEmailError('');
                  }}
                  error={emailError}
                />
              )}

              {saveError && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                  {saveError}
                </p>
              )}

              <div className="flex items-center gap-3">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      Saving…
                    </>
                  ) : (
                    'Save'
                  )}
                </Button>
                {saved && (
                  <span className="text-sm font-medium text-green-600">✓ Settings saved</span>
                )}
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200 p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-red-500">
              Danger Zone
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Sign out</p>
                <p className="text-xs text-gray-400">This will end your current session</p>
              </div>
              <Button
                variant="outline"
                className="!border-red-300 !text-red-600 hover:!bg-red-50"
                onClick={logout}
              >
                Sign out
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

export function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
