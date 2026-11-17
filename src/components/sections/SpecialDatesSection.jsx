import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Calendar, Clock, Heart, Sparkles, Edit3, Plus, Trash2, Check, PartyPopper } from 'lucide-react';
import { WashiTape, PostageStamp, PinkBow } from '../illustrations/ScrapbookDecorations';
import { playCutePop, playHarpFlourish } from '../../utils/soundEffects';

export const SpecialDatesSection = ({ data, onSaveDates, showInlineEdit = false }) => {
  const [datesConfig, setDatesConfig] = useState(data);
  const [isEditing, setIsEditing] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, totalDaysTogether: 0 });
  const [isAnniversaryToday, setIsAnniversaryToday] = useState(false);

  // Sync internal state whenever props update
  useEffect(() => {
    if (data) {
      setDatesConfig(data);
    }
  }, [data]);

  // Calculate live countdown to NEXT anniversary & total days together
  useEffect(() => {
    const updateCountdown = () => {
      const anniversaryStr = datesConfig?.anniversary?.date || "2024-05-18";
      const annivDate = new Date(anniversaryStr);
      const now = new Date();

      if (isNaN(annivDate.getTime())) return;

      // Calculate total days together since original anniversary date
      const diffSinceOriginal = now.getTime() - annivDate.getTime();
      const totalDays = Math.max(0, Math.floor(diffSinceOriginal / (1000 * 60 * 60 * 24)));

      // Next anniversary date this year or next year
      let nextAnniv = new Date(now.getFullYear(), annivDate.getMonth(), annivDate.getDate(), 0, 0, 0);
      if (
        now.getMonth() === annivDate.getMonth() &&
        now.getDate() === annivDate.getDate()
      ) {
        setIsAnniversaryToday(true);
      } else {
        setIsAnniversaryToday(false);
      }

      if (now.getTime() > nextAnniv.getTime() && !isAnniversaryToday) {
        nextAnniv.setFullYear(now.getFullYear() + 1);
      }

      const diffToNext = nextAnniv.getTime() - now.getTime();
      const days = Math.floor(diffToNext / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffToNext / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diffToNext / (1000 * 60)) % 60);
      const seconds = Math.floor((diffToNext / 1000) % 60);

      setTimeLeft({
        days: Math.max(0, days),
        hours: Math.max(0, hours),
        minutes: Math.max(0, minutes),
        seconds: Math.max(0, seconds),
        totalDaysTogether: totalDays,
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [datesConfig?.anniversary?.date, isAnniversaryToday]);

  const triggerCelebration = () => {
    playHarpFlourish();
    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#FF758F', '#FFA3B5', '#FFD166', '#E8D7F1', '#BAE6FD'],
      });
    } catch (e) {}
  };

  const handleSave = () => {
    if (onSaveDates) {
      onSaveDates(datesConfig);
    }
    setIsEditing(false);
    playCutePop();
  };

  return (
    <section className="relative my-12 max-w-5xl mx-auto px-4">
      {/* Decorative Washi Tape & Stamp */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <PinkBow className="w-8 h-8" />
          <h2 className="text-3xl sm:text-4xl font-bold font-handwriting text-gray-800">
            {datesConfig.sectionTitle || "Our Special Dates ♡"}
          </h2>
        </div>

        {showInlineEdit && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/90 hover:bg-pastel-pink-soft text-gray-700 hover:text-pastel-pink-deep rounded-full text-xs font-cute border border-pastel-pink/40 shadow-sm transition-all"
              title="Edit Dates & Countdown"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isEditing ? "Close Editor" : "Edit Dates"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Editor Drawer */}
      {isEditing && (
        <div className="mb-8 p-5 bg-white/95 rounded-3xl border-2 border-dashed border-pastel-pink shadow-scrapbook animate-in fade-in duration-200">
          <h3 className="text-sm font-cute font-bold text-pastel-pink-deep mb-3 flex items-center gap-1">
            <Sparkles className="w-4 h-4" /> Personalize Your Special Dates:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-cute text-gray-600">Anniversary Title</label>
              <input
                type="text"
                value={datesConfig.anniversary.title}
                onChange={(e) =>
                  setDatesConfig({
                    ...datesConfig,
                    anniversary: { ...datesConfig.anniversary, title: e.target.value },
                  })
                }
                className="w-full mt-1 p-2 text-xs font-cute rounded-xl border border-pastel-pink focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-cute text-gray-600">Anniversary Date (YYYY-MM-DD)</label>
              <input
                type="date"
                value={datesConfig.anniversary.date}
                onChange={(e) =>
                  setDatesConfig({
                    ...datesConfig,
                    anniversary: { ...datesConfig.anniversary, date: e.target.value },
                  })
                }
                className="w-full mt-1 p-2 text-xs font-cute rounded-xl border border-pastel-pink focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-cute text-gray-600">Anniversary Caption</label>
            <input
              type="text"
              value={datesConfig.anniversary.caption}
              onChange={(e) =>
                setDatesConfig({
                  ...datesConfig,
                  anniversary: { ...datesConfig.anniversary, caption: e.target.value },
                })
              }
              className="w-full mt-1 p-2 text-xs font-cute rounded-xl border border-pastel-pink focus:outline-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-pastel-pink-deep text-white rounded-full font-cute text-xs font-bold hover:bg-pink-600 transition-colors flex items-center gap-1 shadow-sm"
            >
              <Check className="w-3.5 h-3.5" /> Save Dates
            </button>
          </div>
        </div>
      )}

      {/* Hero Anniversary Live Countdown Card */}
      <div className="relative bg-gradient-to-br from-pastel-pink-soft/80 via-white to-pastel-lavender-soft/80 rounded-3xl p-6 sm:p-8 shadow-scrapbook border-2 border-white/90 mb-8 overflow-hidden text-center">
        {/* Top Washi Tape */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <WashiTape color="bg-pastel-pink/80" pattern="hearts" angle="-rotate-1" />
        </div>

        {/* Anniversary Title */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 rounded-full border border-pastel-pink/40 shadow-sm mb-3">
          <Heart className="w-4 h-4 text-pastel-pink-deep fill-pastel-pink" />
          <span className="text-xs font-cute font-bold text-gray-700">
            {datesConfig.anniversary.title || "Our Anniversary"}
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold font-handwriting text-gray-800">
          Counting Down Every Sweet Second ♡
        </h3>
        <p className="text-xs sm:text-sm font-cute text-gray-500 mt-1 max-w-md mx-auto">
          {datesConfig.anniversary.caption}
        </p>

        {/* Live Countdown Clock Boxes */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-md mx-auto my-6">
          <div className="bg-white/90 rounded-2xl p-2.5 sm:p-3 shadow-md border border-pastel-pink/30 flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-bold font-cute text-pastel-pink-deep">
              {timeLeft.days}
            </span>
            <span className="text-[10px] sm:text-xs font-cute text-gray-400 uppercase tracking-wider">Days</span>
          </div>

          <div className="bg-white/90 rounded-2xl p-2.5 sm:p-3 shadow-md border border-pastel-pink/30 flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-bold font-cute text-pastel-pink-deep">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-cute text-gray-400 uppercase tracking-wider">Hours</span>
          </div>

          <div className="bg-white/90 rounded-2xl p-2.5 sm:p-3 shadow-md border border-pastel-pink/30 flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-bold font-cute text-pastel-pink-deep">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-cute text-gray-400 uppercase tracking-wider">Mins</span>
          </div>

          <div className="bg-white/90 rounded-2xl p-2.5 sm:p-3 shadow-md border border-pastel-pink/30 flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-bold font-cute text-pastel-pink-deep">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-cute text-gray-400 uppercase tracking-wider">Secs</span>
          </div>
        </div>

        {/* Milestone Together counter pill */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/90 rounded-full text-xs font-cute text-gray-600 border border-pastel-lavender shadow-sm">
            <span>✨</span>
            <strong className="text-pastel-pink-deep">{timeLeft.totalDaysTogether} days</strong> of loving you so far
          </span>

          <button
            onClick={triggerCelebration}
            className="px-4 py-1.5 bg-gradient-to-r from-pastel-pink-deep to-pink-500 text-white rounded-full font-cute text-xs font-bold shadow hover:shadow-md transition-all active:scale-95 flex items-center gap-1.5"
          >
            <PartyPopper className="w-3.5 h-3.5" /> Celebrate Us ♡
          </button>
        </div>
      </div>

      {/* Grid of Other Important Special Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {(datesConfig.datesList || []).map((item, idx) => {
          const tapes = ['bg-pastel-pink/60', 'bg-pastel-peach/60', 'bg-pastel-lavender/60'];
          const tapeRot = ['-rotate-2', 'rotate-2', '-rotate-1'];
          return (
            <div
              key={item.id || idx}
              className="relative bg-white/90 rounded-3xl p-5 shadow-scrapbook border border-white/80 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform"
            >
              <div className="absolute -top-3">
                <WashiTape color={tapes[idx % tapes.length]} pattern="dots" angle={tapeRot[idx % tapeRot.length]} />
              </div>

              <div className="w-10 h-10 rounded-full bg-pastel-pink-soft text-pastel-pink-deep flex items-center justify-center my-2 shadow-inner">
                <Calendar className="w-5 h-5" />
              </div>

              <h4 className="font-handwriting font-bold text-xl text-gray-800">
                {item.title}
              </h4>

              <div className="inline-block my-1.5 px-3 py-0.5 bg-pastel-pink-soft/80 text-pastel-pink-deep rounded-full text-xs font-cute font-semibold">
                {item.date}
              </div>

              <p className="font-handwriting text-sm text-gray-500 leading-snug mt-1">
                "{item.caption}"
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
