import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen: React.FC = () => {
    const [fade, setFade] = useState(false);

    useEffect(() => {
        // Trigger fade out shortly before unmount if needed, 
        // but now App.tsx controls the lifecycle.
        // We keep the internal fade visual state matching the CSS.
        const fadeTimer = setTimeout(() => {
            setFade(true);
        }, 7500);

        return () => {
            clearTimeout(fadeTimer);
        };
    }, []);

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
