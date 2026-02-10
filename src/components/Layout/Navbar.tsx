import { LogOut, Calendar, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    return (
        <nav className="navbar glass">
            <div className="navbar-logo">
                <img src="/pfe-tracker-logo.png" alt="Logo" className="logo-img-small" />
                <div className="logo-text">
                    <span className="logo-title">PFE TRACKER</span>
                    <span className="logo-subtitle">MILITARY ACADEMY</span>
                </div>
            </div>

            <div className="navbar-nav">
                {user?.role === 'supervisor' && (
                    <>
                        <Link to="/supervisor" className={`nav-link ${location.pathname === '/supervisor' ? 'active' : ''}`}>
                            <LayoutDashboard size={18} />
                            <span>Dashboard</span>
                        </Link>
                        <Link to="/supervisor/booking" className={`nav-link ${location.pathname === '/supervisor/booking' ? 'active' : ''}`}>
                            <Calendar size={18} />
                            <span>Appointments</span>
                        </Link>
                    </>
                )}
                {user?.role === 'student' && (
                    <>
                        <Link to="/student" className={`nav-link ${location.pathname === '/student' ? 'active' : ''}`}>
                            <LayoutDashboard size={18} />
                            <span>Mon Projet</span>
                        </Link>
                        <Link to="/student/booking" className={`nav-link ${location.pathname === '/student/booking' ? 'active' : ''}`}>
                            <Calendar size={18} />
                            <span>Prendre RDV</span>
                        </Link>
                    </>
                )}
            </div>

            <div className="navbar-actions">
                {user && (
                    <div className="user-profile">
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
        </nav>
    );
};

export default Navbar;
