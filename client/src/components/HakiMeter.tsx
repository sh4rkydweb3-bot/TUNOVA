
import React from 'react';
import { UserRank } from '../types';
import { Zap, Trophy, Activity } from 'lucide-react';

interface HakiMeterProps {
    rank: UserRank;
    className?: string;
}

const HakiMeter: React.FC<HakiMeterProps> = ({ rank, className = "" }) => {
    // Calculate progress to next rank (simplified thresholds based on App.tsx)
    const getProgress = () => {
        if (rank.haki < 50) return (rank.haki / 50) * 100; // Rookie
        if (rank.haki < 100) return ((rank.haki - 50) / 50) * 100; // Captain
        if (rank.haki < 200) return ((rank.haki - 100) / 100) * 100; // Supernova
        if (rank.haki < 500) return ((rank.haki - 200) / 300) * 100; // Yonko
        return 100; // Pirate King
    };

    return (
        <div className={`flex flex-col gap-1 select-none pointer-events-none ${className}`}>
            
            {/* Haki Label & Icon */}
            <div className="flex items-center gap-2 mb-1">
                <div className="relative">
                    <div className="absolute inset-0 bg-current blur-sm opacity-50" style={{ color: rank.aura }}></div>
                    <Zap size={20} className="relative z-10 text-yellow-400 fill-current animate-pulse" />
                </div>
                <span className="font-mono text-xs font-bold tracking-[0.2em] text-slate-400">HAKI_LEVEL</span>
            </div>

            {/* Main Meter Container */}
            <div className="bg-black/60 backdrop-blur-sm border border-slate-700/50 p-3 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.5)] min-w-[200px] relative overflow-hidden group">
                
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:10px_10px]"></div>
                
                <div className="relative z-10 flex justify-between items-end mb-2">
                    <div className="flex flex-col">
                        <span className="font-black text-2xl italic leading-none tracking-tighter" style={{ color: rank.aura, textShadow: `0 0 10px ${rank.aura}` }}>
                            {rank.haki}
                        </span>
                        <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Power Level</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="font-marker text-lg leading-none text-white opacity-90">{rank.title}</span>
                        <div className="flex items-center gap-1">
                            <Trophy size={10} className="text-yellow-500" />
                            <span className="font-mono text-[8px] text-yellow-500 font-bold">RANK</span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden relative">
                    <div 
                        className="h-full relative transition-all duration-1000 ease-out"
                        style={{ width: `${getProgress()}%`, backgroundColor: rank.aura, boxShadow: `0 0 10px ${rank.aura}` }}
                    >
                        <div className="absolute inset-0 bg-white/30 animate-[pulse_2s_infinite]"></div>
                    </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-1 right-1 opacity-20">
                    <Activity size={16} className="text-white" />
                </div>
            </div>
            
            {/* System Status Line */}
            <div className="flex items-center gap-2 px-1 opacity-60">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="font-mono text-[8px] text-green-500 tracking-wider">SYSTEM ONLINE</span>
            </div>
        </div>
    );
};

export default HakiMeter;
