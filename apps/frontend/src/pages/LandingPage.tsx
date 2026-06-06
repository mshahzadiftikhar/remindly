import { Bell, Tag, Mail, Clock, CalendarCheck, CheckCircle, ArrowRight, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';

function MockReminderCard() {
  return (
    <div className="w-full max-w-[320px] bg-white rounded-2xl border border-charcoal/10 shadow-2xl shadow-black/30 overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-amber-brand to-amber-brand-dark" />
      <div className="p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🗂️</span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-charcoal/35">Document</span>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-charcoal/32 mb-1">Days remaining</p>
            <p className="text-[3rem] font-bold tabular text-amber-brand leading-none">28</p>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        </div>
        <h3 className="text-[15px] font-semibold text-charcoal mb-0.5">UK Passport</h3>
        <p className="text-[12px] text-charcoal/38 mb-4">Expires 15 Jan 2026</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {['30 days', '7 days', '1 day'].map((label) => (
            <span key={label} className="text-[11px] bg-amber-brand-light text-charcoal/60 px-3 py-1 rounded-full font-medium">
              {label} before
            </span>
          ))}
        </div>
        <div className="pt-4 border-t border-charcoal/6 flex items-center gap-2 text-[11px] text-charcoal/32">
          <Mail size={11} />
          <span>Reminders to jane@example.com</span>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: Bell,
    title: 'Smart Reminders',
    description: 'Choose exactly when to be notified — 30 days, 7 days, 1 day before. Your schedule, your rules.',
    accent: 'bg-amber-brand/18 text-amber-brand',
  },
  {
    icon: Tag,
    title: 'Any Category',
    description: 'Documents, subscriptions, warranties, insurance — or anything custom you define.',
    accent: 'bg-violet-500/20 text-violet-300',
  },
  {
    icon: Mail,
    title: 'Email Delivery',
    description: 'Clean, timely emails straight to your inbox. No app to install, no push notification fatigue.',
    accent: 'bg-blue-500/18 text-blue-300',
  },
  {
    icon: Shield,
    title: 'Always Free',
    description: 'Core features are free forever. No credit card, no trials, no paywalls.',
    accent: 'bg-emerald-500/18 text-emerald-300',
  },
  {
    icon: Zap,
    title: 'Instant Setup',
    description: 'Sign up and add your first reminder in under two minutes. Zero configuration needed.',
    accent: 'bg-orange-500/18 text-orange-300',
  },
  {
    icon: CheckCircle,
    title: 'Peace of Mind',
    description: 'Stop keeping mental tabs on things that have deadlines. Let Remindly hold that for you.',
    accent: 'bg-pink-500/18 text-pink-300',
  },
];

const steps = [
  {
    number: '01',
    icon: CalendarCheck,
    title: 'Create a free account',
    description: 'Sign up in seconds — no credit card required.',
  },
  {
    number: '02',
    icon: Clock,
    title: 'Add what you want to track',
    description: 'Set a title, expiry date, and choose when to be reminded.',
  },
  {
    number: '03',
    icon: Bell,
    title: 'Get emailed before it expires',
    description: 'We send a reminder to your inbox on the exact days you picked.',
  },
];

export function LandingPage() {
  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-charcoal">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="flex-1 relative overflow-hidden dot-grid-dark">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-amber-brand/22 -translate-y-1/3 translate-x-1/4 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-amber-brand/12 translate-y-1/2 -translate-x-1/4 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 lg:pt-32 lg:pb-40">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

            {/* Left: copy */}
            <div className="animate-fade-up">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 bg-amber-brand/15 border border-amber-brand/40 text-amber-brand text-xs font-semibold px-4 py-1.5 rounded-full mb-8 tracking-wide shadow-sm shadow-amber-brand/10">
                <span className="w-2 h-2 rounded-full bg-amber-brand animate-pulse" />
                Free to use — always
              </div>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-[4.5rem] text-white leading-[1.06] tracking-tight mb-6">
                Never miss an
                <span className="block text-amber-brand italic">expiry date</span>
                again.
              </h1>

              <p className="text-[17px] text-white/45 leading-relaxed mb-9 max-w-[440px]">
                Set reminders for your passport, subscriptions, warranties — anything.
                Remindly emails you well before it's too late.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link to="/auth/signup">
                  <Button size="lg" className="w-full sm:w-auto gap-1.5 shadow-md shadow-amber-brand/25">
                    Start for free
                    <ArrowRight size={16} />
                  </Button>
                </Link>
                <a href="#how-it-works" onClick={scrollTo('how-it-works')}>
                  <Button size="lg" variant="outline-invert" className="w-full sm:w-auto">
                    See how it works
                  </Button>
                </a>
              </div>

              {/* Trust strip */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {['No credit card', 'Free forever', 'Email reminders included'].map((t) => (
                  <span key={t} className="flex items-center gap-1.5 text-[13px] text-white/38">
                    <CheckCircle size={13} className="text-emerald-400 shrink-0" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: mock card with floating badges */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Depth layers */}
                <div className="absolute inset-0 rounded-2xl bg-amber-brand/35 rotate-[6deg] translate-y-5 translate-x-4 blur-[6px]" />
                <div className="absolute inset-0 rounded-2xl bg-white/8 rotate-[3deg] translate-y-2.5 translate-x-2" />
                {/* Card */}
                <div className="relative drop-shadow-2xl">
                  <MockReminderCard />
                  {/* Top badge */}
                  <div className="animate-float absolute -top-5 -right-5 flex items-center gap-1.5 bg-white text-charcoal text-[11px] font-semibold px-3.5 py-2 rounded-full shadow-xl shadow-black/25">
                    <CheckCircle size={12} className="text-emerald-500" />
                    Email sent
                  </div>
                  {/* Bottom badge */}
                  <div className="absolute -bottom-5 -left-5 flex items-center gap-1.5 bg-white border border-charcoal/10 text-charcoal text-xs font-medium px-3.5 py-2 rounded-full shadow-lg shadow-charcoal/15 animate-float-delayed">
                    <Bell size={12} className="text-amber-brand" />
                    Reminder scheduled
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section id="features" className="py-28 bg-[#13131f] relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 dot-grid-dark" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-18">
            <p className="text-amber-brand text-[11px] font-semibold uppercase tracking-widest mb-3">Features</p>
            <h2 className="font-display text-3xl sm:text-4xl text-white mb-4 leading-tight">
              Everything you need,<br className="hidden sm:block" /> nothing you don't
            </h2>
            <p className="text-white/42 text-[17px] max-w-lg mx-auto">
              Remindly is simple by design. Set it once, let it do the work.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-14">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-white/6 bg-white/4 p-7 hover:bg-white/7 hover:border-white/10 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`w-10 h-10 rounded-xl ${f.accent} flex items-center justify-center mb-5`}>
                  <f.icon size={18} />
                </div>
                <h3 className="text-[15px] font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-white/42 text-[13px] leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────── */}
      <section id="how-it-works" className="py-28 bg-charcoal relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 dot-grid-dark opacity-60" />
        <div className="pointer-events-none absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-amber-brand/8 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-18">
            <p className="text-amber-brand text-[11px] font-semibold uppercase tracking-widest mb-3">How it works</p>
            <h2 className="font-display text-3xl sm:text-4xl text-white mb-4">
              Up and running in minutes
            </h2>
            <p className="text-white/42 text-[17px] max-w-lg mx-auto">
              No setup. No complexity. Just reminders that work.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 relative mt-14">
            {/* Connector line */}
            <div className="hidden sm:block absolute top-[28px] left-[calc(16.66%+28px)] right-[calc(16.66%+28px)] h-px bg-gradient-to-r from-amber-brand/40 via-amber-brand/20 to-amber-brand/40 z-0" />

            {steps.map((step, i) => (
              <div key={step.number} className="relative z-10 flex flex-col items-center text-center">
                <div className="relative w-14 h-14 rounded-full bg-amber-brand flex items-center justify-center mb-6 shadow-lg shadow-amber-brand/30">
                  <step.icon size={22} className="text-charcoal" />
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#13131f] border border-white/15 text-white text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-[15px] font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-white/42 text-[13px] leading-relaxed max-w-[200px]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────── */}
      <section className="py-28 bg-[#13131f] relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 dot-grid-dark opacity-[0.8]" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-amber-brand/10 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-3xl px-10 py-14 text-center backdrop-blur-sm">
            <div className="inline-flex items-center gap-2 bg-amber-brand/15 border border-amber-brand/30 text-amber-brand text-[11px] font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-brand" />
              Join thousands of users
            </div>

            <h2 className="font-display text-[2.75rem] sm:text-5xl text-white leading-tight mb-4">
              Ready to stop<br />forgetting?
            </h2>
            <p className="text-white/42 text-[17px] mb-10 max-w-md mx-auto leading-relaxed">
              Stop keeping mental tabs on things with deadlines. Let Remindly hold that for you.
            </p>

            <Link to="/auth/signup">
              <Button size="lg" className="shadow-xl shadow-amber-brand/25 gap-2">
                Create free account
                <ArrowRight size={16} />
              </Button>
            </Link>
            <p className="mt-5 text-white/28 text-[13px]">No credit card required · Cancel anytime</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
