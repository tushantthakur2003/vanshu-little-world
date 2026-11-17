import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { PenguinHeart } from './illustrations/PenguinHeart';
import { WashiTape, PostageStamp, PinkBow } from './illustrations/ScrapbookDecorations';
import { playChime, playCutePop } from '../utils/soundEffects';
import { Sparkles, Heart } from 'lucide-react';

export const WelcomeScreen = ({ content, onOpenWorld }) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    playCutePop();
    playChime();

    // Cute pastel confetti burst with hearts
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#FFB6C1', '#FFA3B5', '#E8D7F1', '#FFE5D9', '#FFFDF9'],
        shapes: ['circle'],
        scalar: 1.2,
      });
    } catch (e) {
      // Confetti fallback
    }

    // Smooth transition
    setTimeout(() => {
      onOpenWorld();
    }, 650);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-pastel-pink-soft via-pastel-cream-soft to-pastel-lavender-soft transition-all duration-700 ${
        isOpening ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Decorative Scrapbook Background Patterns */}
      <div className="absolute top-6 left-6 hidden sm:block">
        <PostageStamp label="KISS" postmark="VANSHU ♡" />
      </div>
      <div className="absolute bottom-6 right-6 hidden sm:block">
        <PostageStamp label="LOVE" postmark="FOREVER ♡" />
      </div>

      {/* Main Welcome Card */}
      <div className="relative max-w-md w-full bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-scrapbook border-2 border-white/80 text-center flex flex-col items-center">
        {/* Washi Tape on top */}
        <div className="absolute -top-3.5">
          <WashiTape color="bg-pastel-pink/80" pattern="hearts" angle="-rotate-1" />
        </div>

        {/* Top ribbon bow */}
        <div className="mt-2 mb-2">
          <PinkBow className="w-10 h-10 animate-bounce" />
        </div>

        {/* Penguin with Pink Heart Illustration */}
        <div className="my-2 transform transition-transform hover:scale-105 duration-300">
          <PenguinHeart className="w-40 h-44 sm:w-48 sm:h-52" />
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold font-handwriting text-gray-800 tracking-wide mt-2">
          {content?.welcomeScreen?.heading || "Hey, Vanshu! ♡"}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg font-cute font-medium text-pastel-pink-deep mt-2">
          {content?.welcomeScreen?.subtitle || "Someone made a little world just for you..."}
        </p>

        {/* Supporting text */}
        <p className="text-xs sm:text-sm font-body text-gray-500 mt-2 max-w-xs leading-relaxed">
          {content?.welcomeScreen?.supportingText || "A tiny place filled with love, memories and little surprises."}
        </p>

        {/* Cute Divider */}
        <div className="flex items-center gap-2 my-5 opacity-60">
          <span className="w-8 h-[1px] bg-pastel-pink-deep" />
          <Heart className="w-3.5 h-3.5 text-pastel-pink-deep fill-pastel-pink" />
          <span className="w-8 h-[1px] bg-pastel-pink-deep" />
        </div>

        {/* Large Animated Open Button */}
        <button
          onClick={handleOpen}
          className="group relative w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#FF758F] to-[#FFA3B5] hover:from-[#FF4D6D] hover:to-[#FF758F] text-white rounded-full font-cute font-bold text-base sm:text-lg shadow-scrapbook hover:shadow-scrapbook-hover transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 animate-spin text-yellow-200" style={{ animationDuration: '3s' }} />
          <span>{content?.welcomeScreen?.buttonText || "Open your little world ♡"}</span>
          <span className="group-hover:translate-x-1 transition-transform">🎀</span>
        </button>

        {/* Bottom micro-hint */}
        <span className="text-[11px] font-cute text-gray-400 mt-4">
          Handcrafted with all my love for Vanshika Handoo ♡
        </span>
      </div>
    </div>
  );
};
