import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { FeedbackProvider } from './context/FeedbackContext';
import { Navbar } from './components/layout/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import StudentDashboard from './pages/student/Dashboard';
import StudentSubmit from './pages/student/Submit';
import StudentMyFeedback from './pages/student/MyFeedback';
import FacultyDashboard from './pages/faculty/Dashboard';
import FacultySubmit from './pages/faculty/Submit';
import FacultyMyFeedback from './pages/faculty/MyFeedback';
import ParentDashboard from './pages/parent/Dashboard';
import ParentSubmit from './pages/parent/Submit';
import ParentMyFeedback from './pages/parent/MyFeedback';
import AdminDashboard from './pages/admin/Dashboard';
import AdminInbox from './pages/admin/Inbox';
import AdminActions from './pages/admin/Actions';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FeedbackProvider>
          <Toaster position="top-right" richColors closeButton />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />

            {/* Student */}
            <Route path="/student" element={
              <ProtectedRoute allowedRoles={['student']}>
                <AppLayout><StudentDashboard /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/submit" element={
              <ProtectedRoute allowedRoles={['student']}>
                <AppLayout><StudentSubmit /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/my-feedback" element={
              <ProtectedRoute allowedRoles={['student']}>
                <AppLayout><StudentMyFeedback /></AppLayout>
              </ProtectedRoute>
            } />

            {/* Faculty */}
            <Route path="/faculty" element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <AppLayout><FacultyDashboard /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/faculty/submit" element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <AppLayout><FacultySubmit /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/faculty/my-feedback" element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <AppLayout><FacultyMyFeedback /></AppLayout>
              </ProtectedRoute>
            } />

            {/* Parent */}
            <Route path="/parent" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <AppLayout><ParentDashboard /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/parent/submit" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <AppLayout><ParentSubmit /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/parent/my-feedback" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <AppLayout><ParentMyFeedback /></AppLayout>
              </ProtectedRoute>
            } />

            {/* Admin */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AppLayout><AdminDashboard /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/inbox" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AppLayout><AdminInbox /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/actions" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AppLayout><AdminActions /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </FeedbackProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
