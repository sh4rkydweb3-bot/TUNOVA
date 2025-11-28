
import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Power, ArrowUp } from 'lucide-react';
import { playSfx } from '../sfx';

interface ControlsProps {
  isPlaying: boolean;
  hasTape: boolean;
  onToggle: () => void;
  onNext: () => void;
  onPrev: () => void;
  onFlip: () => void; // Now Power
  onEject: () => void;
}

interface ButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    disabled?: boolean;
    active?: boolean;
    title?: string;
}

const ControlButton: React.FC<ButtonProps> = ({ onClick, children, disabled = false, active = false, title = "" }) => (
    <button 
        onClick={() => {
            if (!disabled) playSfx('click');
            onClick();
        }}
        disabled={disabled}
        title={title}
        className={`
            h-8 px-2 md:h-10 md:px-4 rounded-sm flex items-center justify-center
            border-b-2 transition-all duration-150
            ${disabled ? 'bg-slate-800 border-slate-900 text-slate-600 cursor-not-allowed' : 'bg-slate-700 border-slate-900 text-slate-300 hover:bg-slate-600 hover:text-white active:border-b-0 active:translate-y-[2px] shadow-md'}
            ${active ? 'text-cyan-400 bg-slate-800 shadow-[inset_0_0_5px_rgba(6,182,212,0.5)] border-slate-800' : ''}
        `}
    >
        {children}
    </button>
);

const Controls: React.FC<ControlsProps> = ({ 
    isPlaying, 
    hasTape,
    onToggle, 
    onNext, 
    onPrev, 
    onFlip,
    onEject 
}) => {
  return (
    <div className="flex items-center gap-1 md:gap-2 w-full">
        
        <ControlButton onClick={onFlip} active={false}>
             <Power size={14} className="md:w-4 md:h-4 text-red-500 hover:text-red-400 transition-colors" />
        </ControlButton>

        <div className="w-[1px] h-6 md:h-8 bg-white/10 mx-1"></div>

        <ControlButton onClick={onPrev} disabled={!hasTape}>
            <SkipBack size={14} className="md:w-[18px] md:h-[18px]" fill="currentColor" />
        </ControlButton>

        <button 
            onClick={() => {
                if(hasTape) playSfx(isPlaying ? 'stop' : 'play');
                onToggle();
            }}
            disabled={!hasTape}
            className={`
                flex-1 h-8 md:h-10 rounded-sm flex items-center justify-center gap-2
                font-black text-xs md:text-sm tracking-wider italic
                transition-all border-b-4
                ${!hasTape ? 'bg-slate-800 border-slate-900 text-slate-600 cursor-not-allowed' : 
                  isPlaying ? 'bg-cyan-700 border-cyan-900 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'bg-cyan-600 border-cyan-800 text-white hover:brightness-110 active:border-b-0 active:translate-y-[4px] shadow-lg'}
            `}
        >
             {isPlaying ? <Pause size={14} className="md:w-[18px] md:h-[18px]" fill="currentColor"/> : <Play size={14} className="md:w-[18px] md:h-[18px]" fill="currentColor"/>}
             <span className="hidden sm:inline">{isPlaying ? "PAUSE" : "PLAY"}</span>
             <span className="sm:hidden">{isPlaying ? "" : ""}</span>
        </button>

        <ControlButton onClick={onNext} disabled={!hasTape}>
            <SkipForward size={14} className="md:w-[18px] md:h-[18px]" fill="currentColor" />
        </ControlButton>
        
        <div className="w-[1px] h-6 md:h-8 bg-white/10 mx-1"></div>

        <ControlButton onClick={onEject} disabled={!hasTape}>
             <ArrowUp size={14} className={`md:w-4 md:h-4 ${hasTape ? "text-slate-200 group-hover:translate-y-[-2px] transition-transform" : "text-slate-600"}`} />
        </ControlButton>

    </div>
  );
};

export default Controls;
