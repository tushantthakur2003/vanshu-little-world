import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, X, Sparkles, Send } from 'lucide-react';
import { PenguinsHugging } from '../illustrations/PenguinsHugging';
import { WashiTape, PinkBow } from '../illustrations/ScrapbookDecorations';
import { playHugSound, playCutePop } from '../../utils/soundEffects';
import { loadStoredData, saveStoredData } from '../../utils/storage';

export const CardPenguinHug = ({ data, onMarkOpened, isOpened }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hugCount, setHugCount] = useState(() => loadStoredData('hug_count', 1));
  const [isHuggingAnim, setIsHuggingAnim] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    playHugSound();
    onMarkOpened();
  };

  const handleSendHug = () => {
    setIsHuggingAnim(true);
    playHugSound();
    const nextCount = hugCount + 1;
    setHugCount(nextCount);
    saveStoredData('hug_count', nextCount);

    // Heart explosion
    try {
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FF758F', '#FFA3B5', '#FFD1DC', '#FFC4A8'],
      });
    } catch (e) {}

    setTimeout(() => {
      setIsHuggingAnim(false);
    }, 700);
  };

  return (
    <>
      {/* Scrapbook Card Preview */}
      <div
        onClick={handleOpen}
        className={`group relative bg-white/90 rounded-3xl p-5 sm:p-6 shadow-scrapbook hover:shadow-scrapbook-hover transition-all duration-300 cursor-pointer border-2 border-white/80 flex flex-col items-center text-center transform hover:-translate-y-1.5 ${
          isOpened ? 'ring-2 ring-pastel-pink/40' : ''
        }`}
      >
        <div className="absolute -top-3">
          <WashiTape color="bg-pastel-blue/80" pattern="dots" angle="rotate-1" />
        </div>

        {isOpened && (
          <span className="absolute top-3 right-3 text-[10px] font-cute px-2 py-0.5 bg-pastel-blue-soft text-sky-600 rounded-full border border-sky-200">
            Hugged ♡
          </span>
        )}

        {/* Two Penguins Hugging preview */}
        <div className="my-2 group-hover:scale-105 transition-transform">
          <PenguinsHugging className="w-28 h-28" />
        </div>

        <h3 className="text-xl font-bold font-handwriting text-gray-800 group-hover:text-sky-600 transition-colors mt-2">
          {data.title || "When You Miss Me 🐧"}
        </h3>
        <p className="text-xs font-cute text-gray-500 mt-1">
          {data.subtitle || "Press anytime you need warmth"}
        </p>

        <div className="mt-4 flex items-center gap-1 text-xs font-cute text-sky-600 font-semibold">
          <span>Get a warm hug</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>

      {/* Hug Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-md w-full bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-pastel-blue-soft flex flex-col items-center text-center">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <WashiTape color="bg-pastel-blue/90" pattern="dots" angle="rotate-0" />
            </div>

            <button
              onClick={() => {
                playCutePop();
                setIsOpen(false);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-pastel-blue-soft text-gray-400 hover:text-sky-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <div className="flex items-center gap-2 mb-2">
              <PinkBow className="w-6 h-6" />
              <h2 className="text-2xl font-bold font-handwriting text-gray-800">
                A Giant Warm Hug
              </h2>
            </div>

            {/* Hugging Penguins with animation */}
            <div className="my-3">
              <PenguinsHugging className="w-48 h-48 sm:w-52 sm:h-52" isHugging={isHuggingAnim} />
            </div>

            {/* Hug Count Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pastel-blue-soft text-sky-700 rounded-full text-xs font-cute font-semibold mb-3 border border-sky-200">
              <Heart className="w-3.5 h-3.5 fill-sky-400 text-sky-500" />
              <span>{hugCount} warm hugs sent to Vanshu</span>
            </div>

            {/* Message */}
            <div className="bg-sky-50/50 p-4 rounded-2xl border border-dashed border-sky-200 text-gray-700 font-handwriting text-lg sm:text-xl leading-relaxed whitespace-pre-line mb-5">
              {data.message}
            </div>

            {/* Send another hug button */}
            <button
              onClick={handleSendHug}
              className={`w-full py-3.5 bg-gradient-to-r from-sky-400 to-pastel-pink-deep text-white rounded-full font-cute font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-95 ${
                isHuggingAnim ? 'scale-105 ring-4 ring-sky-200' : ''
              }`}
            >
              <Heart className="w-4 h-4 fill-white animate-pulse" />
              <span>{data.buttonLabel || "Send me another hug ♡"}</span>
              <Sparkles className="w-4 h-4 text-yellow-200" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
