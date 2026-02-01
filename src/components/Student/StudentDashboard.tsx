import { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BroadcastBanner from '../Layout/BroadcastBanner';
import type { ProjetPFE } from '../../types';
import { Download, Clock, BookOpen, FlaskConical, LayoutDashboard, Calendar, Check, AlertCircle, ArrowLeft, Mail, ChevronRight, Shield } from 'lucide-react';
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
        <div className="empty-dashboard glass animate-fade-in" style={{ padding: '4rem', textAlign: 'center', marginTop: '100px' }}>
            <LayoutDashboard size={64} className="empty-icon" style={{ color: 'var(--color-accent-blue)', opacity: 0.5, marginBottom: '2rem' }} />
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Dossier Académique Non Assigné</h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
                Votre matricule n'est actuellement rattaché à aucun projet de fin d'études.
                Veuillez régulariser votre situation auprès du Bureau des PFE.
            </p>
        </div>
    );

    const calculateSectionProgress = (milestones: any[]) => {
        return Math.round(milestones.reduce((acc, m) => acc + m.progres, 0) / milestones.length);
    };

    const expProgress = calculateSectionProgress(project.progres.experimental);
    const redProgress = calculateSectionProgress(project.progres.redaction);
    const totalProgress = Math.round((expProgress + redProgress) / 2);


    return (
        <div className="dashboard-page animate-fade-in">
            <BroadcastBanner />

            {showPDF && (
                <div className="pdf-viewer-overlay glass" onClick={() => setShowPDF(false)}>
                    <div className="pdf-viewer-modal glass" style={{ width: '90%', height: '90vh' }} onClick={e => e.stopPropagation()}>
                        <div className="pdf-header">
                            <h3>RÉFÉRENTIEL : FICHE DE PROPOSITION (PDF)</h3>
                            <button className="btn-close" onClick={() => setShowPDF(false)}>×</button>
                        </div>
                        <iframe src={project.urlFichePFE} title="Fiche PFE" width="100%" height="100%"></iframe>
                    </div>
                </div>
            )}

            <header className="dashboard-header">
                <div className="header-info">
                    <button className="btn-back" onClick={() => navigate(-1)} style={{ marginBottom: '1.5rem' }}>
                        <ArrowLeft size={18} /> Retour au Portail
                    </button>
                    <div className="welcome-tag">SITUATION ACADÉMIQUE - ÉLÈVE OFFICIER</div>
                    <h1>{project.titre}</h1>
                    <div className="encadrant-contact">
                        <span>SOUS LA DIRECTION DE : <strong>{project.nomEncadrant.toUpperCase()}</strong></span>
                        <a href={`mailto:${project.emailEncadrant}`} className="contact-pill link" style={{ marginLeft: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59,130,246,0.1)', padding: '4px 12px', borderRadius: '4px', textDecoration: 'none', color: 'var(--color-accent-blue)', fontSize: '0.8rem', fontWeight: 600 }}>
                            <Mail size={12} /> SIGNALER UN PROBLÈME
                        </a>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline" onClick={() => setShowPDF(true)}>
                        <Download size={18} /> Cahier des Charges
                    </button>
                    <button className="btn btn-primary" onClick={() => navigate('/student/booking')}>
                        <Calendar size={18} /> Planifier Consultation
                    </button>
                </div>
            </header>

            <div className="stats-grid">
                <div className="stat-card glass secondary">
                    <div className="stat-progress-circle">
                        <svg viewBox="0 0 36 36" className="circular-chart">
                            <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path className="circle" strokeDasharray={`${totalProgress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <div className="percentage">{totalProgress}%</div>
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Progression Master</span>
                        <span className="stat-value">{project.statut.replace('-', ' ').toUpperCase()}</span>
                    </div>
                </div>

                <div className="stat-card glass">
                    <div className="stat-icon-box blue">
                        <FlaskConical size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Volet Expérimental</span>
                        <div className="stat-progress-mini">
                            <div className="progress-bar-mini"><div className="fill" style={{ width: `${expProgress}%` }}></div></div>
                            <span className="stat-value">{expProgress}%</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card glass">
                    <div className="stat-icon-box red">
                        <BookOpen size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Volet Rédactionnel</span>
                        <div className="stat-progress-mini">
                            <div className="progress-bar-mini"><div className="fill red" style={{ width: `${redProgress}%` }}></div></div>
                            <span className="stat-value">{redProgress}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-content-grid">
                <section className="milestones-section glass">
                    <div className="section-title">
                        <FlaskConical size={20} />
                        <h2>OBJECTIFS OPÉRATIONNELS</h2>
                    </div>
                    <div className="milestone-list">
                        {project.progres.experimental.map((m) => (
                            <div key={m.id} className="milestone-item">
                                <div className="m-info">
                                    <span className="m-label">{m.label}</span>
                                    <span className="m-date">MAJ : {m.derniereMiseAJour || 'N/A'}</span>
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
                        <h2>REVUE ET RÉDACTION</h2>
                    </div>
                    <div className="milestone-list">
                        {project.progres.redaction.map((m) => (
                            <div key={m.id} className="milestone-item">
                                <div className="m-info">
                                    <span className="m-label">{m.label}</span>
                                    <span className="m-date">MAJ : {m.derniereMiseAJour || 'N/A'}</span>
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

            <div className="update-reminder glass animate-slide-up">
                <Clock size={20} className="reminder-icon" />
                <p>
                    <strong>CONSIGNE :</strong> La mise à jour de l'avancement est obligatoire avant chaque remise hebdomadaire.
                    Le non-respect des échéances peut impacter votre visa de soutenance.
                </p>
                <button className="btn btn-primary" onClick={() => navigate(`/project/${project.id}`)}>
                    Journal de Suivi <ChevronRight size={18} />
                </button>
            </div>

            {notifications.length > 0 && (
                <div className="notifications-alert-panel glass animate-slide-in-up" style={{ marginTop: '2rem' }}>
                    <div className="notes-header">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Shield size={16} /> ORDRES ET INSTRUCTIONS DE L'ENCADRANT
                        </h3>
                        <button className="btn-clear" onClick={() => {
                            storageService.clearNotifications();
                            setNotifications([]);
                        }}>DÉCLASSÉ / LU</button>
                    </div>
                    <div className="notes-list">
                        {notifications.map(note => (
                            <div key={note.id} className={`note-item glass ${note.type}`}>
                                <div className="note-icon">
                                    {note.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                                </div>
                                <div className="note-content">
                                    <p>{note.message}</p>
                                    <span className="note-date">{new Date(note.date).toLocaleDateString()} - {new Date(note.date).toLocaleTimeString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
