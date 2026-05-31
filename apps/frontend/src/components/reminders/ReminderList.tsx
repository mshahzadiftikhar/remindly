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
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate); expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

interface SectionProps {
  label: string;
  dotColor: string;
  count: number;
  items: ReminderWithDays[];
  onDelete: (id: string) => Promise<void>;
  indexOffset: number;
}

function Section({ label, dotColor, count, items, onDelete, indexOffset }: SectionProps) {
  if (items.length === 0) return null;
  const isUrgentSection = label === 'Urgent';
  return (
    <div>
      <div className="mb-4 flex items-center gap-2.5">
        <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${dotColor} ${isUrgentSection ? 'animate-pulse' : ''}`} />
        <h2 className="text-[13px] font-semibold text-white/50 uppercase tracking-widest">{label}</h2>
        <span className="rounded-full bg-white/8 px-2 py-0.5 text-[11px] font-medium text-white/45">
          {count}
        </span>
        <div className="flex-1 h-px bg-white/8" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ reminder, daysUntilExpiry }, index) => (
          <div
            key={reminder.id}
            className="animate-fade-up"
            style={{ animationDelay: `${(indexOffset + index) * 60}ms` }}
          >
            <ReminderCard reminder={reminder} daysUntilExpiry={daysUntilExpiry} onDelete={onDelete} />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/4 py-20 px-8 text-center">
      {/* Illustration */}
      <div className="mb-6">
        <svg width="88" height="88" viewBox="0 0 88 88" fill="none" aria-hidden="true">
          <rect x="10" y="20" width="68" height="56" rx="10" fill="rgba(255,255,255,0.06)" />
          <rect x="10" y="20" width="68" height="22" rx="10" fill="#E8A838" />
          <rect x="10" y="34" width="68" height="8" fill="#E8A838" />
          <rect x="27" y="12" width="5" height="16" rx="2.5" fill="#C8881C" />
          <rect x="56" y="12" width="5" height="16" rx="2.5" fill="#C8881C" />
          {[30, 43, 56].map((x) =>
            [52, 62].map((y) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="white" opacity="0.12" />
            ))
          )}
          <circle cx="62" cy="66" r="14" fill="rgba(255,255,255,0.08)" />
          <circle cx="62" cy="66" r="12" fill="#22c55e" />
          <path d="M56.5 66.5l4 4 7.5-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h3 className="text-[17px] font-semibold text-white mb-2">No reminders yet</h3>
      <p className="text-[13px] text-white/42 max-w-xs leading-relaxed mb-7">
        Track passports, warranties, subscriptions — anything with an expiry date. We'll remind you before it's too late.
      </p>
      <Button onClick={onAdd} size="lg">
        Add your first reminder
      </Button>

      {/* Decorative chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
        {['🗂️ Passport', '📦 Netflix', '🔧 Warranty', '🛡️ Insurance'].map((label) => (
          <span key={label} className="text-[11px] text-white/35 border border-white/10 rounded-full px-3 py-1">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ReminderList({ reminders, onDelete }: ReminderListProps) {
  const navigate = useNavigate();

  if (reminders.length === 0) {
    return <EmptyState onAdd={() => navigate('/reminders/new')} />;
  }

  const withDays: ReminderWithDays[] = reminders.map((r) => ({
    reminder: r,
    daysUntilExpiry: getDaysUntilExpiry(r.expiryDate),
  }));

  const urgent  = withDays.filter(({ daysUntilExpiry }) => daysUntilExpiry <= 7);
  const soon    = withDays.filter(({ daysUntilExpiry }) => daysUntilExpiry > 7 && daysUntilExpiry <= 30);
  const ok      = withDays.filter(({ daysUntilExpiry }) => daysUntilExpiry > 30);

  return (
    <div className="space-y-10">
      <Section label="Urgent"     dotColor="bg-urgent"      count={urgent.length} items={urgent} onDelete={onDelete} indexOffset={0} />
      <Section label="Coming up"  dotColor="bg-soon"        count={soon.length}   items={soon}   onDelete={onDelete} indexOffset={urgent.length} />
      <Section label="All good"   dotColor="bg-safe"        count={ok.length}     items={ok}     onDelete={onDelete} indexOffset={urgent.length + soon.length} />
    </div>
  );
}
