import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Check, HelpCircle } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { emailService } from '../../services/emailService';
import { useAuth } from '../../context/AuthContext';
import type { RendezVous } from '../../types';
import './BookingCalendar.css';

const TIME_SLOTS = [
    '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
    '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00'
];

const MOTIFS_PREDEFINIS = [
    "Demande d'explications sur une tâche spécifique",
    "Validation des résultats expérimentaux",
    "Correction de la partie rédaction",
    "Blocage technique / Matériel",
    "Autre motif (Précisez ci-dessous)"
];

const BookingCalendar = () => {
    const { user } = useAuth();
    // Prochaine semaine à partir de aujourd'hui (simulé au 01/02/2026)
    const [selectedDate, setSelectedDate] = useState('2026-02-09');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [selectedMotif, setSelectedMotif] = useState(MOTIFS_PREDEFINIS[0]);
    const [details, setDetails] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [appointments, setAppointments] = useState<RendezVous[]>([]);

    useEffect(() => {
        if (user) {
            setAppointments(storageService.getAppointments().filter(a => a.idEtudiant === user.id));
        }
    }, [user]);

    const handleBooking = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !selectedSlot) return;

        setIsSubmitting(true);
        const userProject = storageService.getProjectByStudent(user.id);

        const newApp: RendezVous = {
            id: `rdv-${Date.now()}`,
            idEtudiant: user.id,
            nomEtudiant: user.nom,
            idProjet: userProject?.id || 'proj-unknown',
            titreProjet: userProject?.titre || 'Projet PFE',
            date: selectedDate,
            creneauHoraire: selectedSlot,
            motif: `${selectedMotif}${details ? ': ' + details : ''}`,
            statut: 'en-attente'
        };

        setTimeout(async () => {
            storageService.addAppointment(newApp);

            // Send Email Notification to Supervisor
            await emailService.sendBookingNotification({
                nomEtudiant: newApp.nomEtudiant,
                titreProjet: newApp.titreProjet,
                date: newApp.date,
                creneauHoraire: newApp.creneauHoraire,
                motif: newApp.motif
            });

            setAppointments(prev => [...prev, newApp]);
            setIsSubmitting(false);
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 3000);
        }, 1200);
    };

    return (
        <div className="booking-page animate-fade-in">
            <header className="page-header">
                <div className="header-info">
                    <span className="welcome-tag">PLANIFICATEUR ACADÉMIQUE 2026</span>
                    <h1>Prendre Rendez-vous</h1>
                    <p>CALENDRIER DISPONIBLE DE FÉVRIER À MAI 2026</p>
                </div>
            </header>

            <div className="booking-grid">
                <div className="booking-form-section glass">
                    <form onSubmit={handleBooking} className="booking-form">
                        <div className="form-group">
                            <label>Date de Consultation (Prochaine semaine au 31 Mai 2026)</label>
                            <div className="date-picker-placeholder glass">
                                <CalendarIcon size={20} />
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    min="2026-02-09"
                                    max="2026-05-31"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Créneau Horaire</label>
                            <div className="slots-grid">
                                {TIME_SLOTS.map(slot => (
                                    <button
                                        key={slot}
                                        type="button"
                                        className={`slot-btn ${selectedSlot === slot ? 'active' : ''}`}
                                        onClick={() => setSelectedSlot(slot)}
                                    >
                                        <Clock size={16} />
                                        <span>{slot}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Motif de la Consultation</label>
                            <select
                                className="motif-select glass"
                                value={selectedMotif}
                                onChange={(e) => setSelectedMotif(e.target.value)}
                            >
                                {MOTIFS_PREDEFINIS.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Détails Supplémentaires (Optionnel)</label>
                            <textarea
                                placeholder="Décrivez votre besoin d'explication..."
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className={`btn btn-primary booking-submit ${isSuccess ? 'success' : ''}`}
                            disabled={!selectedSlot || isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="loader"></div>
                            ) : isSuccess ? (
                                <><Check size={20} /> Demande Envoyée</>
                            ) : (
                                'Demander le Rendez-vous'
                            )}
                        </button>
                    </form>
                </div>

                <div className="booking-history-section">
                    <h2 className="section-subtitle">Mes Rendez-vous</h2>
                    <div className="requests-list">
                        {appointments.length > 0 ? (
                            appointments.map(app => (
                                <div key={app.id} className="request-card glass">
                                    <div className="request-header">
                                        <div className="request-date">
                                            <CalendarIcon size={14} />
                                            <span>{app.date}</span>
                                        </div>
                                        <span className={`status-pill ${app.statut}`}>{app.statut.toUpperCase()}</span>
                                    </div>
                                    <div className="request-body">
                                        <div className="request-time">
                                            <Clock size={14} />
                                            <span>{app.creneauHoraire}</span>
                                        </div>
                                        <div className="request-motif">
                                            <HelpCircle size={14} />
                                            <p>"{app.motif}"</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-history glass">
                                <p>Aucun rendez-vous planifié.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingCalendar;
