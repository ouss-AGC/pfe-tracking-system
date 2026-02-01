import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import type { ProjetPFE } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
    ArrowLeft, FlaskConical, BookOpen, Save,
    Printer, ShieldCheck, PenTool,
    MessageSquare, Shield, List, FileText
} from 'lucide-react';
import './ProjectDetails.css';

interface ProjectDetailsProps {
    projectId?: string;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projectId }) => {
    const { id: urlId } = useParams<{ id: string }>();
    const id = projectId || urlId;
    const navigate = useNavigate();
    const { user } = useAuth();
    const [project, setProject] = useState<ProjetPFE | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showPresets, setShowPresets] = useState(false);
    const [showPDF, setShowPDF] = useState(false);

    const PRESET_COMMENTS = [
        { label: "Excellent Travail", text: "Le travail présenté est d'une excellente qualité. Les objectifs fixés pour cette période ont été atteints avec brio. Je vous encourage vivement à maintenir ce niveau de rigueur et d'analyse." },
        { label: "Progression Satisfaisante", text: "L'avancement du projet est conforme au planning. Les résultats obtenus sont cohérents. Continuez sur cette lancée tout en restant vigilant sur les détails techniques abordés." },
        { label: "Insuffisant / Plus d'Efforts", text: "Le travail actuel nécessite un investissement plus soutenu. Les livrables attendus sont incomplets. Un redoublement d'effort est impératif pour ne pas accumuler de retard sur l'échéance." },
        { label: "Réunion Spéciale Requise", text: "Je constate des difficultés majeures dans l'approche méthodologique. Je demande une réunion de cadrage immédiate pour vous remettre sur la bonne voie et clarifier les orientations du projet." },
        { label: "Encouragements", text: "Malgré les difficultés techniques rencontrées, votre persévérance est louable. Continuez à explorer ces pistes, vous êtes sur le point de débloquer des points cruciaux pour votre mémoire." }
    ];

    // États pour la Signature et le Cachet
    const [signature, setSignature] = useState<string | null>(null);
    const [stamp, setStamp] = useState<string | null>(null);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const found = storageService.getProjectById(id || '');

        if (found) {
            // Vérification de sécurité (Confidentialité)
            if (user?.role === 'student' && found.idEtudiant !== user.id) {
                setError("Accès Refusé : Vous n'êtes pas autorisé à consulter ce projet (Confidentialité Académique).");
                return;
            }

            setProject(JSON.parse(JSON.stringify(found)));
            setSignature(found.signatureEncadrant || null);
            setStamp(found.cachetEncadrant || null);
        }
    }, [id, user]);

    const handleSave = () => {
        if (!project) return;
        setIsSaving(true);
        setTimeout(() => {
            storageService.updateProject(project);
            setIsSaving(false);
        }, 800);
    };

    const handleSign = () => {
        if (!project) return;
        const newStamp = '/cachet_signature_dr_atoui.png';

        setSignature(null); // La signature est déjà intégrée dans l'image du cachet
        setStamp(newStamp);

        const updated = {
            ...project,
            signatureEncadrant: '',
            cachetEncadrant: newStamp,
            dateSignature: new Date().toLocaleDateString('fr-FR'),
            statut: 'termine' as const
        };

        setProject(updated);
        storageService.updateProject(updated);
    };

    if (error) return <div className="error-container glass"><h2>{error}</h2><button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Retour au Dashboard</button></div>;
    if (!project) return <div className="loader"></div>;

    const expAvg = Math.round(project.progres.experimental.reduce((acc, m) => acc + m.progres, 0) / project.progres.experimental.length);
    const redAvg = Math.round(project.progres.redaction.reduce((acc, m) => acc + m.progres, 0) / project.progres.redaction.length);

    const getLastInteractionDate = () => {
        const entries = project.journalSuivi;
        return entries.length > 0 ? entries[entries.length - 1].date : 'Aucune';
    };

    const isLate = (dateLimite?: string) => {
        if (!dateLimite) return false;
        // Pour la demo simulation on compare au 05/02/2024
        const now = new Date('2024-02-05');
        const limit = new Date(dateLimite);
        return limit < now;
    };

    return (
        <div className={`project-details-page animate-fade-in ${projectId ? 'in-modal' : ''}`}>
            {/* Modal de Visualisation PDF */}
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

            {/* Header d'interface - Caché à l'impression et en mode modal */}
            {!projectId && (
                <header className="page-header no-print">
                    <div className="header-left">
                        <button className="btn-back" onClick={() => navigate(-1)}>
                            <ArrowLeft size={20} /> Retour
                        </button>
                        <h1>Espace de Suivi PFE</h1>
                    </div>
                    <div className="header-right">
                        <button className="btn btn-primary btn-pulse" onClick={() => setShowPDF(true)}>
                            <FileText size={18} /> Voir Fiche PFE (Réf)
                        </button>
                        {user?.role === 'student' && (
                            <button className="btn btn-outline" onClick={handleSave} disabled={isSaving}>
                                <Save size={18} /> {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                        )}
                        <button className="btn btn-outline" onClick={() => window.print()}>
                            <Printer size={18} /> Imprimer la Fiche
                        </button>
                    </div>
                </header>
            )}

            {/* CONTENU DE LA FICHE OFFICIELLE */}
            <div className="official-sheet-container glass">
                {/* En-tête de la Fiche (Style Académique) */}
                <div className="sheet-header">
                    <div className="academy-logo">
                        <ShieldCheck size={48} color="var(--color-accent-blue)" />
                        <div className="academy-text">
                            <h3>ACADÉMIE MILITAIRE</h3>
                            <span>DÉPARTEMENT GÉNIE CIVIL</span>
                        </div>
                    </div>
                    <div className="sheet-title-box">
                        <h2>FICHE DE SUIVI DE PFE</h2>
                        <span>ANNÉE UNIVERSITAIRE 2025-2026</span>
                    </div>
                    <div className="sheet-ref">
                        <span>REF: PFE-{project.id.toUpperCase()}</span>
                        <span>DATE: {new Date().toLocaleDateString('fr-FR')}</span>
                    </div>
                </div>

                {/* Indicateur de Vigilance Administration */}
                <div className="vigilance-banner">
                    <div className="vigilance-status positive">
                        <Shield size={20} />
                        <span>SUIVI ADMINISTRATIF : CONFORME (Dernière interaction : {getLastInteractionDate()})</span>
                    </div>
                    <div className="proof-id">
                        ID PREUVE : {project.id}-TRACK-2026
                    </div>
                </div>

                <div className="project-info-summary">
                    <div className="info-block">
                        <label>Sujet du PFE :</label>
                        <p className="title-text">{project.titre}</p>
                    </div>
                    <div className="info-grid">
                        <div className="info-block">
                            <label>Officier Élève :</label>
                            <p>{user?.role === 'student' && user?.id === project.idEtudiant ? user.nom : project.nomEtudiant}</p>
                        </div>
                        <div className="info-block">
                            <label>Encadrant :</label>
                            <p>{project.nomEncadrant}</p>
                        </div>
                        <div className="info-block">
                            <label>Statut Actuel :</label>
                            <p><span className={`status-pill ${project.statut}`}>{project.statut.replace('-', ' ').toUpperCase()}</span></p>
                        </div>
                    </div>
                </div>

                {/* Sections de Progrès */}
                <div className="sheet-progress-sections">
                    <section className="sheet-section">
                        <div className="section-header-mini">
                            <FlaskConical size={20} />
                            <h3>PARTIE I : TRAVAUX EXPÉRIMENTAUX</h3>
                            <span className="section-total">Moyenne: {expAvg}%</span>
                        </div>
                        <div className="milestone-list-official">
                            {project.progres.experimental.map(m => (
                                <div key={m.id} className={`milestone-row-official ${isLate(m.dateLimite) && m.progres < 100 ? 'late' : ''}`}>
                                    <div className="milestone-label-box">
                                        <span className="milestone-label">{m.label}</span>
                                        {m.dateLimite && <span className="milestone-deadline">Échéance: {m.dateLimite}</span>}
                                    </div>
                                    <div className="milestone-track">
                                        <div className="track-bar"><div className="fill" style={{ width: `${m.progres}%` }}></div></div>
                                        <span className="track-val">{m.progres}%</span>
                                    </div>
                                    <span className="milestone-date">{m.derniereMiseAJour}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="sheet-section">
                        <div className="section-header-mini">
                            <BookOpen size={20} />
                            <h3>PARTIE II : RÉDACTION DU MÉMOIRE</h3>
                            <span className="section-total">Moyenne: {redAvg}%</span>
                        </div>
                        <div className="milestone-list-official">
                            {project.progres.redaction.map(m => (
                                <div key={m.id} className={`milestone-row-official ${isLate(m.dateLimite) && m.progres < 100 ? 'late' : ''}`}>
                                    <div className="milestone-label-box">
                                        <span className="milestone-label">{m.label}</span>
                                        {m.dateLimite && <span className="milestone-deadline">Échéance: {m.dateLimite}</span>}
                                    </div>
                                    <div className="milestone-track">
                                        <div className="track-bar"><div className="fill red" style={{ width: `${m.progres}%` }}></div></div>
                                        <span className="track-val">{m.progres}%</span>
                                    </div>
                                    <span className="milestone-date">{m.derniereMiseAJour}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Journal de Suivi Hebdomadaire (Preuve Administration) */}
                <section className="sheet-section journal-section">
                    <div className="section-header-mini">
                        <MessageSquare size={20} />
                        <h3>JOURNAL DE SUIVI HEBDOMAIRE & OBSERVATIONS</h3>
                    </div>

                    {/* Bloc d'ajout de commentaire - Réservé à l'encadrant */}
                    {user?.role === 'supervisor' && (
                        <div className="add-comment-box no-print">
                            <div className="comment-input-header">
                                <label>Ajouter une Observation Officielle :</label>
                                <div className="preset-selector-wrapper">
                                    <button
                                        className="btn-text-icon"
                                        onClick={() => setShowPresets(!showPresets)}
                                        title="Utiliser un modèle de commentaire"
                                    >
                                        <List size={16} /> Modèles Professionnels
                                    </button>
                                    {showPresets && (
                                        <div className="presets-dropdown-menu glass">
                                            {PRESET_COMMENTS.map((pc, i) => (
                                                <div
                                                    key={i}
                                                    className="preset-item"
                                                    onClick={() => {
                                                        const textarea = document.getElementById('new-comment') as HTMLTextAreaElement;
                                                        textarea.value = pc.text;
                                                        setShowPresets(false);
                                                    }}
                                                >
                                                    <strong>{pc.label}</strong>
                                                    <p>{pc.text.substring(0, 60)}...</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <textarea
                                placeholder="Ajoutez vos recommandations ou remarques sur l'avancement..."
                                id="new-comment"
                            ></textarea>
                            <button className="btn btn-primary" onClick={() => {
                                const textarea = document.getElementById('new-comment') as HTMLTextAreaElement;
                                if (textarea.value.trim()) {
                                    setProject(prev => prev ? ({
                                        ...prev,
                                        journalSuivi: [
                                            ...prev.journalSuivi,
                                            {
                                                date: new Date().toLocaleDateString('fr-FR'),
                                                heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                                                commentaire: textarea.value.trim(),
                                                type: 'superviseur'
                                            }
                                        ]
                                    }) : null);
                                    textarea.value = '';
                                }
                            }}>
                                <Save size={16} /> Ajouter au Journal
                            </button>
                        </div>
                    )}

                    <div className="journal-table">
                        <div className="journal-header-row">
                            <div className="j-col-date">Date & Heure</div>
                            <div className="j-col-type">Emetteur</div>
                            <div className="j-col-comm">Commentaires / Observations</div>
                        </div>
                        {project.journalSuivi.map((entry, idx) => (
                            <div key={idx} className="journal-row animate-fade-in">
                                <div className="j-col-date">
                                    <span className="j-date">{entry.date}</span>
                                    <span className="j-time">{entry.heure || '--:--'}</span>
                                </div>
                                <div className="j-col-type">
                                    <span className={`type-badge ${entry.type}`}>
                                        {entry.type === 'superviseur' ? 'ENCADRANT' : 'OFFICIER ÉLÈVE'}
                                    </span>
                                </div>
                                <div className="j-col-comm">{entry.commentaire}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Bloc de Validation Finale */}
                <div className="validation-footer">
                    <div className="signature-area etudiant">
                        <label>Visa de l'Officier Élève</label>
                        <div className="signature-box-official">
                            <p className="signature-ident">{user?.role === 'student' && user?.id === project.idEtudiant ? user.nom : project.nomEtudiant}</p>
                            <span className="sign-hint">Validé via Portail Numérique</span>
                        </div>
                    </div>

                    <div className="signature-area encadrant">
                        <label>Visa de l'Encadrant (Signature & Cachet)</label>
                        <div className="signature-box-official">
                            {signature && stamp ? (
                                <div className="visual-signature">
                                    <img src={signature} alt="Signature" className="official-signature-img" />
                                    <img src={stamp} alt="Cachet" className="official-stamp-img" />
                                    <div className="signature-info">
                                        <strong>{project.nomEncadrant}</strong>
                                        <span>Signé le : {project.dateSignature}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="signature-placeholder">
                                    {user?.role === 'supervisor' ? (
                                        <button className="btn btn-red" onClick={handleSign}>
                                            <PenTool size={18} /> Signer & Cacheter
                                        </button>
                                    ) : (
                                        <span className="pending-text">En attente de validation...</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="signature-area chef">
                        <label>Visa Chef de Département (Colonel Major)</label>
                        <div className="signature-box-official manual-visa">
                            <div className="manual-visa-text">
                                <strong>Col. Major Trabelsi Raouf</strong>
                                <span className="visa-instruction">(Signature manuscrite et date lors de l'examen de la fiche)</span>
                            </div>
                            <div className="stamp-placeholder-manual">
                                CACHET DE DÉPARTEMENT
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sheet-footer-note">
                    Document généré automatiquement par le Portail de Suivi PFE - Académie Militaire de Tunisie
                </div>
            </div>

            <div className="doc-watermark-overlay no-print">CONFIDENTIEL - PFE 2026</div>
        </div>
    );
};

export default ProjectDetails;
