
import React, { useEffect, useRef, useState } from 'react';
import { CassetteTape, Track } from '../types';
import Cassette from './Cassette';
import Controls from './Controls';
import VolumeKnob from './VolumeKnob';
import VotePanel from './VotePanel';
import { Music, Shuffle, RotateCw } from 'lucide-react';
import { playSfx } from '../sfx';

interface BoomboxProps {
  tape: CassetteTape | null;
  isPlaying: boolean;
  volume: number; // 0 to 1
  isLoFi: boolean;
  onPlayToggle: () => void;
  onNext: () => void;
  onPrev: () => void;
  onEject: () => void;
  onToggleLoFi: () => void;
  onVolumeChange: (v: number) => void;
  onRandomPick: () => void;
  currentTrack: Track | null;
  currentVotes?: number;
  currentUserVote?: number;
  onVote?: (newVoteState: number) => void;
  isHoveringDropZone?: boolean;
  isLoading?: boolean;
  isSearching?: boolean;
}

const LoFiSwitch = ({ active, onToggle }: { active: boolean, onToggle: () => void }) => (
    <div className="flex flex-col items-center gap-1.5 select-none">
        <div 
            onClick={() => {
                playSfx('switch');
                onToggle();
            }}
            className={`
                w-10 h-14 rounded-md border-2 border-[#1a1a1a] relative cursor-pointer shadow-[0_4px_6px_rgba(0,0,0,0.5)] transition-colors
                bg-gradient-to-b from-[#333] to-[#222]
            `}
            title="Lo-Fi Audio Filter"
        >
            {/* Screw heads */}
            <div className="absolute top-1 left-1 w-1 h-1 rounded-full bg-[#111] shadow-[inset_0_0_2px_rgba(255,255,255,0.2)]"></div>
            <div className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-[#111] shadow-[inset_0_0_2px_rgba(255,255,255,0.2)]"></div>

            {/* Switch Lever Slot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-10 bg-black rounded-full shadow-[inset_0_0_5px_black]"></div>

            {/* Switch Lever */}
            <div className={`
                absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-sm border border-black shadow-lg
                transition-all duration-200 z-10 flex items-center justify-center
                ${active 
                    ? 'top-[6px] bg-gradient-to-t from-amber-600 to-amber-400' 
                    : 'bottom-[6px] bg-gradient-to-t from-slate-600 to-slate-400'}
            `}>
                <div className="w-full h-[1px] bg-black/30 mb-[1px]"></div>
                <div className="w-full h-[1px] bg-black/30 mt-[1px]"></div>
            </div>

            {/* LED Indicator */}
            <div className={`
                absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full border border-black transition-all duration-300
                ${active ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b] animate-pulse' : 'bg-red-900/50'}
            `}></div>
        </div>
        <span className={`text-[8px] font-mono font-bold tracking-widest ${active ? 'text-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]' : 'text-slate-600'}`}>LO-FI</span>
    </div>
);

const Boombox: React.FC<BoomboxProps> = ({
  tape,
  isPlaying,
  volume,
  isLoFi,
  onPlayToggle,
  onNext,
  onPrev,
  onEject,
  onToggleLoFi,
  onVolumeChange,
  onRandomPick,
  currentTrack,
  currentVotes = 0,
  currentUserVote = 0,
  onVote,
  isHoveringDropZone = false,
  isLoading = false,
  isSearching = false
}) => {
  
  // Speaker Pulse Animation based on Volume + Playing
  const [pulse, setPulse] = useState(1);
  useEffect(() => {
      let frame: number;
      const animate = () => {
          if (isPlaying) {
              // Simple simulated beat pulse
              const time = Date.now() / 100;
              const beat = Math.sin(time) * 0.1 * volume; // Scale by volume
              setPulse(1 + Math.max(0, beat));
              frame = requestAnimationFrame(animate);
          } else {
              setPulse(1);
          }
      }
      
      if(isPlaying) {
          animate();
      } else {
          setPulse(1);
      }

      return () => {
          if(frame) cancelAnimationFrame(frame);
      };
  }, [isPlaying, volume]);

  const getLCDText = () => {
      if (isSearching) return "SCANNING FREQUENCIES... >>>";
      if (isLoading) return "CHANGING TAPE...";
      if (!tape) return "NO TAPE INSERTED - INSERT CASSETTE";
      if (!isPlaying) return "READY - STANDBY";
      return `PLAYING: ${currentTrack?.title || 'UNKNOWN'} - ${currentTrack?.artist || ''}`;
  }

  return (
    <div className={`
        relative w-[350px] sm:w-[380px] md:w-[500px] h-[280px] md:h-[300px] bg-[#1e1e24] rounded-[2rem] flex flex-col items-center p-4 md:p-6 border-t border-white/10 transition-all duration-300
        ${isHoveringDropZone 
            ? 'shadow-[0_0_50px_rgba(34,197,94,0.6),inset_0_0_20px_rgba(34,197,94,0.2)] ring-2 ring-green-500 scale-[1.02]' 
            : 'shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_2px_5px_rgba(255,255,255,0.1)]'}
    `}>
        
        {/* Handle */}
        <div className="absolute -top-10 md:-top-12 left-1/2 -translate-x-1/2 w-[60%] h-12 rounded-t-[1rem] border-[16px] border-[#1e1e24] border-b-0 shadow-xl z-0"></div>

        {/* Top Controls Strip */}
        <div className="w-full h-14 md:h-16 bg-[#27272a] rounded-lg mb-4 shadow-inner flex items-center justify-between px-3 md:px-4 border-b border-white/5 relative z-10">
             {/* LCD Display */}
             <div className="flex-1 flex items-center gap-3 overflow-hidden mr-4">
                <div className={`bg-[#48584e] h-8 flex-1 rounded shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] flex items-center px-2 font-mono text-[10px] overflow-hidden relative transition-colors duration-500 ${isLoFi ? 'text-amber-400' : 'text-[#a4f3b8]'}`}>
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/pixel-weave.png')]"></div>
                    <div className={`whitespace-nowrap ${isPlaying && !isLoading && !isSearching ? 'animate-marquee' : ''} ${isLoading || isSearching ? 'animate-pulse text-cyan-300 font-bold' : ''}`}>
                        {getLCDText()}
                    </div>
                    {isLoFi && <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-amber-500/20 border border-amber-500/50 px-1 rounded text-[8px]">LO-FI</div>}
                </div>
             </div>
             
             {/* Vote System Integration */}
             {tape && onVote && (
                <div className="shrink-0 h-8">
                    <VotePanel 
                        votes={currentVotes} 
                        userVote={currentUserVote}
                        onVote={onVote} 
                        variant="lcd"
                        externalUrl={currentTrack?.externalUrl || currentTrack?.url}
                    />
                </div>
             )}
        </div>

        {/* Main Body: Speakers & Deck */}
        <div className="flex-1 w-full flex justify-between items-center gap-2 md:gap-4 relative z-10 overflow-hidden">
            
            {/* Left Speaker */}
            <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-[#111] rounded-full shadow-[inset_0_5px_10px_rgba(0,0,0,1)] border-4 border-[#27272a] relative flex items-center justify-center group shrink-0">
                 {/* Grill */}
                 <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,#222_1px,transparent_1px)] bg-[length:4px_4px] opacity-50 z-20"></div>
                 {/* Cone */}
                 <div 
                    className="w-[70%] h-[70%] bg-[#1a1a1a] rounded-full shadow-[inset_0_0_20px_black] transition-transform duration-75"
                    style={{ transform: `scale(${pulse})` }}
                 >
                     <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/20 to-transparent rounded-full"></div>
                 </div>
            </div>

            {/* Deck Area */}
            <div className="flex-1 h-full flex flex-col gap-4 min-w-0">
                 {/* Cassette Door / Slot */}
                 <div className="relative flex-1 bg-[#111] rounded border border-white/5 shadow-[inset_0_5px_15px_black] overflow-hidden flex items-center justify-center">
                      {tape ? (
                          <div className={`scale-[0.55] sm:scale-[0.65] hover:scale-[0.68] transition-transform duration-300 ${isLoading || isSearching ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                              <Cassette tape={tape} state="inserted" isPlaying={isPlaying} />
                          </div>
                      ) : (
                          <div className={`text-slate-700 text-xs font-mono flex flex-col items-center gap-2 transition-all ${isHoveringDropZone ? 'text-green-500 scale-110' : ''}`}>
                              {isLoading || isSearching ? (
                                  <RotateCw className="animate-spin text-cyan-500" size={24} />
                              ) : (
                                  <>
                                    <Music size={24} className="opacity-20" />
                                    <span>{isHoveringDropZone ? 'DROP HERE' : 'OPEN'}</span>
                                  </>
                              )}
                          </div>
                      )}

                      {/* Glass Reflection */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
                 </div>
            </div>

            {/* Right Speaker */}
             <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-[#111] rounded-full shadow-[inset_0_5px_10px_rgba(0,0,0,1)] border-4 border-[#27272a] relative flex items-center justify-center shrink-0">
                 <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,#222_1px,transparent_1px)] bg-[length:4px_4px] opacity-50 z-20"></div>
                 <div 
                    className="w-[70%] h-[70%] bg-[#1a1a1a] rounded-full shadow-[inset_0_0_20px_black] transition-transform duration-75"
                    style={{ transform: `scale(${pulse})` }}
                 >
                     <div className="absolute inset-0 bg-gradient-to-tl from-purple-900/20 to-transparent rounded-full"></div>
                 </div>
            </div>
        </div>

        {/* Bottom Controls */}
        <div className="w-full mt-4 flex items-end justify-between gap-4 px-1 md:px-4 relative z-10">
            <div className="flex-1 min-w-0">
                <Controls 
                    isPlaying={isPlaying} 
                    hasTape={!!tape}
                    onToggle={onPlayToggle}
                    onNext={onNext}
                    onPrev={onPrev}
                    onFlip={() => {}}
                    onEject={onEject}
                />
            </div>

            {/* THE BIG SWAP BUTTON */}
            <div className="relative group shrink-0 -mb-2 ml-4">
                {/* Reactor Glow */}
                <div className={`absolute inset-0 bg-orange-500 rounded-full blur-2xl transition-all duration-500 ${isLoading || isSearching ? 'opacity-30 scale-110 animate-pulse' : 'opacity-0 group-hover:opacity-40'}`}></div>
                
                {/* Hazard Ring */}
                <div className={`absolute -inset-2 rounded-full border-[3px] border-dashed border-orange-900/30 ${isSearching ? 'animate-spin-slow' : ''}`}></div>

                <button 
                    onClick={() => {
                        playSfx('click');
                        onRandomPick();
                    }}
                    disabled={isLoading || isSearching}
                    className={`
                        relative w-20 h-20 md:w-24 md:h-24 rounded-full 
                        bg-gradient-to-br from-orange-400 via-orange-600 to-orange-800
                        shadow-[0_8px_0_#431407,0_15px_25px_rgba(0,0,0,0.6),inset_0_2px_5px_rgba(255,255,255,0.4)]
                        active:shadow-[0_0_0_#431407,inset_0_5px_10px_rgba(0,0,0,0.6)] active:translate-y-2 active:border-b-0
                        transition-all flex flex-col items-center justify-center border-4 border-[#270e05] group-hover:brightness-110 z-20 overflow-hidden
                        ${(isLoading || isSearching) ? 'cursor-wait grayscale-[0.3] brightness-90 translate-y-2 shadow-none border-t-8 border-[#270e05]' : 'hover:-translate-y-1'}
                    `}
                    title="SMART SHUFFLE / SWAP TAPE"
                >
                    {/* Industrial Safety Stripes */}
                    <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(45deg,#000,#000_2px,transparent_2px,transparent_8px)] pointer-events-none mix-blend-overlay"></div>
                    
                    <Shuffle className={`text-orange-50 drop-shadow-lg transition-transform duration-700 ${isSearching ? 'animate-spin' : 'group-hover:rotate-180'}`} size={32} strokeWidth={3} />
                    <span className="text-[9px] md:text-[10px] font-black text-[#270e05] uppercase tracking-widest mt-1 drop-shadow-sm border-t border-[#270e05]/20 pt-0.5 w-12 text-center">SWAP</span>
                </button>
            </div>

            <div className="ml-4 pb-1 flex items-end gap-3">
                <LoFiSwitch active={isLoFi} onToggle={onToggleLoFi} />
                <VolumeKnob volume={volume} onChange={onVolumeChange} />
            </div>
        </div>
        
        <style>{`
            @keyframes marquee {
                0% { transform: translateX(100%); }
                100% { transform: translateX(-100%); }
            }
            .animate-marquee {
                animation: marquee 8s linear infinite;
            }
        `}</style>
    </div>
  );
};

export default Boombox;
