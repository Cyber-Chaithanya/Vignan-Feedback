import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Feedback, ActionItem, FeedbackStatus, FeedbackCategory, Sentiment, UserRole } from '../types';
import { INITIAL_FEEDBACK, INITIAL_ACTIONS } from '../data/mockData';
import { analyzeSentiment } from '../lib/utils';
import { toast } from 'sonner';

interface FeedbackContextType {
  feedbacks: Feedback[];
  actionItems: ActionItem[];
  addFeedback: (data: {
    user_id: string;
    role: UserRole;
    category: FeedbackCategory;
    rating: number;
    comments: string;
    user_name?: string;
  }) => void;
  updateFeedbackStatus: (id: string, status: FeedbackStatus) => void;
  bulkUpdateStatus: (ids: string[], status: FeedbackStatus) => void;
  deleteFeedback: (id: string) => void;
  addActionItem: (item: Omit<ActionItem, 'id' | 'created_at'>) => void;
  updateActionStatus: (id: string, status: ActionItem['status']) => void;
  getUserFeedback: (userId: string) => Feedback[];
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

const FB_KEY = 'uni_feedback_list';
const ACT_KEY = 'uni_action_items';

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);

  useEffect(() => {
    const storedFb = localStorage.getItem(FB_KEY);
    const storedAct = localStorage.getItem(ACT_KEY);
    if (storedFb) {
      try {
        setFeedbacks(JSON.parse(storedFb));
      } catch {
        setFeedbacks(INITIAL_FEEDBACK);
      }
    } else {
      setFeedbacks(INITIAL_FEEDBACK);
    }
    if (storedAct) {
      try {
        setActionItems(JSON.parse(storedAct));
      } catch {
        setActionItems(INITIAL_ACTIONS);
      }
    } else {
      setActionItems(INITIAL_ACTIONS);
    }
  }, []);

  useEffect(() => {
    if (feedbacks.length > 0) {
      localStorage.setItem(FB_KEY, JSON.stringify(feedbacks));
    }
  }, [feedbacks]);

  useEffect(() => {
    if (actionItems.length > 0) {
      localStorage.setItem(ACT_KEY, JSON.stringify(actionItems));
    }
  }, [actionItems]);

  const addFeedback = (data: {
    user_id: string;
    role: UserRole;
    category: FeedbackCategory;
    rating: number;
    comments: string;
    user_name?: string;
  }) => {
    const sentiment = analyzeSentiment(data.comments, data.rating);
    const newFb: Feedback = {
      id: `fb-${Date.now()}`,
      ...data,
      status: 'Open',
      ai_sentiment: sentiment,
      created_at: new Date().toISOString(),
    };
    setFeedbacks((prev) => [newFb, ...prev]);
    toast.success('Feedback submitted successfully!');
  };

  const updateFeedbackStatus = (id: string, status: FeedbackStatus) => {
    setFeedbacks((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status } : f))
    );
    toast.success(`Status updated to ${status}`);
  };

  const bulkUpdateStatus = (ids: string[], status: FeedbackStatus) => {
    setFeedbacks((prev) =>
      prev.map((f) => (ids.includes(f.id) ? { ...f, status } : f))
    );
    toast.success(`${ids.length} items updated to ${status}`);
  };

  const deleteFeedback = (id: string) => {
    setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    setActionItems((prev) => prev.filter((a) => a.feedback_id !== id));
    toast.success('Feedback deleted');
  };

  const addActionItem = (item: Omit<ActionItem, 'id' | 'created_at'>) => {
    const newItem: ActionItem = {
      ...item,
      id: `act-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setActionItems((prev) => [newItem, ...prev]);
    // Also mark related feedback as In Progress if Open
    setFeedbacks((prev) =>
      prev.map((f) =>
        f.id === item.feedback_id && f.status === 'Open'
          ? { ...f, status: 'In Progress' }
          : f
      )
    );
    toast.success('Action item created');
  };

  const updateActionStatus = (id: string, status: ActionItem['status']) => {
    setActionItems((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    toast.success(`Action status updated to ${status}`);
  };

  const getUserFeedback = (userId: string) =>
    feedbacks.filter((f) => f.user_id === userId);

  return (
    <FeedbackContext.Provider
      value={{
        feedbacks,
        actionItems,
        addFeedback,
        updateFeedbackStatus,
        bulkUpdateStatus,
        deleteFeedback,
        addActionItem,
        updateActionStatus,
        getUserFeedback,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error('useFeedback must be used within FeedbackProvider');
  return ctx;
}
