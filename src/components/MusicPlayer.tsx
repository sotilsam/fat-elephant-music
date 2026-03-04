import { useState } from 'react';
import { FastForward, Rewind, Play, Pause, Radio, Menu } from 'lucide-react';

export const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack] = useState("01. No Time");




    return (
        <div className="w-full py-24 bg-[#050505] flex justify-center border-t border-white/5">


            <div className="max-w-3xl w-full px-4">
                {/* <div className="flex items-center justify-between mb-8 px-2">
                    <h3 className="text-xl font-semibold tracking-tight text-white/90">Multimedia</h3>
                </div> */}

                {/* Modern Car Radio Chassis */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">

                    <div className="flex flex-col md:flex-row gap-8 items-center">

                        {/* Left Controls */}
                        <div className="flex w-full md:w-auto md:flex-col justify-between gap-4">
                            <button className="flex-1 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white p-4 rounded-2xl flex items-center justify-center gap-3 transition-all">
                                <Radio size={20} /> <span className="text-sm font-medium tracking-wide">Radio</span>
                            </button>
                            <button className="flex-1 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white p-4 rounded-2xl flex items-center justify-center gap-3 transition-all">
                                <Menu size={20} /> <span className="text-sm font-medium tracking-wide">Menu</span>
                            </button>
                        </div>

                        {/* Center Display */}
                        <div className="flex-1 w-full bg-[#111] rounded-2xl p-6 flex flex-col justify-center relative shadow-inner border border-white/5">
                            <div className="text-white/40 text-xs font-semibold uppercase tracking-widest text-center mb-3">
                                {isPlaying ? "Now Playing" : "Paused"}
                            </div>
                            <div className="text-white text-2xl md:text-3xl font-medium text-center truncate mb-6 tracking-tight">
                                {currentTrack}
                            </div>

                            {/* Minimalist Equalizer */}
                            <div className="flex items-end justify-center gap-2 h-10">
                                {[...Array(16)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-1.5 rounded-full bg-white/80"
                                        style={{
                                            height: isPlaying ? `${20 + Math.random() * 80}%` : '10%',
                                            transition: 'height 0.15s ease-out'
                                        }}
                                    ></div>
                                ))}
                            </div>
                        </div>

                        {/* Right Controls */}
                        <div className="flex w-full md:w-auto md:flex-col justify-between gap-4">
                            <button
                                className="w-full bg-white text-black hover:bg-white/90 p-4 rounded-2xl flex items-center justify-center shadow-lg transition-all"
                                onClick={() => setIsPlaying(!isPlaying)}
                            >
                                {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
                            </button>
                            <div className="flex gap-4">
                                <button className="flex-1 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white py-4 px-5 rounded-2xl flex items-center justify-center transition-all">
                                    <Rewind size={20} className="fill-current" />
                                </button>
                                <button className="flex-1 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white py-4 px-5 rounded-2xl flex items-center justify-center transition-all">
                                    <FastForward size={20} className="fill-current" />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
