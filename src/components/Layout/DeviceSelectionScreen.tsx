import { useState } from 'react';
import { Laptop, Smartphone, Check } from 'lucide-react';
import './DeviceSelectionScreen.css';

interface DeviceSelectionScreenProps {
    onSelect: (mode: 'desktop' | 'mobile') => void;
}

const DeviceSelectionScreen = ({ onSelect }: DeviceSelectionScreenProps) => {
    const [selected, setSelected] = useState<'desktop' | 'mobile' | null>(null);

    const handleConfirm = () => {
        if (selected) {
            onSelect(selected);
        }
    };

    return (
        <div className="device-selection-page animate-fade-in">
            <div className="selection-container glass">
                <div className="selection-header">
                    <h1>CHOISISSEZ VOTRE EXPÉRIENCE</h1>
                    <p>Pour une utilisation optimale, veuillez indiquer votre appareil</p>
                </div>

                <div className="device-options">
                    <button
                        className={`device-card glass ${selected === 'desktop' ? 'active' : ''}`}
                        onClick={() => setSelected('desktop')}
                    >
                        <div className="icon-wrapper">
                            <Laptop size={48} />
                        </div>
                        <h3>ORDINATEUR</h3>
                        <p>Laptop / Desktop</p>
                        {selected === 'desktop' && <div className="check-badge"><Check size={16} /></div>}
                    </button>

                    <button
                        className={`device-card glass ${selected === 'mobile' ? 'active' : ''}`}
                        onClick={() => setSelected('mobile')}
                    >
                        <div className="icon-wrapper">
                            <Smartphone size={48} />
                        </div>
                        <h3>MOBILE / TABLETTE</h3>
                        <p>Smartphone / iPad</p>
                        {selected === 'mobile' && <div className="check-badge"><Check size={16} /></div>}
                    </button>
                </div>

                <button
                    className="btn btn-primary btn-lg continue-btn"
                    disabled={!selected}
                    onClick={handleConfirm}
                >
                    CONTINUER VERS LE PORTAIL
                </button>
            </div>
        </div>
    );
};

export default DeviceSelectionScreen;
