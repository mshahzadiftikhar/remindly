import { Bell, LogOut, User } from 'lucide-react';
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

function SectionLabel({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <div className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center">
        <Icon size={14} className="text-white/50" />
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-white/38">
        {children}
      </p>
    </div>
  );
}

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
      <div className="min-h-screen bg-charcoal dot-grid-dark">
        <AppNavbar />
        <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
          <SettingsSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal dot-grid-dark">
      <AppNavbar />
      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
        {/* Page heading */}
        <div className="mb-9">
          <h1 className="font-display text-[1.85rem] text-white">Settings</h1>
          <p className="text-[13px] text-white/38 mt-1">Manage your account and preferences</p>
        </div>

        <div className="space-y-4">
          {/* ── Profile ── */}
          <Card className="p-6">
            <SectionLabel icon={User}>Profile</SectionLabel>
            <div className="divide-y divide-white/6 rounded-xl overflow-hidden border border-white/7">
              <div className="flex items-center justify-between px-4 py-3 bg-white/4">
                <span className="text-[13px] text-white/42">Name</span>
                <span className="text-[13px] font-medium text-white">
                  {user?.fullName ?? '—'}
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-white/4">
                <span className="text-[13px] text-white/42">Email</span>
                <span className="text-[13px] font-medium text-white">{user?.email}</span>
              </div>
            </div>
          </Card>

          {/* ── Notification Preferences ── */}
          <Card className="p-6">
            <SectionLabel icon={Bell}>Notification Preferences</SectionLabel>

            <div className="rounded-xl border border-white/8 overflow-hidden">
              {/* Toggle row */}
              <div className="flex items-center justify-between gap-4 px-4 py-4 bg-white/4">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-white">Send email reminders</p>
                  <p className="text-[12px] text-white/38 mt-0.5">
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

              {/* Conditional email input */}
              {emailEnabled && (
                <div className="border-t border-white/7 px-4 py-4 bg-white/3">
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
                </div>
              )}
            </div>

            {/* Save row */}
            <div className="flex items-center gap-3 mt-5">
              {saveError && (
                <p className="flex-1 text-[12px] text-danger">{saveError}</p>
              )}
              <div className="flex items-center gap-3 ml-auto">
                {saved && (
                  <span className="text-[13px] font-medium text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Saved
                  </span>
                )}
                <Button onClick={handleSave} disabled={saving} size="md">
                  {saving ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Saving…
                    </>
                  ) : (
                    'Save preferences'
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* ── Danger Zone ── */}
          <Card className="p-6 border-danger/20">
            <SectionLabel icon={LogOut}>Danger Zone</SectionLabel>
            <div className="rounded-xl border border-danger/15 bg-danger/5 px-4 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-[13px] font-semibold text-white">Sign out</p>
                <p className="text-[12px] text-white/38 mt-0.5">This will end your current session</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="!border-danger/30 !text-danger hover:!bg-danger/8 shrink-0"
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
