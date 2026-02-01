import { useState } from 'react';
import { storageService } from '../../services/storageService';
import { Calendar, Clock, Check, X, AlertCircle, RefreshCw, MessageCircle } from 'lucide-react';
import './BookingManagement.css';

const BookingManagement = () => {
    const [appointments, setAppointments] = useState(storageService.getAppointments());
    const [delayingId, setDelayingId] = useState<string | null>(null);
    const [delayTime, setDelayTime] = useState('');

    const handleAction = (id: string, statut: 'accepte' | 'annule') => {
        storageService.updateAppointment(id, { statut });
        setAppointments(storageService.getAppointments());
    };

    const handleDelay = (id: string) => {
        const updates = { statut: 'reporte', creneauHoraire: delayTime };
        storageService.updateAppointment(id, updates as any);
        setAppointments(storageService.getAppointments());
        setDelayingId(null);
        setDelayTime('');
    };

    return (
        <div className="booking-page animate-fade-in">
            <header className="page-header">
                <div className="header-info">
                    <span className="welcome-tag">LOGISTIQUE D'ENCADREMENT</span>
                    <h1>Gestion des Rendez-vous</h1>
                    <p>COORDONNEZ LES SESSIONS DE CONSULTATION AVEC LES ÉLÈVES OFFICERS</p>
                </div>
            </header>

            <div className="booking-mgmt-container glass">
                <div className="mgmt-header">
                    <div className="tab-active">Demandes en Attente ({appointments.filter(a => a.statut === 'en-attente').length})</div>
                    <div>Historique</div>
                </div>

                <div className="appointments-table">
                    <div className="table-row header">
                        <div className="col-student">Étudiant</div>
                        <div className="col-project">Projet</div>
                        <div className="col-date">Créneau Demandé</div>
                        <div className="col-reason">Motif / Besoin d'explications</div>
                        <div className="col-actions">Actions</div>
                    </div>

                    {appointments.map(app => (
                        <div key={app.id} className="table-row appointment-row animate-fade-in">
                            <div className="col-student">
                                <div className="student-profile">
                                    <div className="mini-avatar">{app.nomEtudiant[0]}</div>
                                    <span>{app.nomEtudiant}</span>
                                </div>
                            </div>
                            <div className="col-project">
                                <span className="project-ref">{app.titreProjet}</span>
                            </div>
                            <div className="col-date">
                                <div className="time-info">
                                    <Calendar size={14} /> <span>{app.date}</span>
                                </div>
                                <div className="time-info accent">
                                    <Clock size={14} /> <span>{app.creneauHoraire}</span>
                                </div>
                            </div>
                            <div className="col-reason">
                                <div className="reason-container">
                                    <MessageCircle size={14} className="reason-icon" />
                                    <p className="reason-text">{app.motif}</p>
                                </div>
                            </div>
                            <div className="col-actions">
                                {app.statut === 'en-attente' ? (
                                    <div className="action-buttons">
                                        <button
                                            className="action-btn accept"
                                            onClick={() => handleAction(app.id, 'accepte')}
                                            title="Accepter le RDV"
                                        >
                                            <Check size={18} />
                                        </button>
                                        <button
                                            className="action-btn delay"
                                            onClick={() => setDelayingId(app.id)}
                                            title="Proposer de reporter"
                                        >
                                            <RefreshCw size={18} />
                                        </button>
                                        <button
                                            className="action-btn reject"
                                            onClick={() => handleAction(app.id, 'annule')}
                                            title="Refuser"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    <span className={`status-pill ${app.statut}`}>
                                        {app.statut.toUpperCase()}
                                    </span>
                                )}
                            </div>

                            {delayingId === app.id && (
                                <div className="delay-panel glass animate-fade-in">
                                    <AlertCircle size={20} className="alert-icon" />
                                    <div className="delay-content">
                                        <h4>Proposer un Report</h4>
                                        <p>Suggérez un créneau alternatif à l'élève officier.</p>
                                        <div className="delay-form">
                                            <select className="glass" value={delayTime} onChange={(e) => setDelayTime(e.target.value)}>
                                                <option value="">Sélectionner Nouveau Créneau</option>
                                                <option value="08:00 - 09:00">08:00 - 09:00</option>
                                                <option value="11:00 - 12:00">11:00 - 12:00</option>
                                                <option value="15:00 - 16:00">15:00 - 16:00</option>
                                            </select>
                                            <button className="btn btn-primary" onClick={() => handleDelay(app.id)}>Confirmer Report</button>
                                            <button className="btn btn-outline" onClick={() => setDelayingId(null)}>Annuler</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BookingManagement;
