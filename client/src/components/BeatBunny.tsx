
import React, { useEffect, useState } from 'react';

interface BeatBunnyProps {
  isPlaying: boolean;
  isChatOpen?: boolean;
  isThinking?: boolean;
  onClick?: () => void;
  bpm?: number;
}

const BeatBunny: React.FC<BeatBunnyProps> = ({ isPlaying, isChatOpen, isThinking, onClick }) => {
  const [frame, setFrame] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);

  // Dance loop
  useEffect(() => {
    if (!isPlaying && !isThinking) {
      setFrame(0);
      return;
    }
    const speed = isThinking ? 150 : 400;
    const interval = setInterval(() => {
      setFrame(prev => (prev === 0 ? 1 : 0));
    }, speed); 
    return () => clearInterval(interval);
  }, [isPlaying, isThinking]);

  // Blink loop
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <div 
        onClick={onClick}
        className={`
            relative w-32 h-32 select-none transition-all duration-300 ease-out group cursor-pointer
            ${isThinking ? 'scale-110' : ''}
        `}
        style={{ 
           transform: `translateY(${isPlaying && frame === 1 ? '-10px' : '0px'}) rotate(${isPlaying && frame === 1 ? '5deg' : '0deg'})`,
           filter: isThinking ? 'drop-shadow(0 0 25px rgba(236,72,153,0.8))' : 'drop-shadow(0 0 15px rgba(6,182,212,0.4))'
         }}>
      
      {/* Interaction Hint */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-cyan-400 text-[10px] px-2 py-1 rounded border border-cyan-500/50 whitespace-nowrap z-50 pointer-events-none font-mono">
          OPEN NEURAL LINK
      </div>

      {/* Speech Bubble (Status) */}
      {!isPlaying && !isChatOpen && (
        <div className="absolute -top-8 -right-4 bg-white text-black text-[10px] font-mono p-2 rounded-lg rounded-bl-none animate-pulse opacity-80">
          {isThinking ? "..." : "Zzz..."}
        </div>
      )}

      {/* Chat Active Indicator */}
      {isChatOpen && (
          <div className="absolute -right-2 top-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black z-10 shadow-[0_0_10px_#22c55e]"></div>
      )}

      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Ears */}
        <g transform={isPlaying && frame === 1 ? "rotate(-5 50 50)" : ""}>
             <path d="M30 35 L25 5 Q20 0 35 5 L40 35 Z" fill="#e2e8f0" stroke="#1e293b" strokeWidth="2" />
             <path d="M30 35 L28 10" fill="none" stroke="#ec4899" strokeWidth="2" className="opacity-50" />
        </g>
        <g transform={isPlaying && frame === 1 ? "rotate(5 50 50)" : ""}>
             <path d="M70 35 L75 5 Q80 0 65 5 L60 35 Z" fill="#e2e8f0" stroke="#1e293b" strokeWidth="2" />
             <path d="M70 35 L72 10" fill="none" stroke="#ec4899" strokeWidth="2" className="opacity-50" />
        </g>

        {/* Head (Mecha Helmet) */}
        <circle cx="50" cy="55" r="25" fill="#f1f5f9" stroke="#334155" strokeWidth="2" />
        
        {/* Visor / Face Plate */}
        <path d="M35 50 Q50 65 65 50" fill="none" stroke="#94a3b8" strokeWidth="1" />
        
        {/* Eyes (LEDs) */}
        {isBlinking ? (
            <>
                <line x1="38" y1="52" x2="48" y2="52" stroke="#06b6d4" strokeWidth="2" />
                <line x1="52" y1="52" x2="62" y2="52" stroke="#06b6d4" strokeWidth="2" />
            </>
        ) : (
            <>
                <circle cx="43" cy="52" r="4" fill={isThinking ? "#ec4899" : "#06b6d4"} className={isThinking ? "animate-pulse" : ""} />
                <circle cx="57" cy="52" r="4" fill={isThinking ? "#ec4899" : "#06b6d4"} className={isThinking ? "animate-pulse" : ""} />
            </>
        )}

        {/* Cheeks */}
        <circle cx="35" cy="60" r="2" fill="#ec4899" opacity="0.6" />
        <circle cx="65" cy="60" r="2" fill="#ec4899" opacity="0.6" />

        {/* Body (Small Robot Body) */}
        <rect x="40" y="78" width="20" height="15" rx="5" fill="#334155" />
        
        {/* Headphones */}
        <path d="M25 55 Q25 30 50 30 Q75 30 75 55" fill="none" stroke="#1e293b" strokeWidth="4" />
        <rect x="20" y="45" width="10" height="20" rx="2" fill="#ec4899" />
        <rect x="70" y="45" width="10" height="20" rx="2" fill="#ec4899" />
      </svg>
    </div>
  );
};

export default BeatBunny;
