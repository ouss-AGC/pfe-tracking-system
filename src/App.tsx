```javascript
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { storageService } from './services/storageService'; // Kept as it's used globally
import Login from './components/Auth/Login';
import SupervisorDashboard from './components/Supervisor/SupervisorDashboard';
import StudentDashboard from './components/Student/StudentDashboard';
import ProjectDetails from './components/Project/ProjectDetails';
import Navbar from './components/Layout/Navbar';
import BookingCalendar from './components/Booking/BookingCalendar'; // Re-added as it's used in routes
import BookingManagement from './components/Booking/BookingManagement';
import Profile from './components/Student/Profile'; // Re-added as it's used in routes
import SplashScreen from './components/Layout/SplashScreen';
import UserGuide from './components/Guide/UserGuide'; // Kept as it's used in the original MainApp logic, though not in the provided AppContent snippet
import ScientificPaperAlert from './components/Student/ScientificPaperAlert'; // Kept as it's used in AppContent JSX
import BroadcastBanner from './components/Layout/BroadcastBanner';
import DeviceSelectionScreen from './components/Layout/DeviceSelectionScreen'; // Added
import SupervisorBooking from './components/Booking/SupervisorBooking'; // Added (assuming this replaces BookingManagement for supervisor)
import './App.css'; // Added

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole: 'supervisor' | 'student' }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (user?.role !== allowedRole) {
        return <Navigate to="/" />; // Redirect to home or unauthorized page
    }

    return <>{children}</>;
};

// Initialisation de la base de données locale
storageService.init();

const AppContent = () => {
    const { isAuthenticated, user } = useAuth(); // Added 'user' to destructuring
    const [showSplash, setShowSplash] = useState(true);
    const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile' | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 2500); // 2.5 seconds splash

        // Check for saved device preference
        const savedDevice = localStorage.getItem('pfe_device_mode');
        if (savedDevice) {
            setDeviceMode(savedDevice as 'desktop' | 'mobile');
        }

        // Check for guide
        const hasSeenGuide = localStorage.getItem('pfe_guide_seen');
        const guideTimer = setTimeout(() => {
            if (!hasSeenGuide) {
                setShowGuide(true);
            }
        }, 8500);

        return () => {
            clearTimeout(timer);
            clearTimeout(guideTimer);
        };
    }, []);

    useEffect(() => {
        if (deviceMode === 'desktop') {
            document.getElementById('root')?.classList.add('force-desktop');
            // Remove viewport meta tag to allow scaling on mobile devices acting as desktop
            const viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
                // @ts-ignore
                viewport.content = "width=1200"; // Force wide width
            }
        } else if (deviceMode === 'mobile') {
            document.getElementById('root')?.classList.remove('force-desktop');
             // Reset viewport for mobile
             const viewport = document.querySelector('meta[name="viewport"]');
             if (viewport) {
                 // @ts-ignore
                 viewport.content = "width=device-width, initial-scale=1.0";
             }
        }
    }, [deviceMode]);

    const handleDeviceSelect = (mode: 'desktop' | 'mobile') => {
        setDeviceMode(mode);
        localStorage.setItem('pfe_device_mode', mode);
    };

    const handleCloseGuide = () => {
        setShowGuide(false);
        localStorage.setItem('pfe_guide_seen', 'true');
    };

    if (showSplash) {
        return <SplashScreen />;
    }

    if (!deviceMode) {
        return <DeviceSelectionScreen onSelect={handleDeviceSelect} />;
    }

    return (
        <div className="app-container">
            {isAuthenticated && <Navbar />}
            {isAuthenticated && <BroadcastBanner />}
            {isAuthenticated && user?.role === 'student' && <ScientificPaperAlert />}
            {showGuide && <UserGuide role={user?.role} onClose={handleCloseGuide} />}
            
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
            <AppContent />
        </Router>
    </AuthProvider>
  );
}

export default App;
```
