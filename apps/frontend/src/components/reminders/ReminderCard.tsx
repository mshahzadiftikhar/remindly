import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reminder, ReminderCategory } from '../../lib/types';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface ReminderCardProps {
  reminder: Reminder;
  daysUntilExpiry: number;
  onDelete: (id: string) => Promise<void>;
}

const categoryStyle: Record<ReminderCategory, string> = {
  document: 'text-indigo-600 bg-indigo-50',
  subscription: 'text-purple-600 bg-purple-50',
  warranty: 'text-orange-600 bg-orange-50',
  insurance: 'text-green-600 bg-green-50',
  custom: 'text-gray-600 bg-gray-100',
};

const categoryLabel: Record<ReminderCategory, string> = {
  document: 'Document',
  subscription: 'Subscription',
  warranty: 'Warranty',
  insurance: 'Insurance',
  custom: 'Custom',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatDaysChip(days: number): string {
  return days === 1 ? '1 day before' : `${days} days before`;
}

export function ReminderCard({ reminder, daysUntilExpiry, onDelete }: ReminderCardProps) {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isExpired = daysUntilExpiry < 0;
  const isUrgent = daysUntilExpiry >= 0 && daysUntilExpiry <= 7;
  const isSoon = daysUntilExpiry > 7 && daysUntilExpiry <= 30;

  const daysText =
    daysUntilExpiry < 0
      ? `${Math.abs(daysUntilExpiry)} day${Math.abs(daysUntilExpiry) !== 1 ? 's' : ''} ago`
      : daysUntilExpiry === 0
        ? 'today'
        : `in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}`;

  const daysColor = isUrgent
    ? 'text-red-600'
    : isSoon
      ? 'text-amber-600'
      : 'text-emerald-600';

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(reminder.id);
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  const sortedDays = [...reminder.remindDaysBefore].sort((a, b) => b - a);

  return (
    <>
      <div className={`rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:shadow-md ${isExpired ? 'opacity-60' : ''}`}>
        <div className="p-5">
          {/* Row 1: category + status */}
          <div className="mb-4 flex items-center justify-between">
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${categoryStyle[reminder.category]}`}>
              {categoryLabel[reminder.category]}
            </span>
            <span className={`flex items-center gap-1.5 text-xs font-medium ${isExpired ? 'text-gray-400' : 'text-emerald-600'}`}>
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${isExpired ? 'bg-gray-300' : 'bg-emerald-500'}`} />
              {isExpired ? 'Expired' : 'Active'}
            </span>
          </div>

          {/* Row 2: title */}
          <h3 className="mb-1 truncate text-base font-semibold text-gray-900">
            {isUrgent && reminder.isActive && (
              <span className="mr-1.5 inline-block h-2 w-2 animate-pulse rounded-full bg-red-500 align-middle" />
            )}
            {reminder.title}
          </h3>

          {/* Row 3: expiry */}
          <p className="mb-4 text-sm text-gray-500">
            Expires{' '}
            <span className={`font-medium ${daysColor}`}>{daysText}</span>
            {' · '}
            {formatDate(reminder.expiryDate)}
          </p>

          {/* Row 4: remind-before chips */}
          {sortedDays.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {sortedDays.map((d) => (
                <span key={d} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                  {formatDaysChip(d)}
                </span>
              ))}
            </div>
          )}

          {/* Notes */}
          {reminder.notes && (
            <p className="mt-3 truncate text-xs text-gray-400">{reminder.notes}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-1 border-t border-gray-100 px-5 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/reminders/${reminder.id}`)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="!text-red-500 hover:!bg-red-50"
            onClick={() => setConfirmOpen(true)}
          >
            Delete
          </Button>
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
        Are you sure you want to delete <strong>{reminder.title}</strong>? This cannot be undone.
      </Modal>
    </>
  );
}
