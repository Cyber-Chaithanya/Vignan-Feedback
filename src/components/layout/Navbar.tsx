import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '../ui/Button';
import { 
  GraduationCap, 
  LogOut, 
  LayoutDashboard, 
  MessageSquarePlus,
  List,
  BarChart3,
  ClipboardList
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const roleLinks = {
    student: [
      { to: '/student', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/student/submit', label: 'Submit Feedback', icon: MessageSquarePlus },
      { to: '/student/my-feedback', label: 'My Feedback', icon: List },
    ],
    faculty: [
      { to: '/faculty', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/faculty/submit', label: 'Submit Feedback', icon: MessageSquarePlus },
      { to: '/faculty/my-feedback', label: 'My Feedback', icon: List },
    ],
    parent: [
      { to: '/parent', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/parent/submit', label: 'Submit Feedback', icon: MessageSquarePlus },
      { to: '/parent/my-feedback', label: 'My Feedback', icon: List },
    ],
    admin: [
      { to: '/admin', label: 'Overview', icon: BarChart3 },
      { to: '/admin/inbox', label: 'Feedback Inbox', icon: List },
      { to: '/admin/actions', label: 'Action Plans', icon: ClipboardList },
    ],
  };

  const links = roleLinks[user.role] || [];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-semibold text-indigo-600 dark:text-indigo-400">
            <GraduationCap className="h-7 w-7" />
            <span className="hidden sm:inline">UniFeedback</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{user.full_name}</span>
            <span className="text-xs capitalize text-slate-500">{user.role}</span>
          </div>
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => { signOut(); navigate('/'); }}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <nav className="flex md:hidden overflow-x-auto border-t border-slate-100 dark:border-slate-800 px-2 py-1 gap-1">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 whitespace-nowrap hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <link.icon className="h-3.5 w-3.5" />
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
