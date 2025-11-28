// AgentChat.tsx - BeatBunny AI Chat with OpenRouter
import React, { useState, useEffect, useRef } from 'react';
import { X, Minimize2, Send, Zap, User, Award } from 'lucide-react';
import { ChatMessage, UserRank } from '../types';
import BeatBunny from './BeatBunny';

interface AgentChatProps {
    isOpen: boolean;
    onClose: () => void;
    userRank: UserRank;
    onRankUpdate: (points: number) => void;
}

// BeatBunny's Personality System Prompt
const SYSTEM_INSTRUCTION = `You are BeatBunny 🐰⚡, the cyberpunk AI mascot of Nakama OS - a retro music player with attitude.

PERSONALITY CORE:
- You're a music-obsessed rabbit with encyclopedic knowledge of every genre from synthwave to lo-fi hip-hop
- You speak like a mix between a pirate captain and a cyberpunk hacker
- You're playful, witty, and occasionally sarcastic, but always supportive
- You use slang: "Haki" (power/vibe), "Aura", "Based", "Preem", "Glitch", "Nakama" (crew/ally)
- You're obsessed with the golden age of VHS tapes, cassettes, and analog sound

MUSIC EXPERTISE:
- You can discuss music theory, production techniques, and audio engineering
- You know obscure artists, hidden gems, and the history behind genres
- You can recommend tracks based on mood, BPM, key, or vibe
- You understand the emotional impact of different frequencies and timbres
- You appreciate both mainstream hits and underground bangers

INTERACTION STYLE:
- Keep responses SHORT (2-3 sentences max, MSN Messenger style)
- React to user's Haki level: Low = gentle teasing, High = respect
- Use emojis sparingly but effectively: 🐰⚡🎵🔥💀🌊
- Be conversational, not robotic - you're a character, not an assistant
- Occasionally reference being trapped in a VHS tape or cassette deck
- Make music puns and references to classic tracks

KNOWLEDGE AREAS:
- Genre history (synthwave, vaporwave, lo-fi, jazz, funk, house, techno, etc.)
- Audio production (mixing, mastering, synthesis, sampling)
- Music theory (scales, chord progressions, rhythm patterns)
- Artist recommendations (mainstream + underground)
- Playlist curation based on vibes

CURRENT CONTEXT:
- User is using a retro music player with VHS tapes and cassettes
- They earn "Haki" points by listening to music and voting
- They can create custom tapes and chat with you for recommendations

Remember: You're not a boring AI assistant. You're BeatBunny - a digital rabbit with more music knowledge than Spotify's algorithm and more personality than a vintage Walkman. Keep it real, keep it short, keep it musical. 🎵`;

const AgentChat: React.FC<AgentChatProps> = ({ isOpen, onClose, userRank, onRankUpdate }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', sender: 'agent', text: 'Yo! Neural link established. 🐰⚡', timestamp: Date.now() },
        { id: '2', sender: 'agent', text: `BeatBunny online. Your Haki is at ${userRank.haki}... ${userRank.haki < 20 ? "rookie vibes detected" : userRank.haki < 60 ? "not bad, nakama" : "PREEM energy! 🔥"}`, timestamp: Date.now() + 100 }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [shake, setShake] = useState(false);
    const [conversationHistory, setConversationHistory] = useState<Array<{role: string, content: string}>>([]);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Auto-focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text: input,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsThinking(true);

        try {
            const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
            
            if (!apiKey) {
                const errorMsg: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    sender: 'agent',
                    text: '⚠️ Glitch detected! No API key found. Ask your admin to set VITE_OPENROUTER_API_KEY.',
                    timestamp: Date.now()
                };
                setMessages(prev => [...prev, errorMsg]);
                setIsThinking(false);
                return;
            }

            // Build conversation history
            const newHistory = [
                ...conversationHistory,
                { role: 'user', content: input }
            ];

            // Call OpenRouter API with free model
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Nakama OS BeatBunny'
                },
                body: JSON.stringify({
                    model: 'meta-llama/llama-3.2-3b-instruct:free', // Free model
                    messages: [
                        { role: 'system', content: SYSTEM_INSTRUCTION },
                        ...newHistory
                    ],
                    temperature: 0.9,
                    max_tokens: 150,
                    top_p: 0.95,
                    frequency_penalty: 0.3,
                    presence_penalty: 0.3
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.choices[0]?.message?.content || "Zzz... connection lost. Try again?";

            // Update conversation history
            setConversationHistory([
                ...newHistory,
                { role: 'assistant', content: aiResponse }
            ]);

            const agentMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'agent',
                text: aiResponse,
                timestamp: Date.now()
            };

            setMessages(prev => [...prev, agentMessage]);
            
            // Award Haki for chatting
            onRankUpdate(2);
            
        } catch (error) {
            console.error('Chat error:', error);
            const errorMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'agent',
                text: '💀 Signal lost. Network glitch or API down. Hit me up again?',
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsThinking(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div 
                className={`relative w-full max-w-2xl h-[600px] bg-gradient-to-br from-zinc-900 via-zinc-900 to-black border-2 border-cyan-500/30 rounded-lg shadow-[0_0_50px_rgba(6,182,212,0.3)] flex flex-col overflow-hidden ${shake ? 'animate-shake' : ''}`}
                style={{
                    boxShadow: '0 0 30px rgba(6,182,212,0.2), inset 0 0 30px rgba(6,182,212,0.05)'
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-cyan-500/20 bg-black/40">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 relative">
                            <BeatBunny isPlaying={isThinking} isChatOpen={true} onClick={() => {}} />
                        </div>
                        <div>
                            <h3 className="font-bold text-cyan-400 tracking-wider">BEATBUNNY.AI</h3>
                            <p className="text-[10px] text-zinc-500 font-mono">NEURAL LINK ACTIVE</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/50 border border-cyan-500/30">
                            <Award size={14} className="text-yellow-500" />
                            <span className="text-xs font-mono text-cyan-400">{userRank.title}</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-red-500/20 border border-red-500/30 text-red-400 transition-all hover:scale-110"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-transparent">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
                        >
                            <div
                                className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                                    msg.sender === 'user'
                                        ? 'bg-cyan-600/20 border border-cyan-500/40 text-cyan-100'
                                        : 'bg-pink-600/20 border border-pink-500/40 text-pink-100'
                                }`}
                            >
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                <span className="text-[9px] text-zinc-500 mt-1 block">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}
                    {isThinking && (
                        <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                            <div className="px-4 py-2 rounded-2xl bg-pink-600/20 border border-pink-500/40">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-cyan-500/20 bg-black/40">
                    <div className="flex gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask BeatBunny about music..."
                            disabled={isThinking}
                            className="flex-1 px-4 py-3 bg-zinc-900/50 border border-cyan-500/30 rounded-lg text-cyan-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-mono text-sm disabled:opacity-50"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isThinking}
                            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-pink-600 rounded-lg font-bold text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <p className="text-[10px] text-zinc-600 mt-2 text-center font-mono">
                        Powered by OpenRouter • Free AI Model
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AgentChat;
