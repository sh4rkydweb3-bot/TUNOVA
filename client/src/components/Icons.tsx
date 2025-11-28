import React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

export const PlayIcon = ({ className }: { className?: string }) => <Play className={className} fill="currentColor" />;
export const PauseIcon = ({ className }: { className?: string }) => <Pause className={className} fill="currentColor" />;
export const PrevIcon = ({ className }: { className?: string }) => <SkipBack className={className} fill="currentColor" />;
export const NextIcon = ({ className }: { className?: string }) => <SkipForward className={className} fill="currentColor" />;
