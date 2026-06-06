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
  { value: 'document',     label: 'Document',     icon: '🗂️' },
  { value: 'subscription', label: 'Subscription', icon: '📦' },
  { value: 'warranty',     label: 'Warranty',     icon: '🔧' },
  { value: 'insurance',    label: 'Insurance',    icon: '🛡️' },
  { value: 'custom',       label: 'Custom',       icon: '🔔' },
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
  return { title: '', category: 'document', expiryDate: '', remindDaysBefore: [7], notes: '' };
}

function ProgressBar({ form }: { form: FormState }) {
  const filled = [
    !!form.title.trim(),
    !!form.expiryDate,
    form.remindDaysBefore.length > 0,
    !!form.notes.trim(),
  ].filter(Boolean).length;
  const pct = Math.round((filled / 4) * 100);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-white/35">
          Form completion
        </span>
        <span className="text-[11px] font-semibold text-white/40">{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
        <div
          className="h-full rounded-full bg-amber-brand transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
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
    if (!form.title.trim()) next.title = 'Title is required.';
    else if (form.title.trim().length > 100) next.title = 'Title must be 100 characters or fewer.';
    if (!form.expiryDate) next.expiryDate = 'Expiry date is required.';
    else if (form.expiryDate < todayISO()) next.expiryDate = 'Expiry date must be today or in the future.';
    if (form.remindDaysBefore.length === 0) next.remindDaysBefore = 'Select at least one reminder interval.';
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
      <Card className="p-6">
        <ProgressBar form={form} />

        <div className="space-y-6">
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
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-white/65">Category</label>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
              {CATEGORIES.map(({ value, label, icon }) => {
                const selected = form.category === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => set('category', value)}
                    className={[
                      'relative flex flex-col items-center gap-2 rounded-2xl border py-4 px-2 text-[12px] font-semibold',
                      'transition-all duration-150',
                      selected
                        ? 'border-amber-brand/50 bg-amber-brand/12 text-white shadow-sm scale-[1.02]'
                        : 'border-white/10 text-white/45 hover:border-white/18 hover:bg-white/5 hover:scale-[1.01]',
                    ].join(' ')}
                  >
                    <span className="text-[1.75rem] leading-none">{icon}</span>
                    <span>{label}</span>
                    {selected && (
                      <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-brand flex items-center justify-center shadow-sm">
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                          <path d="M1 3L3 5L7 1" stroke="#FDFCF9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expiry Date */}
          <Input
            label="Expiry date"
            type="date"
            min={todayISO()}
            value={form.expiryDate}
            onChange={(e) => set('expiryDate', e.target.value)}
            error={errors.expiryDate}
          />

          {/* Remind Me Before */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-white/65">Remind me before</label>
            <div className="flex flex-wrap gap-2">
              {REMIND_OPTIONS.map((day) => {
                const checked = form.remindDaysBefore.includes(day);
                return (
                  <label
                    key={day}
                    className={[
                      'flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium',
                      'transition-all duration-150 select-none',
                      checked
                        ? 'border-amber-brand bg-amber-brand text-charcoal shadow-sm'
                        : 'border-white/12 text-white/45 hover:border-white/20 hover:bg-white/5',
                    ].join(' ')}
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
              <p className="text-xs text-danger">{errors.remindDaysBefore}</p>
            )}
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="notes" className="text-[13px] font-medium text-white/65">
                Notes <span className="font-normal text-white/30">(optional)</span>
              </label>
              <span className="text-[11px] text-white/28">{form.notes.length}/500</span>
            </div>
            <textarea
              id="notes"
              rows={3}
              maxLength={500}
              placeholder="Any additional details…"
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              className="w-full resize-none rounded-xl border border-white/12 px-4 py-2.5 text-sm text-white placeholder-white/28 outline-none transition-all duration-150 focus:border-amber-brand focus:ring-2 focus:ring-amber-brand/15 bg-white/8 disabled:bg-white/4 disabled:text-white/30"
            />
          </div>

          {apiError && (
            <p className="rounded-xl bg-danger/6 border border-danger/18 px-4 py-3 text-sm text-danger">
              {apiError}
            </p>
          )}
        </div>
      </Card>

      <div className="mt-5 flex items-center justify-end gap-3">
        <Button type="button" variant="ghost" onClick={() => navigate('/dashboard')}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting} className="min-w-36">
          {submitting ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              {isEdit ? 'Saving…' : 'Creating…'}
            </>
          ) : isEdit ? 'Save changes' : 'Create reminder'}
        </Button>
      </div>
    </form>
  );
}
