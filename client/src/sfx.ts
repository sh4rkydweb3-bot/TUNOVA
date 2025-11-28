
let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;

const initAudio = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        masterGain = audioCtx.createGain();
        masterGain.gain.value = 0.25; 
        masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
    }
    return { ctx: audioCtx, out: masterGain! };
};

const createNoiseBuffer = (ctx: AudioContext) => {
    const bufferSize = ctx.sampleRate * 2; 
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    return buffer;
};

let noiseBuffer: AudioBuffer | null = null;

export type SfxType = 
    'click' | 'hover' | 'play' | 'stop' | 'eject' | 'insert' | 
    'power_on' | 'power_off' | 'static' | 'success' | 'error' | 
    'type' | 'notification' | 'switch' | 'glitch' | 'haki_trigger';

export const playSfx = (type: SfxType) => {
    try {
        const { ctx, out } = initAudio();
        const t = ctx.currentTime;
        
        if (!noiseBuffer) noiseBuffer = createNoiseBuffer(ctx);

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        gain.connect(out);

        switch (type) {
            case 'click':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(800, t);
                osc.frequency.exponentialRampToValueAtTime(300, t + 0.05);
                gain.gain.setValueAtTime(0.3, t);
                gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
                osc.connect(gain);
                osc.start(t);
                osc.stop(t + 0.05);
                break;
            
            case 'hover': // Subtle tick
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1200, t);
                gain.gain.setValueAtTime(0.02, t);
                gain.gain.linearRampToValueAtTime(0, t + 0.01);
                osc.connect(gain);
                osc.start(t);
                osc.stop(t + 0.01);
                break;

            case 'switch': // Mechanical toggle
                 osc.type = 'square';
                 osc.frequency.setValueAtTime(400, t);
                 gain.gain.setValueAtTime(0.1, t);
                 gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
                 osc.connect(gain);
                 osc.start(t);
                 osc.stop(t + 0.08);
                 break;

            case 'play': // Heavy latch
                osc.type = 'square';
                osc.frequency.setValueAtTime(120, t);
                osc.frequency.exponentialRampToValueAtTime(60, t + 0.1);
                gain.gain.setValueAtTime(0.4, t);
                gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
                osc.connect(gain);
                osc.start(t);
                osc.stop(t + 0.1);
                break;
            
            case 'stop': // Release mechanism
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(200, t);
                osc.frequency.linearRampToValueAtTime(100, t + 0.1);
                gain.gain.setValueAtTime(0.3, t);
                gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
                osc.connect(gain);
                osc.start(t);
                osc.stop(t + 0.1);
                break;

            case 'insert': // Slide + Thunk
                const noiseSrc = ctx.createBufferSource();
                noiseSrc.buffer = noiseBuffer;
                const noiseGain = ctx.createGain();
                
                const filter = ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(600, t);
                filter.frequency.linearRampToValueAtTime(200, t + 0.3);

                noiseSrc.connect(filter);
                filter.connect(noiseGain);
                noiseGain.connect(out);
                
                noiseGain.gain.setValueAtTime(0, t);
                noiseGain.gain.linearRampToValueAtTime(0.4, t + 0.05);
                noiseGain.gain.linearRampToValueAtTime(0, t + 0.3);
                
                noiseSrc.start(t);
                noiseSrc.stop(t + 0.3);
                
                // Add a 'click' at the end for the lock-in
                setTimeout(() => {
                    const osc2 = ctx.createOscillator();
                    const g2 = ctx.createGain();
                    osc2.connect(g2);
                    g2.connect(out);
                    osc2.type = 'square';
                    osc2.frequency.setValueAtTime(100, ctx.currentTime);
                    g2.gain.setValueAtTime(0.5, ctx.currentTime);
                    g2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                    osc2.start(ctx.currentTime);
                    osc2.stop(ctx.currentTime + 0.1);
                }, 250);
                break;

            case 'eject': // Motor whine
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, t);
                osc.frequency.linearRampToValueAtTime(300, t + 0.6);
                gain.gain.setValueAtTime(0.15, t);
                gain.gain.linearRampToValueAtTime(0.15, t + 0.4);
                gain.gain.linearRampToValueAtTime(0, t + 0.6);
                osc.connect(gain);
                osc.start(t);
                osc.stop(t + 0.6);
                break;

            case 'power_on': // CRT Charge
                osc.type = 'sine';
                osc.frequency.setValueAtTime(200, t);
                osc.frequency.exponentialRampToValueAtTime(8000, t + 0.6);
                gain.gain.setValueAtTime(0, t);
                gain.gain.linearRampToValueAtTime(0.2, t + 0.1);
                gain.gain.linearRampToValueAtTime(0, t + 0.6);
                osc.connect(gain);
                osc.start(t);
                osc.stop(t + 0.6);
                break;

            case 'power_off': // CRT Discharge
                osc.type = 'sine';
                osc.frequency.setValueAtTime(8000, t);
                osc.frequency.exponentialRampToValueAtTime(100, t + 0.4);
                gain.gain.setValueAtTime(0.2, t);
                gain.gain.linearRampToValueAtTime(0, t + 0.4);
                osc.connect(gain);
                osc.start(t);
                osc.stop(t + 0.4);
                break;

            case 'success': // Retro chime
                const oscSuccess = ctx.createOscillator();
                const gainSuccess = ctx.createGain();
                oscSuccess.connect(gainSuccess);
                gainSuccess.connect(out);

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, t); // C5
                gain.gain.setValueAtTime(0.1, t);
                gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
                
                oscSuccess.type = 'triangle';
                oscSuccess.frequency.setValueAtTime(659.25, t + 0.1); // E5
                gainSuccess.gain.setValueAtTime(0, t);
                gainSuccess.gain.setValueAtTime(0.1, t + 0.1);
                gainSuccess.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

                osc.connect(gain);
                osc.start(t);
                osc.stop(t + 0.3);
                oscSuccess.start(t);
                oscSuccess.stop(t + 0.4);
                break;
            
             case 'notification': // High ping
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1200, t); 
                gain.gain.setValueAtTime(0.1, t);
                gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
                osc.connect(gain);
                osc.start(t);
                osc.stop(t + 0.15);
                break;

            case 'glitch': // Random noise burst
                const glitchSrc = ctx.createBufferSource();
                glitchSrc.buffer = noiseBuffer;
                const glitchGain = ctx.createGain();
                glitchSrc.connect(glitchGain);
                glitchGain.connect(out);
                
                glitchGain.gain.setValueAtTime(0.2, t);
                glitchGain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
                
                glitchSrc.start(t);
                glitchSrc.stop(t + 0.1);
                break;
                
            case 'haki_trigger': // Heavy Thunder + Bass Drop + Distorted Shock
                // 1. Deep Sub Bass Drop (Louder, Longer)
                const oscDrop = ctx.createOscillator();
                const gainDrop = ctx.createGain();
                const distortion = ctx.createWaveShaper();

                // Simple distortion curve
                const curve = new Float32Array(44100);
                for (let i = 0; i < 44100; i++) {
                    const x = (i * 2) / 44100 - 1;
                    curve[i] = (Math.PI + 50) * x / (Math.PI + 50 * Math.abs(x));
                }
                distortion.curve = curve;
                distortion.oversample = '4x';

                oscDrop.connect(gainDrop);
                gainDrop.connect(distortion);
                distortion.connect(out);
                
                oscDrop.type = 'sawtooth'; // Aggressive wave
                oscDrop.frequency.setValueAtTime(80, t);
                oscDrop.frequency.exponentialRampToValueAtTime(10, t + 2.5); // Longer drop
                
                gainDrop.gain.setValueAtTime(0.8, t); // Louder start
                gainDrop.gain.exponentialRampToValueAtTime(0.01, t + 2.5);
                
                oscDrop.start(t);
                oscDrop.stop(t + 2.5);
                
                // 2. Electrical Crackle (More Intense)
                const noiseCrack = ctx.createBufferSource();
                noiseCrack.buffer = noiseBuffer;
                const filterCrack = ctx.createBiquadFilter();
                filterCrack.type = 'highpass'; 
                filterCrack.frequency.value = 1000;
                
                const gainCrack = ctx.createGain();
                
                noiseCrack.connect(filterCrack);
                filterCrack.connect(gainCrack);
                gainCrack.connect(out);
                
                gainCrack.gain.setValueAtTime(1.0, t); // Louder
                gainCrack.gain.exponentialRampToValueAtTime(0.01, t + 0.8); // Sharp burst
                
                noiseCrack.start(t);
                noiseCrack.stop(t + 0.8);

                // 3. Impact Thud (Boom)
                const oscThud = ctx.createOscillator();
                const gainThud = ctx.createGain();
                oscThud.connect(gainThud);
                gainThud.connect(out);
                
                oscThud.type = 'triangle';
                oscThud.frequency.setValueAtTime(150, t);
                oscThud.frequency.exponentialRampToValueAtTime(40, t + 0.6);
                gainThud.gain.setValueAtTime(1.0, t); // Louder
                gainThud.gain.exponentialRampToValueAtTime(0.01, t + 0.6);
                
                oscThud.start(t);
                oscThud.stop(t + 0.6);
                break;
        }
    } catch (e) {
        // Ignore audio errors
    }
}
