import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { Reminder, ReminderCategory } from '../../lib/types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';

interface ReminderFormProps {
  reminder?: Reminder;
}

const CATEGORIES: { value: ReminderCategory; label: string; icon: string }[] = [
  { value: 'document', label: 'Document', icon: '🗂️' },
  { value: 'subscription', label: 'Subscription', icon: '📦' },
  { value: 'warranty', label: 'Warranty', icon: '🔧' },
  { value: 'insurance', label: 'Insurance', icon: '🛡️' },
  { value: 'custom', label: 'Custom', icon: '🔔' },
];

const REMIND_OPTIONS = [1, 3, 7, 14, 30, 60];

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

interface FormErrors {
  title?: string;
  expiryDate?: string;
  remindDaysBefore?: string;
}

interface FormState {
  title: string;
  category: ReminderCategory;
  expiryDate: string;
  remindDaysBefore: number[];
  notes: string;
}

function initState(reminder?: Reminder): FormState {
  if (reminder) {
    return {
      title: reminder.title,
      category: reminder.category,
      expiryDate: reminder.expiryDate,
      remindDaysBefore: reminder.remindDaysBefore,
      notes: reminder.notes ?? '',
    };
  }
  return {
    title: '',
    category: 'document',
    expiryDate: '',
    remindDaysBefore: [7],
    notes: '',
  };
}

export function ReminderForm({ reminder }: ReminderFormProps) {
  const navigate = useNavigate();
  const isEdit = !!reminder;

  const [form, setForm] = useState<FormState>(() => initState(reminder));
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleRemindDay = (day: number) => {
    set(
      'remindDaysBefore',
      form.remindDaysBefore.includes(day)
        ? form.remindDaysBefore.filter((d) => d !== day)
        : [...form.remindDaysBefore, day],
    );
  };

  const validate = (): boolean => {
    const next: FormErrors = {};

    if (!form.title.trim()) {
      next.title = 'Title is required.';
    } else if (form.title.trim().length > 100) {
      next.title = 'Title must be 100 characters or fewer.';
    }

    if (!form.expiryDate) {
      next.expiryDate = 'Expiry date is required.';
    } else if (form.expiryDate < todayISO()) {
      next.expiryDate = 'Expiry date must be today or in the future.';
    }

    if (form.remindDaysBefore.length === 0) {
      next.remindDaysBefore = 'Select at least one reminder interval.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        category: form.category,
        expiryDate: form.expiryDate,
        remindDaysBefore: form.remindDaysBefore,
        notes: form.notes.trim() || null,
      };

      if (isEdit) {
        await api.patch(`/reminders/${reminder.id}`, payload);
      } else {
        await api.post('/reminders', payload);
      }

      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setApiError(typeof msg === 'string' ? msg : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Card className="space-y-6 p-6">
        {/* Title */}
        <Input
          label="Title"
          placeholder="e.g. UK Passport"
          maxLength={101}
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          error={errors.title}
        />

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Category</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {CATEGORIES.map(({ value, label, icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => set('category', value)}
                className={`flex flex-col items-center gap-1 rounded-xl border py-3 text-xs font-medium transition-colors ${
                  form.category === value
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Expiry Date */}
        <Input
          label="Expiry Date"
          type="date"
          min={todayISO()}
          value={form.expiryDate}
          onChange={(e) => set('expiryDate', e.target.value)}
          error={errors.expiryDate}
        />

        {/* Remind Me Before */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Remind Me Before</label>
          <div className="flex flex-wrap gap-2">
            {REMIND_OPTIONS.map((day) => {
              const checked = form.remindDaysBefore.includes(day);
              return (
                <label
                  key={day}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                    checked
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => toggleRemindDay(day)}
                  />
                  {day === 1 ? '1 day' : `${day} days`}
                </label>
              );
            })}
          </div>
          {errors.remindDaysBefore && (
            <p className="text-xs text-red-600">{errors.remindDaysBefore}</p>
          )}
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="notes" className="text-sm font-medium text-gray-700">
              Notes <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <span className="text-xs text-gray-400">{form.notes.length}/500</span>
          </div>
          <textarea
            id="notes"
            rows={3}
            maxLength={500}
            placeholder="Any additional details…"
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            className="w-full resize-none rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {apiError && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{apiError}</p>
        )}
      </Card>

      <div className="mt-4 flex items-center justify-end gap-3">
        <Button type="button" variant="ghost" onClick={() => navigate('/dashboard')}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              {isEdit ? 'Saving…' : 'Creating…'}
            </>
          ) : isEdit ? (
            'Save changes'
          ) : (
            'Create reminder'
          )}
        </Button>
      </div>
    </form>
  );
}
