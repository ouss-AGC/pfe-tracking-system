import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen: React.FC = () => {
    const [visible, setVisible] = useState(true);
    const [fade, setFade] = useState(false);

    useEffect(() => {
        // Start fade out after 4.5s to finish by 5s
        const fadeTimer = setTimeout(() => {
            setFade(true);
        }, 4500);

        const removeTimer = setTimeout(() => {
            setVisible(false);
        }, 5000);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
        };
    }, []);

    if (!visible) return null;

    return (
        <div className={`splash-screen ${fade ? 'fade-out' : ''}`}>
            <div className="splash-content">
                <div className="logo-container">
                    <img src="/pfe-tracker-logo.png" alt="PFE Tracker Logo" className="splash-logo" />
                    <div className="logo-glow"></div>
                </div>
                <div className="splash-text">
                    <h1 className="cinematic-title">PFE TRACKER</h1>
                    <div className="title-underline"></div>
                    <p className="splash-subtitle">ACADÉMIE MILITAIRE DE FONDOUCK JEDID</p>
                    <p className="author-credit">BY DR. OUSSAMA ATOUI</p>
                </div>
            </div>
            <div className="loading-bar-container">
                <div className="loading-bar"></div>
            </div>
        </div>
    );
};

export default SplashScreen;
