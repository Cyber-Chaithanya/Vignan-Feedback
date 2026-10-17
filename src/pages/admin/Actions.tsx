import { useState } from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Label, Select, Textarea } from '../../components/ui/Input';
import { getStatusColor, formatDate } from '../../lib/utils';
import { DEPARTMENTS } from '../../data/mockData';
import { ActionStatus } from '../../types';
import { Plus, ClipboardList, Calendar } from 'lucide-react';

export default function AdminActions() {
  const { feedbacks, actionItems, addActionItem, updateActionStatus } = useFeedback();
  const [showForm, setShowForm] = useState(false);
  const [feedbackId, setFeedbackId] = useState('');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [targetDate, setTargetDate] = useState('');

  const criticalFeedback = feedbacks.filter(
    (f) => f.status !== 'Resolved' && (f.ai_sentiment === 'Negative' || f.rating <= 2)
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackId || !title || !targetDate) return;
    addActionItem({
      feedback_id: feedbackId,
      title,
      assigned_department: department,
      status: 'Pending',
      target_date: targetDate,
    });
    setShowForm(false);
    setFeedbackId('');
    setTitle('');
    setTargetDate('');
  };

  const createFromFeedback = (fbId: string, comment: string) => {
    setFeedbackId(fbId);
    setTitle(comment.slice(0, 80) + (comment.length > 80 ? '...' : ''));
    setShowForm(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Action Plan Generator</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Convert critical feedback into trackable departmental action items
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" /> New Action Item
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8 border-indigo-200 dark:border-indigo-800">
          <CardHeader>
            <CardTitle className="text-lg">Create Action Item</CardTitle>
            <CardDescription>Link to feedback and assign a department with deadline</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>Related Feedback</Label>
                <Select value={feedbackId} onChange={(e) => setFeedbackId(e.target.value)} required>
                  <option value="">Select feedback item...</option>
                  {feedbacks.filter(f => f.status !== 'Resolved').map((f) => (
                    <option key={f.id} value={f.id}>
                      [{f.role}] {f.category} — {f.comments.slice(0, 60)}...
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Action Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Describe the improvement action" required />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Assigned Department</Label>
                  <Select value={department} onChange={(e) => setDepartment(e.target.value)}>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Target Date</Label>
                  <Input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} required />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Create Action Item</Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Critical feedback suggestions */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-rose-500" /> Critical / Recurring
          </h2>
          {criticalFeedback.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-slate-400 text-sm">
                No critical open feedback
              </CardContent>
            </Card>
          ) : (
            criticalFeedback.slice(0, 8).map((fb) => (
              <Card key={fb.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-medium capitalize text-slate-500">{fb.role}</span>
                    <span className="text-xs text-rose-600 font-medium">{fb.rating}/5</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2 mb-3">{fb.comments}</p>
                  <Button size="sm" variant="outline" className="w-full" onClick={() => createFromFeedback(fb.id, fb.comments)}>
                    Create Action
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Action items list */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Active Action Items ({actionItems.length})
          </h2>
          {actionItems.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-slate-400">
                No action items yet. Create one from critical feedback.
              </CardContent>
            </Card>
          ) : (
            actionItems.map((item) => {
              const related = feedbacks.find((f) => f.id === item.feedback_id);
              return (
                <Card key={item.id}>
                  <CardContent className="pt-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500">
                          <span className="font-medium text-indigo-600 dark:text-indigo-400">
                            {item.assigned_department}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            Due {formatDate(item.target_date)}
                          </span>
                        </div>
                        {related && (
                          <p className="mt-2 text-xs text-slate-400 line-clamp-1">
                            From: [{related.role}] {related.comments}
                          </p>
                        )}
                      </div>
                      <Select
                        value={item.status}
                        onChange={(e) => updateActionStatus(item.id, e.target.value as ActionStatus)}
                        className="h-9 text-xs min-w-[120px]"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </Select>
                    </div>
                    <div className="mt-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
