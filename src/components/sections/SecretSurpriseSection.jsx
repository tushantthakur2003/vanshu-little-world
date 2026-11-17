import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Lock, Unlock, Sparkles, Heart, X, Edit3, Check } from 'lucide-react';
import { WashiTape, PinkBow } from '../illustrations/ScrapbookDecorations';
import { playHarpFlourish, playCutePop, playChime } from '../../utils/soundEffects';

export const SecretSurpriseSection = ({
  data,
  openedCardsCount = 0,
  totalCardsCount = 6,
  onSaveMessage,
  showInlineEdit = false
}) => {
  const isUnlocked = openedCardsCount >= totalCardsCount;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(data.message);

  const handleOpenFinalSurprise = () => {
    if (!isUnlocked) return;
    setIsModalOpen(true);
    playHarpFlourish();

    try {
      // Grand Romantic Confetti Flourish
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#FF758F', '#FFA3B5', '#FFD166', '#E8D7F1', '#BAE6FD', '#FFF'],
        scalar: 1.3,
      });
    } catch (e) {}
  };

  const handleSave = () => {
    if (onSaveMessage) {
      onSaveMessage(editedMessage);
    }
    setIsEditing(false);
    playCutePop();
  };

  return (
    <section className="relative my-14 max-w-4xl mx-auto px-4">
      {/* Container Box */}
      <div
        className={`relative rounded-3xl p-6 sm:p-10 transition-all duration-500 text-center flex flex-col items-center border-4 ${
          isUnlocked
            ? 'bg-gradient-to-br from-pink-100/90 via-white to-purple-100/90 border-pastel-pink shadow-scrapbook-hover'
            : 'bg-gray-50/80 border-dashed border-gray-300 shadow-sm opacity-90'
        }`}
      >
        {/* Top Washi Tape */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <WashiTape
            color={isUnlocked ? "bg-pastel-pink/90" : "bg-gray-300/80"}
            pattern="hearts"
            angle="-rotate-1"
          />
        </div>

        {/* Section Heading */}
        <div className="flex items-center gap-2 mb-2">
          {isUnlocked ? (
            <PinkBow className="w-8 h-8 animate-bounce" />
          ) : (
            <Lock className="w-6 h-6 text-gray-400" />
          )}
          <h2 className="text-3xl sm:text-4xl font-bold font-handwriting text-gray-800">
            {data.sectionTitle || "One Last Thing For You..."}
          </h2>
        </div>

        {/* Progress or Unlock Status */}
        {!isUnlocked ? (
          <div className="flex flex-col items-center gap-3 my-4 max-w-md">
            <div className="w-16 h-16 rounded-full bg-gray-200/80 flex items-center justify-center text-gray-400 mb-1">
              <Lock className="w-7 h-7" />
            </div>

            <h3 className="font-cute font-bold text-base sm:text-lg text-gray-700">
              {data.lockedHeading || "A Secret Love Note is Hidden Here"}
            </h3>

            <p className="text-xs sm:text-sm font-cute text-gray-500 leading-relaxed">
              {data.lockedDescription ||
                "Explore all 6 scrapbook memories above to unlock this final surprise ♡"}
            </p>

            {/* Progress indicator pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full border border-gray-200 shadow-inner mt-2">
              <span className="text-xs font-cute text-pastel-pink-deep font-bold">
                {openedCardsCount} of {totalCardsCount} cards unlocked
              </span>
              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pastel-pink to-pastel-pink-deep transition-all duration-500"
                  style={{ width: `${(openedCardsCount / totalCardsCount) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 my-4 max-w-md animate-in zoom-in-95 duration-300">
            {/* Glowing Unlocked Gift Icon */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pastel-pink to-pastel-pink-deep flex items-center justify-center text-white shadow-lg animate-heartbeat-soft">
                <Unlock className="w-9 h-9" />
              </div>
              <Sparkles className="w-6 h-6 text-yellow-300 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '4s' }} />
            </div>

            <h3 className="font-handwriting font-bold text-2xl sm:text-3xl text-pastel-pink-deep">
              {data.unlockedHeading || "You Unlocked The Secret Surprise! 🎀"}
            </h3>

            <p className="text-xs sm:text-sm font-cute text-gray-600">
              You've opened every memory in your little world. Now, here is my final whisper for you...
            </p>

            <button
              onClick={handleOpenFinalSurprise}
              className="mt-2 px-8 py-3.5 bg-gradient-to-r from-pastel-pink-deep to-pink-600 hover:from-pink-600 hover:to-pastel-pink-deep text-white rounded-full font-cute font-bold text-base sm:text-lg shadow-scrapbook hover:shadow-scrapbook-hover transition-all transform active:scale-95 flex items-center gap-2"
            >
              <Heart className="w-5 h-5 fill-white animate-pulse" />
              <span>{data.unlockedPrompt || "Tap to read my final message ♡"}</span>
              <Sparkles className="w-4 h-4 text-yellow-200" />
            </button>
          </div>
        )}
      </div>

      {/* Full-Screen Romantic Presentation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative max-w-2xl w-full bg-[#FFFDF9] rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-pastel-pink flex flex-col max-h-[92vh] overflow-y-auto">
            {/* Scrapbook Ribbon */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <WashiTape color="bg-pastel-pink" pattern="hearts" angle="rotate-0" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-pastel-pink/40 mb-4">
              <div className="flex items-center gap-2">
                <PinkBow className="w-8 h-8" />
                <h3 className="text-2xl sm:text-3xl font-bold font-handwriting text-gray-800">
                  {data.fullScreenTitle || "To My Dearest Vanshu ♡"}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {showInlineEdit && (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-1.5 rounded-full hover:bg-pastel-pink-soft text-gray-500 hover:text-pastel-pink-deep transition-colors"
                    title="Edit message"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => {
                    playCutePop();
                    setIsModalOpen(false);
                  }}
                  className="p-1.5 rounded-full hover:bg-pastel-pink-soft text-gray-400 hover:text-pastel-pink-deep transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Main Romantic Note */}
            <div className="relative bg-gradient-to-br from-pink-50/70 via-white to-purple-50/70 p-6 sm:p-8 rounded-2xl border-2 border-dashed border-pastel-pink shadow-inner-soft">
              {isEditing ? (
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-cute text-pastel-pink-deep font-semibold">
                    Edit Secret Final Message:
                  </span>
                  <textarea
                    rows={10}
                    value={editedMessage}
                    onChange={(e) => setEditedMessage(e.target.value)}
                    className="w-full p-3 rounded-xl border border-pastel-pink text-base font-handwriting leading-relaxed focus:outline-none focus:ring-2 focus:ring-pastel-pink"
                  />
                  <button
                    onClick={handleSave}
                    className="self-end px-5 py-2 bg-pastel-pink-deep text-white rounded-full font-cute text-xs font-bold hover:bg-pink-600 transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <Check className="w-4 h-4" /> Save Final Message
                  </button>
                </div>
              ) : (
                <div className="font-handwriting text-xl sm:text-2xl text-gray-800 leading-relaxed sm:leading-loose whitespace-pre-line text-center">
                  {data.message}
                </div>
              )}
            </div>

            {/* Footer with romantic signature */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-cute text-gray-500">
              <div className="flex items-center gap-1.5 text-pastel-pink-deep font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Made especially for Vanshika Handoo (Vanshu)</span>
              </div>
              <button
                onClick={() => {
                  playCutePop();
                  setIsModalOpen(false);
                }}
                className="px-6 py-2 bg-gradient-to-r from-pastel-pink to-pastel-pink-deep text-white rounded-full font-cute font-bold hover:shadow-md transition-all active:scale-95"
              >
                I Love You Too ♡
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
