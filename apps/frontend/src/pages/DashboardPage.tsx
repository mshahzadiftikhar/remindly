import { ClipboardList, Clock, CheckCircle, Plus, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppNavbar } from '../components/layout/AppNavbar';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { ReminderList } from '../components/reminders/ReminderList';
import { DashboardSkeleton } from '../components/skeletons/DashboardSkeleton';
import { Button } from '../components/ui/Button';
import api from '../lib/api';
import { useAuth } from '../lib/auth-context';
import { Reminder } from '../lib/types';

function getDaysUntil(dateStr: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const expiry = new Date(dateStr); expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry.getTime() - today.getTime()) / 86_400_000);
}

interface StatCardProps {
  label: string;
  value: number;
  Icon: React.ElementType;
  gradient: string;
  valueColor: string;
  iconBg: string;
  iconColor: string;
  bottomBorder: string;
  trend?: string;
}

function StatCard({ label, value, Icon, gradient, valueColor, iconBg, iconColor, bottomBorder, trend }: StatCardProps) {
  return (
    <div className={`relative rounded-2xl border border-[#D4C9B8] shadow-[0_2px_8px_rgba(100,80,40,0.10),_0_8px_32px_rgba(100,80,40,0.08)] ${gradient} p-5 overflow-hidden flex flex-col`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`h-10 w-10 rounded-xl ${iconBg} flex items-center justify-center shadow-sm`}>
          <Icon size={17} className={iconColor} />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            <TrendingUp size={9} />
            {trend}
          </span>
        )}
      </div>
      <p className={`text-5xl font-black leading-none tabular ${valueColor} mb-1.5`}>{value}</p>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-charcoal/38">{label}</p>
      {/* Colored bottom accent */}
      <div className={`absolute bottom-0 left-0 right-0 h-[3px] ${bottomBorder}`} />
    </div>
  );
}

function getContextMessage(reminders: Reminder[]): { text: string; color: string } {
  if (reminders.length === 0) {
    return { text: "Ready to add your first reminder?", color: 'text-charcoal/40' };
  }
  const urgent = reminders.filter(r => { const d = getDaysUntil(r.expiryDate); return d >= 0 && d <= 7; }).length;
  const soon = reminders.filter(r => { const d = getDaysUntil(r.expiryDate); return d > 7 && d <= 30; }).length;
  if (urgent > 0) return { text: `${urgent} reminder${urgent > 1 ? 's' : ''} expire${urgent === 1 ? 's' : ''} within a week — action needed.`, color: 'text-urgent font-medium' };
  if (soon > 0) return { text: `${soon} reminder${soon > 1 ? 's' : ''} coming up this month.`, color: 'text-soon font-medium' };
  return { text: "All looking good. Nothing urgent right now.", color: 'text-safe' };
}

function DashboardContent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Reminder[]>('/reminders')
      .then((res) => setReminders(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    await api.delete(`/reminders/${id}`);
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const firstName = user?.fullName?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'there';

  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const expiringThisMonth = reminders.filter(r => {
    const e = new Date(r.expiryDate);
    return e >= now && e <= endOfMonth;
  }).length;

  const stats = [
    {
      key: 'total', label: 'Total reminders', value: reminders.length,
      Icon: ClipboardList,
      gradient: 'bg-gradient-to-br from-[#FEFCF8] to-[#F5F0E8]',
      valueColor: 'text-charcoal', iconBg: 'bg-charcoal/8', iconColor: 'text-charcoal/40',
      bottomBorder: 'bg-charcoal/15',
    },
    {
      key: 'expiring', label: 'Expiring this month', value: expiringThisMonth,
      Icon: Clock,
      gradient: 'bg-gradient-to-br from-[#FFFDF5] to-[#FFF4D6]',
      valueColor: 'text-soon', iconBg: 'bg-soon/10', iconColor: 'text-soon',
      bottomBorder: 'bg-soon',
    },
    {
      key: 'active', label: 'Active', value: reminders.filter(r => r.isActive).length,
      Icon: CheckCircle,
      gradient: 'bg-gradient-to-br from-[#F6FDF8] to-[#E8F8EE]',
      valueColor: 'text-safe', iconBg: 'bg-safe/10', iconColor: 'text-safe',
      bottomBorder: 'bg-safe',
    },
  ];

  const ctx = getContextMessage(reminders);

  return (
    <div className="page-bg min-h-screen">
      <AppNavbar />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 pb-28 sm:pb-12">
        {/* Page header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[1.85rem] text-charcoal leading-snug font-semibold">
              Hello, <span className="font-display">{firstName}</span> 👋
            </h1>
            <p className={`mt-1 text-[13px] font-medium ${ctx.color} transition-colors duration-300`}>
              {loading ? 'Loading your reminders…' : ctx.text}
            </p>
          </div>
          {/* Desktop new-reminder button */}
          <Button
            onClick={() => navigate('/reminders/new')}
            className="hidden sm:inline-flex shrink-0 gap-1.5"
          >
            <Plus size={15} strokeWidth={2.5} />
            New reminder
          </Button>
        </div>

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <div className="space-y-8">
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {stats.map(({ key, ...s }) => (
                <StatCard key={key} {...s} />
              ))}
            </div>

            <ReminderList reminders={reminders} onDelete={handleDelete} />
          </div>
        )}
      </main>

      {/* Mobile FAB */}
      <button
        onClick={() => navigate('/reminders/new')}
        className="fixed bottom-6 right-5 z-30 sm:hidden flex items-center gap-2 rounded-full bg-amber-brand text-charcoal font-semibold text-[14px] pl-4 pr-5 py-3.5 shadow-lg shadow-amber-brand/40 hover:bg-amber-brand-dark active:scale-95 transition-all duration-150"
        aria-label="New reminder"
      >
        <Plus size={18} strokeWidth={2.5} />
        New
      </button>
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
