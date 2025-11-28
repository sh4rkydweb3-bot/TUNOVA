
import React, { useEffect, useRef } from 'react';

interface BackgroundFxProps {
    analyser: AnalyserNode | null;
    isPlaying: boolean;
    isHakiActive?: boolean;
}

const BackgroundFx: React.FC<BackgroundFxProps> = ({ analyser, isPlaying, isHakiActive = false }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frameRef = useRef(0);

    // Advanced Lightning Generator
    const drawLightning = (
        ctx: CanvasRenderingContext2D, 
        x1: number, y1: number, 
        x2: number, y2: number, 
        displace: number, 
        thickness: number,
        color: string = '#ffffff'
    ) => {
        if (displace < 4) {
            ctx.lineWidth = thickness;
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            return;
        }

        let midX = (x1 + x2) / 2;
        let midY = (y1 + y2) / 2;
        midX += (Math.random() - 0.5) * displace;
        midY += (Math.random() - 0.5) * displace;

        drawLightning(ctx, x1, y1, midX, midY, displace / 2, thickness, color);
        drawLightning(ctx, midX, midY, x2, y2, displace / 2, thickness, color);
    };

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        let animationId: number;
        // FFT Size 256 -> 128 bins
        const bufferLength = analyser ? analyser.frequencyBinCount : 0;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationId = requestAnimationFrame(draw);
            frameRef.current++;
            
            // Get Audio Data
            let bass = 0;
            let mids = 0;

            if (isPlaying && analyser) {
                try {
                    analyser.getByteFrequencyData(dataArray);
                    const bassSum = dataArray.slice(0, 5).reduce((a, b) => a + b, 0);
                    bass = (bassSum / 5) / 255;
                    const midsSum = dataArray.slice(5, 30).reduce((a, b) => a + b, 0);
                    mids = (midsSum / 25) / 255;
                } catch(e) {}
            }

            // --- HAKI MODE EFFECTS ---
            if (isHakiActive) {
                // 1. "Pressure" Effect (Dark Red/Black Vignette that pulses)
                // We do NOT clearRect completely to create a trail effect.
                ctx.fillStyle = `rgba(20, 5, 5, ${0.1 + bass * 0.25})`; 
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.save();

                // 2. Screen Shake (Based on Bass)
                const shakeIntensity = bass * 60; 
                if (shakeIntensity > 1) {
                    const dx = (Math.random() - 0.5) * shakeIntensity;
                    const dy = (Math.random() - 0.5) * shakeIntensity;
                    ctx.translate(dx, dy);
                }

                // 3. Conqueror's Lightning (Black Core, Red/Purple Glow)
                // Trigger heavily on bass kicks or randomly
                if (bass > 0.35 || Math.random() < 0.04) {
                    const cx = canvas.width / 2;
                    const cy = canvas.height / 2;
                    const angle = Math.random() * Math.PI * 2;
                    // Bolts extend from center or are chaotic
                    const dist = Math.min(canvas.width, canvas.height) * (0.4 + Math.random() * 0.6);
                    
                    const x1 = cx + Math.cos(angle) * (dist * 0.1);
                    const y1 = cy + Math.sin(angle) * (dist * 0.1);
                    const x2 = cx + Math.cos(angle) * dist;
                    const y2 = cy + Math.sin(angle) * dist;

                    // A) Thick Red Glow
                    ctx.shadowBlur = 40 + bass * 40;
                    ctx.shadowColor = '#dc2626'; // Red-600
                    drawLightning(ctx, x1, y1, x2, y2, 90, 8 + bass * 12, '#ef4444'); 
                    
                    // B) Black Core (The "Haki" look)
                    ctx.shadowBlur = 0;
                    drawLightning(ctx, x1, y1, x2, y2, 90, 3 + bass * 5, '#000000'); 
                }

                // 4. Rising Dark Energy Particles
                const particleCount = 4 + Math.floor(bass * 8);
                for (let i = 0; i < particleCount; i++) {
                    const px = Math.random() * canvas.width;
                    const py = canvas.height + 10;
                    const speed = 10 + Math.random() * 20;
                    const size = 2 + Math.random() * 5 + bass * 5;
                    
                    // Use a pseudo-random offset based on frame to move them up
                    const yPos = (py - ((frameRef.current * speed) % (canvas.height + 100)));
                    
                    ctx.fillStyle = Math.random() > 0.5 ? '#7f1d1d' : '#000000'; // Dark Red or Black
                    ctx.beginPath();
                    ctx.arc(px, yPos, size, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();

            } else {
                // --- STANDARD MODE ---
                // Clear screen with fade for trails
                ctx.fillStyle = 'rgba(16, 16, 18, 0.2)'; 
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Pulse Effect (Center)
                if (bass > 0.1) {
                    const cx = canvas.width / 2;
                    const cy = canvas.height / 2;
                    const radius = Math.min(canvas.width, canvas.height) * 0.4 * bass;
                    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 2);
                    gradient.addColorStop(0, 'rgba(6, 182, 212, 0.1)');
                    gradient.addColorStop(1, 'transparent');
                    
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(cx, cy, radius * 3, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Global Ambient Dust
                if (isPlaying && mids > 0.1) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    const time = Date.now() / 1000;
                    for (let i=0; i<15; i++) {
                        const x = (Math.sin(time + i * 10) * 0.5 + 0.5) * canvas.width;
                        const y = (Math.cos(time * 0.5 + i * 20) * 0.5 + 0.5) * canvas.height;
                        ctx.fillRect(x, y, 2, 2);
                    }
                }
            }
        };

        draw();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, [analyser, isPlaying, isHakiActive]);

    return (
        <canvas 
            ref={canvasRef} 
            className={`fixed inset-0 z-0 pointer-events-none transition-all duration-1000 ${isHakiActive ? 'mix-blend-normal' : 'mix-blend-screen'}`}
        />
    );
};

export default BackgroundFx;
