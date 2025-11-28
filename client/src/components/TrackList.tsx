
import React from 'react';
import { Album, CassetteSide } from '../types';

interface TrackListProps {
    album: Album;
    currentSide: CassetteSide;
    currentSongIndex: number;
}

const TrackList: React.FC<TrackListProps> = ({ album, currentSide, currentSongIndex }) => {
    const renderSide = (side: 'A' | 'B', songs: any[]) => (
        <div className={`mb-4 ${side !== currentSide ? 'opacity-50 grayscale' : ''} transition-all duration-300`}>
            <h4 className="font-mono font-bold text-xs mb-2 border-b-2 border-slate-800/20 pb-1 flex justify-between items-center text-slate-800">
                <span className="bg-slate-800 text-white px-1.5 py-0.5 rounded-sm">SIDE {side}</span>
                <span className="text-[9px] font-bold tracking-widest opacity-60">{songs.length} TRACKS</span>
            </h4>
            <ul className="space-y-2.5">
                {songs.map((song, idx) => {
                    const isActive = side === currentSide && idx === currentSongIndex;
                    return (
                        <li key={idx} className={`text-[11px] font-mono flex justify-between items-center ${isActive ? 'text-blue-700 font-bold relative pl-3' : 'text-slate-600'}`}>
                            {isActive && <span className="absolute left-0 text-[8px] top-[3px] animate-pulse">▶</span>}
                            <span className="truncate max-w-[150px] uppercase tracking-tight">{song.title}</span>
                            <span className="font-bold opacity-50 tabular-nums tracking-tighter">{Math.floor(song.duration / 60)}:{String(Math.floor(song.duration % 60)).padStart(2, '0')}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );

    return (
        <div className="w-full h-full bg-[#fdfbf7] text-slate-900 p-6 relative overflow-y-auto custom-scrollbar shadow-2xl rounded-sm transform md:rotate-0 border border-slate-200" 
             style={{ 
                 backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")',
            }}>
            
            {/* Tape/Sticker Graphic at top */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-yellow-300/90 rotate-[-1.5deg] shadow-md border border-yellow-400/50 flex items-center justify-center">
                 <span className="text-[8px] font-mono text-yellow-900 font-bold uppercase tracking-widest opacity-70">Tracklist</span>
            </div>

            {/* Header - Handwriting style */}
            <div className="mt-4 mb-6 text-center border-b-4 double border-slate-800 pb-4">
                <h2 className="font-marker text-3xl leading-none text-slate-900 mb-2">{album.title}</h2>
                <p className="font-mono text-xs font-bold tracking-widest text-slate-500 uppercase bg-slate-100 inline-block px-2 py-1 rounded">{album.artist}</p>
            </div>

            {/* Content */}
            {renderSide('A', album.songs)}
            {album.sideB && renderSide('B', album.sideB)}

            {/* Footer Decoration */}
            <div className="mt-10 pt-6 border-t border-dashed border-slate-300 text-center opacity-50">
                <p className="font-mono text-[8px] uppercase tracking-widest">Nakama OS • High Fidelity Audio</p>
                <div className="w-full h-2 mt-2 bg-slate-200 rounded-full overflow-hidden">
                     <div className="h-full w-1/2 bg-slate-300 -skew-x-12"></div>
                </div>
            </div>
        </div>
    );
};

export default TrackList;
