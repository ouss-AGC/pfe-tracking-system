import { useState } from 'react';
import { storageService } from '../../services/storageService';
import { Calendar, Clock, Check, X, AlertCircle, RefreshCw, MessageCircle } from 'lucide-react';
import './BookingManagement.css';

const BookingManagement = () => {
    const [appointments, setAppointments] = useState(storageService.getAppointments());
    const [delayingId, setDelayingId] = useState<string | null>(null);
    const [delayTime, setDelayTime] = useState('');

    const handleAction = (id: string, statut: 'accepte' | 'annule') => {
        const app = appointments.find(a => a.id === id);
        storageService.updateAppointment(id, { statut });

        if (app) {
            storageService.addNotification({
                id: `note-${Date.now()}`,
                type: statut === 'accepte' ? 'success' : 'error',
                message: `Votre demande de RDV du ${app.date} a été ${statut === 'accepte' ? 'acceptée' : 'refusée'}.`,
                date: new Date().toISOString(),
                idEtudiant: app.idEtudiant
            });
        }

        setAppointments(storageService.getAppointments());
    };

    const handleDelay = (id: string) => {
        const app = appointments.find(a => a.id === id);
        const updates = { statut: 'reporte', creneauHoraire: delayTime };
        storageService.updateAppointment(id, updates as any);

        if (app) {
            storageService.addNotification({
                id: `note-${Date.now()}`,
                type: 'warning',
                message: `L'encadrant propose de reporter votre RDV du ${app.date} à ${delayTime}.`,
                date: new Date().toISOString(),
                idEtudiant: app.idEtudiant
            });
        }

        setAppointments(storageService.getAppointments());
        setDelayingId(null);
        setDelayTime('');
    };

    // Créneaux occupés pour le calendrier aide-mémoire
    const occupiedSlots = appointments
        .filter(a => a.statut === 'accepte')
        .map(a => `${a.date} | ${a.creneauHoraire}`);

    return (
        <div className="booking-page animate-fade-in">
            <header className="page-header">
                <div className="header-info">
                    <span className="welcome-tag">LOGISTIQUE D'ENCADREMENT</span>
                    <h1>Gestion des Rendez-vous</h1>
                    <p>COORDONNEZ LES SESSIONS DE CONSULTATION AVEC LES ÉLÈVES OFFICERS</p>
                </div>
            </header>

            <div className="booking-mgmt-layout">
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
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Volet Calendrier Aide-à-la-Décision */}
            <aside className="booking-decision-helper glass animate-slide-in-right">
                <div className="helper-header">
                    <Calendar size={18} />
                    <h3>AIDE À LA DÉCISION</h3>
                </div>
                <div className="helper-body">
                    <p className="helper-hint">Consultez vos créneaux déjà validés avant de confirmer une nouvelle demande.</p>
                    <div className="occupied-list">
                        <h4>CRÉNEAUX OCCUPÉS</h4>
                        {occupiedSlots.length > 0 ? (
                            occupiedSlots.map((slot, idx) => (
                                <div key={idx} className="occupied-item">
                                    <Clock size={12} />
                                    <span>{slot}</span>
                                </div>
                            ))
                        ) : (
                            <p className="empty-msg">Aucun engagement pour le moment.</p>
                        )}
                    </div>
                    <div className="decision-legend">
                        <div className="legend-item"><span className="dot accept"></span> Accepté</div>
                        <div className="legend-item"><span className="dot pending"></span> En attente</div>
                    </div>
                </div>
            </aside>
        </div>
        </div >
    );
};

export default BookingManagement;
