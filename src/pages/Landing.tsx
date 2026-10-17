import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { ThemeToggle } from '../components/layout/ThemeToggle';
import {
  GraduationCap,
  Users,
  BookOpen,
  Shield,
  MessageSquare,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const roles = [
  {
    role: 'student' as const,
    title: 'Student',
    description: 'Share your academic experience, campus life feedback, and career needs.',
    icon: GraduationCap,
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
  },
  {
    role: 'faculty' as const,
    title: 'Faculty',
    description: 'Provide insights on curriculum, research resources, and institutional processes.',
    icon: BookOpen,
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50 dark:bg-violet-950/40',
  },
  {
    role: 'parent' as const,
    title: 'Parent',
    description: 'Voice concerns about safety, infrastructure, and student support systems.',
    icon: Users,
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
  },
  {
    role: 'admin' as const,
    title: 'Admin',
    description: 'Command center for analytics, action plans, and institutional improvement.',
    icon: Shield,
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
  },
];

const features = [
  { icon: MessageSquare, title: 'Multi-Stakeholder Voice', desc: 'Students, faculty & parents share structured feedback.' },
  { icon: BarChart3, title: 'Live Analytics', desc: 'Sentiment analysis, category breakdowns & resolution metrics.' },
  { icon: CheckCircle2, title: 'Action Tracking', desc: 'Convert feedback into assigned departmental action items.' },
  { icon: Sparkles, title: 'AI Sentiment', desc: 'Automatic sentiment tagging helps prioritize critical issues.' },
];

export default function Landing() {
  const { demoLogin, user } = useAuth();
  const navigate = useNavigate();

  const handleDemo = (role: typeof roles[0]['role']) => {
    demoLogin(role);
    navigate(`/${role === 'admin' ? 'admin' : role}`);
  };

  if (user) {
    navigate(`/${user.role === 'admin' ? 'admin' : user.role}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-indigo-400">
            <GraduationCap className="h-8 w-8" />
            UniFeedback
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/auth">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent dark:from-indigo-900/20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-950/50 px-4 py-1.5 text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-6">
            <Sparkles className="h-4 w-4" />
            Institutional Excellence Platform
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
            Amplify Every Voice.{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Drive Real Change.
            </span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A modern multi-stakeholder feedback system that turns student, faculty, and parent insights into trackable institutional improvements.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/auth?mode=signup">
              <Button size="lg" className="gap-2">
                Start Giving Feedback <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" onClick={() => handleDemo('admin')}>
              View Admin Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Role Cards */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">
          Choose Your Portal
        </h2>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-10">
          Quick demo access — no signup required
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {roles.map((r) => (
            <button
              key={r.role}
              onClick={() => handleDemo(r.role)}
              className={`group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 p-6 text-left transition-all hover:shadow-lg hover:-translate-y-1 ${r.bg}`}
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${r.color} text-white mb-4 shadow-md`}>
                <r.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{r.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{r.description}</p>
              <div className="mt-4 flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Enter portal <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-10">
            Built for Continuous Improvement
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{f.title}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>University Multi-Stakeholder Feedback & Institutional Improvement Platform</p>
        <p className="mt-1">Demo credentials: any role email + password <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">demo123</code></p>
      </footer>
    </div>
  );
}
