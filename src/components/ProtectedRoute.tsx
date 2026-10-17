import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface Props {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role === 'admin' ? 'admin' : user.role}`} replace />;
  }

  return <>{children}</>;
}
