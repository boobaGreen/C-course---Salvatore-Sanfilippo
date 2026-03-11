import { useEffect, useRef, useState } from 'react';
import storage, { STORAGE_KEYS } from '../../utils/storage';

interface VideoEmbedProps {
    videoId: string;
    title?: string;
}

// Basic types for YouTube IFrame API
interface YTPlayer {
    destroy: () => void;
    getCurrentTime: () => number;
    getPlayerState: () => number;
    seekTo: (seconds: number, allowSeekAhead: boolean) => void;
}

interface YTEvent {
    target: YTPlayer;
    data: number;
}

declare global {
    interface Window {
        onYouTubeIframeAPIReady: () => void;
        YT: {
            Player: new (container: HTMLElement | string, options: unknown) => YTPlayer;
            PlayerState: {
                PLAYING: number;
                PAUSED: number;
            };
        };
    }
}

export default function VideoEmbed({ videoId, title = "YouTube Video" }: VideoEmbedProps) {
    const playerRef = useRef<YTPlayer | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isApiLoaded, setIsApiLoaded] = useState(false);

    useEffect(() => {
        // Load the API script if it's not already there
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            tag.async = true;
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

            // The API will call this function when ready
            const previousOnReady = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = () => {
                if (previousOnReady) previousOnReady();
                setIsApiLoaded(true);
            };
        } else if (window.YT && window.YT.Player) {
            // Use setTimeout to avoid synchronous setState in useEffect warning
            const timer = setTimeout(() => setIsApiLoaded(true), 0);
            return () => clearTimeout(timer);
        }

        // Check periodically if YT is available (sometimes script loads but onYouTubeIframeAPIReady doesn't fire if already loaded)
        const interval = setInterval(() => {
            if (window.YT && window.YT.Player) {
                setIsApiLoaded(true);
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!isApiLoaded || !containerRef.current) return;

        const savedTime = storage.get<number>(STORAGE_KEYS.VIDEO_PROGRESS(videoId)) || 0;

        const onPlayerStateChange = (event: YTEvent) => {
            // Save progress when playing (1) or paused (2)
            if (event.data === window.YT.PlayerState.PLAYING || event.data === window.YT.PlayerState.PAUSED) {
                const currentTime = event.target.getCurrentTime();
                storage.set(STORAGE_KEYS.VIDEO_PROGRESS(videoId), Math.floor(currentTime));
            }
        };

        // Initialize player
        playerRef.current = new window.YT.Player(containerRef.current, {
            videoId: videoId,
            playerVars: {
                autoplay: 0,
                start: savedTime,
                rel: 0,
                modestbranding: 1,
                origin: window.location.origin
            },
            events: {
                onStateChange: onPlayerStateChange,
                onReady: (event: YTEvent) => {
                    // Double check seek if start param failed for some reason
                    if (savedTime > 0) {
                        event.target.seekTo(savedTime, true);
                    }
                }
            },
        });

        // Set interval to save progress while playing
        const saveInterval = setInterval(() => {
            if (playerRef.current && playerRef.current.getPlayerState && playerRef.current.getPlayerState() === window.YT.PlayerState.PLAYING) {
                const currentTime = playerRef.current.getCurrentTime();
                storage.set(STORAGE_KEYS.VIDEO_PROGRESS(videoId), Math.floor(currentTime));
            }
        }, 5000); // Save every 5 seconds

        return () => {
            clearInterval(saveInterval);
            if (playerRef.current && playerRef.current.destroy) {
                playerRef.current.destroy();
            }
        };
    }, [isApiLoaded, videoId, title]);

    return (
        <div className="my-8 rounded-lg overflow-hidden border border-border-color shadow-sm bg-black aspect-video relative">
            <div ref={containerRef} className="absolute top-0 left-0 w-full h-full" />
        </div>
    );
}
