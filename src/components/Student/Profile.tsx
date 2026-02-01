import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Save, ArrowLeft, ShieldCheck, Camera, Phone } from 'lucide-react';
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
                        <span className="badge-role">{user?.role === 'student' ? 'Élève Officier' : 'Encadrant'}</span>
                        <p className="matricule">Matricule: {user?.numeroMatricule || 'N/A'}</p>
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
            </div>
        </div>
    );
};

export default Profile;
