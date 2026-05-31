import { AppNavbar } from '../../components/layout/AppNavbar';
import { ProtectedRoute } from '../../components/layout/ProtectedRoute';
import { ReminderForm } from '../../components/reminders/ReminderForm';

function NewReminderContent() {
  return (
    <div className="min-h-screen bg-charcoal dot-grid-dark">
      <AppNavbar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="font-display text-3xl text-white mb-6">Add Reminder</h1>
        <ReminderForm />
      </main>
    </div>
  );
}

export function NewReminderPage() {
  return (
    <ProtectedRoute>
      <NewReminderContent />
    </ProtectedRoute>
  );
}
