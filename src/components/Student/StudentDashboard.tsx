import { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BroadcastBanner from '../Layout/BroadcastBanner';
import DocumentSubmission from './DocumentSubmission';
import FicheSuiviPFE from '../Project/FicheSuiviPFE';
import CharteAgreement from '../Project/CharteAgreement';
import type { ProjetPFE } from '../../types';
import {
    Download, Clock, BookOpen, FlaskConical, LayoutDashboard,
    Calendar, Check, AlertCircle, ArrowLeft, Mail,
    ChevronRight, Shield, Edit3, FileCheck
} from 'lucide-react';
import './StudentDashboard.css';

const MilitaryGauge = ({ value, label }: { value: number; label: string }) => {
    const rotation = (value / 100) * 180 - 90;

    return (
        <div className="mercedes-gauge-container">
            <div className="gauge-glow-effect"></div>
            <svg viewBox="0 0 100 60" className="gauge-svg">
                {/* Background Track with Metallic Look */}
                <path className="gauge-track" d="M10 50 A 40 40 0 0 1 90 50" fill="none" strokeWidth="6" stroke="rgba(255,255,255,0.05)" />

                {/* Colored Segments with Mercedes Palette */}
                <path className="gauge-segment" d="M10 50 A 40 40 0 0 1 30 18" fill="none" strokeWidth="4" stroke="#059669" /> {/* Deep Green */}
                <path className="gauge-segment" d="M30 18 A 40 40 0 0 1 50 10" fill="none" strokeWidth="4" stroke="#84cc16" /> {/* Lime */}
                <path className="gauge-segment" d="M50 10 A 40 40 0 0 1 70 18" fill="none" strokeWidth="4" stroke="#f59e0b" /> {/* Orange */}
                <path className="gauge-segment" d="M70 18 A 40 40 0 0 1 90 50" fill="none" strokeWidth="4" stroke="#ef4444" /> {/* Red */}

                {/* Needle with Chrome/White finish */}
                <line
                    x1="50" y1="50" x2="50" y2="15"
                    className="needle"
                    style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '50px 50px' }}
                />

                {/* Center Cap (Mercedes Star vibe) */}
                <circle cx="50" cy="50" r="4" className="needle-cap-outer" fill="rgba(255,255,255,0.1)" />
                <circle cx="50" cy="50" r="2.5" className="needle-cap-inner" fill="#fff" />
            </svg>
            <div className="gauge-info">
                <div className="gauge-value-box">
                    <span className="gauge-percent">{value}%</span>
                </div>
                <span className="gauge-title">{label.toUpperCase()}</span>
            </div>
        </div>
    );
};

const StudentDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [project, setProject] = useState<ProjetPFE | null>(null);
    const [showPDF, setShowPDF] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);

    // Editable Progress State
    const [isEditingProgress, setIsEditingProgress] = useState(false);
    const [tempExperimental, setTempExperimental] = useState<any[]>([]);
    const [tempRedaction, setTempRedaction] = useState<any[]>([]);
    const [activeDocTab, setActiveDocTab] = useState<'fiche' | 'charte' | 'docs'>('fiche');

    useEffect(() => {
        if (user) {
            setNotifications(storageService.getNotifications().filter(n => n.idEtudiant === user.id));
            const userProject = storageService.getProjectByStudent(user.id);
            if (userProject) {
                setProject(userProject);
                setTempExperimental(userProject.progres.experimental);
                setTempRedaction(userProject.progres.redaction);
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
        if (!milestones || milestones.length === 0) return 0;
        return Math.round(milestones.reduce((acc, m) => acc + m.progres, 0) / milestones.length);
    };

    // Use temp state for calculations to reflect live edits
    const expProgress = calculateSectionProgress(isEditingProgress ? tempExperimental : project.progres.experimental);
    const redProgress = calculateSectionProgress(isEditingProgress ? tempRedaction : project.progres.redaction);
    const totalProgress = Math.round((expProgress + redProgress) / 2);


    const handleProgressChange = (type: 'experimental' | 'redaction', id: string, newValue: number) => {
        const updater = type === 'experimental' ? setTempExperimental : setTempRedaction;
        const currentList = type === 'experimental' ? tempExperimental : tempRedaction;

        updater(currentList.map(item =>
            item.id === id ? { ...item, progres: parseInt(newValue.toString()) } : item
        ));
    };

    const saveProgress = () => {
        if (!project) return;

        const updatedProject = {
            ...project,
            progres: {
                experimental: tempExperimental,
                redaction: tempRedaction
            }
        };

        storageService.updateProject(updatedProject);
        setProject(updatedProject);
        setIsEditingProgress(false); // Mode lecture seule après sauvegarde
    };

    const cancelProgressEdit = () => {
        if (!project) return;
        setTempExperimental(project.progres.experimental);
        setTempRedaction(project.progres.redaction);
        setIsEditingProgress(false);
    };

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
                    <div className="welcome-tag">SITUATION ACADÉMIQUE - OFFICIER ÉLÈVE</div>
                    <h1>{project.titre}</h1>
                    <div className="encadrant-contact">
                        <span>SOUS LA DIRECTION DE : <strong>{project.nomEncadrant.toUpperCase()}</strong></span>
                        <a href="mailto:oussmer@hotmail.fr" className="contact-pill link" style={{ marginLeft: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59,130,246,0.1)', padding: '6px 14px', borderRadius: '6px', textDecoration: 'none', color: 'var(--color-accent-blue)', fontSize: '0.85rem', fontWeight: 600 }}>
                            <Mail size={14} /> CONTACT ENCADRANT
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

            {/* Mercedes Style Dashboard Cluster */}
            <div className="mercedes-cluster-wrapper">
                <div className="mercedes-dashboard animate-slide-up">
                    <MilitaryGauge value={totalProgress} label="Progression Globale" />
                    <MilitaryGauge value={expProgress} label="Volet Expérimental" />
                    <MilitaryGauge value={redProgress} label="Volet Rédactionnel" />
                </div>
            </div>

            <div className="dashboard-subheader" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', paddingRight: '2rem' }}>
                {!isEditingProgress ? (
                    <button className="btn btn-primary" onClick={() => setIsEditingProgress(true)}>
                        <Edit3 size={16} /> Mettre à jour l'Avancement
                    </button>
                ) : (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-outline" onClick={cancelProgressEdit}>
                            Annuler
                        </button>
                        <button className="btn btn-primary" onClick={saveProgress}>
                            <Check size={16} /> Enregistrer
                        </button>
                    </div>
                )}
            </div>

            <div className="dashboard-content-grid">
                <section className={`milestones-section glass ${isEditingProgress ? 'editing-mode' : ''}`}>
                    <div className="section-title">
                        <FlaskConical size={20} />
                        <h2>OBJECTIFS OPÉRATIONNELS</h2>
                    </div>
                    <div className="milestone-list">
                        {(isEditingProgress ? tempExperimental : project.progres.experimental).map((m) => (
                            <div key={m.id} className="milestone-item">
                                <div className="m-info">
                                    <span className="m-label">{m.label}</span>
                                    {!isEditingProgress && <span className="m-date">MAJ : {m.derniereMiseAJour || 'N/A'}</span>}
                                </div>
                                <div className="m-progress-interactive">
                                    {isEditingProgress ? (
                                        <>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={m.progres}
                                                onChange={(e) => handleProgressChange('experimental', m.id, parseInt(e.target.value))}
                                                className="progress-slider"
                                            />
                                            <span className="m-percent-editable">{m.progres}%</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="progress-bar"><div className="fill" style={{ width: `${m.progres}%` }}></div></div>
                                            <span className="m-percent">{m.progres}%</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={`milestones-section glass ${isEditingProgress ? 'editing-mode' : ''}`}>
                    <div className="section-title">
                        <BookOpen size={20} />
                        <h2>REVUE ET RÉDACTION</h2>
                    </div>
                    <div className="milestone-list">
                        {(isEditingProgress ? tempRedaction : project.progres.redaction).map((m) => (
                            <div key={m.id} className="milestone-item">
                                <div className="m-info">
                                    <span className="m-label">{m.label}</span>
                                    {!isEditingProgress && <span className="m-date">MAJ : {m.derniereMiseAJour || 'N/A'}</span>}
                                </div>
                                <div className="m-progress-interactive">
                                    {isEditingProgress ? (
                                        <>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={m.progres}
                                                onChange={(e) => handleProgressChange('redaction', m.id, parseInt(e.target.value))}
                                                className="progress-slider red-slider"
                                            />
                                            <span className="m-percent-editable">{m.progres}%</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="progress-bar"><div className="fill red" style={{ width: `${m.progres}%` }}></div></div>
                                            <span className="m-percent">{m.progres}%</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* DOCUMENT SUBMISSION SECTION - LIVRABLE REQUIS */}
            <DocumentSubmission projectId={project.id} />

            {/* NEW: DOSSIER ACADÉMIQUE OFFICIEL Section */}
            <section className="academic-dossier-section glass animate-slide-up">
                <div className="section-header-academic">
                    <div className="title-group">
                        <Shield size={24} className="shield-icon" />
                        <div>
                            <h2>DOSSIER ACADÉMIQUE OFFICIEL</h2>
                            <p>Documents administratifs et suivi réglementaire</p>
                        </div>
                    </div>
                    <div className="academic-tabs">
                        <button
                            className={`tab-btn ${activeDocTab === 'fiche' ? 'active' : ''}`}
                            onClick={() => setActiveDocTab('fiche')}
                        >
                            <FileCheck size={16} /> Fiche de Suivi
                        </button>
                        <button
                            className={`tab-btn ${activeDocTab === 'charte' ? 'active' : ''}`}
                            onClick={() => setActiveDocTab('charte')}
                        >
                            <BookOpen size={16} /> Charte PFE
                        </button>
                    </div>
                </div>

                <div className="academic-content">
                    {activeDocTab === 'fiche' && (
                        <FicheSuiviPFE project={project} isStudentView={true} />
                    )}
                    {activeDocTab === 'charte' && (
                        <CharteAgreement project={project} isStudentView={true} />
                    )}
                </div>
            </section>

            <div className="update-reminder glass animate-slide-up">
                <Clock size={20} className="reminder-icon" />
                <p>
                    <strong>CONSIGNE :</strong> La mise à jour de l'avancement est obligatoire avant chaque remise hebdomadaire.
                    Le non-respect des échéances peut impacter votre visa de soutenance.
                    L'encadrant validera vos déclarations.
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
