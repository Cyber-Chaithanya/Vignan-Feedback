import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getSentimentColor(sentiment: string) {
  switch (sentiment) {
    case 'Positive':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'Negative':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400';
    default:
      return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'Resolved':
    case 'Completed':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'In Progress':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
    case 'Open':
    case 'Pending':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400';
    default:
      return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
  }
}

export function analyzeSentiment(text: string, rating: number): 'Positive' | 'Neutral' | 'Negative' {
  const lower = text.toLowerCase();
  const positiveWords = ['great', 'excellent', 'good', 'amazing', 'love', 'helpful', 'improve', 'better', 'satisfied', 'happy'];
  const negativeWords = ['bad', 'poor', 'terrible', 'hate', 'awful', 'worst', 'disappointed', 'issue', 'problem', 'lack', 'insufficient'];
  
  let score = rating >= 4 ? 1 : rating <= 2 ? -1 : 0;
  positiveWords.forEach(w => { if (lower.includes(w)) score += 1; });
  negativeWords.forEach(w => { if (lower.includes(w)) score -= 1; });
  
  if (score > 0) return 'Positive';
  if (score < 0) return 'Negative';
  return 'Neutral';
}
