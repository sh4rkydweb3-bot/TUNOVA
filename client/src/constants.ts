import { VHSTape, CassetteTape } from './types';

// --- VISUAL COLLECTIONS (VHS) ---
// Each tape represents a creator's portfolio.
export const TAPES: VHSTape[] = [
  {
    id: 'creator_amv_01',
    title: "AMV ARCHIVE V.1",
    label: "EDITS BY KIRA",
    color: "#ef4444", // Red
    rotation: -3,
    variant: 'standard',
    creator: "KIRA_EDITS",
    tracks: [
        { id: 'amv_1', title: "Cyberpunk Edgerunners [AMV]", url: "PWBKq_1gCg4", type: 'youtube', duration: 240, votes: 1500, externalUrl: 'https://youtube.com' },
        { id: 'amv_2', title: "Akira - Neo Tokyo Mix", url: "t-QSmNReDyI", type: 'youtube', duration: 180, votes: 1200, externalUrl: 'https://youtube.com' },
        { id: 'amv_3', title: "Ghost in the Shell - Inner Univ", url: "08l82eU06U8", type: 'youtube', duration: 300, votes: 900, externalUrl: 'https://youtube.com' }
    ]
  },
  {
    id: 'creator_vfx_01',
    title: "VFX SHOWCASE",
    label: "VISUALS BY NEON",
    color: "#8b5cf6", // Violet
    rotation: 5,
    variant: 'bootleg',
    creator: "NEON_DREAMS",
    tracks: [
        { id: 'vfx_1', title: "Abstract Loops V1", url: "v4pi1LxuDHc", type: 'youtube', duration: 999, votes: 500, externalUrl: 'https://youtube.com' },
        { id: 'vfx_2', title: "Retro Grid Flyover", url: "8wLwxmjrzj8", type: 'youtube', duration: 120, votes: 450, externalUrl: 'https://youtube.com' }
    ]
  },
  {
    id: 'creator_music_01',
    title: "SYNTHWAVE MIX",
    label: "MUSIC BY RETRO",
    color: "#06b6d4", // Cyan
    rotation: 2,
    variant: 'rental',
    creator: "RETRO_WAVE",
    tracks: [
        { id: 'mus_1', title: "Nightcall (Visualizer)", url: "MV_3Dpw-BRY", type: 'youtube', duration: 250, votes: 2000, externalUrl: 'https://youtube.com' },
        { id: 'mus_2', title: "Tech Noir", url: "N9S7uiL71l8", type: 'youtube', duration: 220, votes: 1800, externalUrl: 'https://youtube.com' }
    ]
  }
];

// --- AUDIO COLLECTIONS (CASSETTES) ---
// The Official Nakama & Tunova Discography.

