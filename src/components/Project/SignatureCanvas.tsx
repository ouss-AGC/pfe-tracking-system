import React, { useRef, useEffect, useState } from 'react';

interface Props {
    onSave: (signatureData: string) => void;
    onCancel: () => void;
    title?: string;
}

const SignatureCanvas = ({ onSave, onCancel, title = "Signer le document" }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.strokeStyle = '#1e3a5f'; // Deep Blue for official signature
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Clear canvas with white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, []);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        setIsEmpty(false);
        const pos = getPos(e);
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        }
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const pos = getPos(e);
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const getPos = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const clear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            setIsEmpty(true);
        }
    };

    const handleSave = () => {
        if (isEmpty) return;
        const canvas = canvasRef.current;
        if (canvas) {
            onSave(canvas.toDataURL('image/png'));
        }
    };

    return (
        <div className="signature-modal-overlay">
            <div className="signature-modal">
                <div className="signature-header">
                    <h3>{title}</h3>
                </div>
                <div className="signature-pad-container">
                    <canvas
                        ref={canvasRef}
                        width={500}
                        height={250}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseOut={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="signature-canvas"
                    />
                    <div className="signature-pad-hint">Veuillez signer à l'aide de votre souris ou stylet</div>
                </div>
                <div className="signature-footer">
                    <button className="btn btn-outline" onClick={clear}>Effacer</button>
                    <div className="action-buttons">
                        <button className="btn btn-outline" onClick={onCancel}>Annuler</button>
                        <button className="btn btn-primary" onClick={handleSave} disabled={isEmpty}>
                            Valider la signature
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .signature-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    backdrop-filter: blur(5px);
                }
                .signature-modal {
                    background: white;
                    border-radius: 16px;
                    width: 90%;
                    max-width: 550px;
                    padding: 1.5rem;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }
                .signature-header h3 {
                    margin: 0 0 1.5rem 0;
                    color: #1e293b;
                    font-size: 1.2rem;
                    text-align: center;
                }
                .signature-pad-container {
                    border: 2px dashed #cbd5e1;
                    border-radius: 12px;
                    background: #f8fafc;
                    overflow: hidden;
                    margin-bottom: 1.5rem;
                    cursor: crosshair;
                }
                .signature-canvas {
                    width: 100%;
                    display: block;
                }
                .signature-pad-hint {
                    padding: 0.75rem;
                    text-align: center;
                    font-size: 0.8rem;
                    color: #64748b;
                    border-top: 1px solid #e2e8f0;
                }
                .signature-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .action-buttons {
                    display: flex;
                    gap: 1rem;
                }
            `}</style>
        </div>
    );
};

export default SignatureCanvas;
