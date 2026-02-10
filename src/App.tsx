import React, { useState, useEffect } from 'react';
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
import SplashScreen from './components/Layout/SplashScreen';
import UserGuide from './components/Guide/UserGuide';

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

const MainApp = () => {
  const [showGuide, setShowGuide] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Check if user has seen guide before (per session or persistent)
    const hasSeenGuide = localStorage.getItem('pfe_guide_seen');

    // Show after splash screen (8s) + some delay
    const timer = setTimeout(() => {
      if (!hasSeenGuide) {
        setShowGuide(true);
      }
    }, 8500); // 8s splash + 0.5s buffer

    return () => clearTimeout(timer);
  }, []);

  const handleCloseGuide = () => {
    setShowGuide(false);
    localStorage.setItem('pfe_guide_seen', 'true');
  };

  return (
    <>
      <SplashScreen />
      {showGuide && <UserGuide role={user?.role} onClose={handleCloseGuide} />}
      <Router>
        <AppRoutes />
      </Router>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
