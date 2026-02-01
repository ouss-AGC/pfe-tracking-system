import { useState } from 'react';
import { storageService } from '../../services/storageService';
import { Calendar, Clock, Check, X, AlertCircle, RefreshCw, MessageCircle, Info } from 'lucide-react';
import './BookingManagement.css';

const BookingManagement = () => {
    const [appointments, setAppointments] = useState(storageService.getAppointments());
    const [delayingId, setDelayingId] = useState<string | null>(null);
    const [delayTime, setDelayTime] = useState('');
    const [hoveredApp, setHoveredApp] = useState<any>(null);

    const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const SLOTS = ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00'];

    // Calcul des dates de la semaine actuelle
    const getWeekDates = () => {
        const now = new Date();
        const day = now.getDay(); // 0 (Sun) to 6 (Sat)
        const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
        const monday = new Date(now.setDate(diff));

        return DAYS.map((_, i) => {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
        });
    };

    const weekDates = getWeekDates();
    const currentYear = new Date().getFullYear();

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

    // Créneaux occupés
    const confirmedApps = appointments.filter(a => a.statut === 'accepte');

    const getDayFromDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[date.getDay()];
    };

    const isSlotOccupied = (day: string, slot: string) => {
        return confirmedApps.find(a => getDayFromDate(a.date) === day && a.creneauHoraire === slot);
    };

    const isHoveredSlot = (day: string, slot: string) => {
        if (!hoveredApp) return false;
        return getDayFromDate(hoveredApp.date) === day && hoveredApp.creneauHoraire === slot;
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

                        {appointments.filter(a => a.statut === 'en-attente').map(app => (
                            <div
                                key={app.id}
                                className="table-row appointment-row animate-fade-in"
                                onMouseEnter={() => setHoveredApp(app)}
                                onMouseLeave={() => setHoveredApp(null)}
                            >
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

                {/* Calendrier Graphique (Teams Style) */}
                <aside className="booking-decision-helper glass animate-slide-in-right">
                    <div className="helper-header">
                        <Calendar size={18} />
                        <div>
                            <h3>AGENDA SEMAINE</h3>
                            <span className="week-range">Février {currentYear}</span>
                        </div>
                    </div>

                    <div className="calendar-grid-container">
                        <div className="grid-header-row">
                            <div className="slot-label-empty"></div>
                            {DAYS.map((d, i) => (
                                <div key={d} className="day-label">
                                    <span className="d-name">{d}</span>
                                    <span className="d-date">{weekDates[i]}</span>
                                </div>
                            ))}
                        </div>

                        {SLOTS.map(slot => (
                            <div key={slot} className="grid-row">
                                <div className="slot-time-label">{slot.split(' ')[0]}</div>
                                {DAYS.map(day => {
                                    const occupiedBy = isSlotOccupied(day, slot);
                                    const isHovered = isHoveredSlot(day, slot);

                                    return (
                                        <div
                                            key={`${day}-${slot}`}
                                            className={`grid-cell ${occupiedBy ? 'occupied' : ''} ${isHovered ? 'highlight-hover' : ''}`}
                                            title={occupiedBy ? `Occupé par ${occupiedBy.nomEtudiant}` : 'Libre'}
                                        >
                                            {occupiedBy && <span className="occ-name">{occupiedBy.nomEtudiant[0]}</span>}
                                            {isHovered && <div className="pulse-spot"></div>}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    <div className="decision-legend-refined">
                        <div className="leg-item"><span className="box confirmed"></span> Confirmé</div>
                        <div className="leg-item"><span className="box requested pulse-anim"></span> Demande survolée</div>
                    </div>

                    <div className="helper-tip">
                        <Info size={14} />
                        <p>Survolez une demande à gauche pour visualiser l'impact sur votre agenda.</p>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default BookingManagement;
