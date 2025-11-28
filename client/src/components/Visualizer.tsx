import React, { useRef, useEffect } from 'react';

interface VisualizerProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
  variant?: 'classic' | 'matrix';
}

const Visualizer: React.FC<VisualizerProps> = ({ analyser, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !analyser) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    let animationId: number;

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / 16); // 16 bars for retro look
      let x = 0;

      // Draw 16 bars, sampling from the lower-mid frequencies (where music energy is)
      for (let i = 0; i < 16; i++) {
        // Map i (0-16) to frequency data index (skip very low and very high freqs)
        const dataIndex = Math.floor(i * (bufferLength / 24)); 
        const value = dataArray[dataIndex];
        
        // Calculate height
        const barHeight = (value / 255) * canvas.height;
        
        // Draw LED segments
        const segmentHeight = 4;
        const gap = 1;
        const numSegments = Math.floor(barHeight / (segmentHeight + gap));

        for(let j = 0; j < numSegments; j++) {
             const y = canvas.height - (j * (segmentHeight + gap));
             
             // Color Gradient based on height
             if(j > 12) ctx.fillStyle = '#ef4444'; // Red (Peak)
             else if(j > 8) ctx.fillStyle = '#eab308'; // Yellow
             else ctx.fillStyle = '#06b6d4'; // Cyan/Green

             ctx.fillRect(x, y - segmentHeight, barWidth - 2, segmentHeight);
        }

        x += barWidth;
      }
    };

    if (isPlaying) {
      draw();
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw flatline
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(0, canvas.height - 2, canvas.width, 2);
    }

    return () => cancelAnimationFrame(animationId);
  }, [analyser, isPlaying]);

  return (
    <canvas 
        ref={canvasRef} 
        width={160} 
        height={64} 
        className="w-full h-full opacity-90"
    />
  );
};

export default Visualizer;