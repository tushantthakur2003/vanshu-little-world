import React, { useState } from 'react';
import { X, Smartphone, Monitor, Sparkles, Check, Send } from 'lucide-react';
import { WelcomeScreen } from '../WelcomeScreen';
import { Dashboard } from '../sections/Dashboard';
import { SpecialDatesSection } from '../sections/SpecialDatesSection';
import { SecretSurpriseSection } from '../sections/SecretSurpriseSection';
import { PinkBow, WashiTape } from '../illustrations/ScrapbookDecorations';

export const PreviewModal = ({ isOpen, onClose, draftContent, onPublishFromPreview }) => {
  const [viewMode, setViewMode] = useState('mobile'); // 'mobile' or 'desktop'
  const [openedCards, setOpenedCards] = useState({});
  const [welcomePassed, setWelcomePassed] = useState(true);

  if (!isOpen) return null;

  const handleMarkCardOpened = (cardKey) => {
    setOpenedCards((prev) => ({ ...prev, [cardKey]: true }));
  };

  return (
    <div className="fixed inset-0 z-90 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[94vh] bg-[#FFFDF9] rounded-3xl shadow-2xl border-4 border-pastel-pink-soft flex flex-col overflow-hidden">
        {/* Preview Top Action Header */}
        <div className="bg-white/95 border-b border-pastel-pink/40 px-4 py-2.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <PinkBow className="w-6 h-6" />
            <div>
              <span className="font-handwriting font-bold text-lg sm:text-xl text-gray-800 leading-none block">
                Draft Preview Mode
              </span>
              <span className="text-[10px] font-cute text-pastel-pink-deep">
                See exactly how Vanshu will experience your changes ♡
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Viewport switcher */}
            <div className="hidden sm:flex items-center bg-gray-100 rounded-full p-0.5 border border-gray-200">
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-1.5 rounded-full text-xs font-cute flex items-center gap-1 transition-colors ${
                  viewMode === 'mobile' ? 'bg-white text-pastel-pink-deep shadow-sm font-bold' : 'text-gray-500'
                }`}
                title="Phone View"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="text-[10px]">Phone</span>
              </button>
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-1.5 rounded-full text-xs font-cute flex items-center gap-1 transition-colors ${
                  viewMode === 'desktop' ? 'bg-white text-pastel-pink-deep shadow-sm font-bold' : 'text-gray-500'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="text-[10px]">Desktop</span>
              </button>
            </div>

            {/* Quick Publish from Preview */}
            <button
              onClick={() => {
                onClose();
                onPublishFromPreview();
              }}
              className="px-4 py-1.5 bg-gradient-to-r from-pastel-pink to-pastel-pink-deep text-white rounded-full font-cute text-xs font-bold shadow hover:shadow-md transition-all flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Approve & Publish</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview Frame Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gradient-to-br from-pink-50/40 via-[#FFFDF9] to-purple-50/40 flex justify-center">
          <div
            className={`w-full transition-all duration-300 ${
              viewMode === 'mobile'
                ? 'max-w-md bg-[#FFFDF9] rounded-3xl shadow-xl border-4 border-gray-200/80 p-2 overflow-y-auto my-2'
                : 'max-w-4xl'
            }`}
          >
            {/* Live Rendered Content */}
            <div className="relative py-4">
              <Dashboard
                content={draftContent}
                openedCards={openedCards}
                onMarkCardOpened={handleMarkCardOpened}
                onUpdateContent={() => {}}
              />

              <SpecialDatesSection
                data={{
                  sectionTitle: draftContent.specialDates?.sectionTitle || "Our Special Dates ♡",
                  subtitle: draftContent.specialDates?.subtitle || "The milestones that make my heart so grateful.",
                  anniversary: draftContent.anniversaryInfo || draftContent.specialDates?.anniversary || {
                    title: "Our Anniversary",
                    date: "2024-05-18",
                    caption: "The best day ever. Counting down to our next milestone! ✨",
                  },
                  datesList: Array.isArray(draftContent.specialDates)
                    ? draftContent.specialDates
                    : draftContent.specialDates?.datesList || [],
                }}
                onSaveDates={() => {}}
              />

              <SecretSurpriseSection
                data={draftContent.finalSecretSurprise || draftContent.secretSurprise}
                openedCardsCount={Object.values(openedCards).filter(Boolean).length}
                totalCardsCount={6}
                onSaveMessage={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
