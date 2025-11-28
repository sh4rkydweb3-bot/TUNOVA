
import React, { useState } from 'react';
import { Radio, Plus, Play, Signal, Music, UploadCloud } from 'lucide-react';
import { VHSTape, CassetteTape, SystemMode } from '../types';

interface RadioPanelProps {
    activeSystem: SystemMode;
    vhsLibrary: VHSTape[];
    cassetteLibrary: CassetteTape[];
    onRequestOpen: () => void;
    onPlay: (id: string) => void;
}

const RadioPanel: React.FC<RadioPanelProps> = ({ 
    activeSystem, 
    vhsLibrary, 
    cassetteLibrary, 
    onRequestOpen, 
    onPlay 
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Filter for User Submissions (ID starts with 'user_')
    const userVhs = vhsLibrary.filter(t => t.id.startsWith('user_')).reverse();
    const userCassettes = cassetteLibrary.filter(t => t.id.startsWith('user_')).reverse();
    const activeList = activeSystem === 'VHS' ? userVhs : userCassettes;

    return (
        <div className={`
            fixed bottom-4 left-4 z-40 transition-all duration-300 ease-out flex flex-col items-start font-sans
            ${isExpanded ? 'w-64' : 'w-12'}
        `}>
            
            {/* RADIO HEADER / TOGGLE */}
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className={`
                    h-12 flex items-center bg-[#1e1e24] border border-cyan-900/50 shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300 relative group
                    ${isExpanded ? 'w-full rounded-t-lg border-b-0' : 'w-12 rounded-lg hover:scale-110 hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]'}
                `}
                title="RADIO NAKAMA"
            >
                {/* Noise Texture */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>

                <div className="w-12 h-12 flex items-center justify-center shrink-0 z-10">
                    <Radio size={20} className={`text-cyan-400 transition-all ${isExpanded ? 'drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]' : 'group-hover:animate-pulse'}`} />
                </div>
                
                {/* Expanded Title */}
                <div className={`flex flex-col items-start whitespace-nowrap transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="font-black text-white text-xs tracking-widest italic">RADIO NAKAMA</span>
                    <div className="flex items-center gap-1">
                        <Signal size={8} className="text-green-500 animate-pulse" />
                        <span className="font-mono text-[8px] text-cyan-600 font-bold">FREQ: 104.5 // OPEN</span>
                    </div>
                </div>

                {/* Status Light (Collapsed) */}
                {!isExpanded && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_5px_#22c55e] animate-ping"></div>
                )}
            </button>

            {/* RADIO BODY (Content) */}
            <div className={`
                bg-[#18181b]/95 backdrop-blur-md border border-cyan-900/50 rounded-b-lg shadow-2xl w-full overflow-hidden transition-all duration-300 flex flex-col
                ${isExpanded ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0 border-0'}
            `}>
                {/* Action Bar */}
                <div className="p-3 border-b border-white/5 bg-gradient-to-r from-cyan-950/30 to-transparent">
                    <button 
                        onClick={onRequestOpen}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold py-2 rounded-sm flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(6,182,212,0.3)] hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all group active:translate-y-[1px]"
                    >
                        <Plus size={12} className="group-hover:rotate-90 transition-transform" />
                        REQUEST MUSIC
                    </button>
                    <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-slate-500">
                        <span>COMMUNITY PICKS</span>
                        <span className="text-cyan-500">{activeSystem} MODE</span>
                    </div>
                </div>

                {/* Request List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar min-h-[100px]">
                    {activeList.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600 py-4 gap-2 opacity-60">
                            <UploadCloud size={24} strokeWidth={1.5} />
                            <span className="text-[9px] font-mono text-center">NO SIGNAL<br/>BE THE FIRST TO UPLOAD</span>
                        </div>
                    ) : (
                        activeList.map((tape) => (
                            <div 
                                key={tape.id}
                                onClick={() => onPlay(tape.id)}
                                className="group flex items-center justify-between p-2 rounded bg-white/5 hover:bg-white/10 border border-transparent hover:border-cyan-500/30 cursor-pointer transition-all active:scale-95"
                            >
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center shrink-0">
                                        <Music size={12} className="text-slate-400 group-hover:text-cyan-400" />
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-[10px] font-bold text-slate-200 truncate group-hover:text-cyan-300">{tape.title}</span>
                                        <span className="text-[8px] font-mono text-slate-500 truncate">{tape.creator || 'ANON'}</span>
                                    </div>
                                </div>
                                <Play size={10} className="text-slate-500 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" />
                            </div>
                        ))
                    )}
                </div>
                
                {/* Footer Deco */}
                <div className="h-2 bg-black flex items-center gap-1 px-2 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="w-[2px] h-[2px] rounded-full bg-cyan-900 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
                    ))}
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #18181b; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
            `}</style>
        </div>
    );
};

export default RadioPanel;
