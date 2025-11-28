
import React, { useRef, useEffect } from 'react';
import { CassetteTape } from '../types';

interface CassetteProps {
  tape: CassetteTape;
  state?: 'idle' | 'dragging' | 'inserted';
  isPlaying?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onMouseDown?: (e: React.MouseEvent) => void;
}

const CassetteSpool = ({ isPlaying, speed = 1 }: { isPlaying: boolean, speed?: number }) => {
    const ref = useRef<SVGGElement>(null);
    const rotation = useRef(Math.random() * 360);

    useEffect(() => {
        let frame: number;
        const animate = () => {
            if (isPlaying) {
                rotation.current = (rotation.current + (2 * speed)) % 360;
                if (ref.current) ref.current.style.transform = `rotate(${rotation.current}deg)`;
            }
            frame = requestAnimationFrame(animate);
        }
        animate();
        return () => cancelAnimationFrame(frame);
    }, [isPlaying, speed]);

    return (
        <g ref={ref} style={{ transformOrigin: 'center' }}>
             {/* Hub */}
             <circle cx="0" cy="0" r="12" fill="#e5e5e5" stroke="#999" strokeWidth="0.5" />
             {/* Spool Teeth */}
             {[0, 60, 120, 180, 240, 300].map(deg => (
                 <path 
                    key={deg} 
                    d="M-2 -14 L2 -14 L3 -8 L-3 -8 Z" 
                    fill="#e5e5e5" 
                    transform={`rotate(${deg})`} 
                 />
             ))}
             {/* Pin Hole */}
             <circle cx="0" cy="0" r="3.5" fill="#1a1a1a" />
        </g>
    )
}

