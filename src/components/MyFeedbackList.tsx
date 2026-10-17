import { useAuth } from '../context/AuthContext';
import { useFeedback } from '../context/FeedbackContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { StarRating } from './ui/StarRating';
import { getStatusColor, getSentimentColor, formatDate } from '../lib/utils';
import { MessageSquare } from 'lucide-react';

export function MyFeedbackList() {
  const { user } = useAuth();
  const { getUserFeedback } = useFeedback();

  if (!user) return null;
  const items = getUserFeedback(user.id);

  if (items.length === 0) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardContent className="py-16 text-center">
          <MessageSquare className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p className="text-slate-500">No feedback submitted yet.</p>
          <p className="text-sm text-slate-400 mt-1">Your submissions will appear here with live status updates.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">My Submitted Feedback</h2>
      {items.map((fb) => (
        <Card key={fb.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <CardTitle className="text-base">{fb.category}</CardTitle>
                <p className="text-xs text-slate-400 mt-1">{formatDate(fb.created_at)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(fb.status)}`}>
                  {fb.status}
                </span>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getSentimentColor(fb.ai_sentiment)}`}>
                  {fb.ai_sentiment}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <StarRating value={fb.rating} readonly size="sm" />
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{fb.comments}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
