
import React, { useState } from 'react';
import { X, Upload, Disc, User, Plus, Trash2, Play, ArrowLeft, Film, Music } from 'lucide-react';
import { VHSTape, CassetteTape, Track, SystemMode } from '../types';
import VHS from './VHS';
import Cassette from './Cassette';

interface TapeCreatorProps {
    onClose: () => void;
    onCreate: (tape: VHSTape | CassetteTape) => void;
    mode: SystemMode;
}

const TapeCreator: React.FC<TapeCreatorProps> = ({ onClose, onCreate, mode }) => {
    // TAPE META
    const [title, setTitle] = useState('');
    const [creator, setCreator] = useState('');
    
    // TRACK MANAGEMENT
    const [tracks, setTracks] = useState<Track[]>([]);
    const [trackUrl, setTrackUrl] = useState('');
    const [trackTitle, setTrackTitle] = useState('');

    const [loading, setLoading] = useState(false);
    
    // PREVIEW STATE
    const [previewItem, setPreviewItem] = useState<VHSTape | CassetteTape | null>(null);

    const parseUrl = (inputUrl: string): { type: Track['type'], id: string } | null => {
        // YouTube Regex
        const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const ytMatch = inputUrl.match(ytRegex);
        if (ytMatch && ytMatch[1]) return { type: 'youtube', id: ytMatch[1] };
        
        // TikTok Regex (Extract Video ID)
        const ttRegex = /tiktok\.com\/@[\w.-]+\/video\/(\d+)/i;
        const ttMatch = inputUrl.match(ttRegex);
        if (ttMatch && ttMatch[1]) return { type: 'tiktok', id: ttMatch[1] };

        // Instagram Regex (Extract Post ID)
        const igRegex = /instagram\.com\/(?:p|reel)\/([\w-]+)/i;
        const igMatch = inputUrl.match(igRegex);
        if (igMatch && igMatch[1]) return { type: 'instagram', id: igMatch[1] };

        // Generic Extensions
        if (inputUrl.match(/\.mp3$/i)) return { type: 'mp3', id: inputUrl };
        if (inputUrl.match(/\.mp4$/i)) return { type: 'mp4', id: inputUrl };

        // Fallback for YouTube if just ID provided (loose check)
        if (inputUrl.length === 11 && !inputUrl.includes('.') && !inputUrl.includes('/')) {
             return { type: 'youtube', id: inputUrl };
        }

        return null;
    };

    const handleAddTrack = (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackUrl) return;

        const parsed = parseUrl(trackUrl);
        if (!parsed) {
            alert("Invalid URL. Supported: YouTube, TikTok, Instagram, MP4, MP3.");
            return;
        }

        const newTrack: Track = {
            id: `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: trackTitle || (mode === 'VHS' ? `Clip #${tracks.length + 1}` : `Track #${tracks.length + 1}`),
            url: parsed.id,
            type: parsed.type,
            duration: 180, // Default dummy duration
            votes: 0,
            externalUrl: trackUrl
        };

        setTracks([...tracks, newTrack]);
        setTrackUrl('');
        setTrackTitle('');
    };

    const removeTrack = (id: string) => {
        setTracks(tracks.filter(t => t.id !== id));
    };

    const generatePreviewItem = () => {
        if (!title || !creator || tracks.length === 0) return null;

        const color = getRandomColor();
        const timestamp = Date.now();
        const idBase = mode === 'VHS' ? `user_vhs_${timestamp}` : `user_cassette_${timestamp}`;

        if (mode === 'VHS') {
            return {
                id: idBase,
                title: title.toUpperCase().substring(0, 16),
                label: `EDIT BY ${creator.toUpperCase()}`,
                color: color,
                tracks: tracks,
                rotation: 0,
                variant: 'bootleg',
                creator: creator.toUpperCase()
            } as VHSTape;
        } else {
             return {
                id: idBase,
                title: title.toUpperCase().substring(0, 16),
                artist: creator.toUpperCase(),
                color: color,
                labelColor: '#ffffff',
                tracks: tracks,
                rotation: 0,
                variant: 'c90',
                creator: creator.toUpperCase()
            } as CassetteTape;
        }
    };

    const handlePreviewClick = () => {
        const item = generatePreviewItem();
        if (item) setPreviewItem(item);
    };

    const handleLocalInject = () => {
        if (!previewItem) return;
        setLoading(true);
        setTimeout(() => {
            onCreate(previewItem);
            setLoading(false);
        }, 1000);
    };

    const handleTelegramSubmit = () => {
        if (!previewItem) return;
        
        const trackListStr = tracks.map(t => `- ${t.title} (${t.externalUrl})`).join('\n');
        
        const msg = `Voy a ser el Rey de los Emprendedores! 🏴‍☠️\n\nSubmitting new Nakama Artifact:\nSystem: ${mode}\nTitle: ${title}\nCreator: ${creator}\n\nTracks:\n${trackListStr}`;
        const telegramUrl = `https://t.me/Web3Sh4rK?text=${encodeURIComponent(msg)}`;
        window.open(telegramUrl, '_blank');
    };
    
    const getRandomColor = () => {
        const colors = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="w-full max-w-3xl bg-[#202023] border border-cyan-500/30 rounded-lg shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden relative flex flex-col max-h-[90vh]">
                
                {/* Scanline Overlay */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20 z-20"></div>

                {/* Header */}
                <div className="bg-[#18181b] p-4 flex justify-between items-center border-b border-cyan-500/20 relative z-30 shrink-0">
                    <h2 className="text-cyan-400 font-mono font-bold flex items-center gap-2 tracking-widest text-sm sm:text-base">
                        <Upload className="animate-pulse" size={16} />
                        NAKAMA_{mode}_UPLINK
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-red-400 transition-colors z-10">
                        <X size={20} />
                    </button>
                </div>

                {/* CONTENT AREA */}
                <div className="p-4 sm:p-6 relative z-10 overflow-y-auto custom-scrollbar flex-1">
                    
                    {!previewItem ? (
                        /* --- STEP 1: COMPILATION BUILDER --- */
                        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
                            
                            {/* LEFT: TAPE DETAILS & TRACK INPUT */}
                            <div className="space-y-6">
                                <div className="space-y-4 border-b border-white/5 pb-6">
                                    <h3 className="text-white/50 text-[10px] font-mono tracking-widest uppercase mb-2">1. ARTIFACT METADATA</h3>
                                    <div>
                                        <label className="flex items-center gap-2 text-[10px] font-mono text-cyan-600 mb-1 tracking-widest uppercase">
                                            <Disc size={12} /> {mode} Title
                                        </label>
                                        <input 
                                            type="text" 
                                            value={title} 
                                            onChange={e => setTitle(e.target.value)}
                                            maxLength={16}
                                            className="w-full bg-[#18181b] border border-slate-700 rounded-sm px-3 py-2 text-white focus:border-cyan-500 focus:bg-cyan-950/20 outline-none font-marker tracking-wider text-lg transition-all"
                                            placeholder={mode === 'VHS' ? "MIXTAPE_VOL_1" : "LOFI_STUDY_MIX"}
                                            autoFocus
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 text-[10px] font-mono text-cyan-600 mb-1 tracking-widest uppercase">
                                            <User size={12} /> Creator Name
                                        </label>
                                        <input 
                                            type="text" 
                                            value={creator} 
                                            onChange={e => setCreator(e.target.value)}
                                            maxLength={12}
                                            className="w-full bg-[#18181b] border border-slate-700 rounded-sm px-3 py-2 text-cyan-100 focus:border-cyan-500 focus:bg-cyan-950/20 outline-none font-mono text-sm transition-all"
                                            placeholder="SHARKY_DEV"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-white/50 text-[10px] font-mono tracking-widest uppercase mb-2">2. ADD TRACKS</h3>
                                    <form onSubmit={handleAddTrack} className="flex flex-col gap-2">
                                         <input 
                                            type="text" 
                                            value={trackUrl} 
                                            onChange={e => setTrackUrl(e.target.value)}
                                            className="w-full bg-[#18181b] border border-slate-700 rounded-sm px-3 py-2 text-slate-300 focus:border-cyan-500 outline-none font-mono text-xs"
                                            placeholder="Paste URL (YouTube, TikTok, Instagram...)"
                                        />
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                value={trackTitle} 
                                                onChange={e => setTrackTitle(e.target.value)}
                                                className="flex-1 bg-[#18181b] border border-slate-700 rounded-sm px-3 py-2 text-slate-300 focus:border-cyan-500 outline-none font-mono text-xs"
                                                placeholder="Track Title (Optional)"
                                            />
                                            <button 
                                                type="submit"
                                                disabled={!trackUrl}
                                                className="bg-cyan-700 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 rounded-sm flex items-center justify-center transition-colors"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* RIGHT: PLAYLIST */}
                            <div className="flex flex-col h-64 lg:h-auto bg-black/20 rounded border border-white/5 overflow-hidden">
                                <div className="bg-white/5 px-3 py-2 flex justify-between items-center border-b border-white/5">
                                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                                        TRACKLIST ({tracks.length})
                                    </span>
                                    {tracks.length > 0 && (
                                        <button onClick={() => setTracks([])} className="text-[9px] text-red-400 hover:text-red-300">CLEAR ALL</button>
                                    )}
                                </div>
                                
                                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                                    {tracks.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-2 opacity-50">
                                            {mode === 'VHS' ? <Film size={24} /> : <Music size={24} />}
                                            <span className="text-[10px] font-mono">LIST IS EMPTY</span>
                                        </div>
                                    ) : (
                                        tracks.map((t, i) => (
                                            <div key={t.id} className="flex items-center justify-between p-2 bg-white/5 rounded hover:bg-white/10 group transition-colors">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <span className="text-[10px] font-mono text-slate-500 w-4">{i+1}.</span>
                                                    <div className="flex flex-col overflow-hidden">
                                                        <span className="text-xs font-bold text-slate-300 truncate">{t.title}</span>
                                                        <span className="text-[9px] font-mono text-slate-500 truncate uppercase">{t.type}</span>
                                                    </div>
                                                </div>
                                                <button onClick={() => removeTrack(t.id)} className="text-slate-600 hover:text-red-400 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="p-3 border-t border-white/5 bg-[#18181b]">
                                     <button 
                                        onClick={handlePreviewClick}
                                        disabled={!title || !creator || tracks.length === 0}
                                        className={`
                                            w-full py-3 rounded-sm font-bold tracking-[0.2em] flex items-center justify-center gap-2 transition-all font-mono text-xs uppercase
                                            bg-slate-800 border border-slate-700 text-slate-300 
                                            ${(!title || !creator || tracks.length === 0) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-cyan-700 hover:text-white hover:border-cyan-500'}
                                        `}
                                    >
                                        GENERATE ARTIFACT
                                    </button>
                                </div>
                            </div>

                        </div>
                    ) : (
                        /* --- STEP 2: PREVIEW & ACTION --- */
                        <div className="flex flex-col items-center gap-6 animate-fadeIn h-full justify-center">
                             <div className="flex items-center justify-between w-full mb-2">
                                <button onClick={() => setPreviewItem(null)} className="text-[10px] flex items-center gap-1 text-slate-500 hover:text-cyan-400 transition-colors">
                                    <ArrowLeft size={10} /> BACK TO EDIT
                                </button>
                                <span className="text-[10px] font-mono text-cyan-500 animate-pulse">PREVIEW MODE</span>
                             </div>

                             {/* THE ARTIFACT */}
                             <div className="scale-75 sm:scale-100 transform transition-transform hover:scale-[1.02]">
                                {mode === 'VHS' 
                                    ? <VHS tape={previewItem as VHSTape} />
                                    : <Cassette tape={previewItem as CassetteTape} />
                                }
                             </div>

                             {/* ACTION GRID */}
                             <div className="w-full max-w-md grid grid-cols-2 gap-3 mt-4">
                                {/* Local Test */}
                                <button 
                                    onClick={handleLocalInject}
                                    disabled={loading}
                                    className={`
                                        py-4 rounded-sm font-bold flex flex-col items-center justify-center gap-1 transition-all font-mono text-[10px] uppercase border
                                        ${loading 
                                            ? 'bg-slate-900 border-slate-800 text-slate-500 cursor-wait' 
                                            : 'bg-slate-900/50 border-cyan-900/50 text-cyan-400 hover:bg-cyan-900/20 hover:border-cyan-500'}
                                    `}
                                >
                                    <Play size={16} />
                                    <span>{loading ? 'INJECTING...' : 'INJECT LOCAL (TEST)'}</span>
                                </button>

                                {/* Official Submit */}
                                <button 
                                    onClick={handleTelegramSubmit}
                                    className="py-4 rounded-sm font-bold flex flex-col items-center justify-center gap-1 transition-all font-mono text-[10px] uppercase bg-[#0088cc]/20 border border-[#0088cc]/50 text-[#0088cc] hover:bg-[#0088cc] hover:text-white hover:shadow-[0_0_15px_rgba(0,136,204,0.5)]"
                                >
                                    <Upload size={16} />
                                    <span>SEND TO CAPTAIN</span>
                                </button>
                             </div>

                             <div className="text-center bg-black/40 p-2 rounded border border-yellow-500/20 w-full max-w-md">
                                <p className="text-[9px] text-yellow-500/80 font-mono">
                                    ⚠ Official Nakama status requires approval from Captain Sharky D. Web3.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #18181b; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
            `}</style>
        </div>
    )
};

export default TapeCreator;
