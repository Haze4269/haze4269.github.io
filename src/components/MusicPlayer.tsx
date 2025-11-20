import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface Song {
  id: string;
  title: string;
  artist: string;
  file: string;
}

const MusicPlayer = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch(`/music.json?t=${Date.now()}`);
        if (!response.ok) throw new Error("Failed to fetch music");
        const data = await response.json();
        setSongs(data.songs || []);
      } catch (error) {
        console.error("Error fetching music:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const currentSong: Song | undefined = songs[currentSongIndex];

  const handleNext = useCallback(() => {
    if (songs.length === 0) return;
    if (currentSongIndex < songs.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
      setCurrentTime(0);
    } else {
      setCurrentSongIndex(0);
      setCurrentTime(0);
    }
  }, [currentSongIndex, songs.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSongIndex, handleNext]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSongIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    if (songs.length === 0) return;
    if (currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
      setCurrentTime(0);
    } else {
      setCurrentSongIndex(songs.length - 1);
      setCurrentTime(0);
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isVisible || isLoading || !currentSong) return null;

  return (
    <>
      <audio ref={audioRef} src={currentSong.file} preload="metadata" />
      <div className="bg-card rounded-lg retro-dashed p-2 md:p-3">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
          {/* Play/Pause and main controls */}
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            <div className="flex gap-1 md:gap-2 flex-shrink-0">
              <button 
                onClick={togglePlayPause}
                className="hover:text-hell-red transition-colors p-1"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 md:w-5 md:h-5 text-hell-red" />
                ) : (
                  <Play className="w-4 h-4 md:w-5 md:h-5 text-hell-red" />
                )}
              </button>
              <span className="text-xs md:text-sm text-hell-red font-bold flex-shrink-0">:</span>
            </div>
            
            <div className="flex-1 flex items-center gap-2 md:gap-3 min-w-0">
              <button 
                onClick={handlePrevious}
                className="hover:text-hell-red transition-colors p-1 flex-shrink-0"
                aria-label="Previous song"
              >
                <SkipBack className="w-3 h-3 md:w-4 md:h-4 text-hell-red" />
              </button>
              
              <span className="text-xs md:text-sm font-bold uppercase tracking-wide truncate min-w-0">
                {isPlaying ? "playing" : "paused"} : {currentSong.title} - {currentSong.artist}
              </span>
              
              <button 
                onClick={handleNext}
                className="hover:text-hell-red transition-colors p-1 flex-shrink-0"
                aria-label="Next song"
              >
                <SkipForward className="w-3 h-3 md:w-4 md:h-4 text-hell-red" />
              </button>
            </div>
          </div>
          
          {/* Progress bar - full width on mobile */}
          <div className="flex items-center gap-2 w-full md:w-auto md:flex-1 md:max-w-md">
            <span className="text-xs text-muted-foreground font-bold flex-shrink-0">{formatTime(currentTime)}</span>
            <Slider 
              value={[currentTime]} 
              max={duration || 100} 
              step={0.1}
              onValueChange={handleSeek}
              className="flex-1 [&_[role=slider]]:bg-hell-red [&_[role=slider]]:border-hell-red"
            />
            <span className="text-xs text-muted-foreground font-bold flex-shrink-0">{formatTime(duration)}</span>
          </div>
          
          {/* Volume and close - horizontal on mobile, separate on desktop */}
          <div className="flex gap-2 items-center justify-between md:justify-end">
            <div className="flex gap-2 items-center">
              <Volume2 className="w-3 h-3 md:w-4 md:h-4 text-hell-red flex-shrink-0" />
              <Slider 
                value={[volume]} 
                max={1} 
                step={0.01}
                onValueChange={(value) => setVolume(value[0])}
                className="w-16 md:w-20 [&_[role=slider]]:bg-hell-red [&_[role=slider]]:border-hell-red"
              />
            </div>
            <span className="hidden md:inline text-sm text-hell-red font-bold">:</span>
            <button 
              onClick={() => setIsVisible(false)}
              className="hover:text-hell-red transition-colors p-1 flex-shrink-0"
              aria-label="Close player"
            >
              <X className="w-3 h-3 md:w-4 md:h-4 text-hell-red" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;