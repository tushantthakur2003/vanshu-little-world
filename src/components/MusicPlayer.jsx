import React, { useState, useEffect, useRef } from 'react';
import { Music, Volume2, VolumeX, Play, Pause, Sparkles } from 'lucide-react';

export const MusicPlayer = ({ customAudioUrl, defaultVolume = 0.35 }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(defaultVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);

  // Synthesizer Refs
  const audioCtxRef = useRef(null);
  const synthTimerRef = useRef(null);
  const customAudioRef = useRef(null);

  // Soft romantic music box melody (frequencies in Hz: Pentatonic gentle lullaby)
  const melodyNotes = [
    { freq: 523.25, dur: 0.6 }, // C5
    { freq: 659.25, dur: 0.6 }, // E5
    { freq: 783.99, dur: 0.6 }, // G5
    { freq: 987.77, dur: 0.8 }, // B5
    { freq: 880.00, dur: 0.6 }, // A5
    { freq: 783.99, dur: 0.6 }, // G5
    { freq: 659.25, dur: 0.8 }, // E5
    { freq: 587.33, dur: 0.6 }, // D5
    { freq: 523.25, dur: 0.6 }, // C5
    { freq: 659.25, dur: 0.6 }, // E5
    { freq: 880.00, dur: 0.8 }, // A5
    { freq: 783.99, dur: 1.2 }, // G5
    { freq: 659.25, dur: 0.6 }, // E5
    { freq: 587.33, dur: 0.6 }, // D5
    { freq: 523.25, dur: 1.4 }, // C5
  ];

  // Play a single music-box chime
  const playMusicBoxNote = (ctx, freq, duration) => {
    if (!ctx || ctx.state === 'closed') return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Music box bell overtone
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const targetVol = isMuted ? 0 : volume * 0.22;
      gain.gain.setValueAtTime(targetVol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration * 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration * 1.5);
    } catch (e) {
      console.warn("Synth note error", e);
    }
  };

  // Music box scheduler loop
  const startSynthMelody = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      let noteIndex = 0;
      const step = () => {
        if (!audioCtxRef.current) return;
        const note = melodyNotes[noteIndex];
        playMusicBoxNote(audioCtxRef.current, note.freq, note.dur);
        noteIndex = (noteIndex + 1) % melodyNotes.length;
        synthTimerRef.current = setTimeout(step, (note.dur + 0.15) * 1000);
      };

      step();
    } catch (e) {
      console.warn("Audio Context init error", e);
    }
  };

  const stopSynthMelody = () => {
    if (synthTimerRef.current) {
      clearTimeout(synthTimerRef.current);
      synthTimerRef.current = null;
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      // Pause
      if (customAudioUrl && customAudioRef.current) {
        customAudioRef.current.pause();
      } else {
        stopSynthMelody();
      }
      setIsPlaying(false);
    } else {
      // Play
      if (customAudioUrl && customAudioRef.current) {
        customAudioRef.current.play().catch((err) => {
          console.warn("Custom audio playback failed, falling back to music box:", err);
          startSynthMelody();
        });
      } else {
        startSynthMelody();
      }
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (customAudioRef.current) {
      customAudioRef.current.muted = nextMuted;
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (customAudioRef.current) {
      customAudioRef.current.volume = newVol;
    }
    if (isMuted && newVol > 0) {
      setIsMuted(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSynthMelody();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="relative inline-flex items-center">
      {/* Hidden custom audio element if user provides a file/url */}
      {customAudioUrl && (
        <audio
          ref={customAudioRef}
          src={customAudioUrl}
          loop
          preload="auto"
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Main Music Pill Button */}
      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-scrapbook border border-pastel-pink/50 hover:border-pastel-pink transition-all">
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause music" : "Play romantic music"}
          className={`flex items-center gap-2 text-xs font-cute font-medium transition-all ${
            isPlaying ? 'text-pastel-pink-deep' : 'text-gray-600'
          }`}
        >
          {/* Animated vinyl / music icon */}
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center bg-pastel-pink-soft text-pastel-pink-deep ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '4s' }}
          >
            <Music className="w-3.5 h-3.5" />
          </div>

          <span className="hidden sm:inline">
            {isPlaying ? "Music Playing ♡" : "Play Music ♡"}
          </span>
          <span className="sm:hidden">
            {isPlaying ? "Pause" : "Music"}
          </span>
        </button>

        {/* Volume & Mini Controls Toggle */}
        <button
          onClick={() => setShowControls(!showControls)}
          className="p-1 rounded-full hover:bg-pastel-pink-soft text-gray-500 hover:text-pastel-pink-deep transition-colors"
          title="Music volume"
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-3.5 h-3.5 text-gray-400" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-pastel-pink-deep" />
          )}
        </button>
      </div>

      {/* Floating mini popup volume slider */}
      {showControls && (
        <div className="absolute top-10 right-0 z-50 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-scrapbook border border-pastel-pink/60 flex flex-col gap-2 w-48 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between text-xs font-cute text-gray-600">
            <span className="flex items-center gap-1 font-semibold text-pastel-pink-deep">
              <Sparkles className="w-3 h-3" /> Music Box
            </span>
            <button
              onClick={toggleMute}
              className="text-[10px] text-pastel-pink-deep underline hover:opacity-80"
            >
              {isMuted ? "Unmute" : "Mute"}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full accent-pastel-pink cursor-pointer h-1.5 bg-pastel-pink-soft rounded-lg"
            />
            <span className="text-[10px] text-gray-400 w-6">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>
          <p className="text-[9px] text-gray-400 text-center font-cute">
            Soft music handcrafted for Vanshu ♡
          </p>
        </div>
      )}
    </div>
  );
};
