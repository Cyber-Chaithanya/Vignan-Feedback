import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFeedback } from '../context/FeedbackContext';
import { Button } from './ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Label, Select, Textarea } from './ui/Input';
import { StarRating } from './ui/StarRating';
import { CATEGORIES } from '../data/mockData';
import { FeedbackCategory } from '../types';
import { Send } from 'lucide-react';

export function FeedbackForm() {
  const { user } = useAuth();
  const { addFeedback } = useFeedback();
  const [category, setCategory] = useState<FeedbackCategory>(CATEGORIES[0]);
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setSubmitting(true);
    addFeedback({
      user_id: user.id,
      role: user.role,
      category,
      rating,
      comments,
      user_name: user.full_name,
    });
    setCategory(CATEGORIES[0]);
    setRating(0);
    setComments('');
    setSubmitting(false);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Submit Feedback</CardTitle>
        <CardDescription>
          Your voice matters. Share constructive feedback to help improve the university.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Overall Rating</Label>
            <StarRating value={rating} onChange={setRating} size="lg" />
            {rating === 0 && <p className="text-xs text-slate-400">Please select a rating</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Describe your experience, suggestions, or concerns in detail..."
              required
              rows={5}
            />
          </div>
          <Button type="submit" disabled={submitting || rating === 0} className="w-full gap-2">
            <Send className="h-4 w-4" />
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
