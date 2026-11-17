import React, { useState } from 'react';
import { Mail, Heart, X, Edit3, Check, Sparkles } from 'lucide-react';
import { playChime, playCutePop } from '../../utils/soundEffects';
import { WashiTape, PinkBow } from '../illustrations/ScrapbookDecorations';

export const CardEnvelopeLetter = ({ data, onMarkOpened, isOpened, onSaveMessage, showInlineEdit = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(data.message);

  const handleOpenLetter = () => {
    setIsOpen(true);
    playChime();
    onMarkOpened();
  };

  const handleClose = () => {
    playCutePop();
    setIsOpen(false);
    setIsEditing(false);
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
        onClick={handleOpenLetter}
        className={`group relative bg-white/90 rounded-3xl p-5 sm:p-6 shadow-scrapbook hover:shadow-scrapbook-hover transition-all duration-300 cursor-pointer border-2 border-white/80 flex flex-col items-center text-center transform hover:-translate-y-1.5 ${
          isOpened ? 'ring-2 ring-pastel-pink/40' : ''
        }`}
      >
        {/* Washi tape header */}
        <div className="absolute -top-3">
          <WashiTape color="bg-pastel-pink/80" pattern="hearts" angle="-rotate-2" />
        </div>

        {/* Opened Badge */}
        {isOpened && (
          <span className="absolute top-3 right-3 text-[10px] font-cute px-2 py-0.5 bg-pastel-pink-soft text-pastel-pink-deep rounded-full border border-pastel-pink/40">
            Read ♡
          </span>
        )}

        {/* Cute Envelope Graphic */}
        <div className="my-3 relative w-28 h-20 bg-gradient-to-br from-pastel-pink-soft to-pastel-pink rounded-xl shadow-md border-2 border-white flex items-center justify-center group-hover:scale-105 transition-transform">
          {/* Envelope Flap Lines */}
          <div className="absolute top-0 inset-x-0 h-10 border-b-2 border-l border-r border-pastel-pink-deep/30 [clip-path:polygon(0_0,100%_0,50%_100%)] bg-pastel-pink/80" />
          {/* Heart Sticker in Center */}
          <div className="z-10 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center animate-heartbeat-soft">
            <Heart className="w-5 h-5 text-pastel-pink-deep fill-pastel-pink-deep" />
          </div>
        </div>

        {/* Card Titles */}
        <h3 className="text-xl font-bold font-handwriting text-gray-800 group-hover:text-pastel-pink-deep transition-colors mt-2">
          {data.title || "A Little Love Letter 💌"}
        </h3>
        <p className="text-xs font-cute text-gray-500 mt-1">
          {data.subtitle || "Tap to unfold my heart"}
        </p>

        {/* Action prompt */}
        <div className="mt-4 flex items-center gap-1 text-xs font-cute text-pastel-pink-deep font-semibold">
          <span>Read letter</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>

      {/* Full Animated Letter Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-lg w-full bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-pastel-pink-soft/80 flex flex-col max-h-[90vh] overflow-y-auto">
            {/* Top Washi Tape & Bow */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <WashiTape color="bg-pastel-pink/90" pattern="hearts" angle="rotate-0" />
            </div>

            {/* Header with Close and Edit */}
            <div className="flex items-center justify-between pb-3 border-b border-pastel-pink/30 mb-4">
              <div className="flex items-center gap-2">
                <PinkBow className="w-6 h-6" />
                <span className="font-handwriting font-bold text-2xl text-gray-800">
                  A Love Letter For Vanshu
                </span>
              </div>
              <div className="flex items-center gap-2">
                {showInlineEdit && (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-1.5 rounded-full hover:bg-pastel-pink-soft text-gray-500 hover:text-pastel-pink-deep transition-colors"
                    title={isEditing ? "Cancel edit" : "Edit this letter"}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-full hover:bg-pastel-pink-soft text-gray-500 hover:text-pastel-pink-deep transition-colors"
                  title="Close letter"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Letter Body (Paper texture styling) */}
            <div className="relative bg-[#FFFBF0]/60 p-5 sm:p-6 rounded-2xl border border-dashed border-pastel-pink/60 shadow-inner-soft">
              {isEditing ? (
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-cute text-pastel-pink-deep font-semibold">
                    Edit Your Letter:
                  </span>
                  <textarea
                    rows={10}
                    value={editedMessage}
                    onChange={(e) => setEditedMessage(e.target.value)}
                    className="w-full p-3 rounded-xl border border-pastel-pink text-sm font-handwriting leading-relaxed focus:outline-none focus:ring-2 focus:ring-pastel-pink"
                  />
                  <button
                    onClick={handleSave}
                    className="self-end px-4 py-2 bg-pastel-pink-deep text-white rounded-full font-cute text-xs font-bold hover:bg-pink-600 transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" /> Save Changes
                  </button>
                </div>
              ) : (
                <div className="font-handwriting text-lg sm:text-xl text-gray-700 leading-relaxed whitespace-pre-line">
                  {data.message}
                </div>
              )}
            </div>

            {/* Bottom Cute Footer */}
            <div className="mt-5 flex items-center justify-between text-xs font-cute text-gray-400">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Handcrafted with love
              </span>
              <button
                onClick={handleClose}
                className="px-5 py-2 bg-gradient-to-r from-pastel-pink to-pastel-pink-deep text-white rounded-full font-cute font-bold hover:shadow-md transition-all active:scale-95"
              >
                Keep in My Heart ♡
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
