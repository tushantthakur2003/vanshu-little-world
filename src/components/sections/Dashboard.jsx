import React from 'react';
import { CardEnvelopeLetter } from '../cards/CardEnvelopeLetter';
import { CardPenguinHug } from '../cards/CardPenguinHug';
import { CardReasonsLove } from '../cards/CardReasonsLove';
import { CardComfortLetter } from '../cards/CardComfortLetter';
import { CardMemoriesGallery } from '../cards/CardMemoriesGallery';
import { CardSurpriseBox } from '../cards/CardSurpriseBox';
import { PinkBow, WashiTape } from '../illustrations/ScrapbookDecorations';
import { Sparkles, Heart } from 'lucide-react';

export const Dashboard = ({
  content,
  openedCards,
  onMarkCardOpened,
  onUpdateContent,
}) => {
  const totalCards = 6;
  const openedCount = Object.values(openedCards).filter(Boolean).length;

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-8">
      {/* Dashboard Top Header */}
      <div className="text-center mb-8 relative flex flex-col items-center">
        {/* Top Washi Tape */}
        <div className="mb-2">
          <WashiTape color="bg-pastel-pink/80" pattern="hearts" angle="-rotate-1" />
        </div>

        <div className="flex items-center justify-center gap-2 mb-1">
          <PinkBow className="w-8 h-8" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-handwriting text-gray-800 tracking-wide">
            {content.siteTitle || "Vanshu's Little World ♡"}
          </h1>
          <PinkBow className="w-8 h-8 transform -scale-x-100" />
        </div>

        <p className="text-sm sm:text-base font-cute text-pastel-pink-deep font-medium max-w-md">
          {content.siteSubtitle || "A little scrapbook made with lots of love."}
        </p>

        {/* Exploration Progress Pill */}
        <div className="mt-4 inline-flex items-center gap-2.5 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full shadow-scrapbook border border-pastel-pink/40">
          <Heart className="w-4 h-4 text-pastel-pink-deep fill-pastel-pink" />
          <span className="text-xs font-cute font-bold text-gray-700">
            {openedCount} of {totalCards} Memories Explored
          </span>
          <div className="w-16 h-2 bg-pastel-pink-soft rounded-full overflow-hidden">
            <div
              className="h-full bg-pastel-pink-deep transition-all duration-500"
              style={{ width: `${(openedCount / totalCards) * 100}%` }}
            />
          </div>
          {openedCount === totalCards && (
            <span className="text-xs font-cute text-pastel-pink-deep font-bold flex items-center gap-1 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" /> Secret Unlocked!
            </span>
          )}
        </div>
      </div>

      {/* Six Interactive Scrapbook Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* CARD 1: A Little Love Letter 💌 */}
        <CardEnvelopeLetter
          data={content.card1Letter}
          isOpened={!!openedCards['card1']}
          onMarkOpened={() => onMarkCardOpened('card1')}
          onSaveMessage={(msg) =>
            onUpdateContent({
              ...content,
              card1Letter: { ...content.card1Letter, message: msg },
            })
          }
        />

        {/* CARD 2: When You Miss Me 🐧 */}
        <CardPenguinHug
          data={content.card2Hug}
          isOpened={!!openedCards['card2']}
          onMarkOpened={() => onMarkCardOpened('card2')}
        />

        {/* CARD 3: Reasons I Love You 🎀 */}
        <CardReasonsLove
          data={content.card3Reasons}
          isOpened={!!openedCards['card3']}
          onMarkOpened={() => onMarkCardOpened('card3')}
          onSaveReasons={(reasons) =>
            onUpdateContent({
              ...content,
              card3Reasons: { ...content.card3Reasons, reasons },
            })
          }
        />

        {/* CARD 4: Open When You're Sad 🐰 */}
        <CardComfortLetter
          data={content.card4Comfort}
          isOpened={!!openedCards['card4']}
          onMarkOpened={() => onMarkCardOpened('card4')}
          onSaveMessage={(msg) =>
            onUpdateContent({
              ...content,
              card4Comfort: { ...content.card4Comfort, message: msg },
            })
          }
        />

        {/* CARD 5: Our Little Memories 📸 */}
        <CardMemoriesGallery
          data={content.card5Memories}
          isOpened={!!openedCards['card5']}
          onMarkOpened={() => onMarkCardOpened('card5')}
          onSavePhotos={(photos) =>
            onUpdateContent({
              ...content,
              card5Memories: { ...content.card5Memories, photos },
            })
          }
        />

        {/* CARD 6: A Little Surprise 🎁 */}
        <CardSurpriseBox
          data={content.card6Surprise}
          isOpened={!!openedCards['card6']}
          onMarkOpened={() => onMarkCardOpened('card6')}
          onSaveMessage={(msg) =>
            onUpdateContent({
              ...content,
              card6Surprise: { ...content.card6Surprise, message: msg },
            })
          }
        />
      </div>
    </div>
  );
};
