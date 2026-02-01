import { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BroadcastBanner from '../Layout/BroadcastBanner';
import type { ProjetPFE } from '../../types';
import { Download, Clock, BookOpen, FlaskConical, LayoutDashboard, Calendar, Check, AlertCircle, ArrowLeft, Mail } from 'lucide-react';
import './StudentDashboard.css';

const StudentDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [project, setProject] = useState<ProjetPFE | null>(null);
    const [showPDF, setShowPDF] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        if (user) {
            setNotifications(storageService.getNotifications().filter(n => n.idEtudiant === user.id));
            const userProject = storageService.getProjectByStudent(user.id);
            if (userProject) {
                setProject(userProject);
            }
        }
    }, [user]);

    if (!project) return (
        <div className="empty-dashboard glass animate-fade-in">
            <LayoutDashboard size={48} className="empty-icon" />
            <h2>Aucun Projet Assigné</h2>
            <p>Veuillez contacter votre encadrant pour assigner un projet à votre compte.</p>
        </div>
    );

    const calculateSectionProgress = (milestones: any[]) => {
        return Math.round(milestones.reduce((acc, m) => acc + m.progres, 0) / milestones.length);
    };

    const expProgress = calculateSectionProgress(project.progres.experimental);
    const redProgress = calculateSectionProgress(project.progres.redaction);
    const totalProgress = Math.round((expProgress + redProgress) / 2);

    // Nom dynamique si l'étudiant a changé son profil
    const nomAffiche = user?.id === project.idEtudiant ? user.nom : project.nomEtudiant;

    return (
        <div className="dashboard-page animate-fade-in">
            <BroadcastBanner />
            {showPDF && (
                <div className="pdf-viewer-overlay glass" onClick={() => setShowPDF(false)}>
                    <div className="pdf-viewer-modal glass" onClick={e => e.stopPropagation()}>
                        <div className="pdf-header">
                            <h3>RÉFÉRENTIEL : FICHE DE PROPOSITION PFE</h3>
                            <button className="btn-close" onClick={() => setShowPDF(false)}>×</button>
                        </div>
                        <iframe
                            src={project.urlFichePFE}
                            title="Fiche PFE"
                            width="100%"
                            height="100%"
                        ></iframe>
                    </div>
                </div>
            )}
            <header className="dashboard-header">
                <div className="header-info">
                    <button className="btn-back" onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
                        <ArrowLeft size={18} /> Retour
                    </button>
                    <span className="welcome-tag">PORTAIL ÉTUDIANT - {nomAffiche.toUpperCase()}</span>
                    <h1>{project.titre}</h1>
                    <div className="encadrant-contact" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                        <p style={{ margin: 0 }}>ENCADRÉ PAR {project.nomEncadrant.toUpperCase()}</p>
                        <a href="mailto:08530118@mil.tn" className="contact-pill link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '4px', textDecoration: 'none', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                            <Mail size={12} /> Contact Encadrant
                        </a>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline btn-pulse" onClick={() => setShowPDF(true)} title="Télécharger la Fiche de Proposition">
                        <Download size={20} />
                        <span>Fiche PFE (Réf)</span>
                    </button>
                    <button className="btn btn-primary" onClick={() => navigate('/student/booking')}>
                        <Calendar size={20} />
                        <span>Prendre RDV</span>
                    </button>
                </div>
            </header>

            <div className="stats-grid">
                <div className="stat-card glass secondary">
                    <div className="stat-progress-circle">
                        <svg viewBox="0 0 36 36" className="circular-chart blue">
                            <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path className="circle" strokeDasharray={`${totalProgress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <div className="percentage">{totalProgress}%</div>
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Progression Globale</span>
                        <span className="stat-value">{project.statut.replace('-', ' ').toUpperCase()}</span>
                    </div>
                </div>

                <div className="stat-card glass">
                    <div className="stat-icon-box blue">
                        <FlaskConical size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Phase Expérimentale</span>
                        <div className="stat-progress-mini">
                            <div className="progress-bar-mini"><div className="fill" style={{ width: `${expProgress}%` }}></div></div>
                            <span>{expProgress}%</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card glass">
                    <div className="stat-icon-box red">
                        <BookOpen size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Phase de Rédaction</span>
                        <div className="stat-progress-mini">
                            <div className="progress-bar-mini"><div className="fill red" style={{ width: `${redProgress}%` }}></div></div>
                            <span>{redProgress}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-content-grid">
                <section className="milestones-section glass">
                    <div className="section-title">
                        <FlaskConical size={20} />
                        <h2>Avancement Expérimental</h2>
                    </div>
                    <div className="milestone-list">
                        {project.progres.experimental.map((m) => (
                            <div key={m.id} className="milestone-item">
                                <div className="m-info">
                                    <span className="m-label">{m.label}</span>
                                    <span className="m-date">Mis à jour: {m.derniereMiseAJour}</span>
                                </div>
                                <div className="m-progress">
                                    <div className="progress-bar"><div className="fill" style={{ width: `${m.progres}%` }}></div></div>
                                    <span className="m-percent">{m.progres}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="milestones-section glass">
                    <div className="section-title">
                        <BookOpen size={20} />
                        <h2>Jalons de Rédaction</h2>
                    </div>
                    <div className="milestone-list">
                        {project.progres.redaction.map((m) => (
                            <div key={m.id} className="milestone-item">
                                <div className="m-info">
                                    <span className="m-label">{m.label}</span>
                                    <span className="m-date">Mis à jour: {m.derniereMiseAJour}</span>
                                </div>
                                <div className="m-progress">
                                    <div className="progress-bar"><div className="fill red" style={{ width: `${m.progres}%` }}></div></div>
                                    <span className="m-percent">{m.progres}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Système de Notifications RDV */}
            {notifications.length > 0 && (
                <div className="notifications-alert-panel animate-slide-in-up">
                    <div className="notes-header">
                        <h3>DÉCISIONS DE L'ENCADRANT</h3>
                        <button className="btn-clear" onClick={() => {
                            storageService.clearNotifications();
                            setNotifications([]);
                        }}>MARQUER COMME LU</button>
                    </div>
                    <div className="notes-list">
                        {notifications.map(note => (
                            <div key={note.id} className={`note-item glass ${note.type}`}>
                                <div className="note-icon">
                                    {note.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                                </div>
                                <div className="note-content">
                                    <p>{note.message}</p>
                                    <span className="note-date">{new Date(note.date).toLocaleTimeString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="update-reminder glass">
                <Clock size={20} className="reminder-icon" />
                <p>N'oubliez pas de mettre à jour votre avancement régulièrement. Votre encadrant consulte ces métriques chaque semaine.</p>
                <button className="btn btn-primary" onClick={() => navigate(`/project/${project.id}`)}>
                    Accéder à la Fiche de Suivi Interactive
                </button>
            </div>
        </div>
    );
};

export default StudentDashboard;
