import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { MOCK_APPOINTMENTS } from '../../data/mockProjects';
import { useAuth } from '../../context/AuthContext';
import './BookingCalendar.css';

const TIME_SLOTS = [
    '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
    '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00'
];

const BookingCalendar = () => {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState('2024-02-10');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const studentAppointments = MOCK_APPOINTMENTS.filter(a => a.studentId === user?.id);

    const handleBooking = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 3000);
        }, 1500);
    };

    return (
        <div className="booking-page animate-fade-in">
            <header className="page-header">
                <div className="header-info">
                    <span className="welcome-tag">MEETING SCHEDULER</span>
                    <h1>Book a Supervision Slot</h1>
                    <p>SELECT AN AVAILABLE TIME FOR PROJECT REVIEW WITH YOUR SUPERVISOR</p>
                </div>
            </header>

            <div className="booking-grid">
                <div className="booking-form-section glass">
                    <form onSubmit={handleBooking} className="booking-form">
                        <div className="form-group">
                            <label>Select Date</label>
                            <div className="date-picker-placeholder glass">
                                <CalendarIcon size={20} />
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    min="2024-02-01"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Select Time Slot</label>
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
                            <label>Reason for Meeting</label>
                            <textarea
                                placeholder="Briefly describe what you want to discuss..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                required
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
                                <><Check size={20} /> Request Sent</>
                            ) : (
                                'Request Meeting'
                            )}
                        </button>
                    </form>
                </div>

                <div className="booking-history-section">
                    <h2 className="section-subtitle">Your Requests</h2>
                    <div className="requests-list">
                        {studentAppointments.length > 0 ? (
                            studentAppointments.map(app => (
                                <div key={app.id} className="request-card glass">
                                    <div className="request-header">
                                        <div className="request-date">
                                            <CalendarIcon size={14} />
                                            <span>{app.date}</span>
                                        </div>
                                        <span className={`status-badge ${app.status}`}>{app.status.toUpperCase()}</span>
                                    </div>
                                    <div className="request-body">
                                        <div className="request-time">
                                            <Clock size={14} />
                                            <span>{app.timeSlot}</span>
                                        </div>
                                        <p className="request-reason">"{app.reason}"</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-requests">No pending or previous requests.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingCalendar;
