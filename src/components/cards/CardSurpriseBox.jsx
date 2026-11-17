import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Gift, Heart, Sparkles, X, Edit3, Check } from 'lucide-react';
import { GiftBox } from '../illustrations/GiftBox';
import { WashiTape, PinkBow } from '../illustrations/ScrapbookDecorations';
import { playHarpFlourish, playCutePop, playChime } from '../../utils/soundEffects';

export const CardSurpriseBox = ({ data, onMarkOpened, isOpened, onSaveMessage, showInlineEdit = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBoxOpened, setIsBoxOpened] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(data.message);

  const handleOpenCard = () => {
    setIsModalOpen(true);
    playChime();
    onMarkOpened();
  };

  const handleOpenGiftBox = () => {
    setIsBoxOpened(true);
    playHarpFlourish();

    try {
      // Confetti burst
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#FF758F', '#FFA3B5', '#FFD166', '#E8D7F1', '#FFE5D9'],
        shapes: ['circle', 'square'],
        scalar: 1.2,
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
    <>
      {/* Scrapbook Card Preview */}
      <div
        onClick={handleOpenCard}
        className={`group relative bg-white/90 rounded-3xl p-5 sm:p-6 shadow-scrapbook hover:shadow-scrapbook-hover transition-all duration-300 cursor-pointer border-2 border-white/80 flex flex-col items-center text-center transform hover:-translate-y-1.5 ${
          isOpened ? 'ring-2 ring-pastel-pink/40' : ''
        }`}
      >
        <div className="absolute -top-3">
          <WashiTape color="bg-pastel-pink/80" pattern="hearts" angle="rotate-2" />
        </div>

        {isOpened && (
          <span className="absolute top-3 right-3 text-[10px] font-cute px-2 py-0.5 bg-pastel-pink-soft text-pastel-pink-deep rounded-full border border-pastel-pink/40">
            Unwrapped ♡
          </span>
        )}

        <div className="my-2 group-hover:scale-105 transition-transform">
          <GiftBox className="w-28 h-28" isOpen={false} />
        </div>

        <h3 className="text-xl font-bold font-handwriting text-gray-800 group-hover:text-pastel-pink-deep transition-colors mt-2">
          {data.title || "A Little Surprise 🎁"}
        </h3>
        <p className="text-xs font-cute text-gray-500 mt-1">
          {data.subtitle || "Something sweet tucked inside"}
        </p>

        <div className="mt-4 flex items-center gap-1 text-xs font-cute text-pastel-pink-deep font-semibold">
          <span>Unwrap surprise</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>

      {/* Gift Box Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-lg w-full bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-pastel-pink-soft flex flex-col items-center text-center max-h-[92vh] overflow-y-auto">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <WashiTape color="bg-pastel-pink/90" pattern="stripes" angle="rotate-0" />
            </div>

            <button
              onClick={() => {
                playCutePop();
                setIsModalOpen(false);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-pastel-pink-soft text-gray-400 hover:text-pastel-pink-deep transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <div className="flex items-center gap-2 mb-2">
              <PinkBow className="w-6 h-6" />
              <h2 className="text-2xl font-bold font-handwriting text-gray-800">
                A Little Gift For You
              </h2>
            </div>

            {/* Big Animated Gift Box */}
            <div className="my-3">
              <GiftBox className="w-48 h-48 sm:w-56 sm:h-56" isOpen={isBoxOpened} />
            </div>

            {!isBoxOpened ? (
              <div className="flex flex-col items-center gap-4 my-2">
                <p className="text-xs font-cute text-gray-500 max-w-xs">
                  A special surprise parcel packed with endless love, waiting for Vanshu to open it!
                </p>
                <button
                  onClick={handleOpenGiftBox}
                  className="px-8 py-3.5 bg-gradient-to-r from-pastel-pink-deep to-pink-500 hover:from-pink-500 hover:to-pastel-pink-deep text-white rounded-full font-cute font-bold text-base shadow-lg hover:shadow-xl transition-all transform active:scale-95 flex items-center gap-2 animate-bounce"
                >
                  <Gift className="w-4 h-4" />
                  <span>{data.openPrompt || "Open your gift ♡"}</span>
                  <Sparkles className="w-4 h-4 text-yellow-200" />
                </button>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center animate-in zoom-in-95 fade-in duration-300">
                {/* Editable Surprise Note */}
                <div className="w-full bg-gradient-to-br from-pink-50/80 to-purple-50/80 p-5 sm:p-6 rounded-2xl border-2 border-dashed border-pastel-pink/60 shadow-inner-soft text-left relative my-2">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-pastel-pink/30">
                    <span className="text-xs font-cute font-bold text-pastel-pink-deep flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Inside The Gift Box:
                    </span>
                    {showInlineEdit && (
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="p-1 rounded-full hover:bg-white text-gray-400 hover:text-pastel-pink-deep transition-colors"
                        title="Edit surprise message"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        rows={6}
                        value={editedMessage}
                        onChange={(e) => setEditedMessage(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-pastel-pink text-sm font-handwriting leading-relaxed focus:outline-none focus:ring-2 focus:ring-pastel-pink"
                      />
                      <button
                        onClick={handleSave}
                        className="self-end px-4 py-1.5 bg-pastel-pink-deep text-white rounded-full font-cute text-xs font-bold hover:bg-pink-600 transition-colors flex items-center gap-1"
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

                <button
                  onClick={() => {
                    playCutePop();
                    setIsModalOpen(false);
                  }}
                  className="mt-3 px-6 py-2 bg-pastel-pink text-white rounded-full font-cute text-xs font-bold hover:bg-pastel-pink-deep transition-colors"
                >
                  Close & Cherish ♡
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
