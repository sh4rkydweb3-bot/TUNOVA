export interface Track {
  id: string; // Unique ID for voting
  title: string;
  artist?: string;
  url: string; // YouTube ID, MP4 URL, or Social Post ID
  type: 'youtube' | 'mp4' | 'mp3' | 'tiktok' | 'instagram';
  duration: number;
  votes: number;
  externalUrl?: string; // For the "Link" button
}

export type VideoTrack = Track;

export interface VHSTape {
  id: string;
  title: string;
  label: string;
  color: string; 
  tracks: Track[]; 
  rotation?: number;
  variant?: 'standard' | 'bootleg' | 'rental';
  creator?: string;
}

export interface CassetteTape {
  id: string;
  title: string;
  artist: string;
  color: string; // Shell color
  labelColor: string;
  tracks: Track[];
  rotation?: number;
  variant?: 'c60' | 'c90' | 'transparent' | 'standard';
  creator?: string;
}

export type SystemMode = 'VHS' | 'CASSETTE';

export interface PlayerState {
  isPlaying: boolean;
  currentTrackIndex: number;
  progress: number;
  duration: number;
  volume: number;
  isMuted: boolean;
}

export type CassetteSide = 'A' | 'B';

export interface Album {
  title: string;
  artist: string;
  songs: Track[];
  sideB?: Track[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: number;
  isNudge?: boolean;
}

export interface UserRank {
  haki: number;
  title: string; // e.g. "Rookie", "Supernova", "Yonko"
  aura: string; // Color code
}
