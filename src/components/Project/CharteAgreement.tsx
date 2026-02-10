import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { ProjetPFE } from '../../types';
import {
    Check, Download, PenTool,
    BookOpen
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './CharteAgreement.css';

interface Props {
    project: ProjetPFE;
    isStudentView?: boolean;
}

const CharteAgreement = ({ project, isStudentView = false }: Props) => {
    const { } = useAuth();
    const charteRef = useRef<HTMLDivElement>(null);
    const [signed, setSigned] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [agreedToRules, setAgreedToRules] = useState(false);

    const rules = [
        "Le projet de fin d’études est un travail personnel à réaliser par le(s) officier(s) élève(s) conformément au cahier de charges formulé par l’encadrant d’une part et ses orientations et conseils d’autre part ;",
        "L’encadrant doit spécifier de manière claire et précise le travail demandé de(s) officier(s) élève(s) sous forme d’un cahier de charges détaillé délivré au(x) officier(s) élève(s) au démarrage du projet d’une part et sous forme d’entretiens périodiques tout au long du projet d’autre part ;",
        "L’avancement du PFE est contrôlé par des entretiens avec le directeur de département de la spécialité selon un calendrier planifié à l’avance par la direction de l’enseignement universitaire. Durant chaque entretien, le(s) officier(s) élève(s) doivent présenter leur journal de suivi de PFE validé par le(s) encadrant(s) ;",
        "Le projet de fin d’études doit être clôturé par un rapport rédigé par le(s) officier(s) élève(s) et faisant la synthèse de l’ensemble des travaux réalisés dans le cadre du projet. Le contenu du rapport doit être lu et validé par le(s) encadrant(s) ;",
        "Le rapport est un travail de synthèse personnel et ne doit en aucun cas contenir du plagiat. A cet effet, le(s) officier(s) élève(s) sont tenus de référencer toute source d’information et de s’engager à n’approprier aucune information ou résultat appartenant à un autre travail sans la moindre notification de sa provenance. L’encadrant est tenu à attirer l’attention de(s) officier(s) élève(s) face à tout dérapage dans ce sens. Le(s) officier(s) élève(s) sont dans l’obligation de délivrer une version électronique du contenu du rapport à la direction de l’enseignement universitaire avec les copies en papier du rapport ;",
        "Les copies en papier du rapport ainsi que la version électronique doivent être remises en nombre et au délai fixés par la direction de l’enseignement universitaire. Aucun retard de remise des rapports n'est accepté sans une justification écrite de(s) encadrant(s) et avisée par le directeur de département de la spécialité."
    ];

    const exportToPDF = async () => {
        if (!charteRef.current) return;
        setExporting(true);

        // Add a class to force high contrast styles
        const element = charteRef.current;
        element.classList.add('pdf-export-mode');

        try {
            const canvas = await html2canvas(element, {
                scale: 3, // Higher scale for maximum clarity
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = 210;
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
            pdf.save(`Charte_PFE_${project.nomEtudiant.replace(/\s+/g, '_')}.pdf`);
        } catch (error) {
            console.error('PDF export failed:', error);
        } finally {
            element.classList.remove('pdf-export-mode');
            setExporting(false);
        }
    };

    return (
        <div className="charte-container">
            <div className="charte-actions-top">
                <button className="btn btn-primary" onClick={exportToPDF} disabled={exporting}>
                    <Download size={18} /> {exporting ? 'Exportation...' : 'Exporter PDF'}
                </button>
            </div>

            <div className="charte-document glass" ref={charteRef}>
                <header className="charte-header">
                    <img src="/logo-military.png" alt="Académie Militaire" className="charte-logo" />
                    <div className="header-text">
                        <div className="institution-names-charte">
                            <p className="inst-ar">الأكاديمية العسكرية بفندق الجديد</p>
                            <p className="inst-fr">ACADÉMIE MILITAIRE DE FONDOUCK JEDID</p>
                        </div>
                        <h1>CHARTE DE RÉALISATION DU PROJET DE FIN D'ÉTUDES</h1>
                        <p className="univ-year">Année Universitaire 2025-2026</p>
                    </div>
                    <div className="charte-header-right">
                        <img src="/pfe-tracker-logo.png" alt="PFE Tracker" className="charte-app-logo" />
                    </div>
                </header>

                <section className="charte-intro">
                    <p>La présente charte décrit les règles en vigueur de réalisation d’un projet de fin d’études à l’Académie Militaire.</p>
                </section>

                <section className="charte-details">
                    <div className="detail-row">
                        <label>Département:</label>
                        <span>Génie Civil (GC)</span>
                    </div>
                    <div className="detail-row">
                        <label>Officier Élève:</label>
                        <span>{project.nomEtudiant}</span>
                    </div>
                    <div className="detail-row">
                        <label>Sujet:</label>
                        <span>{project.titre}</span>
                    </div>
                    <div className="detail-row">
                        <label>Encadrant:</label>
                        <span>{project.nomEncadrant}</span>
                    </div>
                </section>

                <section className="charte-rules">
                    <h3><BookOpen size={18} /> Règles de réalisation</h3>
                    <ul>
                        {rules.map((rule, idx) => (
                            <li key={idx}>{rule}</li>
                        ))}
                    </ul>
                </section>

                <footer className="charte-signatures">
                    <div className="sig-block student">
                        <h4>L'Officier Élève</h4>
                        <div className="sig-area">
                            {isStudentView && !signed ? (
                                <div className="sig-action">
                                    <label className="checkbox-container">
                                        <input
                                            type="checkbox"
                                            checked={agreedToRules}
                                            onChange={(e) => setAgreedToRules(e.target.checked)}
                                        />
                                        <span className="checkmark"></span>
                                        Lu et approuvé
                                    </label>
                                    <button
                                        className="btn btn-sm btn-primary"
                                        disabled={!agreedToRules}
                                        onClick={() => setSigned(true)}
                                    >
                                        <PenTool size={14} /> Signer
                                    </button>
                                </div>
                            ) : (
                                <div className="signed-stamp">
                                    <span className="mention">Lu et approuvé</span>
                                    <span className="name">{project.nomEtudiant}</span>
                                    <span className="date">{new Date().toLocaleDateString('fr-FR')}</span>
                                    {signed && <Check className="check-icon" />}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="sig-block supervisor">
                        <h4>L'Encadrant</h4>
                        <div className="sig-area">
                            <div className="stamp-placeholder">
                                <img src="/stamps/supervisor-stamp.png" alt="Stamp" className="supervisor-stamp-img" />
                                <span className="date">{new Date().toLocaleDateString('fr-FR')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="sig-block director">
                        <h4>Directeur de Département</h4>
                        <div className="sig-area">
                            <div className="director-stamp">
                                <span className="placeholder-stamp">Visa & Cachet</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default CharteAgreement;
