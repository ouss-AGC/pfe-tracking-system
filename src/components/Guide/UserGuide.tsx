import React, { useState } from 'react';
import {
    BookOpen,
    User,
    Shield,
    Calendar,
    FileText,
    CheckCircle,
    ArrowRight,
    X,
    Download,
    ExternalLink,
    Clock,
    Award
} from 'lucide-react';
import './UserGuide.css';

interface UserGuideProps {
    role: 'student' | 'supervisor' | undefined;
    onClose: () => void;
}

const UserGuide: React.FC<UserGuideProps> = ({ role, onClose }) => {
    const [activeTab, setActiveTab] = useState<'welcome' | 'process' | 'features' | 'science'>('welcome');

    return (
        <div className="user-guide-overlay animate-fade-in">
            <div className="user-guide-container glass">
                <button className="close-guide-btn" onClick={onClose}>
                    <X size={24} />
                </button>

                <aside className="guide-sidebar">
                    <div className="sidebar-header">
                        <img src="/pfe-tracker-logo.png" alt="Logo" className="sidebar-logo" />
                        <h3>GUIDE PFE</h3>
                    </div>
                    <nav className="guide-nav">
                        <button
                            className={`nav-item ${activeTab === 'welcome' ? 'active' : ''}`}
                            onClick={() => setActiveTab('welcome')}
                        >
                            <BookOpen size={18} />
                            <span>Bienvenue</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'process' ? 'active' : ''}`}
                            onClick={() => setActiveTab('process')}
                        >
                            <Calendar size={18} />
                            <span>Processus 2026</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'features' ? 'active' : ''}`}
                            onClick={() => setActiveTab('features')}
                        >
                            <Shield size={18} />
                            <span>Fonctionnalités</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'science' ? 'active' : ''}`}
                            onClick={() => setActiveTab('science')}
                        >
                            <Award size={18} />
                            <span>Excellence Scientifique</span>
                        </button>
                    </nav>
                    <div className="sidebar-footer">
                        <p>© 2026 Académie Militaire</p>
                    </div>
                </aside>

                <main className="guide-content">
                    {activeTab === 'welcome' && (
                        <div className="guide-pane animate-slide-up">
                            <div className="hero-section">
                                <span className="badge">OFFICIEL</span>
                                <h1>Bienvenue sur PFE Tracker</h1>
                                <p className="subtitle">
                                    La plateforme numérique de suivi des Projets de Fin d'Études du département Génie Civil.
                                </p>
                            </div>

                            <div className="role-message">
                                <div className="role-icon">
                                    {role === 'supervisor' ? <Shield size={32} /> : <User size={32} />}
                                </div>
                                <div className="role-text">
                                    <h3>Espace {role === 'supervisor' ? 'Encadrant' : 'Officier Élève'}</h3>
                                    <p>
                                        Cette interface a été optimisée pour vos besoins spécifiques de
                                        {role === 'supervisor' ? ' gestion et de validation académique.' : ' suivi et de dépôt de travaux.'}
                                    </p>
                                </div>
                            </div>

                            <div className="quick-start">
                                <h4>Objectifs de la plateforme :</h4>
                                <ul className="objectives-list">
                                    <li><CheckCircle size={16} /> Centralisation des documents officiels (Charte, Fiche de Suivi).</li>
                                    <li><CheckCircle size={16} /> Digitalisation du journal de suivi hebdomadaire.</li>
                                    <li><CheckCircle size={16} /> Automatisation des notifications de rendez-vous.</li>
                                    <li><CheckCircle size={16} /> Archivage sécurisé des rapports et livrables.</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === 'process' && (
                        <div className="guide-pane animate-slide-up">
                            <h2>Le Calendrier PFE 2026</h2>
                            <div className="roadmap">
                                <div className="roadmap-step completed">
                                    <div className="step-number">01</div>
                                    <div className="step-info">
                                        <h4>Lancement & Proposition</h4>
                                        <p>Validation du cahier des charges et émission de la fiche de proposition.</p>
                                        <span className="step-date">Février 2026</span>
                                    </div>
                                </div>
                                <div className="roadmap-step current">
                                    <div className="step-number">02</div>
                                    <div className="step-info">
                                        <h4>Réalisation & Suivi</h4>
                                        <p>6 rendez-vous obligatoires avec validation par cachet numérique.</p>
                                        <span className="step-date">Mars - Mai 2026</span>
                                    </div>
                                    <div className="current-marker">EN COURS</div>
                                </div>
                                <div className="roadmap-step">
                                    <div className="step-number">03</div>
                                    <div className="step-info">
                                        <h4>Remise des Rapports</h4>
                                        <p>Dépôt de la version finale via le lien Google Drive dédié.</p>
                                        <span className="step-date">01 Juin 2026</span>
                                    </div>
                                </div>
                                <div className="roadmap-step final">
                                    <div className="step-number">04</div>
                                    <div className="step-info">
                                        <h4>Soutenances</h4>
                                        <p>Session principale devant jury au Département Génie Civil.</p>
                                        <span className="step-date">08 Juin 2026</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'features' && (
                        <div className="guide-pane animate-slide-up">
                            <h2>Fonctionnalités Clés</h2>
                            <div className="features-grid">
                                <div className="feature-card">
                                    <FileText className="feat-icon" />
                                    <h4>Documents Interactifs</h4>
                                    <p>Signez et téléchargez vos fiches au format PDF officiel directement depuis l'app.</p>
                                </div>
                                <div className="feature-card">
                                    <Clock className="feat-icon" />
                                    <h4>Journal de Suivi</h4>
                                    <p>Enregistrez vos travaux hebdomadaires et recevez l'avis de votre encadrant.</p>
                                </div>
                                <div className="feature-card">
                                    <ExternalLink className="feat-icon" />
                                    <h4>Lien Drive Projet</h4>
                                    <p>Un accès direct à votre dossier Cloud pour le stockage de vos données et rapports.</p>
                                </div>
                                <div className="feature-card">
                                    <Download className="feat-icon" />
                                    <h4>Archive Officielle</h4>
                                    <p>Toutes vos signatures et cachets sont horodatés et archivés légalement.</p>
                                </div>
                            </div>

                            <div className="action-footer">
                                <button className="start-btn" onClick={onClose}>
                                    <span>Accéder à mon espace</span>
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'science' && (
                        <div className="guide-pane animate-slide-up">
                            <div className="science-guide-header">
                                <Award size={48} className="gold-icon" />
                                <h2>Standard de Publication Scientifique</h2>
                                <p>Pour l'obtention du visa de soutenance, un article de haut niveau est requis.</p>
                            </div>

                            <div className="science-content-grid">
                                <div className="sci-guide-card">
                                    <h3>Objectif Doctoral</h3>
                                    <p>
                                        L'encadrant soumettra les meilleurs travaux aux revues internationales indexées.
                                        Votre contribution doit être originale et rigoureuse.
                                    </p>
                                </div>
                                <div className="sci-guide-card">
                                    <h3>Critéres de Forme</h3>
                                    <ul>
                                        <li><strong>Langue :</strong> Anglais académique uniquement.</li>
                                        <li><strong>Volume :</strong> Minimum 12 pages (format IEEE/Springer).</li>
                                        <li><strong>Style :</strong> Basé sur les "Highly Cited Papers" du domaine.</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="sci-structure-block">
                                <h3>Structure Type de l'Article</h3>
                                <div className="structure-steps">
                                    <span>Abstract</span>
                                    <span>State of the Art</span>
                                    <span>Experimental</span>
                                    <span>Analytical</span>
                                    <span>Results & Discussion</span>
                                    <span>Conclusion</span>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default UserGuide;
