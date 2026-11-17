import React from 'react';
import { MusicPlayer } from './MusicPlayer';
import { PinkBow } from './illustrations/ScrapbookDecorations';
import { Settings, RefreshCw, Home, Sparkles } from 'lucide-react';
import { playCutePop } from '../utils/soundEffects';

export const Header = ({
  content,
  onResetProgress,
  onOpenSettings,
  onReturnToWelcome,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/85 backdrop-blur-md border-b border-pastel-pink/30 px-4 py-2.5 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Left Branding */}
        <div
          onClick={onReturnToWelcome}
          className="flex items-center gap-2 cursor-pointer group"
          title="Return to Welcome Screen"
        >
          <PinkBow className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <div className="flex flex-col">
            <span className="font-handwriting font-bold text-xl sm:text-2xl text-gray-800 group-hover:text-pastel-pink-deep transition-colors leading-none">
              {content.nickname ? `${content.nickname}'s Little World` : "Vanshu's Little World"}
            </span>
            <span className="text-[9px] font-cute text-pastel-pink-deep tracking-wider hidden sm:inline">
              A Personal Romantic Scrapbook ♡
            </span>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Background Music Player */}
          <MusicPlayer
            customAudioUrl={content?.musicSettings?.customAudioUrl}
            defaultVolume={content?.musicSettings?.volume || 0.35}
          />

          {/* Reset progress (useful for testing or re-living surprise) */}
          <button
            onClick={() => {
              playCutePop();
              onResetProgress();
            }}
            className="p-2 bg-white rounded-full border border-pastel-pink/50 hover:bg-pastel-pink-soft text-gray-400 hover:text-gray-600 transition-all shadow-sm hidden sm:flex"
            title="Reset Exploration Progress"
            aria-label="Reset Progress"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
