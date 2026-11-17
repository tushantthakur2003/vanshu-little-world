import React, { useState } from 'react';
import { Heart, X, Wind, Sparkles, Edit3, Check } from 'lucide-react';
import { BunnyFlower } from '../illustrations/BunnyFlower';
import { WashiTape, PinkBow } from '../illustrations/ScrapbookDecorations';
import { playChime, playCutePop } from '../../utils/soundEffects';

export const CardComfortLetter = ({ data, onMarkOpened, isOpened, onSaveMessage, showInlineEdit = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBreathing, setIsBreathing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(data.message);

  React.useEffect(() => {
    if (data?.message) {
      setEditedMessage(data.message);
    }
  }, [data?.message]);

  const handleOpen = () => {
    setIsOpen(true);
    playChime();
    onMarkOpened();
  };

  const handleSave = () => {
    if (onSaveMessage) {
      onSaveMessage(editedMessage);
    }
    setIsEditing(false);
    playCutePop();
  };

  return (
    <>
      {/* Scrapbook Card Preview */}
      <div
        onClick={handleOpen}
        className={`group relative bg-white/90 rounded-3xl p-5 sm:p-6 shadow-scrapbook hover:shadow-scrapbook-hover transition-all duration-300 cursor-pointer border-2 border-white/80 flex flex-col items-center text-center transform hover:-translate-y-1.5 ${
          isOpened ? 'ring-2 ring-pastel-peach/50' : ''
        }`}
      >
        <div className="absolute -top-3">
          <WashiTape color="bg-pastel-peach/80" pattern="dots" angle="rotate-2" />
        </div>

        {isOpened && (
          <span className="absolute top-3 right-3 text-[10px] font-cute px-2 py-0.5 bg-pastel-peach-soft text-amber-700 rounded-full border border-amber-200">
            Comforted ♡
          </span>
        )}

        <div className="my-2 group-hover:scale-105 transition-transform">
          <BunnyFlower className="w-28 h-28" />
        </div>

        <h3 className="text-xl font-bold font-handwriting text-gray-800 group-hover:text-amber-700 transition-colors mt-2">
          {data.title || "Open When You're Sad 🐰"}
        </h3>
        <p className="text-xs font-cute text-gray-500 mt-1">
          {data.subtitle || "A warm cup of comfort for your heart"}
        </p>

        <div className="mt-4 flex items-center gap-1 text-xs font-cute text-amber-700 font-semibold">
          <span>Read comfort note</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>

      {/* Comfort Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-lg w-full bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-pastel-peach-soft flex flex-col max-h-[92vh] overflow-y-auto">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <WashiTape color="bg-pastel-peach/90" pattern="hearts" angle="rotate-0" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-pastel-peach/40 mb-3">
              <div className="flex items-center gap-2">
                <PinkBow className="w-6 h-6" />
                <h2 className="text-2xl font-bold font-handwriting text-gray-800">
                  You Are Never Alone, Vanshu
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {showInlineEdit && (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-1.5 rounded-full hover:bg-pastel-peach-soft text-gray-500 hover:text-amber-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => {
                    playCutePop();
                    setIsOpen(false);
                  }}
                  className="p-1.5 rounded-full hover:bg-pastel-peach-soft text-gray-500 hover:text-amber-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Bunny Graphic */}
            <div className="flex justify-center my-1">
              <BunnyFlower className="w-32 h-32" />
            </div>

            {/* Interactive Breathing Guide */}
            <div className="my-3 p-3 bg-pastel-peach-soft/60 rounded-2xl border border-dashed border-pastel-peach flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5 text-xs font-cute text-amber-800 font-semibold mb-2">
                <Wind className="w-4 h-4 text-pastel-peach-deep" />
                <span>Take a deep breath with me:</span>
              </div>
              {/* Soothing Breathing Circle */}
              <div
                onClick={() => setIsBreathing(!isBreathing)}
                className={`cursor-pointer w-20 h-20 rounded-full bg-gradient-to-br from-pastel-peach to-pastel-pink-soft flex items-center justify-center shadow-inner transition-transform duration-[4000ms] ease-in-out ${
                  isBreathing ? 'scale-125 ring-4 ring-pastel-peach' : 'scale-100 hover:scale-105'
                }`}
              >
                <span className="text-[11px] font-cute font-bold text-gray-700 select-none">
                  {isBreathing ? "Exhale..." : "Inhale..."}
                </span>
              </div>
              <span className="text-[10px] font-cute text-gray-500 mt-2">
                {isBreathing ? "Let all worries float away ♡" : "Tap the circle to begin calm breathing"}
              </span>
            </div>

            {/* Letter Content / Edit Mode */}
            <div className="bg-[#FFF8F3] p-5 sm:p-6 rounded-2xl border border-dashed border-pastel-peach text-gray-700 shadow-inner-soft">
              {isEditing ? (
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-cute text-amber-800 font-semibold">
                    Edit Comfort Note:
                  </span>
                  <textarea
                    rows={8}
                    value={editedMessage}
                    onChange={(e) => setEditedMessage(e.target.value)}
                    className="w-full p-3 rounded-xl border border-pastel-peach text-sm font-handwriting leading-relaxed focus:outline-none focus:ring-2 focus:ring-pastel-peach"
                  />
                  <button
                    onClick={handleSave}
                    className="self-end px-4 py-2 bg-pastel-peach-deep text-white rounded-full font-cute text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Save Message
                  </button>
                </div>
              ) : (
                <div className="font-handwriting text-lg sm:text-xl text-gray-700 leading-relaxed whitespace-pre-line">
                  {data.message}
                </div>
              )}
            </div>

            {/* Warm hug reminder */}
            <div className="mt-4 flex items-center justify-between text-xs font-cute text-gray-500">
              <span className="flex items-center gap-1 text-pastel-pink-deep">
                <Heart className="w-3.5 h-3.5 fill-pastel-pink-deep" /> Sending you gentle hugs
              </span>
              <button
                onClick={() => {
                  playCutePop();
                  setIsOpen(false);
                }}
                className="px-4 py-2 bg-gradient-to-r from-pastel-peach-deep to-pastel-pink-deep text-white rounded-full font-cute font-bold hover:shadow-md transition-all active:scale-95"
              >
                Feeling Better ♡
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
