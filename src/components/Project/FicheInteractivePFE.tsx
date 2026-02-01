import React from 'react';
import type { ProjetPFE } from '../../types';
import { Shield, MapPin, Calendar, User, FileText } from 'lucide-react';
import './FicheInteractivePFE.css';

interface FicheInteractivePFEProps {
    project: ProjetPFE;
}

const FicheInteractivePFE: React.FC<FicheInteractivePFEProps> = ({ project }) => {
    const today = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="fiche-pfe-container">
            <div className="fiche-pfe-paper">
                {/* Header Officiel */}
                <div className="fiche-header">
                    <div className="republique-header">
                        <p>RÉPUBLIQUE TUNISIENNE</p>
                        <p>MINISTÈRE DE LA DÉFENSE NATIONALE</p>
                        <p>ACADÉMIE MILITAIRE DE TUNISIE</p>
                    </div>
                </div>

                <div className="fiche-content">
                    <div className="fiche-title-box">
                        <h1>FICHE DE PROPOSITION DE SUJET DE PFE</h1>
                        <p className="academic-year">Année Universitaire : 2025 - 2026</p>
                    </div>

                    <section className="fiche-section">
                        <h2 className="section-title"><Shield size={16} /> 1. IDENTIFICATION DU CANDIDAT</h2>
                        <div className="fiche-grid">
                            <div className="grid-item">
                                <label>NOM ET PRÉNOM :</label>
                                <span>{project.nomEtudiant}</span>
                            </div>
                            <div className="grid-item">
                                <label>MATRICULE :</label>
                                <span>PFE-{project.id.split('-')[1]}</span>
                            </div>
                            <div className="grid-item">
                                <label>GÉNIE :</label>
                                <span>Génie Civil</span>
                            </div>
                        </div>
                    </section>

                    <section className="fiche-section">
                        <h2 className="section-title"><FileText size={16} /> 2. INTITULÉ DU SUJET</h2>
                        <div className="sujet-box">
                            <p>{project.titre}</p>
                        </div>
                    </section>

                    <section className="fiche-section">
                        <h2 className="section-title"><User size={16} /> 3. DIRECTION ET ENCADREMENT</h2>
                        <div className="fiche-grid">
                            <div className="grid-item full">
                                <label>ENCADRANT ACADÉMIQUE :</label>
                                <span>{project.nomEncadrant}</span>
                            </div>
                        </div>
                    </section>

                    <section className="fiche-section">
                        <h2 className="section-title"><MapPin size={16} /> 4. DESCRIPTION ET OBJECTIFS</h2>
                        <div className="description-text">
                            <p>{project.description}</p>
                            <p className="placeholder-text">
                                Ce projet s'inscrit dans le cadre des axes de recherche du département de Génie Civil de l'Académie Militaire.
                                Les travaux porteront sur l'analyse expérimentale et la modélisation des phénomènes décrits ci-dessus.
                            </p>
                        </div>
                    </section>

                    <section className="fiche-section">
                        <h2 className="section-title"><Calendar size={16} /> 5. PLANNING PRÉVISIONNEL</h2>
                        <table className="planning-table">
                            <thead>
                                <tr>
                                    <th>Phase</th>
                                    <th>Désignation</th>
                                    <th>Période</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Phase 1</td>
                                    <td>Étude bibliographique et état de l'art</td>
                                    <td>Février 2026</td>
                                </tr>
                                <tr>
                                    <td>Phase 2</td>
                                    <td>Travaux expérimentaux et essais</td>
                                    <td>Mars - Avril 2026</td>
                                </tr>
                                <tr>
                                    <td>Phase 3</td>
                                    <td>Synthèse des résultats et rédaction</td>
                                    <td>Mai 2026</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                </div>

                <div className="fiche-footer">
                    <div className="signature-area">
                        <div className="sig-block">
                            <p className="sig-label">L'ÉLÈVE OFFICIER</p>
                            <p className="sig-name">{project.nomEtudiant}</p>
                        </div>
                        <div className="sig-block centered">
                            <p className="sig-label">FONDÉ À FONDOUK JEDID LE :</p>
                            <p className="sig-date">{today}</p>
                        </div>
                        <div className="sig-block atoui-sig">
                            <p className="sig-label">L'ENCADRANT</p>
                            <p className="sig-name">Dr. Oussama Atoui</p>
                            <img src="/cachet_signature_dr_atoui.png" alt="Cachet Officiel" className="official-seal" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FicheInteractivePFE;
