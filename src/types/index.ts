export type UserRole = 'student' | 'faculty' | 'parent' | 'admin';

export type FeedbackCategory =
  | 'Curriculum & Academics'
  | 'Campus Life & Infrastructure'
  | 'Placement & Career'
  | 'Research & Resources'
  | 'Safety & Discipline';

export type FeedbackStatus = 'Open' | 'In Progress' | 'Resolved';
export type Sentiment = 'Positive' | 'Neutral' | 'Negative';
export type ActionStatus = 'Pending' | 'In Progress' | 'Completed';

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface Feedback {
  id: string;
  user_id: string;
  role: UserRole;
  category: FeedbackCategory;
  rating: number;
  comments: string;
  status: FeedbackStatus;
  ai_sentiment: Sentiment;
  created_at: string;
  user_name?: string;
}

export interface ActionItem {
  id: string;
  feedback_id: string;
  title: string;
  assigned_department: string;
  status: ActionStatus;
  target_date: string;
  created_at: string;
  feedback?: Feedback;
}

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
}
