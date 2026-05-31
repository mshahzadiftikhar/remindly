import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppNavbar } from '../../components/layout/AppNavbar';
import { ProtectedRoute } from '../../components/layout/ProtectedRoute';
import { ReminderForm } from '../../components/reminders/ReminderForm';
import { ReminderFormSkeleton } from '../../components/skeletons/ReminderFormSkeleton';
import api from '../../lib/api';
import { Reminder } from '../../lib/types';

function EditReminderContent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [reminder, setReminder] = useState<Reminder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Reminder>(`/reminders/${id}`)
      .then((res) => setReminder(res.data))
      .catch((err: unknown) => {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 404) navigate('/dashboard');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal dot-grid-dark">
        <AppNavbar />
        <div className="mx-auto max-w-2xl px-4 py-8">
          <ReminderFormSkeleton />
        </div>
      </div>
    );
  }

  if (!reminder) return null;

  return (
    <div className="min-h-screen bg-charcoal dot-grid-dark">
      <AppNavbar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="font-display text-3xl text-white mb-6">Edit Reminder</h1>
        <ReminderForm reminder={reminder} />
      </main>
    </div>
  );
}

export function EditReminderPage() {
  return (
    <ProtectedRoute>
      <EditReminderContent />
    </ProtectedRoute>
  );
}
