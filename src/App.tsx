import Exam from "./pages/exam";
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import DashboardLayout from './components/DashboardLayout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Guide from './pages/Guide';
import Support from './pages/Support';
import Privacy from './pages/Privacy';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DashboardExams from './pages/DashboardExams';
import DashboardScores from './pages/DashboardScores';
import DashboardProfile from './pages/DashboardProfile';
import ExamEnvironment from './pages/exam/ExamEnvironment';
import FaceDetectionExam from './pages/exam/FaceDetectionExam';

// Teacher-specific pages
import TeacherStudents from './pages/teacher/TeacherStudents';
import TeacherReports from './pages/teacher/TeacherReports';
import TeacherExamCreate from './pages/teacher/TeacherExamCreate';
import TeacherExamEdit from './pages/teacher/TeacherExamEdit';
import TeacherGrading from './pages/teacher/TeacherGrading';
import TeacherResources from './pages/teacher/TeacherResources';
import TeacherMessages from './pages/teacher/TeacherMessages';
import TeacherQuestionBank from './pages/teacher/TeacherQuestionBank';

// Admin-specific pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTeachers from './pages/admin/AdminTeachers';
import AdminStudents from './pages/admin/AdminStudents';
import AdminQuestions from './pages/admin/AdminQuestions';
import AdminSettings from './pages/admin/AdminSettings';
import AdminViolations from './pages/admin/AdminViolations';
import AdminLayout from './components/AdminLayout';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const TeacherRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (user?.role !== 'teacher') {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <Navigate to="/dashboard" /> : <>{children}</>;
};

function AppContent() {
  return (
    <Router>
      <Routes>
        {/* Public routes with layout */}
        <Route path="/" element={
          <Layout>
            <Home />
          </Layout>
        } />
        <Route path="/about" element={
          <Layout>
            <About />
          </Layout>
        } />
        <Route path="/contact" element={
          <Layout>
            <Contact />
          </Layout>
        } />
        <Route path="/guide" element={
          <Layout>
            <Guide />
          </Layout>
        } />
        <Route path="/support" element={
          <Layout>
            <Support />
          </Layout>
        } />
        <Route path="/privacy" element={
          <Layout>
            <Privacy />
          </Layout>
        } />
        
        {/* Auth routes without layout */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        
        {/* Protected dashboard routes with dashboard layout */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/exams" element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardExams />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/scores" element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardScores />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/profile" element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardProfile />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Exam Environment Route */}
        <Route path="/exam/:examId" element={
          <ProtectedRoute>
            <ExamEnvironment />
          </ProtectedRoute>
        } />

        {/* Face Detection Exam Route */}
        <Route path="/face-exam" element={
          <ProtectedRoute>
            <FaceDetectionExam />
          </ProtectedRoute>
        } />

        {/* Teacher-only routes */}
        <Route path="/dashboard/students" element={
          <TeacherRoute>
            <DashboardLayout>
              <TeacherStudents />
            </DashboardLayout>
          </TeacherRoute>
        } />
        <Route path="/dashboard/reports" element={
          <TeacherRoute>
            <DashboardLayout>
              <TeacherReports />
            </DashboardLayout>
          </TeacherRoute>
        } />
        <Route path="/dashboard/exam/create" element={
          <TeacherRoute>
            <DashboardLayout>
              <TeacherExamCreate />
            </DashboardLayout>
          </TeacherRoute>
        } />
        <Route path="/dashboard/exam/edit/:id" element={
          <TeacherRoute>
            <DashboardLayout>
              <TeacherExamEdit />
            </DashboardLayout>
          </TeacherRoute>
        } />
        <Route path="/dashboard/grading" element={
          <TeacherRoute>
            <DashboardLayout>
              <TeacherGrading />
            </DashboardLayout>
          </TeacherRoute>
        } />
        <Route path="/dashboard/resources" element={
          <TeacherRoute>
            <DashboardLayout>
              <TeacherResources />
            </DashboardLayout>
          </TeacherRoute>
        } />
        <Route path="/dashboard/messages" element={
          <TeacherRoute>
            <DashboardLayout>
              <TeacherMessages />
            </DashboardLayout>
          </TeacherRoute>
        } />
        <Route path="/dashboard/question-bank" element={
          <TeacherRoute>
            <DashboardLayout>
              <TeacherQuestionBank />
            </DashboardLayout>
          </TeacherRoute>
        } />

        {/* Admin-only routes */}
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </AdminRoute>
        } />
        <Route path="/admin/teachers" element={
          <AdminRoute>
            <AdminLayout>
              <AdminTeachers />
            </AdminLayout>
          </AdminRoute>
        } />
        <Route path="/admin/students" element={
          <AdminRoute>
            <AdminLayout>
              <AdminStudents />
            </AdminLayout>
          </AdminRoute>
        } />
        <Route path="/admin/questions" element={
          <AdminRoute>
            <AdminLayout>
              <AdminQuestions />
            </AdminLayout>
          </AdminRoute>
        } />
        <Route path="/admin/settings" element={
          <AdminRoute>
            <AdminLayout>
              <AdminSettings />
            </AdminLayout>
          </AdminRoute>
        } />
        <Route path="/admin/violations" element={
          <AdminRoute>
            <AdminLayout>
              <AdminViolations />
            </AdminLayout>
          </AdminRoute>
        } />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;