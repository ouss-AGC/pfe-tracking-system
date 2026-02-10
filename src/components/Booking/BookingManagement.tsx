import { useState } from 'react';
import { storageService } from '../../services/storageService';
import {
    Calendar, Clock, Check, X, AlertCircle, RefreshCw, MessageCircle,
    ArrowLeft, ChevronLeft, ChevronRight,
    Users, CalendarDays, Sparkles, Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './BookingManagement.css';

// Semester configuration
const SEMESTER_START = new Date('2026-02-09');
const SEMESTER_END = new Date('2026-05-31');

const BookingManagement = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState(storageService.getAppointments());
    const [delayingId, setDelayingId] = useState<string | null>(null);
    const [delayTime, setDelayTime] = useState('');
    const [hoveredApp, setHoveredApp] = useState<any>(null);
    const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState<string>('all');

    // 7 days including weekends
    const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    // Time slots - reduced on weekends
    const WEEKDAY_SLOTS = ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00'];
    const WEEKEND_SLOTS = ['09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00'];

    // Generate all weeks of the semester
    const getSemesterWeeks = () => {
        const weeks: Array<{
            weekNumber: number;
            startDate: Date;
            endDate: Date;
            month: string;
            monthShort: string;
            dates: Date[];
        }> = [];

        let current = new Date(SEMESTER_START);

        while (current <= SEMESTER_END) {
            const weekStart = new Date(current);
            const weekDates: Date[] = [];

            for (let i = 0; i < 7; i++) {
                const d = new Date(weekStart);
                d.setDate(weekStart.getDate() + i);
                weekDates.push(d);
            }

            weeks.push({
                weekNumber: weeks.length + 1,
                startDate: weekStart,
                endDate: weekDates[6],
                month: weekStart.toLocaleDateString('fr-FR', { month: 'long' }),
                monthShort: weekStart.toLocaleDateString('fr-FR', { month: 'short' }),
                dates: weekDates
            });

            current.setDate(current.getDate() + 7);
        }
        return weeks;
    };

    const semesterWeeks = getSemesterWeeks();
    const currentWeek = semesterWeeks[currentWeekIndex];
    const totalWeeks = semesterWeeks.length;

    // Get unique months for tabs
    const months = [...new Set(semesterWeeks.map(w => w.month))];

    // Filter weeks by selected month
    const getFilteredWeeks = () => {
        if (selectedMonth === 'all') return semesterWeeks;
        return semesterWeeks.filter(w => w.month === selectedMonth);
    };

    // Calculate week occupancy for mini-calendar
    const getWeekOccupancy = (week: typeof semesterWeeks[0]) => {
        const confirmedInWeek = appointments.filter(a => {
            const appDate = new Date(a.date);
            return appDate >= week.startDate && appDate <= week.endDate && a.statut === 'accepte';
        });
        const totalSlots = 5 * 7 + 2 * 3; // 5 weekdays × 7 slots + 2 weekend days × 3 slots
        const occupancy = (confirmedInWeek.length / totalSlots) * 100;
        if (occupancy > 60) return 'high';
        if (occupancy > 30) return 'medium';
        return 'low';
    };

    // Navigate weeks
    const goToPrevWeek = () => {
        if (currentWeekIndex > 0) setCurrentWeekIndex(currentWeekIndex - 1);
    };

    const goToNextWeek = () => {
        if (currentWeekIndex < totalWeeks - 1) setCurrentWeekIndex(currentWeekIndex + 1);
    };

    const jumpToWeek = (index: number) => {
        setCurrentWeekIndex(index);
    };

    // Check slot status
    const getSlotStatus = (date: Date, slot: string) => {
        const dateStr = date.toISOString().split('T')[0];
        const app = appointments.find(a => a.date === dateStr && a.creneauHoraire === slot);
        if (!app) return { status: 'free', app: null };
        return { status: app.statut, app };
    };

    const isHoveredSlot = (date: Date, slot: string) => {
        if (!hoveredApp) return false;
        const dateStr = date.toISOString().split('T')[0];
        return hoveredApp.date === dateStr && hoveredApp.creneauHoraire === slot;
    };

    // Actions
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

    // Statistics
    const stats = {
        total: appointments.length,
        pending: appointments.filter(a => a.statut === 'en-attente').length,
        confirmed: appointments.filter(a => a.statut === 'accepte').length,
        thisWeek: appointments.filter(a => {
            const appDate = new Date(a.date);
            return currentWeek && appDate >= currentWeek.startDate && appDate <= currentWeek.endDate;
        }).length
    };

    return (
        <div className="booking-page semester-view animate-fade-in">
            <header className="page-header">
                <div className="header-info">
                    <button className="btn-back" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} /> Retour
                    </button>
                    <span className="welcome-tag">
                        <Sparkles size={14} /> AGENDA SEMESTRIEL 2026
                    </span>
                    <h1>Gestion des Consultations</h1>
                    <p>FÉVRIER → MAI 2026 • PLANIFICATION AVANCÉE</p>
                </div>
                <div className="header-stats">
                    <div className="stat-pill">
                        <Users size={16} />
                        <span>{stats.total} Total</span>
                    </div>
                    <div className="stat-pill pending">
                        <Clock size={16} />
                        <span>{stats.pending} En attente</span>
                    </div>
                    <div className="stat-pill confirmed">
                        <Check size={16} />
                        <span>{stats.confirmed} Confirmés</span>
                    </div>
                </div>
            </header>

            <div className="semester-layout">
                {/* Collapsible Sidebar - Mini Calendar */}
                <aside className={`semester-sidebar glass ${sidebarOpen ? 'open' : 'collapsed'}`}>
                    <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>

                    {sidebarOpen && (
                        <>
                            <div className="sidebar-header">
                                <CalendarDays size={20} />
                                <h3>Vue Semestre</h3>
                            </div>

                            {/* Month Tabs */}
                            <div className="month-tabs">
                                <button
                                    className={`month-tab ${selectedMonth === 'all' ? 'active' : ''}`}
                                    onClick={() => setSelectedMonth('all')}
                                >
                                    Tout
                                </button>
                                {months.map(month => (
                                    <button
                                        key={month}
                                        className={`month-tab ${selectedMonth === month ? 'active' : ''}`}
                                        onClick={() => setSelectedMonth(month)}
                                    >
                                        {month.charAt(0).toUpperCase() + month.slice(1, 3)}
                                    </button>
                                ))}
                            </div>

                            {/* Mini Calendar Grid */}
                            <div className="mini-calendar">
                                {getFilteredWeeks().map((week) => {
                                    const occupancy = getWeekOccupancy(week);
                                    const isActive = semesterWeeks.indexOf(week) === currentWeekIndex;

                                    return (
                                        <button
                                            key={week.weekNumber}
                                            className={`week-cell ${occupancy} ${isActive ? 'active' : ''}`}
                                            onClick={() => jumpToWeek(semesterWeeks.indexOf(week))}
                                            title={`Semaine ${week.weekNumber}: ${week.startDate.toLocaleDateString('fr-FR')} - ${week.endDate.toLocaleDateString('fr-FR')}`}
                                        >
                                            <span className="week-num">S{week.weekNumber}</span>
                                            <span className="week-range">
                                                {week.startDate.getDate()}-{week.endDate.getDate()}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Legend */}
                            <div className="calendar-legend">
                                <div className="legend-item"><span className="dot low"></span> Disponible</div>
                                <div className="legend-item"><span className="dot medium"></span> Modéré</div>
                                <div className="legend-item"><span className="dot high"></span> Chargé</div>
                            </div>

                            {/* Semester Progress */}
                            <div className="semester-progress">
                                <div className="progress-label">
                                    <Target size={14} />
                                    <span>Progression Semestre</span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${((currentWeekIndex + 1) / totalWeeks) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="progress-text">Semaine {currentWeekIndex + 1} / {totalWeeks}</span>
                            </div>
                        </>
                    )}
                </aside>

                {/* Main Content Area */}
                <div className="main-content-area">
                    {/* Week Navigation Bar */}
                    <div className="week-nav-bar glass">
                        <button
                            className="nav-arrow"
                            onClick={goToPrevWeek}
                            disabled={currentWeekIndex === 0}
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <div className="week-indicator">
                            <span className="week-label">Semaine {currentWeek?.weekNumber}</span>
                            <span className="week-dates">
                                {currentWeek?.startDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                                {' → '}
                                {currentWeek?.endDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                        </div>

                        <button
                            className="nav-arrow"
                            onClick={goToNextWeek}
                            disabled={currentWeekIndex === totalWeeks - 1}
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    {/* Weekly Calendar Grid */}
                    <div className="weekly-grid-container glass">
                        <div className="grid-scroll">
                            <div className="calendar-grid-7days">
                                {/* Header Row */}
                                <div className="grid-header-row">
                                    <div className="time-column-header"></div>
                                    {currentWeek?.dates.map((date, idx) => {
                                        const isWeekend = idx >= 5;
                                        const isToday = date.toDateString() === new Date().toDateString();
                                        return (
                                            <div
                                                key={idx}
                                                className={`day-header ${isWeekend ? 'weekend' : ''} ${isToday ? 'today' : ''}`}
                                            >
                                                <span className="day-name">{DAYS[idx]}</span>
                                                <span className="day-date">{date.getDate()}</span>
                                                {isToday && <span className="today-badge">Aujourd'hui</span>}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Time Slots */}
                                {WEEKDAY_SLOTS.map(slot => (
                                    <div key={slot} className="grid-row">
                                        <div className="time-cell">
                                            <Clock size={12} />
                                            <span>{slot.split(' - ')[0]}</span>
                                        </div>
                                        {currentWeek?.dates.map((date, idx) => {
                                            const isWeekend = idx >= 5;
                                            // Skip afternoon slots on weekends
                                            if (isWeekend && !WEEKEND_SLOTS.includes(slot)) {
                                                return (
                                                    <div key={idx} className="slot-cell unavailable">
                                                        <span className="unavailable-mark">—</span>
                                                    </div>
                                                );
                                            }

                                            const { status, app } = getSlotStatus(date, slot);
                                            const isHovered = isHoveredSlot(date, slot);

                                            return (
                                                <div
                                                    key={idx}
                                                    className={`slot-cell ${status} ${isHovered ? 'highlight' : ''} ${isWeekend ? 'weekend' : ''}`}
                                                    title={app ? `${app.nomEtudiant} - ${app.motif}` : 'Disponible'}
                                                >
                                                    {status === 'accepte' && (
                                                        <div className="slot-content confirmed">
                                                            {app?.avatarEtudiant ? (
                                                                <img src={app.avatarEtudiant} alt="" className="student-initial-img" />
                                                            ) : (
                                                                <span className="student-initial">{app?.nomEtudiant[0]}</span>
                                                            )}
                                                            <Check size={10} className="status-icon" />
                                                        </div>
                                                    )}
                                                    {status === 'en-attente' && (
                                                        <div className="slot-content pending pulse">
                                                            {app?.avatarEtudiant ? (
                                                                <img src={app.avatarEtudiant} alt="" className="student-initial-img" />
                                                            ) : (
                                                                <span className="student-initial">{app?.nomEtudiant[0]}</span>
                                                            )}
                                                            <Clock size={10} className="status-icon" />
                                                        </div>
                                                    )}
                                                    {status === 'reporte' && (
                                                        <div className="slot-content rescheduled">
                                                            {app?.avatarEtudiant ? (
                                                                <img src={app.avatarEtudiant} alt="" className="student-initial-img" />
                                                            ) : (
                                                                <span className="student-initial">{app?.nomEtudiant[0]}</span>
                                                            )}
                                                            <RefreshCw size={10} className="status-icon" />
                                                        </div>
                                                    )}
                                                    {isHovered && <div className="hover-pulse"></div>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Grid Legend */}
                        <div className="grid-legend">
                            <div className="legend-item"><span className="box free"></span> Libre</div>
                            <div className="legend-item"><span className="box confirmed"></span> Confirmé</div>
                            <div className="legend-item"><span className="box pending"></span> En attente</div>
                            <div className="legend-item"><span className="box rescheduled"></span> Reporté</div>
                            <div className="legend-item"><span className="box unavailable"></span> Non disponible</div>
                        </div>
                    </div>

                    {/* Pending Requests Section */}
                    <div className="requests-section glass">
                        <div className="section-header" onClick={() => { }}>
                            <div className="section-title">
                                <AlertCircle size={20} />
                                <h2>Demandes en Attente</h2>
                                <span className="count-badge">{stats.pending}</span>
                            </div>
                        </div>

                        <div className="requests-list">
                            {appointments.filter(a => a.statut === 'en-attente').length === 0 ? (
                                <div className="empty-state">
                                    <Check size={32} />
                                    <p>Aucune demande en attente</p>
                                </div>
                            ) : (
                                appointments.filter(a => a.statut === 'en-attente').map(app => (
                                    <div
                                        key={app.id}
                                        className="request-card animate-slide-up"
                                        onMouseEnter={() => setHoveredApp(app)}
                                        onMouseLeave={() => setHoveredApp(null)}
                                    >
                                        <div className="request-student">
                                            {app.avatarEtudiant ? (
                                                <img src={app.avatarEtudiant} alt={app.nomEtudiant} className="request-avatar" />
                                            ) : (
                                                <div className="avatar">{app.nomEtudiant[0]}</div>
                                            )}
                                            <div className="student-info">
                                                <h4>{app.nomEtudiant}</h4>
                                                <span className="project-title">{app.titreProjet}</span>
                                            </div>
                                        </div>

                                        <div className="request-details">
                                            <div className="detail-item">
                                                <Calendar size={14} />
                                                <span>{new Date(app.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                                            </div>
                                            <div className="detail-item highlight">
                                                <Clock size={14} />
                                                <span>{app.creneauHoraire}</span>
                                            </div>
                                        </div>

                                        <div className="request-motif">
                                            <MessageCircle size={14} />
                                            <p>{app.motif}</p>
                                        </div>

                                        <div className="request-actions">
                                            <button
                                                className="action-btn accept"
                                                onClick={() => handleAction(app.id, 'accepte')}
                                                title="Accepter"
                                            >
                                                <Check size={18} />
                                            </button>
                                            <button
                                                className="action-btn delay"
                                                onClick={() => setDelayingId(app.id)}
                                                title="Reporter"
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

                                        {delayingId === app.id && (
                                            <div className="delay-panel animate-fade-in">
                                                <h4>Proposer un nouveau créneau</h4>
                                                <select value={delayTime} onChange={(e) => setDelayTime(e.target.value)}>
                                                    <option value="">Choisir...</option>
                                                    {WEEKDAY_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                                <div className="delay-actions">
                                                    <button className="btn btn-outline btn-sm" onClick={() => setDelayingId(null)}>Annuler</button>
                                                    <button className="btn btn-primary btn-sm" onClick={() => handleDelay(app.id)}>Confirmer</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingManagement;