export const CASSETTES: CassetteTape[] = [
    {
        id: 'nakama_genesis_v1',
        title: "NAKAMA GENESIS",
        artist: "NAKAMA CREW",
        color: "#fbbf24", // Amber/Gold
        labelColor: "#171717", // Dark label
        variant: 'c90',
        rotation: 4,
        tracks: Array.from({ length: 22 }).map((_, i) => ({
            id: `genesis_t${i+1}`,
            title: `Nakama Hit #${i + 1}`,
            artist: "Nakama Crew",
            url: "jfKfPfyJRdk", // Placeholder: Lofi Stream
            type: 'youtube' as const,
            duration: 180 + (i * 5),
            votes: 100 + (Math.floor(Math.random() * 500)),
            externalUrl: 'https://youtube.com'
        }))
    },
    {
        id: 'tunova_supernovas',
        title: "SUPERNOVAS",
        artist: "TUNOVA.IO",
        color: "#6366f1", // Indigo
        labelColor: "#e0e7ff",
        variant: 'c60',
        rotation: -5,
        tracks: Array.from({ length: 11 }).map((_, i) => ({
            id: `supernova_t${i+1}`,
            title: `Supernova Anthem ${i + 1}`,
            artist: "Tunova Ecosystem",
            url: "5qap5aO4i9A", // Placeholder: Lofi
            type: 'youtube' as const,
            duration: 200,
            votes: 200 + (Math.floor(Math.random() * 500)),
            externalUrl: 'https://tunova.io'
        }))
    },
    {
        id: 'vahoman_king',
        title: "REY EMPRENDEDOR",
        artist: "VAHOMAN",
        color: "#1e293b", // Slate
        labelColor: "#cbd5e1",
        variant: 'standard',
        rotation: 8,
        tracks: [
             { id: 'vm_01', title: "Visionary Mindset", artist: "Vahoman", url: "MCkTebktHVc", type: 'youtube', duration: 180, votes: 888, externalUrl: 'https://youtube.com' },
             { id: 'vm_02', title: "Build The Future", artist: "Vahoman", url: "MCkTebktHVc", type: 'youtube', duration: 200, votes: 777, externalUrl: 'https://youtube.com' },
             { id: 'vm_03', title: "Zero to One", artist: "Vahoman", url: "MCkTebktHVc", type: 'youtube', duration: 190, votes: 666, externalUrl: 'https://youtube.com' },
             { id: 'vm_04', title: "Scale Up", artist: "Vahoman", url: "MCkTebktHVc", type: 'youtube', duration: 210, votes: 555, externalUrl: 'https://youtube.com' },
             { id: 'vm_05', title: "Market Fit", artist: "Vahoman", url: "MCkTebktHVc", type: 'youtube', duration: 220, votes: 444, externalUrl: 'https://youtube.com' },
             { id: 'vm_06', title: "Pivot", artist: "Vahoman", url: "MCkTebktHVc", type: 'youtube', duration: 180, votes: 333, externalUrl: 'https://youtube.com' },
             { id: 'vm_07', title: "Exit Strategy", artist: "Vahoman", url: "MCkTebktHVc", type: 'youtube', duration: 300, votes: 999, externalUrl: 'https://youtube.com' }
        ]
    },
    {
        id: 'razazar_duality',
        title: "LA DUALIDAD",
        artist: "RAZAZAR",
        color: "#14b8a6", // Teal
        labelColor: "#000000",
        variant: 'transparent',
        rotation: -2,
        tracks: [
            // RAZA (Order/Structure)
            { id: 'rz_01', title: "Raza: Origen", artist: "RazAzaR", url: "C_NweXhc8_4", type: 'youtube', duration: 200, votes: 500, externalUrl: 'https://youtube.com' },
            { id: 'rz_02', title: "Raza: Estructura", artist: "RazAzaR", url: "C_NweXhc8_4", type: 'youtube', duration: 210, votes: 510, externalUrl: 'https://youtube.com' },
            { id: 'rz_03', title: "Raza: Legado", artist: "RazAzaR", url: "C_NweXhc8_4", type: 'youtube', duration: 220, votes: 520, externalUrl: 'https://youtube.com' },
            // AZAR (Chaos/Entropy)
            { id: 'az_01', title: "Azar: Entropía", artist: "RazAzaR", url: "lTRiuFIWV54", type: 'youtube', duration: 200, votes: 600, externalUrl: 'https://youtube.com' },
            { id: 'az_02', title: "Azar: Ruido Blanco", artist: "RazAzaR", url: "lTRiuFIWV54", type: 'youtube', duration: 210, votes: 610, externalUrl: 'https://youtube.com' },
            { id: 'az_03', title: "Azar: Probabilidad", artist: "RazAzaR", url: "lTRiuFIWV54", type: 'youtube', duration: 220, votes: 620, externalUrl: 'https://youtube.com' }
        ]
    },
    {
        id: 'tunova_covers',
        title: "TUNOVA COVERS",
        artist: "VARIOUS",
        color: "#ec4899", // Pink
        labelColor: "#ffffff",
        variant: 'standard',
        rotation: 6,
        tracks: [
            { id: 'cv_01', title: "Weekly Cover #1", artist: "Tunova Community", url: "9Gj47G2e1Jc", type: 'youtube', duration: 240, votes: 120, externalUrl: 'https://tunova.io' },
            { id: 'cv_02', title: "Weekly Cover #2", artist: "Tunova Community", url: "ZEcqHA7dbwM", type: 'youtube', duration: 240, votes: 130, externalUrl: 'https://tunova.io' },
            { id: 'cv_03', title: "Weekly Cover #3", artist: "Tunova Community", url: "M0qMgoChzGI", type: 'youtube', duration: 300, votes: 140, externalUrl: 'https://tunova.io' },
            { id: 'cv_04', title: "Weekly Cover #4", artist: "Tunova Community", url: "Mb3iPP-tHdA", type: 'youtube', duration: 240, votes: 150, externalUrl: 'https://tunova.io' }
        ]
    }
];
