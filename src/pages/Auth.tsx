import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input, Label, Select } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import { UserRole } from '../types';
import { ThemeToggle } from '../components/layout/ThemeToggle';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'signin';
  const [isSignUp, setIsSignUp] = useState(mode === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(`/${user.role === 'admin' ? 'admin' : user.role}`);
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let success = false;
    if (isSignUp) {
      success = await signUp(email, password, fullName, role);
    } else {
      success = await signIn(email, password);
    }
    setLoading(false);
    if (success) {
      // Navigation handled by useEffect
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-indigo-50/30 to-white dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-900">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-3 h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-2xl">{isSignUp ? 'Create Account' : 'Welcome Back'}</CardTitle>
              <CardDescription>
                {isSignUp ? 'Join the feedback community' : 'Sign in to your portal'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Alex Rivera"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">I am a...</Label>
                      <Select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        required
                      >
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                        <option value="parent">Parent</option>
                      </Select>
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@university.edu"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
                </Button>
              </form>
              <div className="mt-6 text-center text-sm">
                {isSignUp ? (
                  <p className="text-slate-500">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(false)}
                      className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      Sign in
                    </button>
                  </p>
                ) : (
                  <p className="text-slate-500">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(true)}
                      className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      Sign up
                    </button>
                  </p>
                )}
              </div>
              <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 dark:text-slate-400">
                <p className="font-medium mb-1">Demo accounts (password: demo123)</p>
                <p>student@uni.edu · faculty@uni.edu · parent@uni.edu · admin@uni.edu</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
