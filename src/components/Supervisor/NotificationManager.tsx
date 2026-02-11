import { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { Send, Trash2, Bell, X, Clock } from 'lucide-react';
import './NotificationManager.css';

const NotificationManager = ({ onClose }: { onClose: () => void }) => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'info' | 'alerte' | 'urgent'>('info');

    useEffect(() => {
        setNotifications(storageService.getNotifications());
    }, []);

    const handleSend = () => {
        if (!message) return;

        const newNote = {
            id: `global-${Date.now()}`,
            message,
            date: new Date().toISOString(),
            auteur: 'Commandement de l\'Académie',
            type,
            actif: true
        };

        storageService.addNotification(newNote);
        setNotifications(storageService.getNotifications());
        setMessage('');
    };

    const handleDelete = (id: string) => {
        storageService.deleteNotification(id);
        setNotifications(storageService.getNotifications());
    };

    return (
        <div className="notif-manager-overlay" onClick={onClose}>
            <div className="notif-manager-modal glass animate-scale-in" onClick={e => e.stopPropagation()}>
                <header className="notif-header">
                    <div className="title-group">
                        <Bell size={24} className="bell-icon" />
                        <h2>Gestion des Diffusions Globales</h2>
                    </div>
                    <button className="btn-close" onClick={onClose}><X size={20} /></button>
                </header>

                <div className="notif-composer">
                    <h3>Nouvelle Diffusion</h3>
                    <div className="composer-row">
                        <textarea
                            placeholder="Saisissez votre message ici..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="composer-input"
                        />
                    </div>
                    <div className="composer-row actions">
                        <div className="type-selector">
                            <button
                                className={`type-btn info ${type === 'info' ? 'active' : ''}`}
                                onClick={() => setType('info')}
                            >Info</button>
                            <button
                                className={`type-btn alerte ${type === 'alerte' ? 'active' : ''}`}
                                onClick={() => setType('alerte')}
                            >Alerte</button>
                            <button
                                className={`type-btn urgent ${type === 'urgent' ? 'active' : ''}`}
                                onClick={() => setType('urgent')}
                            >Urgent</button>
                        </div>
                        <button className="btn-send" onClick={handleSend}>
                            <Send size={18} /> Diffuser l'Ordre
                        </button>
                    </div>
                </div>

                <div className="notif-history">
                    <h3>Historique des Diffusions</h3>
                    <div className="notif-list">
                        {notifications.length === 0 ? (
                            <p className="empty-notifs">Aucune diffusion active.</p>
                        ) : (
                            notifications.map(note => (
                                <div key={note.id} className={`notif-hist-item ${note.type}`}>
                                    <div className="notif-hist-info">
                                        <div className="notif-hist-meta">
                                            <span className="notif-hist-type">{note.type.toUpperCase()}</span>
                                            <span className="notif-hist-date"><Clock size={12} /> {new Date(note.date).toLocaleString()}</span>
                                        </div>
                                        <p className="notif-hist-msg">{note.message}</p>
                                    </div>
                                    <button className="btn-delete" onClick={() => handleDelete(note.id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationManager;
