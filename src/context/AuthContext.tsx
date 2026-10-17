import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, UserRole } from '../types';
import { MOCK_USERS } from '../data/mockData';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<boolean>;
  signOut: () => void;
  demoLogin: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = 'uni_feedback_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(AUTH_KEY);
      }
    }
    setLoading(false);
  }, []);

  const persist = (u: AuthUser | null) => {
    if (u) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
    setUser(u);
  };

  const demoLogin = (role: UserRole) => {
    const mock = MOCK_USERS.find((u) => u.role === role);
    if (mock) {
      const authUser: AuthUser = {
        id: mock.user_id,
        email: mock.email,
        full_name: mock.full_name,
        role: mock.role,
      };
      persist(authUser);
      toast.success(`Welcome, ${mock.full_name}! (Demo Mode)`);
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    // Demo credentials
    const demoUser = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (demoUser && (password === 'demo123' || password === 'password')) {
      const authUser: AuthUser = {
        id: demoUser.user_id,
        email: demoUser.email,
        full_name: demoUser.full_name,
        role: demoUser.role,
      };
      persist(authUser);
      toast.success(`Welcome back, ${demoUser.full_name}!`);
      return true;
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) {
          // Fetch profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', data.user.id)
            .single();
          if (profile) {
            persist({
              id: profile.user_id,
              email: profile.email,
              full_name: profile.full_name,
              role: profile.role,
            });
            toast.success(`Welcome back, ${profile.full_name}!`);
            return true;
          }
        }
      } catch (err: any) {
        toast.error(err.message || 'Sign in failed');
        return false;
      }
    }

    toast.error('Invalid credentials. Use demo accounts or password "demo123"');
    return false;
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: UserRole
  ): Promise<boolean> => {
    if (role === 'admin') {
      toast.error('Admin accounts cannot be self-registered');
      return false;
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user) {
          await supabase.from('profiles').insert({
            user_id: data.user.id,
            email,
            full_name: fullName,
            role,
          });
          persist({
            id: data.user.id,
            email,
            full_name: fullName,
            role,
          });
          toast.success('Account created successfully!');
          return true;
        }
      } catch (err: any) {
        toast.error(err.message || 'Sign up failed');
        return false;
      }
    }

    // Demo mode: create local user
    const newUser: AuthUser = {
      id: `user-${role}-${Date.now()}`,
      email,
      full_name: fullName,
      role,
    };
    persist(newUser);
    toast.success('Account created (Demo Mode)!');
    return true;
  };

  const signOut = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut();
    }
    persist(null);
    toast.success('Signed out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, demoLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
