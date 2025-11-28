
import React, { useEffect, useState, useRef } from 'react';
import { VideoTrack } from '../types';
import VotePanel from './VotePanel';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface ScreenProps {
  track: VideoTrack | null;
  isPlaying: boolean;
  onEnded?: () => void;
  glitchAmount: number; // 0 - 1
  volume: number; // 0 - 1
  currentVotes?: number;
  currentUserVote?: number;
  onVote?: (newVoteState: number) => void;
}

const Screen: React.FC<ScreenProps> = ({ 
    track, 
    isPlaying, 
    onEnded, 
    glitchAmount, 
    volume,
    currentVotes = 0,
    currentUserVote = 0,
    onVote 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const ytPlayerRef = useRef<any>(null); // Use ref for player to access in cleanup
  const [ytReady, setYtReady] = useState(false);

  // Initialize YouTube API
  useEffect(() => {
      if (!window.YT) {
          if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
              const tag = document.createElement('script');
              tag.src = "https://www.youtube.com/iframe_api";
              const firstScriptTag = document.getElementsByTagName('script')[0];
              firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
          }
          
          window.onYouTubeIframeAPIReady = () => {
              setYtReady(true);
          };
      } else {
          setYtReady(true);
      }
  }, []);

  // Manage YouTube Player Instance
  useEffect(() => {
      // 1. CLEANUP PREVIOUS PLAYER
      const destroyPlayer = () => {
          if (ytPlayerRef.current) {
              try {
                  if (typeof ytPlayerRef.current.destroy === 'function') {
                      ytPlayerRef.current.destroy();
                  }
              } catch (e) { /* ignore */ }
              ytPlayerRef.current = null;
          }
      };

      if (!track || track.type !== 'youtube' || !ytReady) {
          destroyPlayer();
          return;
      }

      // 2. CHECK DOM
      const playerDiv = document.getElementById('yt-player');
      if (!playerDiv) return;

      // 3. CREATE OR UPDATE PLAYER
      if (ytPlayerRef.current) {
           try {
               // Verify player is still valid and not destroyed
               if (typeof ytPlayerRef.current.getVideoData === 'function') {
                    const currentId = ytPlayerRef.current.getVideoData().video_id;
                    if (currentId !== track.url) {
                        ytPlayerRef.current.loadVideoById(track.url);
                    }
               } else {
                   // Broken instance, recreate
                   destroyPlayer();
                   createPlayer(track.url);
               }
           } catch(e) {
               destroyPlayer();
               createPlayer(track.url);
           }
      } else {
          createPlayer(track.url);
      }

      function createPlayer(videoId: string) {
          try {
              ytPlayerRef.current = new window.YT.Player('yt-player', {
                  height: '100%',
                  width: '100%',
                  videoId: videoId,
                  playerVars: {
                      'playsinline': 1,
                      'controls': 0,
                      'showinfo': 0,
                      'rel': 0,
                      'modestbranding': 1,
                      'fs': 0,
                      'iv_load_policy': 3,
                      'disablekb': 1
                  },
                  events: {
                      'onStateChange': (event: any) => {
                          if (event.data === window.YT.PlayerState.ENDED) {
                              onEnded?.();
                          }
                      },
                      'onReady': (event: any) => {
                          event.target.setVolume(volume * 100);
                          if (isPlaying) event.target.playVideo();
                      }
                  }
              });
          } catch(e) {
              console.warn("YT Player Create Failed", e);
          }
      }
      
      return () => {
          // Optional: Don't destroy immediately if we want smooth transitions, 
          // but strictly to prevent errors:
          // destroyPlayer(); 
      };

  }, [track, ytReady]);

  // Handle Play/Pause/Volume (YouTube)
  useEffect(() => {
      const player = ytPlayerRef.current;
      if (!player || typeof player.playVideo !== 'function') return;
      
      try {
          if (isPlaying && track?.type === 'youtube') {
              player.playVideo();
          } else {
              player.pauseVideo();
          }
          player.setVolume(volume * 100);
      } catch(e) {
          console.warn("YT Control Error", e);
      }
  }, [isPlaying, volume, track]);

  // Handle MP4 Logic
  useEffect(() => {
      if (videoRef.current && track?.type === 'mp4') {
          videoRef.current.volume = volume;
          if (isPlaying) {
              videoRef.current.play().catch(e => console.log("Autoplay prevented", e));
          } else {
              videoRef.current.pause();
          }
      }
  }, [isPlaying, volume, track]);


  return (
    <div className="w-full h-full relative bg-black overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-[inset_0_0_20px_rgba(0,0,0,1)] border-4 border-[#1a1a1a] group">
        
        {/* SCREEN CONTENT */}
        <div className={`w-full h-full relative z-10 ${glitchAmount > 0.8 ? 'opacity-50 translate-x-1' : 'opacity-100'}`}>
             {/* STATIC NOISE (When no track or stopped) */}
             {(!track) && (
                 <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] bg-cover opacity-20 mix-blend-screen"></div>
             )}
             
             {/* YOUTUBE LAYER */}
             <div className={`w-[120%] h-[120%] -ml-[10%] -mt-[10%] pointer-events-none ${track?.type === 'youtube' ? 'block' : 'hidden'}`}>
                <div id="yt-player"></div>
             </div>

             {/* MP4 LAYER */}
             {track?.type === 'mp4' && (
                 <video
                    ref={videoRef}
                    src={track.url}
                    className="w-full h-full object-cover"
                    playsInline
                    onEnded={onEnded}
                    loop={false}
                 />
             )}

             {/* TIKTOK EMBED LAYER */}
             {track?.type === 'tiktok' && (
                <div className="w-full h-full flex items-center justify-center bg-black">
                     <iframe 
                        src={`https://www.tiktok.com/embed/v2/${track.url}`}
                        className="w-full h-full border-0"
                        title="TikTok Embed"
                        allow="encrypted-media;"
                    ></iframe>
                     {/* Overlay to catch clicks if needed, or allow interaction */}
                     {!isPlaying && <div className="absolute inset-0 bg-black/50 z-20"></div>}
                </div>
             )}

             {/* INSTAGRAM EMBED LAYER */}
             {track?.type === 'instagram' && (
                <div className="w-full h-full flex items-center justify-center bg-black overflow-hidden">
                     <iframe 
                        src={`https://www.instagram.com/p/${track.url}/embed/captioned/`}
                        className="w-full h-full border-0 scale-110"
                        title="Instagram Embed"
                        allow="encrypted-media;"
                        scrolling="no"
                    ></iframe>
                </div>
             )}
        </div>

        {/* VOTING OVERLAY (Visible on Hover or when Playing) */}
        {track && onVote && (
            <div className="absolute top-2 left-2 md:top-4 md:left-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-75 md:scale-100 origin-top-left pointer-events-auto">
                <VotePanel 
                    votes={currentVotes} 
                    userVote={currentUserVote}
                    onVote={onVote} 
                    externalUrl={track.externalUrl || (track.type === 'youtube' ? `https://www.youtube.com/watch?v=${track.url}` : track.url)}
                    variant="screen" 
                />
            </div>
        )}

        {/* CRT FILTERS OVERLAY */}
        <div className="absolute inset-0 z-50 pointer-events-none rounded-[2rem] md:rounded-[3rem] overflow-hidden">
            {/* Scanlines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none"></div>
            
            {/* Curvature Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]"></div>
            
            {/* Screen Shine */}
            <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-bl from-white/10 to-transparent rounded-tr-[3rem] filter blur-xl opacity-30"></div>

            {/* Glitch Overlay (Based on Tracking) */}
            {glitchAmount > 0.1 && (
                <div 
                    className="absolute inset-0 bg-white/10 mix-blend-color-dodge"
                    style={{ 
                        transform: `translateY(${Math.sin(Date.now() / 100) * 10}px)`,
                        opacity: glitchAmount * 0.5 
                    }}
                ></div>
            )}
        </div>
    </div>
  );
};

export default Screen;
