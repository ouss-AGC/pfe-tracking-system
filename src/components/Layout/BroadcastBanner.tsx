import { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import type { NotificationGlobale } from '../../types';
import { X, Clock, Info, AlertTriangle, Zap } from 'lucide-react';
import './BroadcastBanner.css';

const BroadcastBanner = () => {
    const [notifications, setNotifications] = useState<NotificationGlobale[]>([]);

    useEffect(() => {
        // Charger les notifications au montage et vérifier périodiquement
        const load = () => {
            const notes = storageService.getNotifications();
            setNotifications(notes.filter(n => n.actif));
        };

        load();
        const interval = setInterval(load, 5000); // Check toutes les 5 secondes (simule temps réel)
        return () => clearInterval(interval);
    }, []);

    if (notifications.length === 0) return null;

    const getIcon = (type: string) => {
        switch (type) {
            case 'urgent': return <Zap size={20} />;
            case 'alerte': return <AlertTriangle size={20} />;
            default: return <Info size={20} />;
        }
    };

    return (
        <div className="broadcast-container animate-slide-down">
            {notifications.map(note => (
                <div key={note.id} className={`broadcast-item ${note.type} glass`}>
                    <div className="broadcast-icon">
                        {getIcon(note.type)}
                    </div>
                    <div className="broadcast-content">
                        <div className="broadcast-meta">
                            <span className="broadcast-author">{note.auteur.toUpperCase()}</span>
                            <span className="broadcast-time"><Clock size={12} /> {note.date}</span>
                        </div>
                        <p className="broadcast-message">{note.message}</p>
                    </div>
                    <button className="broadcast-close" onClick={() => {
                        // Pour cette démo, on cache juste localement
                        setNotifications(prev => prev.filter(n => n.id !== note.id));
                    }}>
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default BroadcastBanner;
