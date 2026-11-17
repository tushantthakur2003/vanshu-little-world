import React, { useState } from 'react';
import { X, Check, RotateCcw, Download, Copy, Sparkles, Music, Calendar, User } from 'lucide-react';
import { WashiTape, PinkBow } from './illustrations/ScrapbookDecorations';
import { playCutePop } from '../utils/soundEffects';

export const EditModal = ({ isOpen, onClose, content, onSaveContent, onResetToDefaults }) => {
  const [formData, setFormData] = useState(content);
  const [activeTab, setActiveTab] = useState('general');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveContent(formData);
    playCutePop();
    onClose();
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all messages and dates back to the original handcrafted defaults?")) {
      onResetToDefaults();
      playCutePop();
      onClose();
    }
  };

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    playCutePop();
  };

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({
          ...formData,
          musicSettings: {
            ...formData.musicSettings,
            customAudioUrl: event.target.result,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative max-w-2xl w-full bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-pastel-pink-soft flex flex-col max-h-[92vh] overflow-y-auto">
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <WashiTape color="bg-pastel-pink/90" pattern="hearts" angle="rotate-0" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pastel-pink/40 mb-4">
          <div className="flex items-center gap-2">
            <PinkBow className="w-6 h-6" />
            <div>
              <h2 className="text-2xl font-bold font-handwriting text-gray-800">
                Personalize Vanshu's World
              </h2>
              <p className="text-xs font-cute text-gray-500">
                Customize names, dates, music, and export settings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-pastel-pink-soft text-gray-400 hover:text-pastel-pink-deep transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-pastel-pink/30 pb-2 mb-4 overflow-x-auto text-xs font-cute">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-3 py-1.5 rounded-full font-bold transition-colors shrink-0 ${
              activeTab === 'general'
                ? 'bg-pastel-pink-deep text-white shadow-sm'
                : 'text-gray-600 hover:bg-pastel-pink-soft'
            }`}
          >
            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> General & Names</span>
          </button>
          <button
            onClick={() => setActiveTab('dates')}
            className={`px-3 py-1.5 rounded-full font-bold transition-colors shrink-0 ${
              activeTab === 'dates'
                ? 'bg-pastel-pink-deep text-white shadow-sm'
                : 'text-gray-600 hover:bg-pastel-pink-soft'
            }`}
          >
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Special Dates</span>
          </button>
          <button
            onClick={() => setActiveTab('music')}
            className={`px-3 py-1.5 rounded-full font-bold transition-colors shrink-0 ${
              activeTab === 'music'
                ? 'bg-pastel-pink-deep text-white shadow-sm'
                : 'text-gray-600 hover:bg-pastel-pink-soft'
            }`}
          >
            <span className="flex items-center gap-1"><Music className="w-3.5 h-3.5" /> Background Music</span>
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-3 py-1.5 rounded-full font-bold transition-colors shrink-0 ${
              activeTab === 'export'
                ? 'bg-pastel-pink-deep text-white shadow-sm'
                : 'text-gray-600 hover:bg-pastel-pink-soft'
            }`}
          >
            <span className="flex items-center gap-1"><Download className="w-3.5 h-3.5" /> Export & Deploy</span>
          </button>
        </div>

        {/* Tab 1: General */}
        {activeTab === 'general' && (
          <div className="space-y-4 text-xs font-cute">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-gray-700">Girlfriend's Full Name</label>
                <input
                  type="text"
                  value={formData.girlfriendName}
                  onChange={(e) => setFormData({ ...formData, girlfriendName: e.target.value })}
                  className="w-full mt-1 p-2 rounded-xl border border-pastel-pink focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-gray-700">Nickname</label>
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  className="w-full mt-1 p-2 rounded-xl border border-pastel-pink focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-700">Website Title</label>
              <input
                type="text"
                value={formData.siteTitle}
                onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
                className="w-full mt-1 p-2 rounded-xl border border-pastel-pink focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700">Website Subtitle</label>
              <input
                type="text"
                value={formData.siteSubtitle}
                onChange={(e) => setFormData({ ...formData, siteSubtitle: e.target.value })}
                className="w-full mt-1 p-2 rounded-xl border border-pastel-pink focus:outline-none"
              />
            </div>

            <div className="pt-2 border-t border-pastel-pink/30">
              <span className="font-bold text-pastel-pink-deep block mb-2">Welcome Screen Text:</span>
              <div className="space-y-2">
                <div>
                  <label className="text-gray-600">Heading</label>
                  <input
                    type="text"
                    value={formData.welcomeScreen.heading}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        welcomeScreen: { ...formData.welcomeScreen, heading: e.target.value },
                      })
                    }
                    className="w-full mt-0.5 p-2 rounded-xl border border-pastel-pink focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-600">Subtitle</label>
                  <input
                    type="text"
                    value={formData.welcomeScreen.subtitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        welcomeScreen: { ...formData.welcomeScreen, subtitle: e.target.value },
                      })
                    }
                    className="w-full mt-0.5 p-2 rounded-xl border border-pastel-pink focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-600">Open Button Text</label>
                  <input
                    type="text"
                    value={formData.welcomeScreen.buttonText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        welcomeScreen: { ...formData.welcomeScreen, buttonText: e.target.value },
                      })
                    }
                    className="w-full mt-0.5 p-2 rounded-xl border border-pastel-pink focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Dates */}
        {activeTab === 'dates' && (
          <div className="space-y-4 text-xs font-cute">
            <div className="p-3 bg-pink-50/60 rounded-2xl border border-pink-200">
              <span className="font-bold text-pastel-pink-deep block mb-2">Main Anniversary:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-600">Title</label>
                  <input
                    type="text"
                    value={formData.specialDates.anniversary.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specialDates: {
                          ...formData.specialDates,
                          anniversary: {
                            ...formData.specialDates.anniversary,
                            title: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full mt-0.5 p-2 rounded-xl border border-pastel-pink focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-600">Anniversary Date (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    value={formData.specialDates.anniversary.date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specialDates: {
                          ...formData.specialDates,
                          anniversary: {
                            ...formData.specialDates.anniversary,
                            date: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full mt-0.5 p-2 rounded-xl border border-pastel-pink focus:outline-none"
                  />
                </div>
              </div>
              <div className="mt-2">
                <label className="text-gray-600">Caption / Note</label>
                <input
                  type="text"
                  value={formData.specialDates.anniversary.caption}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specialDates: {
                        ...formData.specialDates,
                        anniversary: {
                          ...formData.specialDates.anniversary,
                          caption: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full mt-0.5 p-2 rounded-xl border border-pastel-pink focus:outline-none"
                />
              </div>
            </div>

            <div>
              <span className="font-bold text-gray-700 block mb-2">Other Milestone Dates:</span>
              <div className="space-y-3">
                {formData.specialDates.datesList.map((item, idx) => (
                  <div key={item.id} className="p-3 bg-white rounded-xl border border-pastel-pink/60 flex flex-col gap-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={item.title}
                        placeholder="Milestone Title"
                        onChange={(e) => {
                          const updated = [...formData.specialDates.datesList];
                          updated[idx].title = e.target.value;
                          setFormData({
                            ...formData,
                            specialDates: { ...formData.specialDates, datesList: updated },
                          });
                        }}
                        className="p-1.5 rounded-lg border border-pastel-pink text-xs"
                      />
                      <input
                        type="date"
                        value={item.date}
                        onChange={(e) => {
                          const updated = [...formData.specialDates.datesList];
                          updated[idx].date = e.target.value;
                          setFormData({
                            ...formData,
                            specialDates: { ...formData.specialDates, datesList: updated },
                          });
                        }}
                        className="p-1.5 rounded-lg border border-pastel-pink text-xs"
                      />
                    </div>
                    <input
                      type="text"
                      value={item.caption}
                      placeholder="Sweet memory caption"
                      onChange={(e) => {
                        const updated = [...formData.specialDates.datesList];
                        updated[idx].caption = e.target.value;
                        setFormData({
                          ...formData,
                          specialDates: { ...formData.specialDates, datesList: updated },
                        });
                      }}
                      className="p-1.5 rounded-lg border border-pastel-pink text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Music */}
        {activeTab === 'music' && (
          <div className="space-y-4 text-xs font-cute">
            <div className="p-4 bg-purple-50/60 rounded-2xl border border-pastel-lavender">
              <span className="font-bold text-purple-900 flex items-center gap-1.5 mb-1">
                <Music className="w-4 h-4 text-pastel-pink-deep" /> Background Music System:
              </span>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                By default, the website includes an enchanting built-in lullaby music-box synthesizer that works instantly on all Android & iPhone browsers without external files.
              </p>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Upload Your Own Song (MP3 / Audio File):</label>
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioUpload}
                className="w-full p-2 border border-dashed border-pastel-pink rounded-xl bg-white text-xs cursor-pointer"
              />
              {formData.musicSettings?.customAudioUrl && (
                <span className="text-green-600 text-[11px] mt-1 block">
                  ✓ Custom audio loaded successfully!
                </span>
              )}
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Or Paste Direct MP3 Link:</label>
              <input
                type="url"
                placeholder="https://example.com/our-song.mp3"
                value={formData.musicSettings?.customAudioUrl?.startsWith('data:') ? '' : formData.musicSettings?.customAudioUrl}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    musicSettings: {
                      ...formData.musicSettings,
                      customAudioUrl: e.target.value,
                    },
                  })
                }
                className="w-full p-2 rounded-xl border border-pastel-pink text-xs"
              />
            </div>
          </div>
        )}

        {/* Tab 4: Export */}
        {activeTab === 'export' && (
          <div className="space-y-4 text-xs font-cute">
            <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200">
              <span className="font-bold text-sky-800 block mb-1">Permanent Site Configuration:</span>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                Edits saved in this browser are stored in your device's LocalStorage. If you want these edits to be the permanent default when you send the website link to Vanshika over WhatsApp or deploy to Vercel/Netlify, copy this configuration and paste it into <code className="bg-white px-1 py-0.5 rounded border">src/config/siteContent.js</code>.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopyConfig}
                className="flex-1 py-2 px-4 bg-sky-500 hover:bg-sky-600 text-white rounded-full font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? "Copied JSON to Clipboard!" : "Copy Configuration JSON"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-pastel-pink/30 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs font-cute text-gray-400 hover:text-red-500 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Handcrafted Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full font-cute text-xs text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-gradient-to-r from-pastel-pink to-pastel-pink-deep text-white rounded-full font-cute text-xs font-bold shadow hover:shadow-md transition-all active:scale-95 flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
