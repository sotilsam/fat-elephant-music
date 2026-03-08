import { useState, useEffect, useRef } from 'react';
import { FastForward, Rewind, Play, Pause, Radio, Menu } from 'lucide-react';

const YOUTUBE_VIDEO_URL = 'https://www.youtube.com/watch?v=SnzIuN8gcQU&list=TLPQMDgwMzIwMjbSvQu2T630yA&index=1';

// Extract the video ID from the URL
const YOUTUBE_VIDEO_ID = (() => {
    try {
        const url = new URL(YOUTUBE_VIDEO_URL);
        return url.searchParams.get('v') || 'Rna2JBkqGgE';
    } catch {
        // Fallback if they just pasted the ID
        return YOUTUBE_VIDEO_URL;
    }
})();

declare global {
    interface Window {
        onYouTubeIframeAPIReady: () => void;
        YT: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Player: any; // YouTube Iframe API injects this, it's safer to use any or disable lint here
            PlayerState: {
                PLAYING: number;
                PAUSED: number;
                ENDED: number;
            };
        };
    }
}

// Basic YT Event interface
interface YTEvent {
    target: {
        getVideoData: () => { title?: string } | null;
        playVideo: () => void;
        pauseVideo: () => void;
        nextVideo: () => void;
        previousVideo: () => void;
        getCurrentTime: () => number;
        seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
        destroy: () => void;
    };
    data?: number;
}

export const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState("Loading...");
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [eqHeights, setEqHeights] = useState<number[]>(Array(16).fill(10));
    const playerRef = useRef<YTEvent['target'] | null>(null);

    useEffect(() => {
        // Load the IFrame Player API code asynchronously.
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
            playerRef.current = new window.YT.Player('radio-youtube-player', {
                height: '100%',
                width: '100%',
                videoId: YOUTUBE_VIDEO_ID,
                playerVars: {
                    autoplay: 0,
                    controls: 0,
                    disablekb: 1,
                    fs: 0,
                    rel: 0,
                    modestbranding: 1
                },
                events: {
                    onReady: (event: YTEvent) => {
                        setIsPlayerReady(true);
                        // Fetch the initial track name if available
                        const data = event.target.getVideoData();
                        if (data && data.title) {
                            setCurrentTrack(data.title);
                        } else {
                            setCurrentTrack("Ready to Play");
                        }
                    },
                    onStateChange: (event: YTEvent) => {
                        // 1 is playing, 2 is paused, 0 is ended, 3 is buffering
                        if (event.data === window.YT.PlayerState.PLAYING) {
                            setIsPlaying(true);
                        } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
                            setIsPlaying(false);
                        }

                        // Always update title in case it changed
                        const data = event.target.getVideoData();
                        if (data && data.title) {
                            setCurrentTrack(data.title);
                        }
                    }
                }
            });
        };

        return () => {
            if (playerRef.current && playerRef.current.destroy) {
                playerRef.current.destroy();
            }
        }
    }, []);

    // Effect to animate the equalizer when playing
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isPlaying) {
            interval = setInterval(() => {
                setEqHeights(Array(16).fill(0).map(() => 20 + Math.random() * 80));
            }, 150);
        } else {
            // Use setTimeout to avoid synchronous setState during render cycle in effect
            setTimeout(() => setEqHeights(Array(16).fill(10)), 0);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const togglePlay = () => {
        if (!isPlayerReady || !playerRef.current) return;

        if (isPlaying) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
    };

    const handleNext = () => {
        if (!isPlayerReady || !playerRef.current) return;
        playerRef.current.nextVideo();
    };

    const handlePrevious = () => {
        if (!isPlayerReady || !playerRef.current) return;

        // Typical music player behavior:
        // If we are more than 3 seconds into the song, restart it.
        // Otherwise, go to the previous song.
        const currentTime = playerRef.current.getCurrentTime();
        if (currentTime > 3) {
            playerRef.current.seekTo(0, true);
        } else {
            playerRef.current.previousVideo();
        }
    };
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
                        <div className="flex-1 w-full bg-[#111] rounded-2xl p-6 flex flex-col justify-center relative shadow-inner border border-white/5 overflow-hidden">

                            {/* YouTube Video Background */}
                            <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen overflow-hidden rounded-2xl">
                                <div id="radio-youtube-player" className="w-[150%] h-[150%] -top-[25%] -left-[25%] absolute pointer-events-auto opacity-30 filter saturate-0 contrast-150"></div>
                            </div>

                            <div className="z-10 relative pointer-events-none">
                                <div className="text-white/40 text-xs font-semibold uppercase tracking-widest text-center mb-3">
                                    {isPlaying ? "Now Playing" : "Paused"}
                                </div>
                                <div className="text-white text-2xl md:text-3xl font-medium text-center truncate mb-6 tracking-tight line-clamp-1 h-9 flex items-center justify-center">
                                    {currentTrack}
                                </div>

                                {/* Minimalist Equalizer */}
                                <div className="flex items-end justify-center gap-2 h-10 z-10 relative pointer-events-none">
                                    {eqHeights.map((height, i) => (
                                        <div
                                            key={i}
                                            className="w-1.5 rounded-full bg-white/80"
                                            style={{
                                                height: `${height}%`,
                                                transition: 'height 0.15s ease-out'
                                            }}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Controls */}
                        <div className="flex w-full md:w-auto md:flex-col justify-between gap-4 z-20">
                            <button
                                className="w-full bg-white text-black hover:bg-white/90 p-4 rounded-2xl flex items-center justify-center shadow-lg transition-all disabled:opacity-50"
                                onClick={togglePlay}
                                disabled={!isPlayerReady}
                            >
                                {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
                            </button>
                            <div className="flex gap-4">
                                <button
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white py-4 px-5 rounded-2xl flex items-center justify-center transition-all disabled:opacity-50"
                                    onClick={handlePrevious}
                                    disabled={!isPlayerReady}
                                >
                                    <Rewind size={20} className="fill-current" />
                                </button>
                                <button
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white py-4 px-5 rounded-2xl flex items-center justify-center transition-all disabled:opacity-50"
                                    onClick={handleNext}
                                    disabled={!isPlayerReady}
                                >
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
