import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Loading from './components/Loading';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Assessment from './pages/Assessment';
import Recommendations from './pages/Recommendations';
import CareerDetails from './pages/CareerDetails';
import CollegeDirectory from './pages/CollegeDirectory';
import ScholarshipPortal from './pages/ScholarshipPortal';
import Exams from './pages/Exams';
import AIAssistant from './pages/AIAssistant';
import AdminDashboard from './pages/AdminDashboard';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, role, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Loading message="Validating credentials..." />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Directories - Publicly viewable */}
      <Route path="/careers" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
      <Route path="/careers/:id" element={<ProtectedRoute><CareerDetails /></ProtectedRoute>} />
      <Route path="/colleges" element={<ProtectedRoute><CollegeDirectory /></ProtectedRoute>} />
      <Route path="/scholarships" element={<ProtectedRoute><ScholarshipPortal /></ProtectedRoute>} />
      <Route path="/exams" element={<ProtectedRoute><Exams /></ProtectedRoute>} />

      {/* Protected Student Pages */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/assessment" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <Assessment />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/recommendations" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <Recommendations />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/assistant" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <AIAssistant />
          </ProtectedRoute>
        } 
      />
      
      {/* Protected Admin Pages */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/careers" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/colleges" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/exams" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/scholarships" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Common Pages */}
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
