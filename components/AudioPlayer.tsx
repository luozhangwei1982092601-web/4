import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { Translation } from '../utils/translations';

interface AudioPlayerProps {
  audioUrl?: string | null;
  t: Translation;
  title?: string;
  subtitle?: string;
  coverUrl?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  audioUrl,
  t,
  title,
  subtitle,
  coverUrl
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioObjRef = useRef<HTMLAudioElement | null>(null);

  // Handle new Audio URL
  useEffect(() => {
    if (audioUrl) {
      if (audioObjRef.current) {
        audioObjRef.current.pause();
        audioObjRef.current = null;
      }
      
      const audio = new Audio(audioUrl);
      audio.crossOrigin = "anonymous";
      audio.onended = () => {
        setIsPlaying(false);
        setProgress(0);
      };
      
      audioObjRef.current = audio;
      audio.play().then(() => setIsPlaying(true)).catch(e => console.error("Auto-play blocked", e));
    }
    return () => {
      if (audioObjRef.current) {
        audioObjRef.current.pause();
      }
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (audioObjRef.current) {
      if (isPlaying) {
        audioObjRef.current.pause();
        setIsPlaying(false);
      } else {
        audioObjRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Progress Animation
  useEffect(() => {
    let animationFrame: number;
    const animate = () => {
      if (isPlaying && audioObjRef.current) {
         const elapsed = audioObjRef.current.currentTime;
         const duration = audioObjRef.current.duration;
         if (duration) setProgress(Math.min((elapsed / duration) * 100, 100));
         animationFrame = requestAnimationFrame(animate);
      }
    };
    if (isPlaying) {
      animationFrame = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying]);

  const displayCover = coverUrl || "https://picsum.photos/seed/zen/400/400?grayscale&blur=1";

  return (
    <div className="w-full bg-[#FDFBF7] rounded-3xl shadow-xl shadow-amber-900/10 p-6 flex flex-col items-center space-y-6 relative overflow-hidden border border-amber-100">
      
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')] pointer-events-none"></div>

      {/* Album Art */}
      <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-amber-50 relative flex items-center justify-center shadow-inner overflow-hidden border-4 border-white shadow-lg">
         <img 
            src={displayCover} 
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[20s] ease-linear ${isPlaying ? 'rotate-180 scale-110' : 'scale-100'}`}
            alt="Zen"
         />
         <div className={`w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md bg-white/20 border border-white/50 text-white z-10`}>
           <Volume2 className="w-8 h-8" />
         </div>
      </div>

      {/* Info */}
      <div className="text-center z-10 max-w-md space-y-1">
        <h3 className="text-2xl font-serif font-bold text-amber-900 line-clamp-1">
          {title || "Zen Garden"}
        </h3>
        <p className="text-sm text-amber-800/60 uppercase tracking-widest text-xs">
          {subtitle || t.music.title}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-amber-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-red-800 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-10 z-10">
        <button className="text-amber-300 hover:text-amber-500 transition-colors">
          <SkipBack className="w-6 h-6" />
        </button>
        <button 
          onClick={togglePlay}
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl shadow-amber-900/20 transform transition-all hover:scale-105 active:scale-95 bg-gradient-to-tr from-amber-600 to-red-700 text-white border-2 border-white/20"
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current translate-x-1" />}
        </button>
        <button className="text-amber-300 hover:text-amber-500 transition-colors">
          <SkipForward className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
