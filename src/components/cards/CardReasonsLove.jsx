import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, X, CheckCircle2, Sparkles, Edit3, Save } from 'lucide-react';
import { BunnyHearts } from '../illustrations/BunnyHearts';
import { WashiTape, PinkBow } from '../illustrations/ScrapbookDecorations';
import { playCutePop, playChime } from '../../utils/soundEffects';

export const CardReasonsLove = ({ data, onMarkOpened, isOpened, onSaveReasons, showInlineEdit = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [revealedHearts, setRevealedHearts] = useState([]);
  const [selectedReason, setSelectedReason] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [reasonsList, setReasonsList] = useState(data.reasons || []);

  // Sync reasons list when updated
  React.useEffect(() => {
    if (data?.reasons) {
      setReasonsList(data.reasons);
    }
  }, [data?.reasons]);

  const handleOpen = () => {
    setIsOpen(true);
    playChime();
    onMarkOpened();
  };

  const handleHeartClick = (index) => {
    playCutePop();
    if (!revealedHearts.includes(index)) {
      const next = [...revealedHearts, index];
      setRevealedHearts(next);
      if (next.length === reasonsList.length) {
        // All 10 revealed!
        try {
          confetti({
            particleCount: 40,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF758F', '#FFA3B5', '#FFCCD5', '#E8D7F1'],
          });
        } catch (e) {}
      }
    }
    setSelectedReason({ index, text: reasonsList[index] });
  };

  const handleReasonChange = (index, val) => {
    const updated = [...reasonsList];
    updated[index] = val;
    setReasonsList(updated);
  };

  const handleSaveReasons = () => {
    if (onSaveReasons) {
      onSaveReasons(reasonsList);
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
          isOpened ? 'ring-2 ring-pastel-pink/40' : ''
        }`}
      >
        <div className="absolute -top-3">
          <WashiTape color="bg-pastel-pink/80" pattern="stripes" angle="-rotate-1" />
        </div>

        {isOpened && (
          <span className="absolute top-3 right-3 text-[10px] font-cute px-2 py-0.5 bg-pastel-pink-soft text-pastel-pink-deep rounded-full border border-pastel-pink/40">
            {revealedHearts.length}/{reasonsList.length} Unlocked ♡
          </span>
        )}

        <div className="my-2 group-hover:scale-105 transition-transform">
          <BunnyHearts className="w-28 h-28" />
        </div>

        <h3 className="text-xl font-bold font-handwriting text-gray-800 group-hover:text-pastel-pink-deep transition-colors mt-2">
          {data.title || "Reasons I Love You 🎀"}
        </h3>
        <p className="text-xs font-cute text-gray-500 mt-1">
          {data.subtitle || "Tap all 10 hearts to reveal"}
        </p>

        <div className="mt-4 flex items-center gap-1 text-xs font-cute text-pastel-pink-deep font-semibold">
          <span>Reveal 10 secrets</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>

      {/* Modal with 10 Clickable Hearts */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-xl w-full bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-pastel-pink-soft flex flex-col max-h-[92vh] overflow-y-auto">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <WashiTape color="bg-pastel-pink/90" pattern="stripes" angle="rotate-0" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-pastel-pink/30 mb-4">
              <div className="flex items-center gap-2">
                <PinkBow className="w-6 h-6" />
                <h2 className="text-2xl font-bold font-handwriting text-gray-800">
                  10 Reasons Why I Love You
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {showInlineEdit && (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-1.5 rounded-full hover:bg-pastel-pink-soft text-gray-500 hover:text-pastel-pink-deep transition-colors"
                    title={isEditing ? "Done editing" : "Edit reasons"}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => {
                    playCutePop();
                    setIsOpen(false);
                    setSelectedReason(null);
                  }}
                  className="p-1.5 rounded-full hover:bg-pastel-pink-soft text-gray-500 hover:text-pastel-pink-deep transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Sub-instruction */}
            <p className="text-xs font-cute text-gray-500 text-center mb-4">
              Click each heart below to unfold a reason why you mean the world to me:
            </p>

            {/* 10 Hearts Grid */}
            <div className="grid grid-cols-5 gap-2.5 sm:gap-3.5 my-2">
              {reasonsList.map((reason, index) => {
                const isRevealed = revealedHearts.includes(index);
                const isSelected = selectedReason?.index === index;
                return (
                  <button
                    key={index}
                    onClick={() => handleHeartClick(index)}
                    className={`relative aspect-square flex flex-col items-center justify-center rounded-2xl p-2 transition-all duration-300 transform active:scale-90 ${
                      isRevealed
                        ? 'bg-gradient-to-br from-pastel-pink to-pastel-pink-deep text-white shadow-md'
                        : 'bg-pastel-pink-soft/80 hover:bg-pastel-pink/50 text-pastel-pink-deep border-2 border-dashed border-pastel-pink'
                    } ${isSelected ? 'ring-4 ring-pink-300 scale-105' : ''}`}
                  >
                    <Heart
                      className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform ${
                        isRevealed ? 'fill-white text-white scale-110' : 'fill-pastel-pink text-pastel-pink-deep'
                      }`}
                    />
                    <span className="text-[11px] font-cute font-bold mt-1">
                      #{index + 1}
                    </span>
                    {isRevealed && (
                      <span className="absolute -top-1 -right-1 text-[10px]">✨</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Reason Display Box */}
            {selectedReason && (
              <div className="my-4 bg-gradient-to-r from-pastel-pink-soft/60 to-pastel-lavender-soft/60 p-4 rounded-2xl border-2 border-white shadow-sm flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="w-10 h-10 rounded-full bg-pastel-pink-deep text-white flex items-center justify-center font-bold font-cute shrink-0">
                  #{selectedReason.index + 1}
                </div>
                <div className="flex-1">
                  <span className="text-[11px] font-cute text-pastel-pink-deep font-semibold uppercase tracking-wider">
                    Reason #{selectedReason.index + 1}
                  </span>
                  <p className="font-handwriting text-xl sm:text-2xl text-gray-800 font-bold leading-snug">
                    {reasonsList[selectedReason.index]}
                  </p>
                </div>
              </div>
            )}

            {/* All Revealed List / Edit Mode */}
            {isEditing ? (
              <div className="mt-4 flex flex-col gap-2 p-3 bg-white rounded-2xl border border-pastel-pink">
                <span className="text-xs font-cute text-pastel-pink-deep font-semibold">
                  Edit 10 Reasons:
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {reasonsList.map((reason, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs font-cute text-gray-400 w-6">#{i+1}</span>
                      <input
                        type="text"
                        value={reason}
                        onChange={(e) => handleReasonChange(i, e.target.value)}
                        className="flex-1 p-1.5 text-xs font-cute border rounded-lg focus:outline-none focus:ring-1 focus:ring-pastel-pink"
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleSaveReasons}
                  className="self-end mt-2 px-4 py-1.5 bg-pastel-pink-deep text-white rounded-full font-cute text-xs font-bold hover:bg-pink-600 transition-colors flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" /> Save All Reasons
                </button>
              </div>
            ) : (
              <div className="mt-3 flex items-center justify-between text-xs font-cute text-gray-500">
                <span>
                  {revealedHearts.length === reasonsList.length
                    ? "All 10 reasons revealed! You are loved so much ♡"
                    : `${revealedHearts.length} of 10 reasons revealed`}
                </span>
                {revealedHearts.length === reasonsList.length && (
                  <span className="text-pastel-pink-deep font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Forever & Always
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
