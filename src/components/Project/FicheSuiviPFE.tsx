import { useState, useEffect, useRef } from 'react';
import { storageService } from '../../services/storageService';
import type { FicheSuiviPFEData, RendezVousFiche, ProjetPFE } from '../../types';
import { RDV_SCHEDULE_2026 } from '../../types';
import {
    Calendar, Check, ChevronDown, ChevronUp,
    Stamp, Download, User, BookOpen, Award, Shield
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './FicheSuiviPFE.css';

interface Props {
    project: ProjetPFE;
    isStudentView?: boolean;
}

const FicheSuiviPFE = ({ project, isStudentView = false }: Props) => {
    const formRef = useRef<HTMLDivElement>(null);
    const [fiche, setFiche] = useState<FicheSuiviPFEData | null>(null);
    const [expandedRDV, setExpandedRDV] = useState<number | null>(null);
    const [exporting, setExporting] = useState(false);

    // Initialize or load fiche
    useEffect(() => {
        let existingFiche = storageService.getFicheSuivi(project.id);

        if (!existingFiche) {
            // Create new fiche with 6 RDVs
            const newFiche: FicheSuiviPFEData = {
                id: `fiche-${project.id}`,
                projectId: project.id,
                studentId: project.idEtudiant,
                studentName: project.nomEtudiant,
                supervisorName: project.nomEncadrant,
                projectTitle: project.titre,
                pfeNumber: `2026-GC-${project.id.split('-')[1] || '001'}`,
                year: '2025-2026',
                rendezVous: RDV_SCHEDULE_2026.map(rdv => ({
                    numero: rdv.numero,
                    weekOf: rdv.weekOf,
                    status: 'pending' as const,
                    studentInput: {
                        travailRealise: '',
                        difficultes: '',
                        signature: false
                    },
                    supervisorInput: {
                        avisAvancement: '' as const,
                        etapeSuivante: '',
                        signature: false,
                        stampApplied: false
                    },
                    visaDirecteur: false
                })),
                evaluationFinale: {
                    evaluationTravail: '',
                    evaluationRapport: '',
                    avisSoutenabilite: '',
                    supervisorSignature: false,
                    supervisorStamp: false
                },
                deadlineRapport: '2026-06-01',
                dateSoutenance: '2026-06-08',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            storageService.saveFicheSuivi(newFiche);
            existingFiche = newFiche;
        }

        setFiche(existingFiche);

        // Auto-expand current RDV
        const today = new Date();
        const currentRDV = existingFiche.rendezVous.find((rdv: RendezVousFiche) => {
            const rdvDate = new Date(rdv.weekOf);
            const rdvEnd = new Date(rdvDate);
            rdvEnd.setDate(rdvEnd.getDate() + 6);
            return today >= rdvDate && today <= rdvEnd;
        });
        if (currentRDV) {
            setExpandedRDV(currentRDV.numero);
        }
    }, [project]);

    const updateRDV = (numero: number, updates: Partial<RendezVousFiche>) => {
        if (!fiche) return;

        const updatedFiche = {
            ...fiche,
            rendezVous: fiche.rendezVous.map(rdv =>
                rdv.numero === numero ? { ...rdv, ...updates } : rdv
            ),
            updatedAt: new Date().toISOString()
        };

        setFiche(updatedFiche);
        storageService.saveFicheSuivi(updatedFiche);
    };

    const updateStudentInput = (numero: number, field: string, value: string | boolean) => {
        if (!fiche) return;
        const rdv = fiche.rendezVous.find(r => r.numero === numero);
        if (!rdv) return;

        updateRDV(numero, {
            studentInput: { ...rdv.studentInput, [field]: value },
            status: 'in-progress'
        });
    };

    const updateSupervisorInput = (numero: number, field: string, value: string | boolean) => {
        if (!fiche) return;
        const rdv = fiche.rendezVous.find(r => r.numero === numero);
        if (!rdv) return;

        updateRDV(numero, {
            supervisorInput: { ...rdv.supervisorInput, [field]: value }
        });
    };

    const applyStamp = (numero: number) => {
        if (!fiche) return;
        const rdv = fiche.rendezVous.find(r => r.numero === numero);
        if (!rdv) return;

        updateRDV(numero, {
            supervisorInput: {
                ...rdv.supervisorInput,
                stampApplied: true,
                signature: true,
                signatureDate: new Date().toISOString()
            },
            status: 'completed'
        });

        // Add notification to student
        storageService.addNotification({
            id: `note-${Date.now()}`,
            type: 'success',
            message: `RDV N°${numero} validé par l'encadrant. Prochaine étape: ${rdv.supervisorInput.etapeSuivante || 'À définir'}`,
            date: new Date().toISOString(),
            idEtudiant: fiche.studentId
        });
    };

    const signStudent = (numero: number) => {
        if (!fiche) return;
        const rdv = fiche.rendezVous.find(r => r.numero === numero);
        if (!rdv) return;

        updateRDV(numero, {
            studentInput: {
                ...rdv.studentInput,
                signature: true,
                signatureDate: new Date().toISOString()
            }
        });
    };

    const exportToPDF = async () => {
        if (!formRef.current || !fiche) return;

        setExporting(true);
        try {
            const canvas = await html2canvas(formRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const pageHeight = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`Fiche_Suivi_PFE_${fiche.studentName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error('PDF export failed:', error);
        } finally {
            setExporting(false);
        }
    };

    const getRDVStatus = (rdv: RendezVousFiche) => {
        const today = new Date();
        const rdvDate = new Date(rdv.weekOf);
        const rdvEnd = new Date(rdvDate);
        rdvEnd.setDate(rdvEnd.getDate() + 6);

        if ((rdv.status as string) === 'completed') return { label: 'Complété', color: 'success' };
        if (today > rdvEnd && (rdv.status as string) !== 'completed') return { label: 'En retard', color: 'danger' };
        if (today >= rdvDate && today <= rdvEnd) return { label: 'En cours', color: 'warning' };
        return { label: 'À venir', color: 'pending' };
    };

    const getCompletedCount = () => {
        if (!fiche) return 0;
        return fiche.rendezVous.filter(r => r.status === 'completed').length;
    };

    if (!fiche) return <div className="loading">Chargement de la fiche...</div>;

    return (
        <div className="fiche-suivi-container">
            {/* Header Actions */}
            <div className="fiche-actions-bar">
                <div className="progress-indicator">
                    <span className="progress-label">Progression:</span>
                    <div className="progress-dots">
                        {fiche.rendezVous.map(rdv => (
                            <div
                                key={rdv.numero}
                                className={`dot ${getRDVStatus(rdv).color}`}
                                title={`RDV ${rdv.numero}: ${getRDVStatus(rdv).label}`}
                            />
                        ))}
                    </div>
                    <span className="progress-count">{getCompletedCount()}/6</span>
                </div>
                <button
                    className="btn btn-primary export-btn"
                    onClick={exportToPDF}
                    disabled={exporting}
                >
                    <Download size={18} />
                    {exporting ? 'Exportation...' : 'Exporter PDF'}
                </button>
            </div>

            {/* Main Form - For PDF Export */}
            <div className="fiche-suivi-form" ref={formRef}>
                {/* Official Header */}
                <header className="fiche-header">
                    <div className="header-logo">
                        <img src="/logo-am.png" alt="Académie Militaire" className="am-logo" />
                    </div>
                    <div className="header-title">
                        <h1>FICHE DE SUIVI DE PROJET DE FIN D'ÉTUDES</h1>
                        <p className="ref-number">ENQ-REF-32 • Année Universitaire {fiche.year}</p>
                    </div>
                    <div className="header-badge">
                        <Shield size={32} />
                        <span>N° {fiche.pfeNumber}</span>
                    </div>
                </header>

                {/* Student Info */}
                <section className="info-section">
                    <div className="info-grid">
                        <div className="info-item">
                            <label>Officier Élève</label>
                            <span>{fiche.studentName}</span>
                        </div>
                        <div className="info-item">
                            <label>Encadrant</label>
                            <span>{fiche.supervisorName}</span>
                        </div>
                        <div className="info-item full-width">
                            <label>Sujet du PFE</label>
                            <span>{fiche.projectTitle}</span>
                        </div>
                    </div>
                    <div className="deadline-banner">
                        <div className="deadline-item">
                            <Calendar size={16} />
                            <span>Remise des rapports: <strong>{new Date(fiche.deadlineRapport).toLocaleDateString('fr-FR')}</strong></span>
                        </div>
                        <div className="deadline-item">
                            <Award size={16} />
                            <span>Soutenance: <strong>Semaine du {new Date(fiche.dateSoutenance).toLocaleDateString('fr-FR')}</strong></span>
                        </div>
                    </div>
                </section>

                {/* RDV Timeline */}
                <section className="rdv-timeline-section">
                    <h2 className="section-title">
                        <BookOpen size={20} />
                        Calendrier des Rendez-vous Obligatoires
                    </h2>

                    <div className="rdv-timeline">
                        {fiche.rendezVous.map((rdv, index) => {
                            const status = getRDVStatus(rdv);
                            const isExpanded = expandedRDV === rdv.numero;
                            const rdvLabel = RDV_SCHEDULE_2026.find(r => r.numero === rdv.numero)?.label;

                            return (
                                <div key={rdv.numero} className={`rdv-card ${status.color} ${isExpanded ? 'expanded' : ''}`}>
                                    <div
                                        className="rdv-header"
                                        onClick={() => setExpandedRDV(isExpanded ? null : rdv.numero)}
                                    >
                                        <div className="rdv-number">
                                            <span>RDV N°{rdv.numero}</span>
                                        </div>
                                        <div className="rdv-date">
                                            <Calendar size={14} />
                                            <span>{rdvLabel}</span>
                                        </div>
                                        <div className={`rdv-status-badge ${status.color}`}>
                                            {status.label}
                                        </div>
                                        <button className="expand-btn">
                                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </button>
                                    </div>

                                    {isExpanded && (
                                        <div className="rdv-content">
                                            {/* Student Section */}
                                            <div className="input-section student-section">
                                                <h4><User size={16} /> Réservé à l'Officier Élève</h4>

                                                <div className="form-group">
                                                    <label>Travail réalisé depuis le dernier RDV</label>
                                                    <textarea
                                                        value={rdv.studentInput.travailRealise}
                                                        onChange={(e) => updateStudentInput(rdv.numero, 'travailRealise', e.target.value)}
                                                        placeholder="Décrivez le travail accompli..."
                                                        disabled={!isStudentView || rdv.studentInput.signature}
                                                        rows={3}
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label>Difficultés rencontrées</label>
                                                    <textarea
                                                        value={rdv.studentInput.difficultes}
                                                        onChange={(e) => updateStudentInput(rdv.numero, 'difficultes', e.target.value)}
                                                        placeholder="Décrivez les difficultés..."
                                                        disabled={!isStudentView || rdv.studentInput.signature}
                                                        rows={2}
                                                    />
                                                </div>

                                                <div className="signature-row">
                                                    {rdv.studentInput.signature ? (
                                                        <div className="signed-indicator">
                                                            <Check size={16} />
                                                            <span>Signé le {rdv.studentInput.signatureDate ? new Date(rdv.studentInput.signatureDate).toLocaleDateString('fr-FR') : ''}</span>
                                                        </div>
                                                    ) : isStudentView ? (
                                                        <button
                                                            className="btn btn-outline sign-btn"
                                                            onClick={() => signStudent(rdv.numero)}
                                                            disabled={!rdv.studentInput.travailRealise}
                                                        >
                                                            <Check size={16} /> Signer
                                                        </button>
                                                    ) : (
                                                        <span className="pending-signature">En attente de signature étudiant</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Supervisor Section */}
                                            <div className="input-section supervisor-section">
                                                <h4><Shield size={16} /> Réservé à l'Encadrant</h4>

                                                <div className="form-group">
                                                    <label>Avis sur l'avancement</label>
                                                    <select
                                                        value={rdv.supervisorInput.avisAvancement}
                                                        onChange={(e) => updateSupervisorInput(rdv.numero, 'avisAvancement', e.target.value)}
                                                        disabled={isStudentView || rdv.supervisorInput.stampApplied}
                                                    >
                                                        <option value="">-- Sélectionner --</option>
                                                        <option value="excellent">Excellent</option>
                                                        <option value="satisfaisant">Satisfaisant</option>
                                                        <option value="insuffisant">Insuffisant</option>
                                                    </select>
                                                </div>

                                                <div className="form-group">
                                                    <label>Étape suivante</label>
                                                    <textarea
                                                        value={rdv.supervisorInput.etapeSuivante}
                                                        onChange={(e) => updateSupervisorInput(rdv.numero, 'etapeSuivante', e.target.value)}
                                                        placeholder="Décrivez la prochaine étape..."
                                                        disabled={isStudentView || rdv.supervisorInput.stampApplied}
                                                        rows={2}
                                                    />
                                                </div>

                                                <div className="signature-row supervisor">
                                                    {rdv.supervisorInput.stampApplied ? (
                                                        <div className="stamp-applied">
                                                            <img src="/stamps/supervisor-stamp.png" alt="Cachet Encadrant" className="stamp-image" />
                                                            <span className="stamp-date">
                                                                Validé le {rdv.supervisorInput.signatureDate ? new Date(rdv.supervisorInput.signatureDate).toLocaleDateString('fr-FR') : ''}
                                                            </span>
                                                        </div>
                                                    ) : !isStudentView ? (
                                                        <button
                                                            className="btn btn-primary stamp-btn"
                                                            onClick={() => applyStamp(rdv.numero)}
                                                            disabled={!rdv.supervisorInput.avisAvancement || !rdv.studentInput.signature}
                                                        >
                                                            <Stamp size={18} /> Appliquer Cachet et Valider
                                                        </button>
                                                    ) : (
                                                        <span className="pending-signature">En attente de validation encadrant</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Connection line to next RDV */}
                                    {index < 5 && <div className="timeline-connector" />}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Final Evaluation - Only show after RDV 6 */}
                {fiche.rendezVous[5]?.status === 'completed' && (
                    <section className="evaluation-section">
                        <h2 className="section-title">
                            <Award size={20} />
                            Évaluation Finale du PFE
                        </h2>

                        <div className="evaluation-grid">
                            <div className="eval-item">
                                <label>Évaluation du travail réalisé</label>
                                <select
                                    value={fiche.evaluationFinale.evaluationTravail}
                                    onChange={(e) => {
                                        const updated = {
                                            ...fiche,
                                            evaluationFinale: { ...fiche.evaluationFinale, evaluationTravail: e.target.value as any }
                                        };
                                        setFiche(updated);
                                        storageService.saveFicheSuivi(updated);
                                    }}
                                    disabled={isStudentView}
                                >
                                    <option value="">-- Sélectionner --</option>
                                    <option value="excellent">Excellent</option>
                                    <option value="bien">Bien</option>
                                    <option value="moyen">Moyen</option>
                                    <option value="insuffisant">Insuffisant</option>
                                </select>
                            </div>

                            <div className="eval-item">
                                <label>Évaluation du rapport</label>
                                <select
                                    value={fiche.evaluationFinale.evaluationRapport}
                                    onChange={(e) => {
                                        const updated = {
                                            ...fiche,
                                            evaluationFinale: { ...fiche.evaluationFinale, evaluationRapport: e.target.value as any }
                                        };
                                        setFiche(updated);
                                        storageService.saveFicheSuivi(updated);
                                    }}
                                    disabled={isStudentView}
                                >
                                    <option value="">-- Sélectionner --</option>
                                    <option value="excellent">Excellent</option>
                                    <option value="bien">Bien</option>
                                    <option value="moyen">Moyen</option>
                                    <option value="insuffisant">Insuffisant</option>
                                </select>
                            </div>

                            <div className="eval-item">
                                <label>Avis sur la soutenabilité</label>
                                <select
                                    value={fiche.evaluationFinale.avisSoutenabilite}
                                    onChange={(e) => {
                                        const updated = {
                                            ...fiche,
                                            evaluationFinale: { ...fiche.evaluationFinale, avisSoutenabilite: e.target.value as any }
                                        };
                                        setFiche(updated);
                                        storageService.saveFicheSuivi(updated);
                                    }}
                                    disabled={isStudentView}
                                >
                                    <option value="">-- Sélectionner --</option>
                                    <option value="favorable">Favorable</option>
                                    <option value="reserve">Réservé</option>
                                    <option value="defavorable">Défavorable</option>
                                </select>
                            </div>
                        </div>

                        {!isStudentView && fiche.evaluationFinale.evaluationTravail && (
                            <div className="final-stamp-section">
                                {fiche.evaluationFinale.supervisorStamp ? (
                                    <div className="stamp-applied final">
                                        <img src="/stamps/supervisor-stamp.png" alt="Cachet Final" className="stamp-image large" />
                                        <span>Évaluation finale validée</span>
                                    </div>
                                ) : (
                                    <button
                                        className="btn btn-primary stamp-btn large"
                                        onClick={() => {
                                            const updated = {
                                                ...fiche,
                                                evaluationFinale: {
                                                    ...fiche.evaluationFinale,
                                                    supervisorSignature: true,
                                                    supervisorStamp: true,
                                                    date: new Date().toISOString()
                                                }
                                            };
                                            setFiche(updated);
                                            storageService.saveFicheSuivi(updated);
                                        }}
                                    >
                                        <Stamp size={20} /> Valider l'Évaluation Finale
                                    </button>
                                )}
                            </div>
                        )}
                    </section>
                )}

                {/* Footer */}
                <footer className="fiche-footer">
                    <p>Cette fiche est approuvée par la direction de l'enseignement universitaire concernant les procédures d'encadrement.</p>
                    <p className="footer-date">Document généré le {new Date().toLocaleDateString('fr-FR')}</p>
                </footer>
            </div>
        </div>
    );
};

export default FicheSuiviPFE;
