import { Calendar, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reminder, ReminderCategory } from '../../lib/types';
import { Modal } from '../ui/Modal';

interface ReminderCardProps {
  reminder: Reminder;
  daysUntilExpiry: number;
  onDelete: (id: string) => Promise<void>;
}

const categoryConfig: Record<ReminderCategory, { icon: string; label: string }> = {
  document:     { icon: '🗂️', label: 'Document' },
  subscription: { icon: '📦', label: 'Subscription' },
  warranty:     { icon: '🔧', label: 'Warranty' },
  insurance:    { icon: '🛡️', label: 'Insurance' },
  custom:       { icon: '🔔', label: 'Custom' },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* Circular progress ring — shows how close to expiry */
const RADIUS = 28;
const CIRC = 2 * Math.PI * RADIUS; // ≈ 175.9

function ProgressRing({
  days,
  isExpired,
  isUrgent,
  isSoon,
}: {
  days: number;
  isExpired: boolean;
  isUrgent: boolean;
  isSoon: boolean;
}) {
  const progress = isExpired ? 1 : Math.max(0, 1 - Math.min(days, 365) / 365);
  const offset = CIRC * (1 - progress);

  const stroke = isExpired
    ? 'rgba(26,26,46,0.10)'
    : isUrgent
      ? '#DC2626'
      : isSoon
        ? '#D97706'
        : '#16A34A';

  const textColor = isExpired
    ? 'text-charcoal/25'
    : isUrgent
      ? 'text-urgent'
      : isSoon
        ? 'text-soon'
        : 'text-safe';

  return (
    <div className="relative w-[72px] h-[72px] shrink-0 flex items-center justify-center drop-shadow-sm">
      <svg
        width="72" height="72" viewBox="0 0 72 72"
        style={{ transform: 'rotate(-90deg)' }}
        className="absolute inset-0"
      >
        {/* Track */}
        <circle cx="36" cy="36" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="4" />
        {/* Progress */}
        <circle
          cx="36" cy="36" r={RADIUS}
          fill="none"
          stroke={stroke}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }}
        />
      </svg>
      <div className="relative z-10 flex flex-col items-center justify-center">
        <span className={`text-[1.9rem] font-black tabular leading-none ${textColor}`}>
          {Math.abs(days)}
        </span>
      </div>
    </div>
  );
}

export function ReminderCard({ reminder, daysUntilExpiry, onDelete }: ReminderCardProps) {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isExpired = daysUntilExpiry < 0;
  const isUrgent  = daysUntilExpiry >= 0 && daysUntilExpiry <= 7;
  const isSoon    = daysUntilExpiry > 7  && daysUntilExpiry <= 30;

  const cat = categoryConfig[reminder.category];
  const sortedDays = [...reminder.remindDaysBefore].sort((a, b) => b - a);

  const handleDelete = async () => {
    setDeleting(true);
    try { await onDelete(reminder.id); }
    finally { setDeleting(false); setConfirmOpen(false); }
  };

  const urgencyBorder = isExpired
    ? 'border-l-charcoal/20'
    : isUrgent
      ? 'border-l-urgent'
      : isSoon
        ? 'border-l-soon'
        : 'border-l-safe';

  return (
    <>
      <div
        className={[
          'group flex flex-col rounded-2xl border border-white/8 bg-white/5 overflow-hidden',
          'shadow-[0_2px_12px_rgba(0,0,0,0.25)] transition-all duration-200',
          'hover:-translate-y-1 hover:shadow-[0_4px_24px_rgba(0,0,0,0.35)] hover:border-white/14 hover:bg-white/7',
          'border-l-4', urgencyBorder,
          isExpired ? 'opacity-45' : '',
          isUrgent && reminder.isActive ? 'animate-pulse-border' : '',
        ].join(' ')}
      >
        <div className="flex flex-col flex-1 p-5">
          {/* Header row: title + category badge */}
          <div className="flex items-start justify-between gap-3 mb-5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[1.1rem] leading-none">{cat.icon}</span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full text-white/55 bg-white/10">
                  {cat.label}
                </span>
              </div>
              <h3 className="font-semibold text-[15px] leading-snug mt-2 truncate text-white">
                {reminder.title}
              </h3>
            </div>

            {/* Expired stamp or urgency status dot */}
            {isExpired ? (
              <span className="shrink-0 text-[10px] font-bold tracking-wide text-white/40 bg-white/8 border border-white/10 px-2 py-0.5 rounded-full mt-0.5">
                EXPIRED
              </span>
            ) : (
              <span
                className={`shrink-0 w-2 h-2 rounded-full mt-1 ${isUrgent ? 'bg-urgent' : isSoon ? 'bg-soon' : 'bg-safe'}`}
                title={isUrgent ? 'Urgent' : isSoon ? 'Soon' : 'Active'}
              />
            )}
          </div>

          {/* Days ring + meta */}
          <div className="flex items-center gap-4 mb-5">
            <ProgressRing
              days={daysUntilExpiry}
              isExpired={isExpired}
              isUrgent={isUrgent}
              isSoon={isSoon}
            />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/35 mb-0.5">
                {isExpired ? 'Expired' : 'Days remaining'}
              </p>
              <p className="text-[11px] text-white/35">{isExpired ? 'ago' : 'until expiry'}</p>
              <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-white/38">
                <Calendar size={10} className="shrink-0" />
                <span>{formatDate(reminder.expiryDate)}</span>
              </div>
            </div>
          </div>

          {/* Reminder chips */}
          <div className="flex flex-wrap items-center gap-1.5 mt-auto">
            {sortedDays.slice(0, 3).map((d) => (
              <span
                key={d}
                className="rounded-full bg-white/8 border border-white/10 px-3 py-1 text-[11px] font-medium text-white/55"
              >
                {d === 1 ? '1 day' : `${d} days`} before
              </span>
            ))}
            {sortedDays.length > 3 && (
              <span className="text-[10px] text-white/32">+{sortedDays.length - 3}</span>
            )}
          </div>

          {/* Notes */}
          {reminder.notes && (
            <p className="mt-3 truncate text-[11px] text-white/30 italic leading-snug">
              {reminder.notes}
            </p>
          )}
        </div>

        {/* Footer actions — always visible on mobile, hover-only on desktop */}
        <div className="flex items-center justify-end gap-0.5 border-t border-white/6 px-3 py-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={() => navigate(`/reminders/${reminder.id}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-white/40 hover:text-white hover:bg-white/8 transition-all duration-150"
          >
            <Pencil size={12} />
            Edit
          </button>
          <button
            onClick={() => setConfirmOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-white/40 hover:text-danger hover:bg-danger/10 transition-all duration-150"
          >
            <Trash2 size={12} />
            Delete
          </button>
        </div>
      </div>

      <Modal
        open={confirmOpen}
        title="Delete reminder"
        confirmLabel={deleting ? 'Deleting…' : 'Delete'}
        danger
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
      >
        Are you sure you want to delete <strong>{reminder.title}</strong>? This action cannot be undone.
      </Modal>
    </>
  );
}
