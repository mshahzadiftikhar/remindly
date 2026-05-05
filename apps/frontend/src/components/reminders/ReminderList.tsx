import { useNavigate } from 'react-router-dom';
import { Reminder } from '../../lib/types';
import { Button } from '../ui/Button';
import { ReminderCard } from './ReminderCard';

interface ReminderWithDays {
  reminder: Reminder;
  daysUntilExpiry: number;
}

interface ReminderListProps {
  reminders: Reminder[];
  onDelete: (id: string) => Promise<void>;
}

function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

interface SectionProps {
  label: string;
  dotColor: string;
  count: number;
  items: ReminderWithDays[];
  onDelete: (id: string) => Promise<void>;
}

function Section({ label, dotColor, count, items, onDelete }: SectionProps) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="mb-4 flex items-center gap-2.5">
        <span className={`h-2.5 w-2.5 rounded-full ${dotColor}`} />
        <h2 className="text-sm font-semibold text-gray-700">{label}</h2>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
          {count}
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ reminder, daysUntilExpiry }) => (
          <ReminderCard
            key={reminder.id}
            reminder={reminder}
            daysUntilExpiry={daysUntilExpiry}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

export function ReminderList({ reminders, onDelete }: ReminderListProps) {
  const navigate = useNavigate();

  if (reminders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-24 text-center">
        <span className="text-5xl">📋</span>
        <h3 className="mt-4 text-base font-semibold text-gray-900">No reminders yet</h3>
        <p className="mt-1 text-sm text-gray-400">
          Track documents, subscriptions, warranties and more.
        </p>
        <Button className="mt-6" onClick={() => navigate('/reminders/new')}>
          Add your first reminder
        </Button>
      </div>
    );
  }

  const withDays: ReminderWithDays[] = reminders.map((r) => ({
    reminder: r,
    daysUntilExpiry: getDaysUntilExpiry(r.expiryDate),
  }));

  const urgent = withDays.filter(({ daysUntilExpiry }) => daysUntilExpiry <= 7);
  const soon = withDays.filter(
    ({ daysUntilExpiry }) => daysUntilExpiry > 7 && daysUntilExpiry <= 30,
  );
  const ok = withDays.filter(({ daysUntilExpiry }) => daysUntilExpiry > 30);

  return (
    <div className="space-y-8">
      <Section label="Urgent" dotColor="bg-red-500" count={urgent.length} items={urgent} onDelete={onDelete} />
      <Section label="Coming up" dotColor="bg-amber-400" count={soon.length} items={soon} onDelete={onDelete} />
      <Section label="All good" dotColor="bg-green-500" count={ok.length} items={ok} onDelete={onDelete} />
    </div>
  );
}
