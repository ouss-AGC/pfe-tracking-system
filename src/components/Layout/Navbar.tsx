import { useState } from 'react';
import { LogOut, Calendar, LayoutDashboard, HelpCircle, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import UserGuide from '../Guide/UserGuide';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [showGuide, setShowGuide] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <nav className="navbar glass">
            <div className="navbar-logo">
                <img src="/pfe-tracker-logo.png" alt="Logo" className="logo-img-small" />
                <div className="logo-text">
                    <span className="logo-title">PFE TRACKER</span>
                    <span className="logo-subtitle">MILITARY ACADEMY</span>
                </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className={`navbar-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                {user?.role === 'supervisor' && (
                    <>
                        <Link to="/supervisor" className={`nav-link ${location.pathname === '/supervisor' ? 'active' : ''}`} onClick={closeMobileMenu}>
                            <LayoutDashboard size={18} />
                            <span>Dashboard</span>
                        </Link>
                        <Link to="/supervisor/booking" className={`nav-link ${location.pathname === '/supervisor/booking' ? 'active' : ''}`} onClick={closeMobileMenu}>
                            <Calendar size={18} />
                            <span>Appointments</span>
                        </Link>
                    </>
                )}
                {user?.role === 'student' && (
                    <>
                        <Link to="/student" className={`nav-link ${location.pathname === '/student' ? 'active' : ''}`} onClick={closeMobileMenu}>
                            <LayoutDashboard size={18} />
                            <span>Mon Projet</span>
                        </Link>
                        <Link to="/student/booking" className={`nav-link ${location.pathname === '/student/booking' ? 'active' : ''}`} onClick={closeMobileMenu}>
                            <Calendar size={18} />
                            <span>Prendre RDV</span>
                        </Link>
                    </>
                )}
            </div>

            <div className="navbar-actions">
                {user && (
                    <div className="user-profile">
                        <button
                            className="nav-action-btn"
                            onClick={() => setShowGuide(true)}
                            title="Guide d'utilisation"
                        >
                            <HelpCircle size={20} />
                        </button>
                        <Link to="/profile" className="user-profile-link" title="Mon Profil">
                            <div className="user-info">
                                <span className="user-name">{user.nom}</span>
                                <span className="user-role">{user.role === 'student' ? 'OFFICIER ÉLÈVE' : 'ENCADRANT'}</span>
                            </div>
                            <img src={user.avatar} alt={user.nom} className="user-avatar" />
                        </Link>
                        <button className="btn-logout" onClick={logout} title="Déconnexion">
                            <LogOut size={20} />
                        </button>
                    </div>
                )}
            </div>
            {showGuide && <UserGuide role={user?.role} onClose={() => setShowGuide(false)} />}
        </nav>
    );
};

export default Navbar;
