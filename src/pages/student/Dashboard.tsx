import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFeedback } from '../../context/FeedbackContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MessageSquarePlus, List, TrendingUp, Clock } from 'lucide-react';
import { getStatusColor } from '../../lib/utils';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { getUserFeedback } = useFeedback();
  const myFeedback = user ? getUserFeedback(user.id) : [];
  const open = myFeedback.filter((f) => f.status === 'Open').length;
  const inProgress = myFeedback.filter((f) => f.status === 'In Progress').length;
  const resolved = myFeedback.filter((f) => f.status === 'Resolved').length;
  const avgRating = myFeedback.length
    ? (myFeedback.reduce((s, f) => s + f.rating, 0) / myFeedback.length).toFixed(1)
    : '—';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Welcome, {user?.full_name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Student Portal — share your experience and track impact.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Submitted</p>
                <p className="text-2xl font-bold">{myFeedback.length}</p>
              </div>
              <List className="h-8 w-8 text-indigo-500 opacity-60" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Open</p>
                <p className="text-2xl font-bold text-rose-600">{open}</p>
              </div>
              <Clock className="h-8 w-8 text-rose-500 opacity-60" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">In Progress</p>
                <p className="text-2xl font-bold text-amber-600">{inProgress}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-amber-500 opacity-60" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Avg Rating</p>
                <p className="text-2xl font-bold text-emerald-600">{avgRating}</p>
              </div>
              <span className="text-2xl">⭐</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Link to="/student/submit">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full border-indigo-200 dark:border-indigo-800">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                <MessageSquarePlus className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Submit New Feedback</h3>
                <p className="text-sm text-slate-500">Share curriculum, campus, or career insights</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/student/my-feedback">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <List className="h-6 w-6 text-slate-600 dark:text-slate-300" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Track My Feedback</h3>
                <p className="text-sm text-slate-500">See status updates on your submissions</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {myFeedback.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {myFeedback.slice(0, 3).map((fb) => (
              <div key={fb.id} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div>
                  <p className="font-medium text-sm">{fb.category}</p>
                  <p className="text-xs text-slate-400 truncate max-w-xs">{fb.comments}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(fb.status)}`}>
                  {fb.status}
                </span>
              </div>
            ))}
            <Link to="/student/my-feedback">
              <Button variant="ghost" size="sm" className="mt-2">View all →</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
