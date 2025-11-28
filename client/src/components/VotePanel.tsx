
import React, { useEffect, useState } from 'react';
import { ThumbsUp, ThumbsDown, ExternalLink, Heart, Link as LinkIcon } from 'lucide-react';
import { playSfx } from '../sfx';

interface VotePanelProps {
    votes: number;
    userVote?: number; // -1, 0, 1. Passed from parent.
    onVote: (newVoteState: number) => void; // Passes the NEW desired state
    externalUrl?: string;
    variant?: 'screen' | 'lcd';
}

const VotePanel: React.FC<VotePanelProps> = ({ votes, userVote = 0, onVote, externalUrl, variant = 'screen' }) => {
    const [animate, setAnimate] = useState<'up' | 'down' | null>(null);

    // Trigger animation effect on vote change
    useEffect(() => {
        if (userVote === 1) {
            setAnimate('up');
            const t = setTimeout(() => setAnimate(null), 400); // Animation duration
            return () => clearTimeout(t);
        } else if (userVote === -1) {
            setAnimate('down');
            const t = setTimeout(() => setAnimate(null), 400);
            return () => clearTimeout(t);
        }
    }, [userVote]);

    // Handle toggling: if clicking same vote, reset to 0. Otherwise set to target.
    const handleVoteClick = (target: number) => {
        if (userVote === target) {
            onVote(0);
        } else {
            onVote(target);
            playSfx(target === 1 ? 'success' : 'click');
        }
    };

    const formatVotes = (num: number) => {
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num;
    };

    // --- LCD VARIANT (Boombox) ---
    if (variant === 'lcd') {
        return (
            <div className="flex items-center gap-2 bg-[#333] p-1 rounded border border-white/10 shadow-inner h-full select-none">
                <div className="flex flex-col gap-[1px]">
                    <button 
                        onClick={() => handleVoteClick(1)}
                        className={`
                            p-1 rounded-sm transition-all duration-200 active:scale-90
                            ${userVote === 1 
                                ? 'text-green-400 bg-green-400/10 shadow-[0_0_8px_rgba(74,222,128,0.4)]' 
                                : 'text-slate-500 hover:text-green-300 hover:bg-white/10 hover:scale-110'}
                            ${animate === 'up' ? '!scale-125 text-green-200 bg-green-500/30' : ''}
                        `}
                        title="Like"
                    >
                        <ThumbsUp size={10} fill={userVote === 1 ? "currentColor" : "none"} />
                    </button>
                    <button 
                        onClick={() => handleVoteClick(-1)}
                        className={`
                            p-1 rounded-sm transition-all duration-200 active:scale-90
                            ${userVote === -1 
                                ? 'text-red-400 bg-red-400/10 shadow-[0_0_8px_rgba(248,113,113,0.4)]' 
                                : 'text-slate-500 hover:text-red-300 hover:bg-white/10 hover:scale-110'}
                            ${animate === 'down' ? '!scale-125 text-red-200 bg-red-500/30' : ''}
                        `}
                        title="Dislike"
                    >
                        <ThumbsDown size={10} fill={userVote === -1 ? "currentColor" : "none"} />
                    </button>
                </div>
                
                {/* LCD Display for Score */}
                <div className="bg-[#48584e] h-full min-w-[50px] px-2 flex items-center justify-center rounded shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] relative overflow-hidden group cursor-default">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/pixel-weave.png')]"></div>
                    <span className={`font-mono text-xs font-bold tracking-widest transition-all duration-300 ${userVote === 1 ? 'text-green-300 drop-shadow-[0_0_5px_rgba(134,239,172,0.8)] scale-110' : (userVote === -1 ? 'text-red-300 drop-shadow-[0_0_5px_rgba(252,165,165,0.8)] scale-110' : 'text-[#a4f3b8]')}`}>
                        {formatVotes(votes)}
                    </span>
                </div>

                {externalUrl && (
                    <a 
                        href={externalUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="h-full px-2 flex items-center justify-center text-slate-500 hover:text-cyan-400 hover:bg-white/5 transition-all hover:scale-110 border-l border-white/10 ml-1 rounded-r-sm"
                        title="Open Source Link"
                        onClick={() => playSfx('click')}
                    >
                        <ExternalLink size={12} />
                    </a>
                )}
            </div>
        );
    }

    // --- SCREEN VARIANT (TV Overlay) ---
    return (
        <div className="backdrop-blur-md bg-black/60 border border-white/20 p-3 rounded-xl flex flex-col items-center gap-3 shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-black/70 select-none group/panel">
            <div className="flex items-center gap-4">
                {/* LIKE BUTTON */}
                <button 
                    onClick={() => handleVoteClick(1)}
                    className={`
                        group/btn relative p-3 rounded-full border-2 outline-none
                        transition-all duration-300 ease-out active:scale-95
                        ${userVote === 1 
                            ? 'bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.6)]' 
                            : 'bg-white/5 border-transparent text-slate-400 hover:bg-green-500/10 hover:border-green-500/50 hover:text-green-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:scale-110'}
                        
                        ${animate === 'up' ? '!scale-[1.4] !bg-green-500/40 !shadow-[0_0_40px_rgba(34,197,94,0.8)] !border-green-400 z-10' : ''}
                    `}
                >
                    <Heart 
                        size={20} 
                        className={`
                            transition-transform duration-300 
                            ${userVote === 1 ? "fill-current scale-110" : "group-hover/btn:scale-110"}
                            ${animate === 'up' ? "scale-125 animate-pulse" : ""}
                        `} 
                    />
                </button>

                {/* VOTE COUNT */}
                <div className="flex flex-col items-center min-w-[40px] transition-transform duration-300 group-hover/panel:scale-110">
                    <span className="font-mono text-[8px] text-slate-500 uppercase tracking-widest mb-1 opacity-0 group-hover/panel:opacity-100 transition-opacity">VOTES</span>
                    <span className={`font-mono text-xl font-bold tabular-nums leading-none transition-all duration-300 ${userVote !== 0 ? 'text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] scale-110' : 'text-white'}`}>
                        {formatVotes(votes)}
                    </span>
                </div>

                {/* DISLIKE BUTTON */}
                <button 
                    onClick={() => handleVoteClick(-1)}
                    className={`
                        group/btn relative p-3 rounded-full border-2 outline-none
                        transition-all duration-300 ease-out active:scale-95
                        ${userVote === -1 
                            ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.6)]' 
                            : 'bg-white/5 border-transparent text-slate-400 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:scale-110'}
                        
                        ${animate === 'down' ? '!scale-[1.4] !bg-red-500/40 !shadow-[0_0_40px_rgba(239,68,68,0.8)] !border-red-400 z-10' : ''}
                    `}
                >
                    <ThumbsDown 
                        size={20} 
                        className={`
                            transition-transform duration-300 
                            ${userVote === -1 ? "fill-current scale-110" : "group-hover/btn:scale-110"}
                            ${animate === 'down' ? "scale-125 animate-pulse" : ""}
                        `}
                    />
                </button>
            </div>

            {externalUrl && (
                <a 
                    href={externalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-cyan-600 text-xs font-bold tracking-wider text-slate-300 hover:text-white rounded-lg transition-all duration-300 border border-white/10 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.6)] group transform hover:-translate-y-1 hover:scale-[1.02]"
                    onClick={() => playSfx('click')}
                >
                    <LinkIcon size={12} className="group-hover:rotate-45 transition-transform duration-300" />
                    <span>SOURCE LINK</span>
                </a>
            )}
        </div>
    );
};

export default VotePanel;
