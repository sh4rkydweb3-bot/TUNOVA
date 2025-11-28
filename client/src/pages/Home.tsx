
import React, { useState, useRef, useEffect } from 'react';
import { TAPES, CASSETTES } from '../constants';
import { VHSTape, CassetteTape, SystemMode, Track, UserRank } from '../types';
import VHS from '../components/VHS';
import Cassette from '../components/Cassette';
import Screen from '../components/Screen';
import Controls from '../components/Controls';
import BeatBunny from '../components/BeatBunny';
import BackgroundFx from '../components/BackgroundFx';
import TapeCreator from '../components/TapeCreator';
import VolumeKnob from '../components/VolumeKnob';
import Boombox from '../components/Boombox';
import AgentChat from '../components/AgentChat';
import RadioTicker from '../components/RadioTicker';
import HakiMeter from '../components/HakiMeter';
import RadioPanel from '../components/RadioPanel';
import { Tv, RefreshCw, Speaker, Plus, Zap } from 'lucide-react';
import { playSfx } from '../sfx';

const App: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  // --- SYSTEM STATE ---
  const [activeSystem, setActiveSystem] = useState<SystemMode>('VHS');
  const [isSwapping, setIsSwapping] = useState(false);

  // --- MEDIA DATA ---
  const [vhsLibrary, setVhsLibrary] = useState<VHSTape[]>(TAPES);
  const [cassetteLibrary, setCassetteLibrary] = useState<CassetteTape[]>(CASSETTES);
  
  // --- SHUFFLE HISTORY ---
  const [recentCassettes, setRecentCassettes] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // --- AGENT & RANKING (NAKAMA OS) ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hakiScore, setHakiScore] = useState(10); // Start with some Haki
  const [tickerMessages, setTickerMessages] = useState<string[]>([]);
  const [isHakiActive, setIsHakiActive] = useState(false); // HAKI VISUAL MODE
  
  const getRank = (score: number): UserRank => {
      if (score > 5000) return { haki: score, title: 'PIRATE KING', aura: '#fbbf24' }; // Gold (Roger/Luffy)
      if (score > 2500) return { haki: score, title: 'YONKO', aura: '#dc2626' }; // Red (Conqueror)
      if (score > 1000) return { haki: score, title: 'WARLORD', aura: '#7c3aed' }; // Violet (Shichibukai)
      if (score > 500) return { haki: score, title: 'SUPERNOVA', aura: '#06b6d4' }; // Cyan (Worst Generation)
      if (score > 100) return { haki: score, title: 'PIRATE', aura: '#10b981' }; // Emerald (Nakama)
      return { haki: score, title: 'CHORE BOY', aura: '#64748b' }; // Slate (Grumete)
  };

  const updateHaki = (points: number) => {
      setHakiScore(prev => prev + points);
  };

  // --- VOTING STATE ---
  // Global Total Votes
  const [trackVotes, setTrackVotes] = useState<Record<string, number>>(() => {
      const initial: Record<string, number> = {};
      TAPES.forEach(t => t.tracks.forEach(tr => initial[tr.id] = tr.votes || 0));
      CASSETTES.forEach(t => t.tracks.forEach(tr => initial[tr.id] = tr.votes || 0));
      return initial;
  });
  // Local User Vote Status: -1 (Down), 0 (None), 1 (Up)
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});

  // --- PLAYER STATE ---
  const [currentVhsId, setCurrentVhsId] = useState<string | null>(null);
  const [currentCassetteId, setCurrentCassetteId] = useState<string | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPowered, setIsPowered] = useState(true); 
  const [volume, setVolume] = useState(0.5);
  const [isLoFi, setIsLoFi] = useState(false);
  
  // --- UI STATE ---
  const [isMobile, setIsMobile] = useState(false);
  const [isInserting, setIsInserting] = useState(false);
  const [isEjecting, setIsEjecting] = useState(false);
  const [tracking, setTracking] = useState(0);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isHoveringDropZone, setIsHoveringDropZone] = useState(false);

  // --- DRAG & DROP ---
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const [vhsPositions, setVhsPositions] = useState<Record<string, { x: number, y: number, rotation: number }>>({});
  const [cassettePositions, setCassettePositions] = useState<Record<string, { x: number, y: number, rotation: number }>>({});
  
  const playerRef = useRef<HTMLDivElement>(null); 
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // --- AUDIO FX (Web Audio API) ---
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  // --- DERIVED DATA ---
  const currentVhs = vhsLibrary.find(t => t.id === currentVhsId);
  const currentCassette = cassetteLibrary.find(t => t.id === currentCassetteId);
  
  const activeMedia = activeSystem === 'VHS' ? currentVhs : currentCassette;
  // Safely access track
  const currentTrack: Track | null = activeMedia && activeMedia.tracks[currentTrackIndex] ? activeMedia.tracks[currentTrackIndex] : null;

  // --- INITIALIZATION ---
  useEffect(() => {
     setMounted(true);
     const handleResize = () => {
         const mobile = window.innerWidth < 768;
         setIsMobile(mobile);
         
         if (!mobile) {
             const width = window.innerWidth;
             const height = window.innerHeight;

             // Initialize VHS Positions
             setVhsPositions(prev => {
                 const newPos: any = { ...prev };
                 vhsLibrary.forEach((t, i) => {
                     if (!newPos[t.id]) {
                         const side = i % 2 === 0 ? 'left' : 'right';
                         newPos[t.id] = {
                             x: side === 'left' ? 40 + (Math.random() * 100) : width - 340 - (Math.random() * 100),
                             y: 100 + (Math.floor(i/2) * 160) + (Math.random() * 40),
                             rotation: t.rotation || (Math.random() * 20 - 10)
                         };
                     }
                 });
                 return newPos;
             });

             // Initialize Cassette Positions
             setCassettePositions(prev => {
                 const newPos: any = { ...prev };
                 cassetteLibrary.forEach((t, i) => {
                    if (!newPos[t.id]) {
                        newPos[t.id] = {
                            x: Math.random() * (width - 300) + 100,
                            y: Math.random() * (height - 400) + 300,
                            rotation: Math.random() * 180 - 90
                        };
                    }
                 });
                 return newPos;
             });
         }
     };
     
     handleResize();
     window.addEventListener('resize', handleResize);
     return () => window.removeEventListener('resize', handleResize);
  }, [vhsLibrary.length, cassetteLibrary.length]);


  // --- AUDIO LOGIC (MP3 Only) ---
  useEffect(() => {
      // 1. Initialize Audio Context only once or if missing
      const initAudio = () => {
          if (!audioCtxRef.current) {
              try {
                  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                  const ctx = new AudioContext();
                  audioCtxRef.current = ctx;

                  // Create Nodes
                  const newAnalyser = ctx.createAnalyser();
                  newAnalyser.fftSize = 256; // 128 bins
                  setAnalyser(newAnalyser);

                  const filter = ctx.createBiquadFilter();
                  filter.type = "lowpass";
                  filter.frequency.value = 20000;
                  filterNodeRef.current = filter;

                  // Connect Filter -> Analyser -> Dest
                  // Source will be connected when audio element is ready
                  filter.connect(newAnalyser);
                  newAnalyser.connect(ctx.destination);
              } catch (e) {
                  console.warn("Audio Context Init Failed", e);
              }
          }
      }

      // 2. Handle Audio Element Source
      if (activeSystem === 'CASSETTE' && currentTrack?.type === 'mp3' && currentTrack.url) {
          initAudio();
          
          if (!audioRef.current) {
              audioRef.current = new Audio();
              audioRef.current.crossOrigin = "anonymous"; 
          }
          
          const audio = audioRef.current;
          if (audio.src !== currentTrack.url) {
             audio.src = currentTrack.url;
          }
          audio.volume = volume;

          // Connect MediaElementSource if not already connected
          if (audioCtxRef.current && !sourceNodeRef.current) {
              try {
                  const source = audioCtxRef.current.createMediaElementSource(audio);
                  sourceNodeRef.current = source;
                  // Connect Source -> Filter (Start of chain)
                  if(filterNodeRef.current) {
                      source.connect(filterNodeRef.current);
                  }
              } catch(e) {
                  // Sometimes source connection fails if element already connected
                  // console.warn("Media Source Connection Failed", e);
              }
          }
          
          if (isPlaying) {
             // Resume context if suspended (browser policy)
             if (audioCtxRef.current?.state === 'suspended') {
                 audioCtxRef.current.resume().catch(() => {});
             }
             const playPromise = audio.play();
             if (playPromise !== undefined) {
                playPromise.catch(error => {
                    // console.warn("Autoplay prevented:", error);
                    setIsPlaying(false);
                });
            }
          } else {
              audio.pause();
          }
          
          audio.onended = nextTrack;
          
          return () => { audio.pause(); };
      } else if (audioRef.current) {
          // If switching away from cassette or MP3
          audioRef.current.pause();
      }
  }, [currentTrack, activeSystem, isPlaying]);

  // Handle Play/Pause & Volume changes
  useEffect(() => {
      if (audioRef.current) {
          audioRef.current.volume = volume;
          if (isPlaying && activeSystem === 'CASSETTE' && currentTrack?.type === 'mp3') {
               // Ensure context is running
               if (audioCtxRef.current?.state === 'suspended') {
                  audioCtxRef.current.resume().catch(() => {});
               }
               audioRef.current.play().catch(() => {});
              
              // Add Haki while playing music
              const hakiInterval = setInterval(() => {
                 updateHaki(1);
              }, 10000); 
              return () => clearInterval(hakiInterval);
          } else {
              audioRef.current.pause();
          }
      }
  }, [isPlaying, volume, activeSystem]);

  // Handle Lo-Fi Effect
  useEffect(() => {
      if (filterNodeRef.current && audioCtxRef.current) {
          const ctx = audioCtxRef.current;
          const now = ctx.currentTime;
          
          // Safety check: Avoid invalid time values if context was just created
          if (now < 0.001) return;

          if (isLoFi) {
              filterNodeRef.current.frequency.setTargetAtTime(800, now, 0.2);
              filterNodeRef.current.Q.setTargetAtTime(8, now, 0.2); 
          } else {
              filterNodeRef.current.frequency.setTargetAtTime(22000, now, 0.2);
              filterNodeRef.current.Q.setTargetAtTime(1, now, 0.2);
          }
      }
  }, [isLoFi]);

  // --- ACTIONS ---

  const switchSystem = () => {
      playSfx('switch');
      setIsSwapping(true);
      setIsPlaying(false);
      setTimeout(() => {
          setActiveSystem(prev => prev === 'VHS' ? 'CASSETTE' : 'VHS');
          setIsSwapping(false);
      }, 800);
  };

  const handleToggleHaki = () => {
      if (!isHakiActive) playSfx('haki_trigger');
      else playSfx('switch');
      setIsHakiActive(!isHakiActive);
  };

  const handleUserVote = (trackId: string, newVoteState: number) => {
      const oldVoteState = userVotes[trackId] || 0;
      const delta = newVoteState - oldVoteState;
      
      setUserVotes(prev => ({...prev, [trackId]: newVoteState}));
      setTrackVotes(prev => ({
          ...prev, 
          [trackId]: (prev[trackId] || 0) + delta
      }));
      // Voting gives Haki
      if (newVoteState !== 0) updateHaki(2);
  };

  const handleDragStart = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if (isMobile) { loadMedia(id); return; }
      
      const positions = activeSystem === 'VHS' ? vhsPositions : cassettePositions;
      const pos = positions[id];
      
      if (pos) {
        setDraggingId(id);
        setDragOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
      }
  };

  const checkCollision = (clientX: number, clientY: number) => {
      if (!playerRef.current) return false;
      const rect = playerRef.current.getBoundingClientRect();
      return (
          clientX >= rect.left - 50 &&
          clientX <= rect.right + 50 &&
          clientY >= rect.top - 50 &&
          clientY <= rect.bottom + 50
      );
  };

  const handleDragMove = (e: React.MouseEvent) => {
      if (draggingId) {
          const setPos = activeSystem === 'VHS' ? setVhsPositions : setCassettePositions;
          setPos(prev => ({
              ...prev,
              [draggingId]: {
                  ...prev[draggingId],
                  x: e.clientX - dragOffset.x,
                  y: e.clientY - dragOffset.y,
                  rotation: 0
              }
          }));

          setIsHoveringDropZone(checkCollision(e.clientX, e.clientY));
      }
  };

  const handleDragEnd = (e: React.MouseEvent) => {
      if (!draggingId) return;
      
      const isOver = checkCollision(e.clientX, e.clientY);

      if (isOver) {
          const currentId = activeSystem === 'VHS' ? currentVhsId : currentCassetteId;
          if (currentId) {
              ejectMedia(() => loadMedia(draggingId));
          } else {
              loadMedia(draggingId);
          }
      }
      
      setIsHoveringDropZone(false);
      setDraggingId(null);
  };

  const loadMedia = (id: string) => {
      playSfx('insert');
      setIsInserting(true);
      setTimeout(() => {
          if (activeSystem === 'VHS') {
            setCurrentVhsId(id);
          } else {
            setCurrentCassetteId(id);
          }
          setCurrentTrackIndex(0);
          setIsInserting(false);
          setTimeout(() => setIsPlaying(true), 1000);
          updateHaki(5); // Loading a tape gives points
      }, 1500);
  };

  const ejectMedia = (callback?: () => void) => {
      const currentId = activeSystem === 'VHS' ? currentVhsId : currentCassetteId;
      if (!currentId) { callback?.(); return; }
      
      playSfx('eject');
      setIsEjecting(true);
      setIsPlaying(false);
      
      setTimeout(() => {
          if (!isMobile && playerRef.current) {
              const rect = playerRef.current.getBoundingClientRect();
              const setPos = activeSystem === 'VHS' ? setVhsPositions : setCassettePositions;
              
              setPos(prev => ({
                  ...prev,
                  [currentId]: {
                      x: rect.left + (activeSystem === 'VHS' ? -300 : -200) + (Math.random() * 50),
                      y: rect.bottom + 50,
                      rotation: Math.random() * 20 - 10
                  }
              }));
          }
          if (activeSystem === 'VHS') setCurrentVhsId(null);
          else setCurrentCassetteId(null);
          
          setIsEjecting(false);
          callback?.();
      }, 1500);
  };

  const handleRandomCassette = () => {
      if (isInserting || isEjecting || isSwapping || isSearching) return;
      setIsSearching(true);
      updateHaki(2); // Using smart shuffle gives Haki
      playSfx('switch'); // Start noise
      
      setTimeout(() => {
          let candidates = cassetteLibrary.filter(t => t.id !== currentCassetteId);
          const historyLimit = Math.max(1, Math.floor(cassetteLibrary.length / 2)); 
          const available = candidates.filter(t => !recentCassettes.includes(t.id));
          const finalPool = available.length > 0 ? available : candidates;
          
          if (finalPool.length === 0) {
              setIsSearching(false);
              return;
          }
          
          const randomTape = finalPool[Math.floor(Math.random() * finalPool.length)];

          setRecentCassettes(prev => {
              const newHistory = [randomTape.id, ...prev];
              return newHistory.slice(0, historyLimit);
          });

          setIsSearching(false);

          if (currentCassetteId) {
              ejectMedia(() => loadMedia(randomTape.id));
          } else {
              loadMedia(randomTape.id);
          }
      }, 800);
  };

  const nextTrack = () => {
      playSfx('click');
      if(!activeMedia || activeMedia.tracks.length === 0) return;
      setCurrentTrackIndex((prev) => (prev + 1) % activeMedia.tracks.length);
  };

  const prevTrack = () => {
      playSfx('click');
      if(!activeMedia || activeMedia.tracks.length === 0) return;
      setCurrentTrackIndex((prev) => (prev - 1 + activeMedia.tracks.length) % activeMedia.tracks.length);
  };

  // --- RENDER ---
  if (!mounted) return <div className="min-h-screen bg-[#101012]" />;

  const rank = getRank(hakiScore);

  return (
    <div 
        className="min-h-screen w-full overflow-hidden relative bg-[#101012] font-sans text-white select-none touch-none md:touch-auto"
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
    >
        {/* AMBIENT FX */}
        <BackgroundFx analyser={analyser} isPlaying={isPowered && isPlaying} isHakiActive={isHakiActive} />

        {/* AI AGENT CHAT */}
        <AgentChat 
            isOpen={isChatOpen} 
            onClose={() => {
                playSfx('click');
                setIsChatOpen(false);
            }} 
            userRank={rank}
            onRankUpdate={updateHaki}
        />

        {/* HUD: HAKI METER (Left) */}
        {!isMobile && (
            <div className="fixed top-20 left-4 z-40">
                <HakiMeter rank={rank} />
            </div>
        )}

        {/* HUD: SYSTEM SWITCHER (Right) */}
        <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
            <div className="hidden md:block text-[10px] font-mono text-slate-500 tracking-widest mb-1">SELECT SYSTEM</div>
            <button 
                onClick={switchSystem}
                disabled={isSwapping}
                className={`
                    flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-4 md:py-2 rounded-full border-2 font-bold tracking-wider transition-all text-xs md:text-sm
                    ${activeSystem === 'VHS' 
                        ? 'bg-black/50 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                        : 'bg-black/50 border-pink-500 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.3)]'}
                    ${isSwapping ? 'opacity-50 cursor-wait' : 'hover:scale-105 active:scale-95'}
                `}
            >
                {activeSystem === 'VHS' ? <Tv size={16} className="md:w-[18px] md:h-[18px]" /> : <Speaker size={16} className="md:w-[18px] md:h-[18px]" />}
                <span>{activeSystem === 'VHS' ? 'VCR' : 'DECK'}</span>
                <RefreshCw size={12} className={`ml-1 md:ml-2 ${isSwapping ? 'animate-spin' : ''}`} />
            </button>
        </div>

        {/* RADIO NAKAMA PANEL */}
        {!isMobile && (
            <RadioPanel 
                activeSystem={activeSystem}
                vhsLibrary={vhsLibrary}
                cassetteLibrary={cassetteLibrary}
                onRequestOpen={() => {
                    playSfx('click');
                    setIsCreatorOpen(true);
                }}
                onPlay={(id) => {
                    const currentId = activeSystem === 'VHS' ? currentVhsId : currentCassetteId;
                    if (currentId) ejectMedia(() => loadMedia(id));
                    else loadMedia(id);
                }}
            />
        )}

        {/* SUBMISSION UPLINK MODAL */}
        {isCreatorOpen && (
            <TapeCreator 
                mode={activeSystem}
                onClose={() => {
                    playSfx('click');
                    setIsCreatorOpen(false);
                }} 
                onCreate={(t: any) => {
                    if (activeSystem === 'VHS') setVhsLibrary(prev => [...prev, t]);
                    else setCassetteLibrary(prev => [...prev, t]);
                    
                    const initialVotes: any = {};
                    t.tracks.forEach((track: any) => initialVotes[track.id] = 0);
                    setTrackVotes(prev => ({...prev, ...initialVotes}));

                    playSfx('success');
                    setIsCreatorOpen(false);
                    updateHaki(20); 
                    
                    const creatorName = t.creator || 'UNKNOWN';
                    setTickerMessages(prev => [`NEW ${activeSystem} UPLOAD: ${t.title} BY ${creatorName}`, ...prev]);
                }} 
            />
        )}

        {/* DESKTOP MEDIA ITEMS (Draggable) */}
        {!isMobile && (
            <div className={`fixed inset-0 z-0 transition-opacity duration-500 ${isSwapping ? 'opacity-0' : 'opacity-100'}`}>
                 <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,#333_1px,transparent_1px)] bg-[length:20px_20px]"></div>
                 
                 {/* VHS TAPES */}
                 {activeSystem === 'VHS' && vhsLibrary.map(tape => {
                     if (tape.id === currentVhsId) return null;
                     const pos = vhsPositions[tape.id] || {x: -999, y: -999, rotation: 0};
                     const isDragging = draggingId === tape.id;
                     return (
                         <div key={tape.id}
                              style={{ left: pos.x, top: pos.y, transform: `rotate(${pos.rotation}deg)`, zIndex: isDragging ? 100 : 10 }}
                              className="absolute transition-transform duration-75"
                         >
                             <VHS 
                                tape={tape} 
                                state={isDragging ? 'dragging' : 'idle'}
                                onMouseDown={(e) => handleDragStart(e, tape.id)}
                                className="w-[280px] h-[160px]"
                             />
                         </div>
                     );
                 })}

                 {/* CASSETTES */}
                 {activeSystem === 'CASSETTE' && cassetteLibrary.map(tape => {
                     if (tape.id === currentCassetteId) return null;
                     const pos = cassettePositions[tape.id] || {x: -999, y: -999, rotation: 0};
                     const isDragging = draggingId === tape.id;
                     return (
                         <div key={tape.id}
                              style={{ left: pos.x, top: pos.y, transform: `rotate(${pos.rotation}deg)`, zIndex: isDragging ? 100 : 10 }}
                              className="absolute transition-transform duration-75"
                         >
                             <Cassette 
                                tape={tape} 
                                state={isDragging ? 'dragging' : 'idle'}
                                onMouseDown={(e) => handleDragStart(e, tape.id)}
                             />
                         </div>
                     );
                 })}
            </div>
        )}

        {/* MAIN PLAYER STAGE */}
        <div 
            className={`fixed inset-0 flex items-center justify-center z-20 pointer-events-none transition-all duration-700 transform ${isSwapping ? 'scale-90 opacity-0 blur-sm' : 'scale-100 opacity-100 blur-0'}`}
            style={{perspective: '2000px'}}
        >
            
            {/* SYSTEM A: VHS & TV */}
            {activeSystem === 'VHS' && (
                <div 
                    className="flex flex-col items-center gap-4 pointer-events-auto scale-[0.60] sm:scale-[0.85] lg:scale-100 origin-center"
                    style={{
                        animation: 'flipIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        transformStyle: 'preserve-3d'
                    }}
                >
                     {/* TV */}
                     <div className={`relative w-[340px] h-[280px] md:w-[440px] md:h-[360px] bg-[#202023] rounded-[3rem] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-500 ${!isPowered ? 'brightness-50' : ''}`}>
                         <div className={`absolute bottom-6 right-10 w-2 h-2 rounded-full shadow-[0_0_5px_currentColor] z-50 transition-colors duration-300 ${isPowered ? 'bg-green-500 text-green-500' : 'bg-red-900 text-red-900'}`}></div>
                         {isPowered ? (
                            <Screen 
                                track={currentTrack} 
                                isPlaying={isPlaying} 
                                glitchAmount={tracking} 
                                onEnded={nextTrack}
                                volume={volume}
                                currentVotes={currentTrack ? trackVotes[currentTrack.id] : 0}
                                currentUserVote={currentTrack ? userVotes[currentTrack.id] || 0 : 0}
                                onVote={(val) => currentTrack && handleUserVote(currentTrack.id, val)}
                            />
                         ) : (
                            <div className="w-full h-full bg-black rounded-[2.5rem]"></div>
                         )}
                         {/* BeatBunny */}
                         <div className="absolute -top-[4.5rem] right-6 md:-top-24 md:right-12 scale-75 md:scale-100 origin-bottom z-10 filter drop-shadow-xl">
                             <BeatBunny 
                                isPlaying={isPlaying} 
                                isChatOpen={isChatOpen}
                                onClick={() => {
                                    playSfx('notification');
                                    setIsChatOpen(!isChatOpen);
                                }}
                             />
                         </div>
                    </div>

                    {/* VCR */}
                    <div 
                        ref={playerRef}
                        className={`
                            relative w-[360px] md:w-[460px] h-[160px] bg-[#18181b] rounded-sm border-t border-white/10 shadow-2xl flex flex-col p-6 gap-4 transition-all duration-300
                            ${isHoveringDropZone ? 'ring-2 ring-cyan-500 ring-offset-4 ring-offset-[#101012] shadow-[0_0_30px_rgba(6,182,212,0.4)]' : ''}
                        `}
                    >
                        {/* HAKI TOGGLE (Integrated into VCR Panel) */}
                         <div className="absolute top-6 right-6">
                             <button 
                                onClick={handleToggleHaki}
                                className={`
                                    relative px-3 py-1 rounded-[2px] font-bold font-mono text-[10px] tracking-widest uppercase transition-all duration-200 flex items-center gap-2 border shadow-sm
                                    ${isHakiActive 
                                        ? 'bg-red-600/20 text-red-400 border-red-500 shadow-[0_0_10px_rgba(220,38,38,0.4)] animate-pulse' 
                                        : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:text-red-400 hover:border-red-500/50'}
                                `}
                            >
                                <Zap size={10} className={isHakiActive ? 'fill-current' : ''} />
                                <span>TURBO_HAKI</span>
                            </button>
                        </div>


                        <div className="flex justify-between items-center pl-6 pr-24">
                            <div className="flex items-center gap-2">
                                <Tv size={18} className="text-cyan-500" />
                                <span className="font-mono font-black tracking-widest text-lg italic text-slate-200">NAKAMA<span className="text-cyan-500">VISION</span></span>
                            </div>
                        </div>

                        {/* Slot */}
                        <div className="relative h-16 bg-black/60 border-b border-white/10 rounded flex items-center justify-center overflow-hidden shadow-[inset_0_5px_10px_black]">
                            <div className="absolute inset-x-2 top-0 bottom-0 bg-[#27272a] border-b border-white/5 origin-top transition-transform duration-300 z-20 flex items-end justify-center pb-1"
                                 style={{ transform: (isInserting || isEjecting) ? 'rotateX(-90deg)' : 'rotateX(0deg)' }}
                            >
                                <div className="w-1/2 h-1 bg-white/10 rounded-full"></div>
                            </div>
                            {currentVhs && (
                                <div className={`absolute transition-all duration-[1500ms] ease-in-out z-10 ${isInserting ? 'translate-y-[0] scale-90 opacity-100' : ''} ${!isInserting && !isEjecting ? 'translate-y-1 opacity-0' : ''} ${isEjecting ? 'translate-y-[0] scale-95 opacity-100' : ''}`}>
                                    <VHS tape={currentVhs} className="w-[240px] h-[140px]" state="inserted" />
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 items-center justify-between relative">
                            <div className="flex-1">
                                <Controls 
                                    isPlaying={isPlaying} 
                                    hasTape={!!currentVhsId}
                                    onToggle={() => setIsPlaying(!isPlaying)}
                                    onNext={nextTrack} onPrev={prevTrack} onEject={() => ejectMedia()}
                                    onFlip={() => {
                                        playSfx(isPowered ? 'power_off' : 'power_on');
                                        setIsPowered(!isPowered);
                                    }} 
                                />
                            </div>
                            <VolumeKnob volume={volume} onChange={setVolume} />
                        </div>
                    </div>
                </div>
            )}

            {/* SYSTEM B: CASSETTE & BOOMBOX */}
            {activeSystem === 'CASSETTE' && (
                <div 
                    className="pointer-events-auto flex flex-col items-center gap-8 relative scale-[0.70] sm:scale-[0.85] lg:scale-100 origin-center"
                    style={{
                        animation: 'flipIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        transformStyle: 'preserve-3d'
                    }}
                >
                     {/* Hidden Screen for YouTube Audio */}
                     <div className="fixed top-0 left-0 w-1 h-1 opacity-0 pointer-events-none">
                        <Screen track={currentTrack} isPlaying={isPlaying} glitchAmount={0} volume={volume} onEnded={nextTrack} />
                     </div>
                    
                     {/* BeatBunny */}
                     <div className="absolute -top-16 left-8 md:-top-20 md:left-0 z-0 rotate-[-5deg] scale-75 md:scale-100 origin-bottom">
                         <BeatBunny 
                            isPlaying={isPlaying} 
                            isChatOpen={isChatOpen}
                            onClick={() => {
                                playSfx('notification');
                                setIsChatOpen(!isChatOpen);
                            }}
                         />
                     </div>

                     <div ref={playerRef} className="relative">
                        
                        {/* HAKI TOGGLE (BOOMBOX - Industrial Switch Style) */}
                        <div className="absolute -right-16 top-10 z-50 flex flex-col items-center group">
                            {/* Cable Connector */}
                            <div className="absolute top-1/2 right-full w-4 h-2 bg-gradient-to-b from-zinc-700 to-zinc-900"></div>

                            <button 
                                onClick={handleToggleHaki}
                                className={`
                                    relative w-14 h-24 rounded-lg border-[3px] flex flex-col items-center justify-between p-2 transition-all duration-300 shadow-xl
                                    ${isHakiActive 
                                        ? 'bg-[#1a0505] border-red-600 shadow-[0_0_25px_rgba(220,38,38,0.5)]' 
                                        : 'bg-zinc-800 border-zinc-600 hover:border-red-400'}
                                `}
                                title="LIMIT BREAK"
                            >
                                {/* Warning Strip */}
                                <div className="absolute top-1 left-1 right-1 h-1.5 bg-[repeating-linear-gradient(45deg,#000,#000_2px,#fbbf24_2px,#fbbf24_4px)] rounded-sm opacity-50"></div>

                                {/* Top LED */}
                                <div className={`mt-2 w-3 h-3 rounded-full border border-black transition-all duration-200 ${isHakiActive ? 'bg-red-500 shadow-[0_0_10px_red] animate-pulse' : 'bg-red-950'}`}></div>
                                
                                {/* Toggle Switch */}
                                <div className="relative w-5 h-10 bg-black rounded-full shadow-[inset_0_0_5px_rgba(0,0,0,1)] flex justify-center border border-white/10">
                                    <div className={`
                                        absolute w-6 h-6 rounded-sm border shadow-lg transition-all duration-200 flex items-center justify-center
                                        ${isHakiActive 
                                            ? 'top-[-2px] bg-gradient-to-b from-red-600 to-red-800 border-red-400' 
                                            : 'bottom-[-2px] bg-gradient-to-b from-zinc-300 to-zinc-500 border-zinc-400'}
                                    `}>
                                        <div className="w-full h-[1px] bg-black/30"></div>
                                    </div>
                                </div>

                                {/* Label */}
                                <span className={`text-[7px] font-mono font-bold tracking-widest uppercase ${isHakiActive ? 'text-red-500' : 'text-zinc-500'}`}>
                                    {isHakiActive ? 'MAX' : 'SAFE'}
                                </span>
                            </button>
                        </div>

                        <Boombox 
                            tape={currentCassette || null}
                            isPlaying={isPlaying}
                            volume={volume}
                            isLoFi={isLoFi}
                            onPlayToggle={() => setIsPlaying(!isPlaying)}
                            onNext={nextTrack}
                            onPrev={prevTrack}
                            onEject={() => ejectMedia()}
                            onVolumeChange={setVolume}
                            onToggleLoFi={() => setIsLoFi(!isLoFi)}
                            onRandomPick={handleRandomCassette}
                            currentTrack={currentTrack}
                            currentVotes={currentTrack ? trackVotes[currentTrack.id] : 0}
                            currentUserVote={currentTrack ? userVotes[currentTrack.id] || 0 : 0}
                            onVote={(val) => currentTrack && handleUserVote(currentTrack.id, val)}
                            isHoveringDropZone={isHoveringDropZone}
                            isLoading={isInserting || isEjecting || isSearching} 
                            isSearching={isSearching}
                        />
                     </div>
                </div>
            )}
        </div>

        {/* RADIO TICKER */}
        <div className="fixed top-0 left-0 right-0 z-50">
             <RadioTicker currentTrack={currentTrack?.title || "OFFLINE"} customMessages={tickerMessages} />
        </div>

        {/* MOBILE SELECTOR */}
        {isMobile && !currentVhsId && !currentCassetteId && (
            <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#08080a] via-[#18181b] to-transparent z-50 pb-8 pt-12">
                <div className="absolute top-6 left-0 w-full text-center pointer-events-none opacity-60 z-10">
                     <span className="text-[9px] font-mono text-cyan-500 tracking-[0.2em] animate-pulse bg-black/20 px-2 rounded-full">SWIPE TO SELECT</span>
                </div>
                <div className="absolute -top-12 right-4 z-50">
                    <button 
                        onClick={() => {
                            playSfx('click');
                            setIsCreatorOpen(true);
                        }}
                        className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center shadow-lg border border-cyan-400/50"
                    >
                        <Plus size={20} className="text-white" />
                    </button>
                </div>
                <div 
                    className="flex gap-4 overflow-x-auto snap-x px-6 pb-4 items-center no-scrollbar" 
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {(activeSystem === 'VHS' ? vhsLibrary : cassetteLibrary).map((media: any) => (
                        <div key={media.id} className="snap-center shrink-0 transform transition-transform active:scale-95" onClick={() => loadMedia(media.id)}>
                            {activeSystem === 'VHS' 
                                ? <VHS tape={media} className="w-[160px] h-[92px] shadow-lg" />
                                : <Cassette tape={media} className="w-[160px] h-[100px] shadow-lg" />
                            }
                        </div>
                    ))}
                    <div className="w-4 shrink-0"></div>
                </div>
            </div>
        )}
    </div>
  );
};

export default App;
