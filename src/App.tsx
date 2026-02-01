import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { storageService } from './services/storageService';
import Login from './components/Auth/Login';
import SupervisorDashboard from './components/Supervisor/SupervisorDashboard';
import StudentDashboard from './components/Student/StudentDashboard';
import ProjectDetails from './components/Project/ProjectDetails';
import Navbar from './components/Layout/Navbar';
import BookingCalendar from './components/Booking/BookingCalendar';
import BookingManagement from './components/Booking/BookingManagement';
import Profile from './components/Student/Profile';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user && !allowedRoles.includes(user.role)) return <Navigate to="/" />;

  return <>{children}</>;
};

// Initialisation de la base de données locale
storageService.init();

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="app-container">
      {isAuthenticated && <Navbar />}
      <main className="main-content">
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />

          <Route path="/" element={
            isAuthenticated ? (
              user?.role === 'supervisor' ? <Navigate to="/supervisor" /> : <Navigate to="/student" />
            ) : <Navigate to="/login" />
          } />

          <Route path="/supervisor" element={
            <ProtectedRoute allowedRoles={['supervisor']}>
              <SupervisorDashboard />
            </ProtectedRoute>
          } />

          <Route path="/supervisor/booking" element={
            <ProtectedRoute allowedRoles={['supervisor']}>
              <BookingManagement />
            </ProtectedRoute>
          } />

          <Route path="/student" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />

          <Route path="/student/booking" element={
            <ProtectedRoute allowedRoles={['student']}>
              <BookingCalendar />
            </ProtectedRoute>
          } />

          <Route path="/project/:id" element={
            <ProtectedRoute allowedRoles={['supervisor', 'student']}>
              <ProjectDetails />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['supervisor', 'student']}>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
