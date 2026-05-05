import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppNavbar } from '../components/layout/AppNavbar';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { ReminderList } from '../components/reminders/ReminderList';
import { DashboardSkeleton } from '../components/skeletons/DashboardSkeleton';
import { Button } from '../components/ui/Button';
import api from '../lib/api';
import { Reminder } from '../lib/types';

const statConfig = [
  {
    key: 'total',
    label: 'Total reminders',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    key: 'expiring',
    label: 'Expiring this month',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: 'active',
    label: 'Active',
    color: 'text-green-600',
    bg: 'bg-green-50',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

function SummaryBar({ reminders }: { reminders: Reminder[] }) {
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const expiringThisMonth = reminders.filter((r) => {
    const expiry = new Date(r.expiryDate);
    return expiry >= now && expiry <= endOfMonth;
  }).length;

  const values = {
    total: reminders.length,
    expiring: expiringThisMonth,
    active: reminders.filter((r) => r.isActive).length,
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {statConfig.map(({ key, label, color, bg, icon }) => (
        <div
          key={key}
          className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm"
        >
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg} ${color}`}>
            {icon}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">{label}</p>
            <p className={`mt-0.5 text-2xl font-bold ${color}`}>
              {values[key as keyof typeof values]}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function DashboardContent() {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Reminder[]>('/reminders')
      .then((res) => setReminders(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    await api.delete(`/reminders/${id}`);
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 to-white">
      <AppNavbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-0.5 text-sm text-gray-500">Track and manage your upcoming expirations</p>
          </div>
          <Button onClick={() => navigate('/reminders/new')}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New reminder
          </Button>
        </div>
        {loading ? (
          <DashboardSkeleton />
        ) : (
          <div className="space-y-8">
            <SummaryBar reminders={reminders} />
            <ReminderList
              reminders={reminders}
              onDelete={handleDelete}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
