import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Shield, Users, GraduationCap } from 'lucide-react';
import type { Role } from '../../types';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<Role>('student');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password, role);
        } catch (err: any) {
            setError(err.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-bg">
                <div className="grid-overlay"></div>
                <div className="glow-effect"></div>
            </div>

            <div className="login-container animate-fade-in">
                <div className="login-card glass">
                    <div className="login-header">
                        <div className="logo-wrapper">
                            <Shield className="logo-icon" size={48} />
                        </div>
                        <h1>PFE TRACKING SYSTEM</h1>
                        <p>MILITARY ACADEMY CIVIL ENGINEERING DEPARTMENT</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="role-selector">
                            <button
                                type="button"
                                className={`role-btn ${role === 'student' ? 'active' : ''}`}
                                onClick={() => setRole('student')}
                            >
                                <GraduationCap size={20} />
                                <span>Student</span>
                            </button>
                            <button
                                type="button"
                                className={`role-btn ${role === 'supervisor' ? 'active' : ''}`}
                                onClick={() => setRole('supervisor')}
                            >
                                <Users size={20} />
                                <span>Supervisor</span>
                            </button>
                        </div>

                        <div className="input-group">
                            <label htmlFor="email">{role === 'supervisor' ? 'Identifiant Personnel' : 'Email Address'}</label>
                            <div className="input-wrapper">
                                <input
                                    id="email"
                                    type="text"
                                    placeholder={role === 'supervisor' ? 'Identifiant' : 'Enter your email'}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">{role === 'supervisor' ? 'Code PIN' : 'Password'}</label>
                            <div className="input-wrapper">
                                <input
                                    id="password"
                                    type="password"
                                    maxLength={role === 'supervisor' ? 4 : undefined}
                                    placeholder="••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button type="submit" className="btn btn-primary login-submit" disabled={loading}>
                            {loading ? (
                                <div className="loader"></div>
                            ) : (
                                <>
                                    <LogIn size={20} />
                                    <span>Access Secure Portal</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>© 2026 DR OUSSAMA ATOUI. ALL RIGHTS RESERVED.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
