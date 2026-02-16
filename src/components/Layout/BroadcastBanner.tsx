import { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import type { NotificationGlobale } from '../../types';
import { X, Clock, Info, AlertTriangle, Zap, Trash2 } from 'lucide-react';
import './BroadcastBanner.css';

const BroadcastBanner = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<NotificationGlobale[]>([]);
    const [dismissedLocal, setDismissedLocal] = useState<string[]>(() => {
        const saved = sessionStorage.getItem('pfe_dismissed_banners');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        // Charger les notifications au montage et vérifier périodiquement
        const load = () => {
            const notes = storageService.getNotifications();
            // Filter inactive and those already dismissed in this session
            setNotifications(notes.filter(n => n.actif && !dismissedLocal.includes(n.id)));
        };

        load();
        const interval = setInterval(load, 5000); // Check toutes les 5 secondes (simule temps réel)
        return () => clearInterval(interval);
    }, [dismissedLocal]);

    if (notifications.length === 0) return null;

    const handleDismiss = (id: string, isSupervisor: boolean) => {
        if (isSupervisor) {
            // Global action
            storageService.deactivateNotification(id);
        } else {
            // Session-only action
            const updated = [...dismissedLocal, id];
            setDismissedLocal(updated);
            sessionStorage.setItem('pfe_dismissed_banners', JSON.stringify(updated));
        }
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

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
                    <button
                        className="broadcast-close"
                        title={user?.role === 'supervisor' ? "Omettre pour tous les étudiants (Action Globale)" : "Masquer pour cette session"}
                        onClick={() => handleDismiss(note.id, user?.role === 'supervisor')}
                    >
                        {user?.role === 'supervisor' ? <Trash2 size={16} /> : <X size={16} />}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default BroadcastBanner;
