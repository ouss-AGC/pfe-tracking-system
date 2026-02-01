import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MOCK_PROJETS } from '../../data/mockProjects';
import type { ProjetPFE } from '../../types';
import { Download, Clock, BookOpen, FlaskConical, LayoutDashboard, Calendar } from 'lucide-react';
import './StudentDashboard.css';

const StudentDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [project, setProject] = useState<ProjetPFE | null>(null);
    const [showPDF, setShowPDF] = useState(false);

    useEffect(() => {
        if (user) {
            const userProject = MOCK_PROJETS.find(p => p.idEtudiant === user.id);
            if (userProject) setProject(userProject);
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
                    <span className="welcome-tag">PORTAIL ÉTUDIANT - {nomAffiche.toUpperCase()}</span>
                    <h1>{project.titre}</h1>
                    <p>ENCADRÉ PAR {project.nomEncadrant.toUpperCase()}</p>
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
