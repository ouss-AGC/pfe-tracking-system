import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PROJETS } from '../../data/mockProjects';
import type { ProjetPFE } from '../../types';
import {
    Users, ShieldCheck, Clock,
    Search, Calendar, TrendingUp,
    CheckCircle2, AlertTriangle, ChevronRight,
    Activity, Shield, FileText
} from 'lucide-react';
import './SupervisorDashboard.css';

const SupervisorDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [projects, setProjects] = useState<ProjetPFE[]>([]);
    const [selectedPDF, setSelectedPDF] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Simulation de chargement avec persistante localStorage un jour
        setProjects(MOCK_PROJETS);
    }, []);

    const filteredProjects = projects.filter(p =>
        p.nomEtudiant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.titre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = [
        { label: 'Total Équipes PFE', value: projects.length, icon: <Users size={24} />, color: 'var(--color-accent-blue)', trend: '+2 cette semaine' },
        { label: 'En Attente de Visa', value: projects.filter(p => p.statut === 'attente-validation').length, icon: <Clock size={24} />, color: 'var(--color-accent-red)', trend: 'Action Requise' },
        { label: 'Vérifications Conformité', value: '100%', icon: <ShieldCheck size={24} />, color: '#10b981', trend: 'Suivi Régulier' },
        { label: 'Jours avant Audit', value: '12', icon: <TrendingUp size={24} />, color: '#f59e0b', trend: 'Phase Finale' },
    ];

    const calculateTotalProgress = (project: ProjetPFE) => {
        const exp = project.progres.experimental.reduce((acc, m) => acc + m.progres, 0) / project.progres.experimental.length;
        const red = project.progres.redaction.reduce((acc, m) => acc + m.progres, 0) / project.progres.redaction.length;
        return Math.round((exp + red) / 2);
    };

    return (
        <div className="dashboard-page animate-fade-in">
            {/* Modal de Visualisation PDF */}
            {selectedPDF && (
                <div className="pdf-viewer-overlay glass" onClick={() => setSelectedPDF(null)}>
                    <div className="pdf-viewer-modal glass" onClick={e => e.stopPropagation()}>
                        <div className="pdf-header">
                            <h3>RÉFÉRENTIEL : FICHE DE PROPOSITION PFE</h3>
                            <button className="btn-close" onClick={() => setSelectedPDF(null)}>×</button>
                        </div>
                        <iframe
                            src={selectedPDF}
                            title="Fiche PFE"
                            width="100%"
                            height="100%"
                        ></iframe>
                    </div>
                </div>
            )}
            <header className="dashboard-header">
                <div className="header-info">
                    <div className="military-label">
                        <Shield size={16} />
                        <span>ACADÉMIE MILITAIRE DE TUNISIE</span>
                    </div>
                    <h1>CENTRE DE COMMANDEMENT PFE</h1>
                    <p>SUPERVISION ET VALIDATION DES PROJETS DE FIN D'ÉTUDES - GC</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline" onClick={() => navigate('/supervisor/booking')}>
                        <Calendar size={18} />
                        <span>Gestion RDV</span>
                    </button>
                    <div className="search-bar glass">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Rechercher un étudiant ou un sujet..."
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
                            <div key={project.id} className={`project-card glass ${late ? 'border-late' : ''}`} onClick={() => navigate(`/project/${project.id}`)}>
                                <div className="card-header">
                                    <div className="student-meta">
                                        <h3>{project.nomEtudiant}</h3>
                                        {late && <span className="badge-urgent">RETARD DÉTECTÉ</span>}
                                        <p>{project.titre}</p>
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
                                            className="v-btn-ref"
                                            title="Voir la Fiche de Proposition (Référentiel)"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedPDF(project.urlFichePFE || null);
                                            }}
                                        >
                                            <FileText size={16} />
                                        </button>
                                        <button className="v-btn-open">
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
