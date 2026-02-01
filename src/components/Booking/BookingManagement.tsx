import { useState } from 'react';
import { MOCK_APPOINTMENTS } from '../../data/mockProjects';
import { Calendar, Clock, Check, X, User, AlertCircle, RefreshCw } from 'lucide-react';
import './BookingManagement.css';

const BookingManagement = () => {
    const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
    const [delayingId, setDelayingId] = useState<string | null>(null);
    const [delayTime, setDelayTime] = useState('');

    const handleAction = (id: string, status: 'accepted' | 'cancelled') => {
        setAppointments(prev => prev.map(app =>
            app.id === id ? { ...app, status } : app
        ));
    };

    const handleDelay = (id: string) => {
        setAppointments(prev => prev.map(app =>
            app.id === id ? { ...app, status: 'delayed', timeSlot: delayTime || app.timeSlot } : app
        ));
        setDelayingId(null);
        setDelayTime('');
    };

    return (
        <div className="booking-page animate-fade-in">
            <header className="page-header">
                <div className="header-info">
                    <span className="welcome-tag">COMMANDER'S LOG</span>
                    <h1>Meeting Requests</h1>
                    <p>MANAGE AND COORDINATE STUDENT SUPERVISION SESSIONS</p>
                </div>
            </header>

            <div className="booking-mgmt-container glass">
                <div className="mgmt-header">
                    <div className="tab-active">Pending Requests ({appointments.filter(a => a.status === 'pending').length})</div>
                    <div>History</div>
                </div>

                <div className="appointments-table">
                    <div className="table-row header">
                        <div className="col-student">Student</div>
                        <div className="col-project">Project Reference</div>
                        <div className="col-date">Requested Time</div>
                        <div className="col-reason">Reason</div>
                        <div className="col-actions">Actions</div>
                    </div>

                    {appointments.map(app => (
                        <div key={app.id} className="table-row appointment-row animate-fade-in">
                            <div className="col-student">
                                <div className="student-profile">
                                    <div className="mini-avatar">{app.studentName[0]}</div>
                                    <span>{app.studentName}</span>
                                </div>
                            </div>
                            <div className="col-project">
                                <span className="project-ref">{app.projectTitle}</span>
                            </div>
                            <div className="col-date">
                                <div className="time-info">
                                    <Calendar size={14} /> <span>{app.date}</span>
                                </div>
                                <div className="time-info accent">
                                    <Clock size={14} /> <span>{app.timeSlot}</span>
                                </div>
                            </div>
                            <div className="col-reason">
                                <p className="reason-text">"{app.reason}"</p>
                            </div>
                            <div className="col-actions">
                                {app.status === 'pending' ? (
                                    <div className="action-buttons">
                                        <button
                                            className="action-btn accept"
                                            onClick={() => handleAction(app.id, 'accepted')}
                                            title="Accept Meeting"
                                        >
                                            <Check size={18} />
                                        </button>
                                        <button
                                            className="action-btn delay"
                                            onClick={() => setDelayingId(app.id)}
                                            title="Propose Delay"
                                        >
                                            <RefreshCw size={18} />
                                        </button>
                                        <button
                                            className="action-btn reject"
                                            onClick={() => handleAction(app.id, 'cancelled')}
                                            title="Reject Request"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    <span className={`status-pill ${app.status}`}>
                                        {app.status.toUpperCase()}
                                    </span>
                                )}
                            </div>

                            {delayingId === app.id && (
                                <div className="delay-panel glass animate-fade-in">
                                    <AlertCircle size={20} className="alert-icon" />
                                    <div className="delay-content">
                                        <h4>Propose Reschedule</h4>
                                        <p>Suggest an alternative time slot for this student.</p>
                                        <div className="delay-form">
                                            <select value={delayTime} onChange={(e) => setDelayTime(e.target.value)}>
                                                <option value="">Select New Slot</option>
                                                <option value="08:00 - 09:00">08:00 - 09:00</option>
                                                <option value="11:00 - 12:00">11:00 - 12:00</option>
                                                <option value="15:00 - 16:00">15:00 - 16:00</option>
                                            </select>
                                            <button className="btn btn-primary" onClick={() => handleDelay(app.id)}>Confirm Delay</button>
                                            <button className="btn btn-outline" onClick={() => setDelayingId(null)}>Cancel</button>
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
