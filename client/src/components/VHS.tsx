
import React, { useRef, useEffect } from 'react';
import { VHSTape } from '../types';

interface VHSProps {
  tape: VHSTape;
  isPlaying?: boolean;
  state?: 'idle' | 'dragging' | 'inserted';
  className?: string;
  style?: React.CSSProperties;
  onMouseDown?: (e: React.MouseEvent) => void;
}

const Spool = ({ isPlaying, direction = 1, speed = 1 }: { isPlaying: boolean, direction?: number, speed?: number }) => {
    const reelRef = useRef<SVGSVGElement>(null);
    const rotation = useRef(Math.random() * 360);

    useEffect(() => {
        let frameId: number;
        const animate = () => {
            if (isPlaying) {
                rotation.current = (rotation.current + (2 * direction * speed)) % 360;
                if (reelRef.current) {
                    reelRef.current.style.transform = `rotate(${rotation.current}deg)`;
                }
            }
            frameId = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(frameId);
    }, [isPlaying, direction, speed]);

    return (
        <svg ref={reelRef} viewBox="0 0 100 100" className="w-full h-full opacity-90">
             <circle cx="50" cy="50" r="45" fill="white" />
             {/* Teeth */}
             {[...Array(6)].map((_, i) => (
                 <path key={i} d="M50 50 L50 5 L65 5 Z" fill="#ddd" transform={`rotate(${i * 60} 50 50)`} />
             ))}
             <circle cx="50" cy="50" r="15" fill="#1a1a1a" />
        </svg>
    );
}

const VHS: React.FC<VHSProps> = ({ 
    tape, 
    isPlaying = false, 
    state = 'idle',
    className = "",
    style = {},
    onMouseDown
}) => {

  const isInserted = state === 'inserted';
  
  // VHS Dimensions are roughly 18.7cm x 10.3cm -> Aspect ~1.81
  
  return (
    <div 
        className={`
            relative bg-[#18181b] rounded-[4px] overflow-hidden select-none
            shadow-[inset_0_0_10px_black,0_5px_15px_rgba(0,0,0,0.5)]
            border-t border-white/10 border-b-4 border-black
            ${state === 'dragging' ? 'cursor-grabbing scale-105 z-50 shadow-[0_20px_40px_rgba(0,0,0,0.8)]' : ''}
            ${state === 'idle' ? 'cursor-grab hover:scale-[1.02] transition-transform' : ''}
            ${className}
        `}
        style={style}
        onMouseDown={onMouseDown}
    >
        {/* Texture Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay"></div>

        {/* --- TOP FACE DESIGN --- */}
        
        {/* 1. Windows Area (Recessed) */}
        <div className="absolute top-[15%] left-[10%] right-[10%] height-[20%] bottom-[45%] bg-[#27272a] rounded shadow-[inset_0_2px_4px_black] flex justify-between items-center px-4 py-2 border-b border-white/5">
            {/* Left Window */}
            <div className="h-full aspect-square bg-black/60 rounded-full border border-white/5 shadow-inner relative overflow-hidden">
                 <div className="absolute inset-0 flex items-center justify-center p-1">
                    <Spool isPlaying={isPlaying && isInserted} direction={1} speed={0.5} />
                 </div>
                 {/* Tape Mass (Visual only, static for now) */}
                 <div className="absolute top-0 right-0 w-1/2 h-full bg-black/80"></div> 
            </div>

            {/* Center Bridge (Dark) */}
            <div className="flex-1 h-1/2 bg-[#18181b] mx-2 rounded shadow-md"></div>

            {/* Right Window */}
            <div className="h-full aspect-square bg-black/60 rounded-full border border-white/5 shadow-inner relative overflow-hidden">
                 <div className="absolute inset-0 flex items-center justify-center p-1">
                    <Spool isPlaying={isPlaying && isInserted} direction={1} speed={0.55} />
                 </div>
            </div>
        </div>

        {/* 2. Label Area (Sticker) */}
        <div className="absolute top-[60%] left-[10%] right-[10%] bottom-[10%] bg-[#e4e4e7] rounded-sm shadow-[0_1px_2px_rgba(0,0,0,0.5)] overflow-hidden rotate-[0.5deg]">
             {/* Color Strip */}
             <div className="absolute top-0 left-0 w-full h-3" style={{ backgroundColor: tape.color }}></div>
             
             {/* Text Lines */}
             <div className="absolute top-4 left-2 right-2 bottom-2 flex flex-col justify-center">
                 <div className="border-b border-slate-300 pb-1 mb-1">
                     <h2 className="font-marker text-slate-900 text-lg leading-none truncate uppercase">{tape.title}</h2>
                 </div>
                 <div className="flex justify-between items-end relative">
                     <span className="font-mono text-[8px] text-slate-500">E-180</span>
                     <span className="font-marker text-slate-600 text-xs truncate max-w-[120px]">{tape.label}</span>
                     {tape.creator && <div className="absolute bottom-0 right-0 font-marker text-[8px] text-red-500/60 rotate-[-2deg]">BY {tape.creator}</div>}
                 </div>
             </div>
             
             {/* Hand-written notes visual */}
             {tape.variant === 'bootleg' && (
                 <div className="absolute top-1 right-2 text-[8px] text-red-600 font-marker rotate-[-10deg] border border-red-600 px-1 rounded">DO NOT ERASE</div>
             )}
             {tape.variant === 'rental' && (
                 <div className="absolute bottom-1 left-1 w-8 h-3 bg-blue-600/20 rounded-full"></div>
             )}
        </div>

        {/* 3. Arrow Indicator */}
        <div className="absolute top-1/2 -translate-y-1/2 left-3 text-white/10 text-2xl font-bold">▼</div>

        {/* 4. Screws */}
        <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-[#3f3f46] rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,1)]"></div>
        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#3f3f46] rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,1)]"></div>
        <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-[#3f3f46] rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,1)]"></div>
        <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-[#3f3f46] rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,1)]"></div>

    </div>
  );
};

export default VHS;
