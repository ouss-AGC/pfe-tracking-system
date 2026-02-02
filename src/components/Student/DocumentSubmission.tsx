import { useState } from 'react';
import { storageService } from '../../services/storageService';
import type { DocumentPFE } from '../../types';
import { FileText, Link as LinkIcon, Trash2, ExternalLink, Plus } from 'lucide-react';
import './DocumentSubmission.css';

interface DocumentSubmissionProps {
    projectId: string;
}

const DocumentSubmission = ({ projectId }: DocumentSubmissionProps) => {
    const [documents, setDocuments] = useState<DocumentPFE[]>(
        storageService.getDocumentsByProject(projectId)
    );
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        type: 'rapport' as 'rapport' | 'presentation' | 'annexe' | 'autre'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.url) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        const newDoc = storageService.addDocumentToProject(projectId, formData);
        if (newDoc) {
            setDocuments(storageService.getDocumentsByProject(projectId));
            setFormData({ name: '', url: '', type: 'rapport' });
            setShowForm(false);
        }
    };

    const handleDelete = (docId: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
            storageService.deleteDocumentFromProject(projectId, docId);
            setDocuments(storageService.getDocumentsByProject(projectId));
        }
    };

    return (
        <div className="document-submission-container">
            <div className="section-header">
                <div className="header-title">
                    <FileText size={20} />
                    <h3>Mes Documents Déposés</h3>
                </div>
                <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowForm(!showForm)}
                >
                    <Plus size={16} />
                    {showForm ? 'Annuler' : 'Ajouter un Lien'}
                </button>
            </div>

            {showForm && (
                <form className="document-form glass" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nom du Document</label>
                        <input
                            type="text"
                            placeholder="Ex: Rapport d'avancement Janvier 2026"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            <LinkIcon size={16} />
                            Lien Google Drive (ou autre cloud)
                        </label>
                        <input
                            type="url"
                            placeholder="https://drive.google.com/file/d/..."
                            value={formData.url}
                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                            required
                        />
                        <small className="form-hint">
                            💡 Assurez-vous que le lien est accessible (partage activé)
                        </small>
                    </div>

                    <div className="form-group">
                        <label>Type de Document</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                        >
                            <option value="rapport">Rapport</option>
                            <option value="presentation">Présentation</option>
                            <option value="annexe">Annexe</option>
                            <option value="autre">Autre</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary">
                        <Plus size={18} />
                        Ajouter le Document
                    </button>
                </form>
            )}

            <div className="documents-list">
                {documents.length === 0 ? (
                    <div className="empty-state glass">
                        <FileText size={48} className="empty-icon" />
                        <p>Aucun document déposé pour le moment</p>
                        <small>Cliquez sur "Ajouter un Lien" pour partager vos documents</small>
                    </div>
                ) : (
                    documents.map(doc => (
                        <div key={doc.id} className="document-item glass">
                            <div className="doc-icon">
                                <FileText size={24} />
                            </div>
                            <div className="doc-info">
                                <h4>{doc.name}</h4>
                                <div className="doc-meta">
                                    <span className="doc-type">{doc.type.toUpperCase()}</span>
                                    <span className="doc-date">{new Date(doc.date).toLocaleDateString('fr-FR')}</span>
                                </div>
                            </div>
                            <div className="doc-actions">
                                <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline btn-sm"
                                    title="Ouvrir le lien"
                                >
                                    <ExternalLink size={16} />
                                </a>
                                <button
                                    className="btn btn-outline btn-sm btn-danger"
                                    onClick={() => handleDelete(doc.id)}
                                    title="Supprimer"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DocumentSubmission;
