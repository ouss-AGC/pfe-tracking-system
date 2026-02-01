import React, { useState } from 'react';
import { useAuth, MOCK_STUDENTS } from '../../context/AuthContext';
import { LogIn, Shield, Users, ChevronDown } from 'lucide-react';
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
                                <div className="role-icon-box">
                                    <Shield size={20} />
                                </div>
                                <span>ESPACE OFFICIER ÉLÈVE</span>
                            </button>
                            <button
                                type="button"
                                className={`role-btn ${role === 'supervisor' ? 'active' : ''}`}
                                onClick={() => setRole('supervisor')}
                            >
                                <Users size={20} />
                                <span>ESPACE ENCADRANT</span>
                            </button>
                        </div>

                        <div className="input-group">
                            <label htmlFor="email">{role === 'supervisor' ? 'Identifiant Personnel' : 'Sélectionnez votre Email'}</label>
                            <div className="input-wrapper">
                                {role === 'supervisor' ? (
                                    <input
                                        id="email"
                                        type="text"
                                        placeholder="Identifiant"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                ) : (
                                    <div className="select-wrapper">
                                        <select
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="select-email-login"
                                        >
                                            <option value="" disabled>--- Choisir mon Email ---</option>
                                            {MOCK_STUDENTS.map(s => (
                                                <option key={s.id} value={s.email}>{s.nom} ({s.email})</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="select-icon" size={16} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Code PIN {role === 'student' ? '(6 chiffres)' : '(4 chiffres)'}</label>
                            <div className="input-wrapper">
                                <input
                                    id="password"
                                    type="password"
                                    maxLength={role === 'supervisor' ? 4 : 6}
                                    placeholder="••••••"
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
