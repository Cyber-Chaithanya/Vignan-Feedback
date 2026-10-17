import { useState, useMemo } from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Input';
import { StarRating } from '../../components/ui/StarRating';
import { getStatusColor, getSentimentColor, formatDate } from '../../lib/utils';
import { FeedbackStatus, UserRole, Sentiment, FeedbackCategory } from '../../types';
import { CATEGORIES } from '../../data/mockData';
import { Trash2, CheckSquare, Filter } from 'lucide-react';

export default function AdminInbox() {
  const { feedbacks, updateFeedbackStatus, bulkUpdateStatus, deleteFeedback } = useFeedback();
  const [selected, setSelected] = useState<string[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return feedbacks.filter((f) => {
      if (roleFilter !== 'all' && f.role !== roleFilter) return false;
      if (categoryFilter !== 'all' && f.category !== categoryFilter) return false;
      if (statusFilter !== 'all' && f.status !== statusFilter) return false;
      if (sentimentFilter !== 'all' && f.ai_sentiment !== sentimentFilter) return false;
      return true;
    });
  }, [feedbacks, roleFilter, categoryFilter, statusFilter, sentimentFilter]);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selected.length === filtered.length) setSelected([]);
    else setSelected(filtered.map((f) => f.id));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Master Feedback Inbox</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Filter, update status, and manage all stakeholder feedback
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-3 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Filter className="h-4 w-4" /> Filters
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="parent">Parent</option>
            </Select>
            <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </Select>
            <Select value={sentimentFilter} onChange={(e) => setSentimentFilter(e.target.value)}>
              <option value="all">All Sentiments</option>
              <option value="Positive">Positive</option>
              <option value="Neutral">Neutral</option>
              <option value="Negative">Negative</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900">
          <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
            {selected.length} selected
          </span>
          <Button size="sm" variant="outline" onClick={() => bulkUpdateStatus(selected, 'In Progress')}>
            Mark In Progress
          </Button>
          <Button size="sm" variant="success" onClick={() => bulkUpdateStatus(selected, 'Resolved')}>
            Mark Resolved
          </Button>
          <Button size="sm" variant="destructive" onClick={() => {
            selected.forEach(deleteFeedback);
            setSelected([]);
          }}>
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelected([])}>Clear</Button>
        </div>
      )}

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{filtered.length} feedback items</CardTitle>
            <Button size="sm" variant="ghost" onClick={toggleAll}>
              <CheckSquare className="h-4 w-4 mr-1" />
              {selected.length === filtered.length ? 'Deselect all' : 'Select all'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-slate-500">
                  <th className="px-4 py-3 w-10"></th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Comments</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Sentiment</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((fb) => (
                  <tr key={fb.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(fb.id)}
                        onChange={() => toggleSelect(fb.id)}
                        className="rounded border-slate-300"
                      />
                    </td>
                    <td className="px-4 py-3 capitalize font-medium">{fb.role}</td>
                    <td className="px-4 py-3 max-w-[140px] truncate" title={fb.category}>{fb.category.split(' & ')[0]}</td>
                    <td className="px-4 py-3">
                      <StarRating value={fb.rating} readonly size="sm" />
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell max-w-xs">
                      <p className="truncate text-slate-600 dark:text-slate-300" title={fb.comments}>{fb.comments}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Select
                        value={fb.status}
                        onChange={(e) => updateFeedbackStatus(fb.id, e.target.value as FeedbackStatus)}
                        className="h-8 text-xs min-w-[110px]"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </Select>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getSentimentColor(fb.ai_sentiment)}`}>
                        {fb.ai_sentiment}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{formatDate(fb.created_at)}</td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="ghost" onClick={() => deleteFeedback(fb.id)}>
                        <Trash2 className="h-4 w-4 text-rose-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-slate-400">No feedback matches current filters</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