const Cassette: React.FC<CassetteProps> = ({ 
    tape, 
    state = 'idle', 
    isPlaying = false,
    className = "",
    style = {},
    onMouseDown
}) => {

  const isTransparent = tape.variant === 'transparent';
  
  // Determine text contrast based on label color
  const isDarkLabel = ['#000000', '#1e293b', '#171717', '#0f172a'].includes(tape.labelColor);
  const textColor = isDarkLabel ? 'text-white/90' : 'text-slate-900/90';
  const subTextColor = isDarkLabel ? 'text-white/60' : 'text-slate-600';
  const borderColor = isDarkLabel ? 'border-white/20' : 'border-black/20';

  return (
    <div 
        className={`
            relative w-[240px] h-[150px] rounded-lg overflow-hidden select-none
            transition-transform duration-100
            ${state === 'dragging' ? 'cursor-grabbing scale-110 z-50 shadow-2xl rotate-0' : ''}
            ${state === 'idle' ? 'cursor-grab hover:scale-[1.02]' : ''}
            ${className}
        `}
        style={style}
        onMouseDown={onMouseDown}
    >
        <style>{`
            @keyframes tapeJitter {
                0% { transform: translateY(-50%); }
                25% { transform: translateY(-49%); }
                50% { transform: translateY(-51%); }
                75% { transform: translateY(-49.5%); }
                100% { transform: translateY(-50%); }
            }
        `}</style>

        {/* Main Body Shell */}
        <div className="absolute inset-0 rounded-lg shadow-xl" style={{ backgroundColor: tape.color }}>
             {/* Plastic Texture / Highlights */}
             <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/30 pointer-events-none"></div>
             
             {/* Bottom trapezoid area (grip section) */}
             <div 
                className="absolute bottom-0 left-[5%] right-[5%] h-[15%] bg-black/10 backdrop-blur-[1px]"
                style={{ clipPath: 'polygon(5% 0, 95% 0, 100% 100%, 0% 100%)' }}
             ></div>

             {isTransparent && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20 mix-blend-overlay"></div>}
        </div>

        {/* Screws */}
        {[
            {top: '4%', left: '4%'}, {top: '4%', right: '4%'}, 
            {bottom: '4%', left: '4%'}, {bottom: '4%', right: '4%'},
            {bottom: '12%', left: '50%'} // Center bottom
        ].map((pos: any, i) => (
            <div key={i} className="absolute w-2.5 h-2.5 bg-zinc-400 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center z-20" style={pos}>
                <div className="w-[60%] h-[1px] bg-zinc-700 rotate-45"></div>
                <div className="w-[60%] h-[1px] bg-zinc-700 -rotate-45 absolute"></div>
            </div>
        ))}

        {/* Label Sticker Area */}
        <div 
            className="absolute top-[12%] left-[8%] right-[8%] bottom-[20%] rounded-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col" 
            style={{ backgroundColor: tape.labelColor }}
        >
            {/* Paper Texture Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] opacity-40 mix-blend-multiply pointer-events-none"></div>

            {/* Label Header */}
            <div className={`h-[38%] w-full relative border-b ${borderColor} flex items-center justify-between px-3 pt-1`}>
                {/* Color Band (Decorative) */}
                <div className="absolute top-0 left-0 w-full h-1.5 opacity-90" style={{ backgroundColor: tape.color }}></div>
                
                {/* Side A Indicator */}
                <div className={`flex flex-col items-center justify-center border-2 ${borderColor} w-6 h-6 rounded-sm mt-1`}>
                    <span className={`font-bold font-mono text-xs leading-none ${textColor}`}>A</span>
                </div>

                {/* Title */}
                <div className="flex-1 mx-2 mt-1 text-center overflow-hidden">
                     <h3 className={`font-marker text-sm sm:text-base leading-none uppercase tracking-tight ${textColor} drop-shadow-sm truncate`}>
                        {tape.title}
                     </h3>
                </div>
                
                {/* Brand / Tech Specs */}
                <div className="flex flex-col items-end mt-1">
                    <span className={`font-mono text-[6px] font-bold tracking-widest ${subTextColor}`}>NAKAMA</span>
                    <span className={`font-mono text-[5px] border ${borderColor} px-0.5 rounded mt-0.5 ${subTextColor}`}>
                        {tape.variant?.toUpperCase() || 'C60'}
                    </span>
                </div>
            </div>

            {/* Label Body (Lines & Artist) */}
            <div className="flex-1 relative">
                {/* Writing Lines Background */}
                <div className="absolute inset-0 opacity-15" style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 7px, ${isDarkLabel ? '#fff' : '#000'} 8px)` }}></div>
                
                {/* Artist Text */}
                <div className="absolute top-1.5 w-full text-center px-4">
                    <p className={`font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-widest ${subTextColor} truncate`}>
                        {tape.artist}
                    </p>
                </div>

                {/* Creator Stamp */}
                {tape.creator && (
                    <div className="absolute bottom-1 right-2 border border-current px-1 rounded-sm opacity-60 transform -rotate-2">
                        <span className={`font-mono text-[5px] font-bold uppercase ${subTextColor}`}>
                           MIX BY {tape.creator}
                        </span>
                    </div>
                )}
            </div>
        </div>

        {/* Window Cutout (Simulating the hole in the cassette label + shell visibility) */}
        <div className="absolute top-[45%] left-[18%] right-[18%] bottom-[28%] bg-[#202020] rounded-full flex justify-between items-center px-2 shadow-[inset_0_2px_5px_black,0_1px_0_rgba(255,255,255,0.1)] border border-white/5 overflow-hidden z-10">
                
                {/* Left Spool */}
                <div className="relative w-10 h-10 flex items-center justify-center">
                    {/* Tape Spool Amount (Left gets smaller as it plays) */}
                    <div className="absolute w-[85%] h-[85%] bg-[#453028] rounded-full opacity-90 shadow-inner"></div>
                    <svg viewBox="-20 -20 40 40" className="w-full h-full relative z-10">
                        <CassetteSpool isPlaying={isPlaying} speed={0.5} />
                    </svg>
                </div>
                
                {/* Center Window Area */}
                <div className="flex-1 h-6 mx-1 relative bg-[#151515] opacity-90 border-t border-b border-white/5 overflow-hidden">
                    {/* The Tape Ribbon */}
                     <div 
                        className={`
                            absolute left-0 right-0 h-[3px] bg-[#5d4037] shadow-[0_0_2px_rgba(0,0,0,0.5)]
                            transition-all duration-500 ease-out origin-left
                            ${isPlaying 
                                ? 'top-1/2 -translate-y-1/2 animate-[tapeJitter_0.1s_infinite_linear]' 
                                : 'top-[65%] -translate-y-1/2 rotate-1 scale-x-[1.05] opacity-80'}
                        `}
                    ></div>
                </div>

                {/* Right Spool */}
                <div className="relative w-10 h-10 flex items-center justify-center">
                     {/* Tape Spool Amount (Right gets bigger) */}
                     <div className="absolute w-[65%] h-[65%] bg-[#453028] rounded-full opacity-90 shadow-inner"></div>
                     <svg viewBox="-20 -20 40 40" className="w-full h-full relative z-10">
                        <CassetteSpool isPlaying={isPlaying} speed={0.55} />
                    </svg>
                </div>
        </div>

    </div>
  );
};

export default Cassette;
