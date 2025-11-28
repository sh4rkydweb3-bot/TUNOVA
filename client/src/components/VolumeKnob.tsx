import React, { useState, useRef, useEffect } from 'react';

interface VolumeKnobProps {
  volume: number; // 0 to 1
  onChange: (vol: number) => void;
}

const VolumeKnob: React.FC<VolumeKnobProps> = ({ volume, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef<number>(0);
  const startVal = useRef<number>(0);

  // Calculate rotation: -135deg (0%) to 135deg (100%)
  const rotation = -135 + (volume * 270);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startY.current = e.clientY;
    startVal.current = volume;
    document.body.style.cursor = 'ns-resize';
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaY = startY.current - e.clientY;
      const sensitivity = 0.01; // Speed of change
      const newVal = Math.min(Math.max(startVal.current + (deltaY * sensitivity), 0), 1);
      onChange(newVal);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = 'default';
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onChange]);

  return (
    <div className="flex flex-col items-center gap-1 relative group">
      <div 
        className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 shadow-knob relative cursor-ns-resize border border-slate-600"
        onMouseDown={handleMouseDown}
        style={{ transform: `rotate(${rotation}deg)` }}
        title="Drag up/down to adjust volume"
      >
         {/* Indicator Line */}
         <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-4 bg-cyan-400 rounded-full shadow-[0_0_5px_rgba(6,182,212,0.8)]"></div>
      </div>
      <span className="text-[8px] font-mono text-slate-400 tracking-widest uppercase select-none">VOL</span>
      
      {/* Numeric tooltip on hover/drag */}
      <div className={`absolute -top-6 bg-black text-cyan-400 text-xs font-mono px-1 border border-cyan-900 transition-opacity ${isDragging || 'opacity-0 group-hover:opacity-100'}`}>
          {Math.round(volume * 100)}%
      </div>
    </div>
  );
};

export default VolumeKnob;