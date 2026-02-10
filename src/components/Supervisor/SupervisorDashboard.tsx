import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import BroadcastBanner from '../Layout/BroadcastBanner';
import FicheSuiviPFE from '../Project/FicheSuiviPFE';
import CharteAgreement from '../Project/CharteAgreement';
import FicheInteractivePFE from '../Project/FicheInteractivePFE';
import ProjectDetails from '../Project/ProjectDetails';
import type { ProjetPFE } from '../../types';
import {
    Users, ShieldCheck, Clock,
    Search, Calendar, TrendingUp,
    CheckCircle2, AlertTriangle, ChevronRight,
    Activity, Shield, FileText, Megaphone, Send, Trash2,
    Phone, Mail, Info, X, ArrowLeft, Edit2, Save, FolderOpen, Download, AlertCircle
} from 'lucide-react';
import './SupervisorDashboard.css';

const SupervisorDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [projects, setProjects] = useState<ProjetPFE[]>([]);
    const [selectedProjectForFiche, setSelectedProjectForFiche] = useState<ProjetPFE | null>(null);
    const [selectedProjectForJournal, setSelectedProjectForJournal] = useState<ProjetPFE | null>(null);
    const [showBroadcastModal, setShowBroadcastModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<ProjetPFE | null>(null);
    const [activeDocTab, setActiveDocTab] = useState<'fiche' | 'charte' | 'proposition'>('proposition');
    const [broadcastMsg, setBroadcastMsg] = useState('');
    const [broadcastType, setBroadcastType] = useState<'info' | 'alerte' | 'urgent'>('info');

    // NEW: Validation Modal State
    const [studentForValidation, setStudentForValidation] = useState<ProjetPFE | null>(null);
    const [validationExp, setValidationExp] = useState<any[]>([]);
    const [validationRed, setValidationRed] = useState<any[]>([]);

    // NEW: Documents Modal State
    const [showDocsModal, setShowDocsModal] = useState<ProjetPFE | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        setProjects(storageService.getProjects());
    }, []);

    const filteredProjects = projects.filter(p =>
        p.nomEtudiant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.titre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = [
        { label: 'Total Officier Élèves', value: projects.length, icon: <Users size={24} />, color: 'var(--color-accent-blue)', trend: '+2 cette semaine' },
        { label: 'En Attente de Visa', value: projects.filter(p => p.statut === 'attente-validation').length, icon: <Clock size={24} />, color: 'var(--color-accent-red)', trend: 'Action Requise' },
        { label: 'Vérifications Conformité', value: '100%', icon: <ShieldCheck size={24} />, color: '#10b981', trend: 'Suivi Régulier' },
        { label: 'Jours avant Audit', value: '12', icon: <TrendingUp size={24} />, color: '#f59e0b', trend: 'Phase Finale' },
    ];

    const calculateTotalProgress = (project: ProjetPFE) => {
        const exp = project.progres.experimental.reduce((acc, m) => acc + m.progres, 0) / project.progres.experimental.length;
        const red = project.progres.redaction.reduce((acc, m) => acc + m.progres, 0) / project.progres.redaction.length;
        return Math.round((exp + red) / 2);
    };

    const openValidationModal = (project: ProjetPFE, e: React.MouseEvent) => {
        e.stopPropagation();
        setStudentForValidation(project);
        setValidationExp(project.progres.experimental);
        setValidationRed(project.progres.redaction);
    };

    const handleValidationChange = (type: 'experimental' | 'redaction', id: string, val: number) => {
        const updater = type === 'experimental' ? setValidationExp : setValidationRed;
        const list = type === 'experimental' ? validationExp : validationRed;
        updater(list.map(m => m.id === id ? { ...m, progres: val } : m));
    };

    const saveValidation = () => {
        if (!studentForValidation) return;
        const updated = {
            ...studentForValidation,
            progres: {
                experimental: validationExp,
                redaction: validationRed
            }
        };
        storageService.updateProject(updated);
        setProjects(storageService.getProjects()); // Refresh list
        setStudentForValidation(null);
    };

    return (
        <div className="dashboard-page animate-fade-in">
            <BroadcastBanner />
            {/* Modal de Visualisation des DOSSIERS ACADÉMIQUES */}
            {selectedProjectForFiche && (
                <div className="pdf-viewer-overlay glass" onClick={() => setSelectedProjectForFiche(null)}>
                    <div className="pdf-viewer-modal glass" style={{ width: '95%', maxWidth: '1000px', height: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                        <div className="pdf-header" style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <Shield size={20} color="var(--color-accent-blue)" />
                                <h3>DOSSIER ACADÉMIQUE : {selectedProjectForFiche.nomEtudiant.toUpperCase()}</h3>
                            </div>
                            <div className="academic-tabs" style={{ marginBottom: 0, marginLeft: '2rem' }}>
                                <button
                                    className={`tab-btn ${activeDocTab === 'proposition' ? 'active' : ''}`}
                                    onClick={() => setActiveDocTab('proposition')}
                                >
                                    Fiche Proposition
                                </button>
                                <button
                                    className={`tab-btn ${activeDocTab === 'fiche' ? 'active' : ''}`}
                                    onClick={() => setActiveDocTab('fiche')}
                                >
                                    Fiche de Suivi
                                </button>
                                <button
                                    className={`tab-btn ${activeDocTab === 'charte' ? 'active' : ''}`}
                                    onClick={() => setActiveDocTab('charte')}
                                >
                                    Charte PFE
                                </button>
                            </div>
                            <button className="btn-close" onClick={() => setSelectedProjectForFiche(null)}>×</button>
                        </div>
                        <div className="academic-modal-content" style={{ padding: '1rem' }}>
                            {activeDocTab === 'proposition' && (
                                <FicheInteractivePFE project={selectedProjectForFiche} />
                            )}
                            {activeDocTab === 'fiche' && (
                                <FicheSuiviPFE project={selectedProjectForFiche} isStudentView={false} />
                            )}
                            {activeDocTab === 'charte' && (
                                <CharteAgreement project={selectedProjectForFiche} isStudentView={false} />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Documents Déposés */}
            {showDocsModal && (
                <div className="pdf-viewer-overlay glass" onClick={() => setShowDocsModal(null)}>
                    <div className="pdf-viewer-modal glass docs-modal animate-scale-up" onClick={e => e.stopPropagation()}>
                        <div className="pdf-header">
                            <div className="header-with-icon">
                                <FolderOpen size={20} />
                                <h3 className="modal-title-text">DOCUMENTS DÉPOSÉS - {showDocsModal.nomEtudiant.toUpperCase()}</h3>
                            </div>
                            <button className="btn-close" onClick={() => setShowDocsModal(null)}>×</button>
                        </div>
                        <div className="modal-scroll-body">
                            {(() => {
                                const docs = storageService.getDocumentsByProject(showDocsModal.id);
                                return docs && docs.length > 0 ? (
                                    <div className="docs-list">
                                        {docs.map(doc => (
                                            <div key={doc.id} className="doc-item glass">
                                                <div className="doc-icon-wrapper">
                                                    <FileText size={24} />
                                                </div>
                                                <div className="doc-info">
                                                    <h4>{doc.name}</h4>
                                                    <span className="doc-meta">{doc.date} • {doc.type.toUpperCase()}</span>
                                                </div>
                                                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" title="Ouvrir le lien">
                                                    <Download size={16} />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="empty-state">
                                        <AlertCircle size={48} className="empty-icon" />
                                        <p>Aucun document déposé par cet officier élève pour le moment.</p>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Validation Progression */}
            {studentForValidation && (
                <div className="pdf-viewer-overlay glass" onClick={() => setStudentForValidation(null)}>
                    <div className="pdf-viewer-modal glass validation-modal animate-scale-up" onClick={e => e.stopPropagation()}>
                        <div className="validation-header">
                            <h3>VALIDATION DE L'AVANCEMENT - {studentForValidation.nomEtudiant.toUpperCase()}</h3>
                            <button className="btn-close" onClick={() => setStudentForValidation(null)}>×</button>
                        </div>

                        <div className="modal-scroll-body">
                            <div className="validation-section">
                                <h4>Volet Expérimental</h4>
                                {validationExp.map(m => (
                                    <div key={m.id} className="validation-row">
                                        <span className="v-label-text">{m.label}</span>
                                        <div className="v-controls">
                                            <input
                                                type="number"
                                                min="0" max="100"
                                                value={m.progres}
                                                onChange={(e) => handleValidationChange('experimental', m.id, parseInt(e.target.value))}
                                                className="v-input-val"
                                            />
                                            <span>%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="validation-section">
                                <h4>Volet Rédactionnel</h4>
                                {validationRed.map(m => (
                                    <div key={m.id} className="validation-row">
                                        <span className="v-label-text">{m.label}</span>
                                        <div className="v-controls">
                                            <input
                                                type="number"
                                                min="0" max="100"
                                                value={m.progres}
                                                onChange={(e) => handleValidationChange('redaction', m.id, parseInt(e.target.value))}
                                                className="v-input-val"
                                            />
                                            <span>%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="validation-actions">
                                <button className="btn btn-outline" onClick={() => setStudentForValidation(null)}>Annuler</button>
                                <button className="btn btn-primary" onClick={saveValidation}>
                                    <Save size={18} /> Valider et Mettre à Jour
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Visualisation du Journal de SUIVI */}
            {selectedProjectForJournal && (
                <div className="pdf-viewer-overlay glass" onClick={() => setSelectedProjectForJournal(null)}>
                    <div className="pdf-viewer-modal glass journal-modal-wide animate-scale-up" onClick={e => e.stopPropagation()}>
                        <div className="pdf-header">
                            <div className="header-with-icon">
                                <Activity size={20} />
                                <h3>JOURNAL DE SUIVI INTERACTIF</h3>
                            </div>
                            <button className="btn-close" onClick={() => setSelectedProjectForJournal(null)}>×</button>
                        </div>
                        <div className="modal-scroll-body">
                            <ProjectDetails projectId={selectedProjectForJournal.id} />
                        </div>
                    </div>
                </div>
            )}
            {/* Modal de Diffusion de Message (Flash Info) */}
            {showBroadcastModal && (
                <div className="pdf-viewer-overlay glass" onClick={() => setShowBroadcastModal(false)}>
                    <div className="pdf-viewer-modal glass broadcast-modal animate-scale-up" onClick={e => e.stopPropagation()}>
                        <div className="modal-military-header">
                            <div className="header-title">
                                <Megaphone className="title-icon" size={24} />
                                <h3>DIFFUSION FLASH INFO COLLECTIVE</h3>
                            </div>
                            <button className="btn-close-military" onClick={() => setShowBroadcastModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="broadcast-form-body-refined">
                            <div className="priority-section">
                                <label className="military-sublabel">NIVEAU D'URGENCE / PRIORITÉ</label>
                                <div className="type-selector-military">
                                    <button
                                        className={`type-btn-mil info ${broadcastType === 'info' ? 'active' : ''}`}
                                        onClick={() => setBroadcastType('info')}
                                    >
                                        <Info size={16} /> INFO
                                    </button>
                                    <button
                                        className={`type-btn-mil alerte ${broadcastType === 'alerte' ? 'active' : ''}`}
                                        onClick={() => setBroadcastType('alerte')}
                                    >
                                        <AlertTriangle size={16} /> ALERTE
                                    </button>
                                    <button
                                        className={`type-btn-mil urgent ${broadcastType === 'urgent' ? 'active' : ''}`}
                                        onClick={() => setBroadcastType('urgent')}
                                    >
                                        <Activity size={16} /> CRITIQUE
                                    </button>
                                </div>
                            </div>

                            <div className="message-section">
                                <label className="military-sublabel">CORPS DU MESSAGE (ORDRES ET CONSIGNES)</label>
                                <div className="textarea-wrapper-military">
                                    <textarea
                                        placeholder="Tapez votre message ici (ex: Rappel : Remise des rapports lundi avant 12h)..."
                                        value={broadcastMsg}
                                        onChange={(e) => setBroadcastMsg(e.target.value)}
                                        className="military-textarea"
                                    ></textarea>
                                    <div className="textarea-focus-border"></div>
                                </div>
                            </div>

                            <div className="broadcast-actions-refined">
                                <button className="btn-mil-outline" onClick={() => {
                                    storageService.clearNotifications();
                                    setBroadcastMsg('');
                                }}>
                                    <Trash2 size={16} /> EFFACER L'HISTORIQUE
                                </button>
                                <button className="btn-mil-primary" onClick={() => {
                                    if (!broadcastMsg) return;
                                    storageService.addNotification({
                                        id: `note-${Date.now()}`,
                                        message: broadcastMsg,
                                        date: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                                        auteur: 'Dr. Atoui',
                                        type: broadcastType,
                                        actif: true
                                    });
                                    setBroadcastMsg('');
                                    setShowBroadcastModal(false);
                                }}>
                                    <Send size={18} /> TRANSMETTRE L'ORDRE
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal Détails Étudiant Académique */}
            {selectedStudent && (
                <div className="pdf-viewer-overlay glass" onClick={() => setSelectedStudent(null)}>
                    <div className="student-details-modal glass animate-scale-up" onClick={e => e.stopPropagation()}>
                        <div className="modal-academic-header">
                            <div className="academic-seal">
                                <ShieldCheck size={40} />
                                <span>ACADÉMIE MILITAIRE</span>
                            </div>
                            <button className="btn-close" onClick={() => setSelectedStudent(null)}>×</button>
                        </div>

                        <div className="modal-academic-content">
                            <div className="student-hero">
                                <div className="student-photo-large">
                                    <img src={selectedStudent.avatarEtudiant || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + selectedStudent.idEtudiant} alt={selectedStudent.nomEtudiant} />
                                </div>
                                <div className="student-main-info">
                                    <span className="user-role">OFFICIER ÉLÈVE</span>
                                    <span className="info-id">MATRICULE PFE-{selectedStudent.id.split('-')[1]}</span>
                                    <h2>{selectedStudent.nomEtudiant}</h2>
                                    <div className="contact-pills">
                                        <a href={`mailto:${selectedStudent.emailEtudiant}`} className="contact-pill link">
                                            <Mail size={14} />
                                            <span>{selectedStudent.emailEtudiant}</span>
                                        </a>
                                        <div className="contact-pill">
                                            <Phone size={14} />
                                            <span>{selectedStudent.telephoneEtudiant || 'Non renseigné'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="academic-divider"></div>

                            <div className="project-highlight">
                                <label>SUJET DE RECHERCHE</label>
                                <h3>{selectedStudent.titre}</h3>
                                <p>{selectedStudent.description}</p>
                            </div>

                            <div className="academic-progress-view">
                                <label>PROGRESSION ACADÉMIQUE GLOBALE</label>
                                <div className="large-progress-track">
                                    <div className="track-header">
                                        <span className="pct">{calculateTotalProgress(selectedStudent)}%</span>
                                        <span className="status-label">{selectedStudent.statut.replace('-', ' ').toUpperCase()}</span>
                                    </div>
                                    <div className="main-bar">
                                        <div className="main-fill" style={{ width: `${calculateTotalProgress(selectedStudent)}%` }}></div>
                                    </div>
                                </div>

                                <div className="sub-progress-grid">
                                    <div className="sub-item">
                                        <label>Partie Expérimentale</label>
                                        <div className="sub-bar"><div className="sub-fill" style={{ width: `${Math.round(selectedStudent.progres.experimental.reduce((acc, m) => acc + m.progres, 0) / selectedStudent.progres.experimental.length)}%` }}></div></div>
                                    </div>
                                    <div className="sub-item">
                                        <label>Phase Rédactionnelle</label>
                                        <div className="sub-bar"><div className="sub-fill blue" style={{ width: `${Math.round(selectedStudent.progres.redaction.reduce((acc, m) => acc + m.progres, 0) / selectedStudent.progres.redaction.length)}%` }}></div></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-academic-footer">
                            <button className="btn btn-outline" onClick={() => setSelectedStudent(null)}>Fermer</button>
                            <button className="btn btn-primary" onClick={() => {
                                setSelectedProjectForJournal(selectedStudent);
                                setSelectedStudent(null);
                            }}>
                                Accéder au Journal de Suivi <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* BANDEAU BIENVENUE DR ATOUI */}
            <div className="welcome-banner glass animate-slide-down">
                <div className="welcome-photo-container">
                    <img src="/dr-atoui.jpg" alt="Dr. Oussama Atoui" className="welcome-photo" />
                </div>
                <div className="welcome-text">
                    <span className="rank-label">OFFICIER ENCADRANT</span>
                    <h2>Bienvenue, Dr. Oussama Atoui</h2>
                    <p>Système de Suivi des Projets de Fin d'Études - Promotion Officier Élève 2026</p>
                </div>
                <div className="welcome-badge">
                    <ShieldCheck size={40} className="badge-icon" />
                    <span>ACCÈS COMMANDEMENT SIGNE</span>
                </div>
            </div>

            <header className="dashboard-header">
                <div className="header-info">
                    <button className="btn-back" onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
                        <ArrowLeft size={18} /> Retour
                    </button>
                    <div className="military-label">
                        <Shield size={16} />
                        <span>ACADÉMIE MILITAIRE DE TUNISIE</span>
                    </div>
                    <h1>CENTRE DE COMMANDEMENT PFE</h1>
                    <p>SUPERVISION ET VALIDATION DES PROJETS DE FIN D'ÉTUDES - GC</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline" onClick={() => setShowBroadcastModal(true)} title="Diffuser un message à tous les officiers élèves">
                        <Megaphone size={18} />
                        <span>Flash Info</span>
                    </button>
                    <button className="btn btn-outline" onClick={() => navigate('/supervisor/booking')}>
                        <Calendar size={18} />
                        <span>Gestion RDV</span>
                    </button>
                    <div className="search-bar glass">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Rechercher un officier élève ou un sujet..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            {/* RACK DE STATISTIQUES HAUTE VISIBILITÉ */}
            <div className="stats-rack">
                {stats.map((stat, idx) => (
                    <div key={idx} className="stat-box glass-card animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                        <div className="stat-box-inner">
                            <div className="stat-info">
                                <label>{stat.label}</label>
                                <span className="stat-number">{stat.value}</span>
                                <div className="stat-trend" style={{ color: stat.color }}>{stat.trend}</div>
                            </div>
                            <div className="stat-visual" style={{ color: stat.color, background: `${stat.color}10` }}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <section className="verification-section">
                <div className="section-header-refined">
                    <div className="title-block">
                        <Activity size={20} className="icon-pulse" />
                        <h2>STATUT DE VÉRIFICATION DES ÉQUIPES</h2>
                    </div>
                    <span className="count-badge">{filteredProjects.length} Équipes actives</span>
                </div>

                <div className="verification-grid">
                    {filteredProjects.map((project) => {
                        const totalProgress = calculateTotalProgress(project);
                        const isPending = project.statut === 'attente-validation';

                        const now = new Date('2024-02-05');
                        const allMilestones = [...project.progres.experimental, ...project.progres.redaction];
                        const late = allMilestones.some(m => m.dateLimite && new Date(m.dateLimite) < now && m.progres < 100);

                        return (
                            <div key={project.id} className={`project-card glass ${late ? 'border-late' : ''}`} onClick={() => setSelectedStudent(project)}>
                                <div className="card-header">
                                    <div className="student-meta">
                                        <div className="student-info-row">
                                            {project.avatarEtudiant && (
                                                <img src={project.avatarEtudiant} alt={project.nomEtudiant} className="student-card-avatar" />
                                            )}
                                            <h3>{project.nomEtudiant}</h3>
                                        </div>
                                        {late && <span className="badge-urgent">RETARD DÉTECTÉ</span>}
                                    </div>
                                    <div className={`v-status-badge ${project.statut}`}>
                                        {isPending ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                                        {project.statut.replace('-', ' ').toUpperCase()}
                                    </div>
                                </div>

                                <div className="v-card-body">
                                    <p className="v-project-title">{project.titre}</p>

                                    <div className="v-progress-stack">
                                        <div className="v-progress-item">
                                            <div className="v-label"><span>Expérimental</span> <span>{Math.round(project.progres.experimental.reduce((acc, m) => acc + m.progres, 0) / project.progres.experimental.length)}%</span></div>
                                            <div className="v-bar"><div className="v-fill" style={{ width: `${Math.round(project.progres.experimental.reduce((acc, m) => acc + m.progres, 0) / project.progres.experimental.length)}%` }}></div></div>
                                        </div>
                                        <div className="v-progress-item">
                                            <div className="v-label"><span>Rédaction</span> <span>{Math.round(project.progres.redaction.reduce((acc, m) => acc + m.progres, 0) / project.progres.redaction.length)}%</span></div>
                                            <div className="v-bar"><div className="v-fill blue" style={{ width: `${Math.round(project.progres.redaction.reduce((acc, m) => acc + m.progres, 0) / project.progres.redaction.length)}%` }}></div></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="v-card-footer">
                                    <div className="v-overall">
                                        <label>Progression Globale</label>
                                        <div className="v-total-val">{totalProgress}%</div>
                                    </div>
                                    <div className="v-actions-group">
                                        <button
                                            className="v-btn-ref docs"
                                            title="Voir les Documents Déposés"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowDocsModal(project);
                                            }}
                                        >
                                            <FolderOpen size={16} />
                                        </button>
                                        <button
                                            className="v-btn-ref info"
                                            title="Éditer et Valider la Progression"
                                            onClick={(e) => openValidationModal(project, e)}
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            className="v-btn-ref"
                                            title="Voir la Fiche de Proposition (Référentiel)"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedProjectForFiche(project);
                                            }}
                                        >
                                            <FileText size={16} />
                                        </button>
                                        <button
                                            className="v-btn-open"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedProjectForJournal(project);
                                            }}
                                        >
                                            Suivi <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default SupervisorDashboard;
