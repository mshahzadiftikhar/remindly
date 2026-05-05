import { Link } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

function MockReminderCard() {
  return (
    <Card className="w-full max-w-sm shadow-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wide">
          Document
        </span>
        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
          Active
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-1">UK Passport</h3>
      <p className="text-sm text-gray-500 mb-4">
        Expires{' '}
        <span className="font-medium text-amber-600">in 28 days</span> · Jan 15, 2026
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        {['30 days before', '7 days before', '1 day before'].map((label) => (
          <span
            key={label}
            className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full"
          >
            {label}
          </span>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-500">
        <span>✉️</span>
        <span>Reminders sent to john@example.com</span>
      </div>
    </Card>
  );
}

const features = [
  {
    icon: '🔔',
    title: 'Smart Reminders',
    description:
      'Choose exactly when to be notified. 30 days, 7 days, 1 day — your call.',
  },
  {
    icon: '📋',
    title: 'Any Category',
    description:
      'Documents, subscriptions, warranties, insurance — or anything custom.',
  },
  {
    icon: '✉️',
    title: 'Email Delivery',
    description:
      'Clean, timely emails straight to your inbox. No app needed.',
  },
];

const steps = [
  {
    number: '1',
    title: 'Create a free account',
    description: 'Sign up in seconds — no credit card required.',
  },
  {
    number: '2',
    title: 'Add what you want to track',
    description: 'Set a title, expiry date, and choose when to be reminded.',
  },
  {
    number: '3',
    title: 'We email you before it expires',
    description: "We'll send a reminder to your inbox on the days you picked.",
  },
];

export function LandingPage() {
  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero */}
      <section className="flex-1 relative overflow-hidden bg-gradient-to-b from-indigo-50/60 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text */}
            <div>
              <span className="inline-block text-xs font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full mb-5 uppercase tracking-wide">
                Free to use
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Never Miss an{' '}
                <span className="text-indigo-600">Expiry</span> Again
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
                Set reminders for your passport, subscriptions, warranties —
                anything. Remindly emails you before it's too late.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/auth/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start for Free →
                  </Button>
                </Link>
                <a href="#how-it-works" onClick={scrollTo('how-it-works')}>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    See How It Works
                  </Button>
                </a>
              </div>
            </div>

            {/* Mock card */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Decorative blobs */}
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-indigo-100 rounded-full opacity-60 blur-2xl"></div>
                <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-purple-100 rounded-full opacity-60 blur-2xl"></div>
                <div className="relative">
                  <MockReminderCard />
                  {/* Floating badge */}
                  <div className="absolute -top-3 -right-3 bg-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                    Email sent! ✓
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need, nothing you don't
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Remindly is simple by design. Set it once, let it do the work.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {features.map((f) => (
              <Card key={f.title} className="p-8 hover:shadow-md transition-shadow duration-200">
                <div className="text-4xl mb-5">{f.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{f.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Up and running in minutes
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              No setup. No complexity. Just reminders that work.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop only) */}
            <div className="hidden sm:block absolute top-10 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-indigo-100 z-0"></div>

            {steps.map((step) => (
              <div key={step.number} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-indigo-600 text-white text-2xl font-bold flex items-center justify-center shadow-lg mb-5">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to stop forgetting?
          </h2>
          <p className="text-indigo-200 text-lg mb-8 max-w-lg mx-auto">
            Join thousands of people who never miss an important expiry date.
          </p>
          <Link to="/auth/signup">
            <Button
              size="lg"
              className="bg-white! text-indigo-600! hover:bg-indigo-50! active:bg-indigo-100! shadow-lg"
            >
              Create Free Account →
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
