import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { User, Mail, Save, ArrowLeft, ShieldCheck, Camera, Phone, Download, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [nom, setNom] = useState(user?.nom || '');
    const [email, setEmail] = useState(user?.email || '');
    const [telephone, setTelephone] = useState(user?.telephone || '');
    const [avatar, setAvatar] = useState(user?.avatar || '');
    const [isSaving, setIsSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            updateProfile({ nom, email, telephone, avatar });
            setIsSaving(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }, 800);
    };

    return (
        <div className="profile-page animate-fade-in">
            <header className="page-header">
                <button className="btn-back" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} /> Retour
                </button>
                <h1>Mon Profil Académique</h1>
            </header>

            <div className="profile-container glass">
                <div className="profile-header">
                    <div className="profile-avatar-large">
                        <img src={avatar || '/dr-atoui.jpg'} alt="Avatar" />
                        <label className="btn-change-photo" title="Changer la photo">
                            <Camera size={18} />
                            <input type="file" accept="image/*" onChange={handlePhotoChange} hidden />
                        </label>
                    </div>
                    <div className="profile-title">
                        <h2>{nom}</h2>
                        <span className="badge-role">{user?.role === 'student' ? 'Officier Élève' : 'Encadrant'}</span>
                        <p className="matricule">Matricule: {user?.numeroMatricule || 'N/A'}</p>
                        <a href={`mailto:${email}`} className="profile-email-link" style={{ fontSize: '0.85rem', color: 'var(--color-accent-blue)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <Mail size={14} /> {email}
                        </a>
                    </div>
                </div>

                <form className="profile-form" onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3>Informations Personnelles</h3>
                        <p className="section-desc">Veuillez entrer votre nom complet tel qu'il apparait sur vos documents officiels.</p>

                        <div className="input-group">
                            <label>Nom et Prénom</label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={18} />
                                <input
                                    type="text"
                                    value={nom}
                                    onChange={(e) => setNom(e.target.value)}
                                    placeholder="Ex: Ahmed Ben Salem"
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Adresse Email Académique</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Ex: ahmed.bs@student.tn"
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Numéro de Téléphone (GSM)</label>
                            <div className="input-wrapper">
                                <Phone className="input-icon" size={18} />
                                <input
                                    type="text"
                                    value={telephone}
                                    onChange={(e) => setTelephone(e.target.value)}
                                    placeholder="Ex: 22524322"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" disabled={isSaving}>
                            <Save size={18} /> {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                        </button>
                    </div>

                    {success && (
                        <div className="success-banner animate-slide-up">
                            <ShieldCheck size={20} />
                            <span>Profil mis à jour avec succès.</span>
                        </div>
                    )}
                </form>

                {/* DATA MANAGEMENT SECTION */}
                <div className="data-management-section" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '2rem', paddingTop: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#fff' }}>Gestion des Données (Sauvegarde)</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                        Téléchargez une copie de vos données pour les sécuriser ou les transférer sur un autre appareil.
                    </p>
                    <div className="data-actions" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <button className="btn btn-outline" type="button" onClick={() => {
                            const data = storageService.exportData();
                            const blob = new Blob([data], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `pfe_backup_${new Date().toISOString().split('T')[0]}.json`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                        }}>
                            <Download size={18} /> Sauvegarder
                        </button>

                        <div className="import-wrapper" style={{ position: 'relative' }}>
                            <input
                                type="file"
                                accept=".json"
                                id="import-file"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                        const json = event.target?.result as string;
                                        if (storageService.importData(json)) {
                                            alert('Données restaurées avec succès ! La page va se recharger.');
                                            window.location.reload();
                                        } else {
                                            alert('Erreur lors de la restauration des données. Fichier invalide.');
                                        }
                                    };
                                    reader.readAsText(file);
                                }}
                            />
                            <button className="btn btn-outline" type="button" onClick={() => document.getElementById('import-file')?.click()}>
                                <Upload size={18} /> Restaurer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
