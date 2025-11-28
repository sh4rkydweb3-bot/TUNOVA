
import React from 'react';

interface RadioTickerProps {
  currentTrack: string;
  customMessages?: string[];
}

const RadioTicker: React.FC<RadioTickerProps> = ({ currentTrack, customMessages = [] }) => {
  const defaultMessages = [
    `NOW PLAYING: ${currentTrack}`,
    "/// RADIO NAKAMA LIVE ///",
    "REQUESTS OPEN FOR NAKAMA CREW",
    "WEATHER: ACID RAIN DETECTED IN SECTOR 7",
    "VAHOMAN STOCK INDEX +500%",
    "REMINDER: FEED THE BEATBUNNY",
  ];

  const messages = [...customMessages, ...defaultMessages];

  return (
    <div className="w-full bg-black/80 h-6 border-t border-b border-rose-900/50 overflow-hidden relative flex items-center">
      <div className="whitespace-nowrap animate-[scroll_30s_linear_infinite] flex gap-10 text-[10px] font-mono text-rose-400 font-bold tracking-widest uppercase">
        {messages.map((msg, i) => (
          <span key={i} className="flex items-center gap-2">
             <span className="w-1 h-1 bg-rose-500 rounded-full"></span>
             {msg}
          </span>
        ))}
         {/* Duplicate for seamless loop */}
         {messages.map((msg, i) => (
          <span key={`dup-${i}`} className="flex items-center gap-2">
             <span className="w-1 h-1 bg-rose-500 rounded-full"></span>
             {msg}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default RadioTicker;
