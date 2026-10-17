import { useMemo } from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { MessageSquare, Star, CheckCircle2, TrendingUp, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export default function AdminDashboard() {
  const { feedbacks, actionItems } = useFeedback();

  const metrics = useMemo(() => {
    const total = feedbacks.length;
    const avg = total ? feedbacks.reduce((s, f) => s + f.rating, 0) / total : 0;
    const resolved = feedbacks.filter((f) => f.status === 'Resolved').length;
    const resolutionRate = total ? Math.round((resolved / total) * 100) : 0;
    const open = feedbacks.filter((f) => f.status === 'Open').length;
    return { total, avg: avg.toFixed(1), resolutionRate, open, resolved };
  }, [feedbacks]);

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    feedbacks.forEach((f) => {
      const short = f.category.split(' & ')[0];
      map[short] = (map[short] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [feedbacks]);

  const sentimentData = useMemo(() => {
    const map = { Positive: 0, Neutral: 0, Negative: 0 };
    feedbacks.forEach((f) => { map[f.ai_sentiment]++; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [feedbacks]);

  const roleData = useMemo(() => {
    const map: Record<string, number> = {};
    feedbacks.forEach((f) => { map[f.role] = (map[f.role] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
  }, [feedbacks]);

  const generateReport = () => {
    const byCat: Record<string, typeof feedbacks> = {};
    feedbacks.filter(f => f.status !== 'Resolved').forEach(f => {
      if (!byCat[f.category]) byCat[f.category] = [];
      byCat[f.category].push(f);
    });
    let report = `UNIVERSITY INSTITUTIONAL IMPROVEMENT REPORT\n`;
    report += `Generated: ${new Date().toLocaleString()}\n`;
    report += `========================================\n\n`;
    report += `EXECUTIVE SUMMARY\n`;
    report += `Total Feedback: ${metrics.total}\n`;
    report += `Average Satisfaction: ${metrics.avg}/5\n`;
    report += `Resolution Rate: ${metrics.resolutionRate}%\n`;
    report += `Open Items: ${metrics.open}\n\n`;

    const groups = [
      { key: 'Curriculum & Academics', label: 'Curriculum' },
      { key: 'Campus Life & Infrastructure', label: 'Infrastructure' },
      { key: 'Placement & Career', label: 'Faculty Efficiency & Career' },
      { key: 'Research & Resources', label: 'Research & Resources' },
      { key: 'Safety & Discipline', label: 'Transparency & Safety' },
    ];

    groups.forEach(g => {
      report += `\n--- ${g.label.toUpperCase()} ---\n`;
      const items = byCat[g.key] || [];
      if (items.length === 0) {
        report += 'No active items.\n';
      } else {
        items.forEach((f, i) => {
          report += `${i + 1}. [${f.role}] (${f.rating}/5, ${f.ai_sentiment}) ${f.comments.slice(0, 120)}...\n`;
        });
      }
    });

    report += `\n\nACTION ITEMS SUMMARY\n`;
    actionItems.forEach(a => {
      report += `- [${a.status}] ${a.title} → ${a.assigned_department} (Due: ${a.target_date})\n`;
    });

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uni-improvement-report-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Command Center</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Institutional overview & improvement analytics</p>
        </div>
        <Button onClick={generateReport} variant="outline" className="gap-2">
          <FileText className="h-4 w-4" /> Export Executive Report
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Feedback</p>
                <p className="text-3xl font-bold">{metrics.total}</p>
              </div>
              <MessageSquare className="h-10 w-10 text-indigo-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Avg Satisfaction</p>
                <p className="text-3xl font-bold">{metrics.avg}<span className="text-lg text-slate-400">/5</span></p>
              </div>
              <Star className="h-10 w-10 text-amber-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Resolution Rate</p>
                <p className="text-3xl font-bold text-emerald-600">{metrics.resolutionRate}%</p>
              </div>
              <CheckCircle2 className="h-10 w-10 text-emerald-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Open Issues</p>
                <p className="text-3xl font-bold text-rose-600">{metrics.open}</p>
              </div>
              <TrendingUp className="h-10 w-10 text-rose-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Feedback by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sentiment Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {sentimentData.map((_, i) => (
                      <Cell key={i} fill={['#10b981', '#94a3b8', '#f43f5e'][i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Feedback by Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roleData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis dataKey="name" type="category" width={70} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
            <CardDescription>Jump to management tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/admin/inbox">
              <Button variant="outline" className="w-full justify-start gap-2">
                <MessageSquare className="h-4 w-4" /> Master Feedback Inbox
              </Button>
            </Link>
            <Link to="/admin/actions">
              <Button variant="outline" className="w-full justify-start gap-2">
                <CheckCircle2 className="h-4 w-4" /> Action Plan Generator
              </Button>
            </Link>
            <Button variant="secondary" className="w-full justify-start gap-2" onClick={generateReport}>
              <FileText className="h-4 w-4" /> Download Full Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
