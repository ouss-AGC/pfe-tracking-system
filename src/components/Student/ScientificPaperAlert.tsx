import React, { useState } from 'react';
import { Award, X, FileText, Globe, BookOpen, AlertCircle, ChevronRight } from 'lucide-react';
import './ScientificPaperAlert.css';

interface ScientificPaperAlertProps {
    onClose?: () => void;
}

const ScientificPaperAlert: React.FC<ScientificPaperAlertProps> = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* The Popping Floating Button */}
            <div
                className={`scientific-floating-badge ${isOpen ? 'hidden' : ''}`}
                onClick={() => setIsOpen(true)}
            >
                <div className="badge-glow"></div>
                <Award size={20} className="badge-icon" />
                <span className="badge-text">MANDATORY: SCIENTIFIC PAPER (ENGLISH)</span>
                <ChevronRight size={16} className="badge-arrow" />
            </div>

            {/* The Detailed Modal */}
            {isOpen && (
                <div className="sci-modal-overlay" onClick={() => setIsOpen(false)}>
                    <div className="sci-modal glass animate-scale-in" onClick={e => e.stopPropagation()}>
                        <button className="sci-close-btn" onClick={() => setIsOpen(false)}>
                            <X size={24} />
                        </button>

                        <div className="sci-modal-header">
                            <div className="sci-header-icon">
                                <FileText size={40} />
                            </div>
                            <h2>Scientific Publication Requirement</h2>
                            <p className="sci-subtitle">Visa for Soutenance Eligibility Condition</p>
                        </div>

                        <div className="sci-modal-content">
                            <div className="sci-requirement-grid">
                                <div className="sci-card language">
                                    <Globe size={24} />
                                    <h4>LANGUAGE</h4>
                                    <p>Strictly <strong>ENGLISH</strong>. High-level academic vocabulary required.</p>
                                </div>
                                <div className="sci-card length">
                                    <FileText size={24} />
                                    <h4>LENGTH</h4>
                                    <p>Minimum <strong>12 Pages</strong> formatted according to standard templates.</p>
                                </div>
                                <div className="sci-card style">
                                    <Award size={24} />
                                    <h4>STYLE</h4>
                                    <p>Follow the "Most Cited Paper" structure in your domain.</p>
                                </div>
                            </div>

                            <div className="sci-structure-section">
                                <h3><BookOpen size={20} /> Mandatory Structure</h3>
                                <ul className="sci-structure-list">
                                    <li><strong>Abstract:</strong> Concise summary of the research.</li>
                                    <li><strong>State of the Art:</strong> Comprehensive literature review.</li>
                                    <li><strong>Experimental Part:</strong> Detailed methodology and setup.</li>
                                    <li><strong>Analytical Part:</strong> Theoretical analysis (if applicable).</li>
                                    <li><strong>Results & Discussion:</strong> Data interpretation and impact.</li>
                                    <li><strong>Conclusion:</strong> High-level synthesis of findings.</li>
                                </ul>
                            </div>

                            <div className="sci-note-box alerte">
                                <AlertCircle size={20} />
                                <p>
                                    <strong>Supervisor's Objective:</strong> These papers will be submitted by the
                                    research group to <strong>top-level scientific journals</strong>.
                                    Quality must be impeccable.
                                </p>
                            </div>
                        </div>

                        <div className="sci-modal-footer">
                            <button className="sci-btn-primary" onClick={() => setIsOpen(false)}>
                                I UNDERSTAND THE REQUIREMENTS
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ScientificPaperAlert;
