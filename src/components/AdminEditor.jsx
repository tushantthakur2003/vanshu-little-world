import React, { useState, useEffect } from 'react';
import {
  Lock, Unlock, Save, Download, Plus, Trash2, Image as ImageIcon,
  Heart, Sparkles, Check, ArrowLeft, Eye, RefreshCw, Key, AlertTriangle,
  Upload, HelpCircle, ExternalLink
} from 'lucide-react';
import { verifyPassword, isAuthenticated, logout, updatePassword } from '../utils/auth';
import { saveImageToStorage, getImageFromStorage } from '../utils/imageStorage';
import { WashiTape, PinkBow } from './illustrations/ScrapbookDecorations';
import { playCutePop, playChime } from '../utils/soundEffects';

export const AdminEditor = ({ content, onSaveContent, onNavigateHome }) => {
  const [authed, setAuthed] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [formData, setFormData] = useState(content);
  const [activeTab, setActiveTab] = useState('general');
  const [saveStatus, setSaveStatus] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordChangedMsg, setPasswordChangedMsg] = useState('');

  // Check auth on mount
  useEffect(() => {
    setAuthed(isAuthenticated());
  }, []);

  // Update formData when content prop changes
  useEffect(() => {
    if (content) {
      setFormData(content);
    }
  }, [content]);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    const ok = await verifyPassword(passwordInput);
    if (ok) {
      setAuthed(true);
      playChime();
    } else {
      setLoginError('Incorrect password. Please try again! (Default: vanshu2024)');
      playCutePop();
    }
  };

  const handleLogout = () => {
    logout();
    setAuthed(false);
    setPasswordInput('');
    playCutePop();
  };

  // Save changes
  const handleSave = async () => {
    playCutePop();
    // Normalize aliases so both old and new code paths work seamlessly
    const updated = {
      ...formData,
      card1Letter: formData.loveLetter || formData.card1Letter,
      card2Hug: formData.whenYouMissMe || formData.card2Hug,
      card3Reasons: formData.reasonsILoveYou || formData.card3Reasons,
      card4Comfort: formData.openWhenSad || formData.card4Comfort,
      card5Memories: formData.photoGallery || formData.card5Memories,
      card6Surprise: formData.surpriseGift || formData.card6Surprise,
      secretSurprise: formData.finalSecretSurprise || formData.secretSurprise,
      specialDates: {
        anniversary: formData.anniversaryInfo || formData.specialDates?.anniversary,
        datesList: formData.specialDates?.datesList || formData.specialDates || [],
      },
    };

    onSaveContent(updated);
    setSaveStatus('Changes saved successfully! ♡');
    setTimeout(() => setSaveStatus(''), 3000);

    // If running with Vite local server, try posting to dev middleware
    try {
      await fetch('/__api/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (_) {
      // Static environment, fine to ignore
    }
  };

  // Export updated content.js as downloadable file
  const handleExportContentFile = () => {
    playCutePop();
    const fileContent = `// =====================================================================
// VANSHU'S LITTLE WORLD 🎀 - CENTRAL CONTENT CONFIGURATION
// =====================================================================
// Generated automatically from /admin on ${new Date().toLocaleDateString()}

export const siteContent = ${JSON.stringify(formData, null, 2)};

// Aliases for seamless component compatibility
siteContent.card1Letter = siteContent.loveLetter;
siteContent.card2Hug = siteContent.whenYouMissMe;
siteContent.card3Reasons = siteContent.reasonsILoveYou;
siteContent.card4Comfort = siteContent.openWhenSad;
siteContent.card5Memories = siteContent.photoGallery;
siteContent.card6Surprise = siteContent.surpriseGift;
siteContent.secretSurprise = siteContent.finalSecretSurprise;

export default siteContent;
`;
    const blob = new Blob([fileContent], { type: 'application/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'content.js';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Reasons Helpers (Card 3)
  const handleAddReason = () => {
    const list = formData.reasonsILoveYou?.reasons || formData.card3Reasons?.reasons || [];
    const nextNum = list.length + 1;
    const updatedList = [...list, `${nextNum}. Your wonderful smile.`];
    setFormData({
      ...formData,
      reasonsILoveYou: { ...formData.reasonsILoveYou, reasons: updatedList },
      card3Reasons: { ...formData.card3Reasons, reasons: updatedList },
    });
    playCutePop();
  };

  const handleRemoveReason = (index) => {
    const list = formData.reasonsILoveYou?.reasons || formData.card3Reasons?.reasons || [];
    const updatedList = list.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      reasonsILoveYou: { ...formData.reasonsILoveYou, reasons: updatedList },
      card3Reasons: { ...formData.card3Reasons, reasons: updatedList },
    });
    playCutePop();
  };

  const handleReasonTextChange = (index, newText) => {
    const list = formData.reasonsILoveYou?.reasons || formData.card3Reasons?.reasons || [];
    const updatedList = [...list];
    updatedList[index] = newText;
    setFormData({
      ...formData,
      reasonsILoveYou: { ...formData.reasonsILoveYou, reasons: updatedList },
      card3Reasons: { ...formData.card3Reasons, reasons: updatedList },
    });
  };

  // Photo Helpers (Card 5)
  const photosList = formData.photoGallery?.photos || formData.card5Memories?.photos || [];

  const handleAddPhoto = () => {
    const newPhoto = {
      id: `photo-${Date.now()}`,
      title: 'Our Special Moment',
      date: 'Special Day',
      caption: 'A moment I will treasure forever ♡',
      image: '/images/memory-1.svg',
      rotation: photosList.length % 2 === 0 ? '-rotate-2' : 'rotate-2',
      tapeColor: 'bg-pastel-pink/60',
    };
    const updatedPhotos = [...photosList, newPhoto];
    setFormData({
      ...formData,
      photoGallery: { ...formData.photoGallery, photos: updatedPhotos },
      card5Memories: { ...formData.card5Memories, photos: updatedPhotos },
    });
    playCutePop();
  };

  const handleRemovePhoto = (id) => {
    const updatedPhotos = photosList.filter((p) => p.id !== id);
    setFormData({
      ...formData,
      photoGallery: { ...formData.photoGallery, photos: updatedPhotos },
      card5Memories: { ...formData.card5Memories, photos: updatedPhotos },
    });
    playCutePop();
  };

  const handlePhotoChange = (id, field, value) => {
    const updatedPhotos = photosList.map((p) => {
      if (p.id === id) {
        return { ...p, [field]: value };
      }
      return p;
    });
    setFormData({
      ...formData,
      photoGallery: { ...formData.photoGallery, photos: updatedPhotos },
      card5Memories: { ...formData.card5Memories, photos: updatedPhotos },
    });
  };

  const handlePhotoFileUpload = async (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target.result;
        // Save into IndexedDB for persistent browser preview
        await saveImageToStorage(id, dataUrl, file.name);

        // Update photo image to the dataUrl for immediate local view
        handlePhotoChange(id, 'image', dataUrl);
        // Also save filename recommendation
        handlePhotoChange(id, 'suggestedFilename', file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  // Milestone Dates Helpers
  const datesList = Array.isArray(formData.specialDates)
    ? formData.specialDates
    : formData.specialDates?.datesList || [];

  const handleAddMilestone = () => {
    const newDate = {
      id: `date-${Date.now()}`,
      title: 'A Special Day',
      date: new Date().toISOString().split('T')[0],
      caption: 'When something unforgettable happened.',
    };
    const updated = [...datesList, newDate];
    setFormData({
      ...formData,
      specialDates: updated,
    });
    playCutePop();
  };

  const handleRemoveMilestone = (id) => {
    const updated = datesList.filter((d) => d.id !== id);
    setFormData({
      ...formData,
      specialDates: updated,
    });
    playCutePop();
  };

  const handleMilestoneChange = (id, field, val) => {
    const updated = datesList.map((d) => (d.id === id ? { ...d, [field]: val } : d));
    setFormData({
      ...formData,
      specialDates: updated,
    });
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.trim().length < 4) {
      setPasswordChangedMsg('Password must be at least 4 characters long.');
      return;
    }
    await updatePassword(newPassword.trim());
    setPasswordChangedMsg('Password successfully updated! ♡');
    setNewPassword('');
    setTimeout(() => setPasswordChangedMsg(''), 3000);
  };

  // -------------------------------------------------------------
  // LOGIN SCREEN (When not authenticated)
  // -------------------------------------------------------------
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pastel-pink-soft via-pastel-cream-soft to-pastel-lavender-soft">
        <div className="relative max-w-md w-full bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-scrapbook border-2 border-pastel-pink/60 flex flex-col items-center text-center">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <WashiTape color="bg-pastel-pink/90" pattern="hearts" angle="-rotate-1" />
          </div>

          <PinkBow className="w-8 h-8 mb-2" />

          <div className="w-14 h-14 rounded-full bg-pastel-pink-soft text-pastel-pink-deep flex items-center justify-center mb-3">
            <Lock className="w-7 h-7" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-handwriting text-gray-800">
            Content Editor Portal
          </h1>
          <p className="text-xs font-cute text-gray-500 mt-1 mb-6">
            Enter your secret password to customize Vanshu's Little World ♡
          </p>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-3">
            <div className="text-left">
              <label className="text-xs font-cute text-gray-600 font-semibold">Editor Password:</label>
              <input
                type="password"
                required
                placeholder="Enter password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full mt-1 p-3 rounded-xl border border-pastel-pink text-sm focus:outline-none focus:ring-2 focus:ring-pastel-pink font-cute"
              />
              <span className="text-[10px] font-cute text-gray-400 mt-1 block">
                Initial default password: <code className="bg-pastel-pink-soft px-1 rounded">vanshu2024</code>
              </span>
            </div>

            {loginError && (
              <p className="text-xs font-cute text-red-500 font-semibold bg-red-50 p-2 rounded-lg border border-red-200">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-pastel-pink to-pastel-pink-deep text-white rounded-full font-cute font-bold text-sm shadow hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 mt-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Content Editor</span>
            </button>
          </form>

          {/* Security explanation banner */}
          <div className="mt-6 p-3 bg-amber-50/70 rounded-2xl border border-amber-200 text-left flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] font-cute text-amber-800 leading-relaxed">
              <strong>Security Note:</strong> This page is strictly for you and is hidden from the public website. Frontend password hashing protects against casual visitors. If hosting publicly on Vercel or Netlify, you can also enable server-level password protection in project settings.
            </p>
          </div>

          <button
            onClick={onNavigateHome}
            className="mt-4 text-xs font-cute text-pastel-pink-deep hover:underline flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Website
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#FFFDF9] pb-24 text-gray-700 selection:bg-pastel-pink-soft selection:text-pastel-pink-deep">
      {/* Admin Top Sticky Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-pastel-pink/40 px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <PinkBow className="w-6 h-6" />
            <div>
              <h1 className="font-handwriting font-bold text-xl sm:text-2xl text-gray-800 leading-none">
                Vanshu's Content Editor 🎀
              </h1>
              <span className="text-[10px] font-cute text-pastel-pink-deep">
                Easy Content Management • No React/Coding Required
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onNavigateHome}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-cute text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Public Website</span>
            </button>

            <button
              onClick={handleExportContentFile}
              className="px-3 py-1.5 bg-pastel-lavender hover:bg-pastel-lavender-deep text-purple-900 hover:text-white rounded-full font-cute text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm"
              title="Download content.js file to save into src/data/content.js"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export content.js</span>
            </button>

            <button
              onClick={handleSave}
              className="px-5 py-1.5 bg-gradient-to-r from-pastel-pink to-pastel-pink-deep text-white rounded-full font-cute text-xs font-bold shadow hover:shadow-md transition-all active:scale-95 flex items-center gap-1"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors"
              title="Logout"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Save confirmation banner */}
        {saveStatus && (
          <div className="max-w-6xl mx-auto mt-2 px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-cute rounded-xl flex items-center gap-1.5 animate-in fade-in duration-200">
            <Check className="w-4 h-4 text-green-600" />
            <span>{saveStatus}</span>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="flex gap-2 pb-2 mb-6 border-b border-pastel-pink/30 overflow-x-auto text-xs font-cute">
          {[
            { id: 'general', label: '1. Names & Welcome' },
            { id: 'letter', label: '2. Love Letter' },
            { id: 'hug', label: '3. When You Miss Me' },
            { id: 'reasons', label: '4. 10 Reasons I Love You' },
            { id: 'sad', label: '5. Open When Sad' },
            { id: 'photos', label: '6. Photo Gallery 📸' },
            { id: 'gift', label: '7. Surprise Gift Box' },
            { id: 'dates', label: '8. Anniversary & Dates' },
            { id: 'secret', label: '9. Final Secret Surprise' },
            { id: 'settings', label: '10. Password & Security' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                playCutePop();
              }}
              className={`px-3.5 py-2 rounded-full font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-pastel-pink-deep text-white shadow-sm'
                  : 'bg-white hover:bg-pastel-pink-soft text-gray-600 border border-pastel-pink/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ======================================================== */}
        {/* TAB 1: GENERAL & NAMES */}
        {/* ======================================================== */}
        {activeTab === 'general' && (
          <div className="bg-white rounded-3xl p-6 shadow-scrapbook border border-pastel-pink/40 space-y-5 animate-in fade-in duration-150">
            <h2 className="text-xl font-bold font-handwriting text-gray-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pastel-pink-deep" /> Personal Information & Welcome Screen
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-cute font-bold text-gray-700">Girlfriend's Full Name:</label>
                <input
                  type="text"
                  value={formData.girlfriendName || ''}
                  onChange={(e) => setFormData({ ...formData, girlfriendName: e.target.value })}
                  className="w-full mt-1 p-2.5 text-xs font-cute rounded-xl border border-pastel-pink focus:outline-none focus:ring-1 focus:ring-pastel-pink"
                />
              </div>

              <div>
                <label className="text-xs font-cute font-bold text-gray-700">Nickname:</label>
                <input
                  type="text"
                  value={formData.nickname || ''}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  className="w-full mt-1 p-2.5 text-xs font-cute rounded-xl border border-pastel-pink focus:outline-none focus:ring-1 focus:ring-pastel-pink"
                />
              </div>

              <div>
                <label className="text-xs font-cute font-bold text-gray-700">Website Title:</label>
                <input
                  type="text"
                  value={formData.siteTitle || ''}
                  onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
                  className="w-full mt-1 p-2.5 text-xs font-cute rounded-xl border border-pastel-pink focus:outline-none focus:ring-1 focus:ring-pastel-pink"
                />
              </div>

              <div>
                <label className="text-xs font-cute font-bold text-gray-700">Website Subtitle:</label>
                <input
                  type="text"
                  value={formData.siteSubtitle || ''}
                  onChange={(e) => setFormData({ ...formData, siteSubtitle: e.target.value })}
                  className="w-full mt-1 p-2.5 text-xs font-cute rounded-xl border border-pastel-pink focus:outline-none focus:ring-1 focus:ring-pastel-pink"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-pastel-pink/30 space-y-3">
              <h3 className="text-sm font-cute font-bold text-pastel-pink-deep">Welcome Screen Content:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-cute text-gray-600">Main Heading:</label>
                  <input
                    type="text"
                    value={formData.welcomeScreen?.heading || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        welcomeScreen: { ...formData.welcomeScreen, heading: e.target.value },
                      })
                    }
                    className="w-full mt-1 p-2 text-xs font-cute rounded-xl border border-pastel-pink focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-cute text-gray-600">Subtitle:</label>
                  <input
                    type="text"
                    value={formData.welcomeScreen?.subtitle || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        welcomeScreen: { ...formData.welcomeScreen, subtitle: e.target.value },
                      })
                    }
                    className="w-full mt-1 p-2 text-xs font-cute rounded-xl border border-pastel-pink focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-cute text-gray-600">Supporting Text:</label>
                  <input
                    type="text"
                    value={formData.welcomeScreen?.supportingText || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        welcomeScreen: { ...formData.welcomeScreen, supportingText: e.target.value },
                      })
                    }
                    className="w-full mt-1 p-2 text-xs font-cute rounded-xl border border-pastel-pink focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-cute text-gray-600">Open Button Text:</label>
                  <input
                    type="text"
                    value={formData.welcomeScreen?.buttonText || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        welcomeScreen: { ...formData.welcomeScreen, buttonText: e.target.value },
                      })
                    }
                    className="w-full mt-1 p-2 text-xs font-cute rounded-xl border border-pastel-pink focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: LOVE LETTER */}
        {/* ======================================================== */}
        {activeTab === 'letter' && (
          <div className="bg-white rounded-3xl p-6 shadow-scrapbook border border-pastel-pink/40 space-y-4 animate-in fade-in duration-150">
            <h2 className="text-xl font-bold font-handwriting text-gray-800 flex items-center gap-2">
              💌 Card 1: A Little Love Letter
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-cute font-bold text-gray-700">Card Heading:</label>
                <input
                  type="text"
                  value={formData.loveLetter?.title || formData.card1Letter?.title || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({
                      ...formData,
                      loveLetter: { ...formData.loveLetter, title: val },
                      card1Letter: { ...formData.card1Letter, title: val },
                    });
                  }}
                  className="w-full mt-1 p-2 text-xs font-cute rounded-xl border border-pastel-pink"
                />
              </div>
              <div>
                <label className="text-xs font-cute font-bold text-gray-700">Envelope Label:</label>
                <input
                  type="text"
                  value={formData.loveLetter?.envelopeLabel || formData.card1Letter?.envelopeLabel || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({
                      ...formData,
                      loveLetter: { ...formData.loveLetter, envelopeLabel: val },
                      card1Letter: { ...formData.card1Letter, envelopeLabel: val },
                    });
                  }}
                  className="w-full mt-1 p-2 text-xs font-cute rounded-xl border border-pastel-pink"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-cute font-bold text-gray-700">Love Letter Message:</label>
              <textarea
                rows={10}
                value={formData.loveLetter?.message || formData.card1Letter?.message || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({
                    ...formData,
                    loveLetter: { ...formData.loveLetter, message: val },
                    card1Letter: { ...formData.card1Letter, message: val },
                  });
                }}
                className="w-full mt-1 p-3 text-sm font-handwriting leading-relaxed rounded-xl border border-pastel-pink focus:outline-none focus:ring-1 focus:ring-pastel-pink"
              />
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: WHEN YOU MISS ME */}
        {/* ======================================================== */}
        {activeTab === 'hug' && (
          <div className="bg-white rounded-3xl p-6 shadow-scrapbook border border-pastel-pink/40 space-y-4 animate-in fade-in duration-150">
            <h2 className="text-xl font-bold font-handwriting text-gray-800 flex items-center gap-2">
              🐧 Card 2: When You Miss Me
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-cute font-bold text-gray-700">Card Heading:</label>
                <input
                  type="text"
                  value={formData.whenYouMissMe?.title || formData.card2Hug?.title || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({
                      ...formData,
                      whenYouMissMe: { ...formData.whenYouMissMe, title: val },
                      card2Hug: { ...formData.card2Hug, title: val },
                    });
                  }}
                  className="w-full mt-1 p-2 text-xs font-cute rounded-xl border border-pastel-pink"
                />
              </div>
              <div>
                <label className="text-xs font-cute font-bold text-gray-700">Hug Button Label:</label>
                <input
                  type="text"
                  value={formData.whenYouMissMe?.buttonLabel || formData.card2Hug?.buttonLabel || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({
                      ...formData,
                      whenYouMissMe: { ...formData.whenYouMissMe, buttonLabel: val },
                      card2Hug: { ...formData.card2Hug, buttonLabel: val },
                    });
                  }}
                  className="w-full mt-1 p-2 text-xs font-cute rounded-xl border border-pastel-pink"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-cute font-bold text-gray-700">Virtual Hug Message:</label>
              <textarea
                rows={6}
                value={formData.whenYouMissMe?.message || formData.card2Hug?.message || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({
                    ...formData,
                    whenYouMissMe: { ...formData.whenYouMissMe, message: val },
                    card2Hug: { ...formData.card2Hug, message: val },
                  });
                }}
                className="w-full mt-1 p-3 text-sm font-handwriting leading-relaxed rounded-xl border border-pastel-pink focus:outline-none focus:ring-1 focus:ring-pastel-pink"
              />
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: REASONS I LOVE YOU */}
        {/* ======================================================== */}
        {activeTab === 'reasons' && (
          <div className="bg-white rounded-3xl p-6 shadow-scrapbook border border-pastel-pink/40 space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-handwriting text-gray-800 flex items-center gap-2">
                🎀 Card 3: Reasons I Love You
              </h2>
              <button
                type="button"
                onClick={handleAddReason}
                className="px-3 py-1.5 bg-pastel-pink-soft text-pastel-pink-deep rounded-full font-cute text-xs font-bold hover:bg-pastel-pink hover:text-white transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add New Reason
              </button>
            </div>

            <p className="text-xs font-cute text-gray-500">
              Each reason corresponds to a clickable heart on the public website. You can edit, add, or remove them:
            </p>

            <div className="space-y-2.5">
              {(formData.reasonsILoveYou?.reasons || formData.card3Reasons?.reasons || []).map((reason, index) => (
                <div key={index} className="flex items-center gap-2 bg-pastel-pink-soft/30 p-2 rounded-xl border border-pastel-pink/30">
                  <span className="w-8 h-8 rounded-full bg-pastel-pink-deep text-white flex items-center justify-center text-xs font-cute font-bold shrink-0">
                    #{index + 1}
                  </span>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => handleReasonTextChange(index, e.target.value)}
                    className="flex-1 p-2 text-xs font-cute rounded-lg border border-pastel-pink bg-white focus:outline-none focus:ring-1 focus:ring-pastel-pink"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveReason(index)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-white transition-colors"
                    title="Remove this reason"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: OPEN WHEN SAD */}
        {/* ======================================================== */}
        {activeTab === 'sad' && (
          <div className="bg-white rounded-3xl p-6 shadow-scrapbook border border-pastel-pink/40 space-y-4 animate-in fade-in duration-150">
            <h2 className="text-xl font-bold font-handwriting text-gray-800 flex items-center gap-2">
              🐰 Card 4: Open When You're Sad
            </h2>
            <div>
              <label className="text-xs font-cute font-bold text-gray-700">Card Heading:</label>
              <input
                type="text"
                value={formData.openWhenSad?.title || formData.card4Comfort?.title || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({
                    ...formData,
                    openWhenSad: { ...formData.openWhenSad, title: val },
                    card4Comfort: { ...formData.card4Comfort, title: val },
                  });
                }}
                className="w-full mt-1 p-2 text-xs font-cute rounded-xl border border-pastel-pink"
              />
            </div>

            <div>
              <label className="text-xs font-cute font-bold text-gray-700">Comforting Message:</label>
              <textarea
                rows={8}
                value={formData.openWhenSad?.message || formData.card4Comfort?.message || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({
                    ...formData,
                    openWhenSad: { ...formData.openWhenSad, message: val },
                    card4Comfort: { ...formData.card4Comfort, message: val },
                  });
                }}
                className="w-full mt-1 p-3 text-sm font-handwriting leading-relaxed rounded-xl border border-pastel-pink focus:outline-none focus:ring-1 focus:ring-pastel-pink"
              />
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: PHOTO GALLERY & IMAGES */}
        {/* ======================================================== */}
        {activeTab === 'photos' && (
          <div className="bg-white rounded-3xl p-6 shadow-scrapbook border border-pastel-pink/40 space-y-5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-handwriting text-gray-800 flex items-center gap-2">
                📸 Card 5: Our Polaroid Photo Gallery
              </h2>
              <button
                type="button"
                onClick={handleAddPhoto}
                className="px-3 py-1.5 bg-pastel-pink-soft text-pastel-pink-deep rounded-full font-cute text-xs font-bold hover:bg-pastel-pink hover:text-white transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Photograph
              </button>
            </div>

            {/* Beginner-friendly explanation */}
            <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-200 text-xs font-cute text-purple-900 space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-purple-600" />
                How Photograph Storage Works:
              </div>
              <p className="text-[11px] leading-relaxed text-gray-600">
                1. <strong>Local & Immediate:</strong> You can upload a photo below. It previews instantly and stays permanently stored in your browser's persistent IndexedDB.<br />
                2. <strong>Public Deployment (Vercel / Netlify):</strong> For photos to be visible when you send the website link to Vanshu on WhatsApp, simply drop the image files into <code className="bg-white px-1.5 py-0.5 rounded border">public/images/</code> (e.g. <code className="bg-white px-1.5 py-0.5 rounded border">public/images/photo1.jpg</code>), and set the image path to <code className="bg-white px-1.5 py-0.5 rounded border">/images/photo1.jpg</code>.
              </p>
            </div>

            {/* Photo List */}
            <div className="space-y-4">
              {photosList.map((photo, index) => (
                <div key={photo.id} className="p-4 bg-gray-50/70 rounded-2xl border border-pastel-pink/40 flex flex-col sm:flex-row gap-4 items-start">
                  {/* Photo Preview Thumbnail */}
                  <div className="w-28 h-28 rounded-xl overflow-hidden bg-white border border-gray-200 shrink-0 shadow-sm flex items-center justify-center relative">
                    <img
                      src={photo.image}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/images/memory-1.svg';
                      }}
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 text-white text-[9px] rounded font-mono">
                      #{index + 1}
                    </span>
                  </div>

                  {/* Photo details */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    <div>
                      <label className="text-[11px] font-cute font-bold text-gray-700">Memory Title:</label>
                      <input
                        type="text"
                        value={photo.title || ''}
                        onChange={(e) => handlePhotoChange(photo.id, 'title', e.target.value)}
                        className="w-full mt-0.5 p-2 text-xs font-cute rounded-lg border border-pastel-pink bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-cute font-bold text-gray-700">Date Displayed:</label>
                      <input
                        type="text"
                        value={photo.date || ''}
                        onChange={(e) => handlePhotoChange(photo.id, 'date', e.target.value)}
                        placeholder="e.g. The Day We Met"
                        className="w-full mt-0.5 p-2 text-xs font-cute rounded-lg border border-pastel-pink bg-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-cute font-bold text-gray-700">Sweet Caption:</label>
                      <input
                        type="text"
                        value={photo.caption || ''}
                        onChange={(e) => handlePhotoChange(photo.id, 'caption', e.target.value)}
                        className="w-full mt-0.5 p-2 text-xs font-cute rounded-lg border border-pastel-pink bg-white"
                      />
                    </div>

                    {/* Image Source / Upload */}
                    <div className="sm:col-span-2 flex flex-col sm:flex-row items-center gap-2">
                      <div className="flex-1 w-full">
                        <label className="text-[11px] font-cute text-gray-600 block">
                          Image Path / URL (e.g. <code className="text-pastel-pink-deep">/images/my-photo.jpg</code>):
                        </label>
                        <input
                          type="text"
                          value={photo.image?.startsWith('data:') ? (photo.suggestedFilename ? `/images/${photo.suggestedFilename}` : '/images/uploaded-photo.jpg') : photo.image}
                          onChange={(e) => handlePhotoChange(photo.id, 'image', e.target.value)}
                          className="w-full mt-0.5 p-2 text-xs font-cute rounded-lg border border-pastel-pink bg-white"
                        />
                      </div>

                      {/* File upload button */}
                      <label className="shrink-0 mt-3 sm:mt-4 px-3 py-2 bg-pastel-pink-soft hover:bg-pastel-pink text-pastel-pink-deep hover:text-white rounded-xl text-xs font-cute font-bold cursor-pointer transition-colors flex items-center gap-1.5 border border-pastel-pink/40">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoFileUpload(photo.id, e)}
                          className="hidden"
                        />
                      </label>

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(photo.id)}
                        className="shrink-0 mt-3 sm:mt-4 p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                        title="Delete photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: SURPRISE GIFT BOX */}
        {/* ======================================================== */}
        {activeTab === 'gift' && (
          <div className="bg-white rounded-3xl p-6 shadow-scrapbook border border-pastel-pink/40 space-y-4 animate-in fade-in duration-150">
            <h2 className="text-xl font-bold font-handwriting text-gray-800 flex items-center gap-2">
              🎁 Card 6: A Little Surprise Gift Box
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-cute font-bold text-gray-700">Card Heading:</label>
                <input
                  type="text"
                  value={formData.surpriseGift?.title || formData.card6Surprise?.title || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({
                      ...formData,
                      surpriseGift: { ...formData.surpriseGift, title: val },
                      card6Surprise: { ...formData.card6Surprise, title: val },
                    });
                  }}
                  className="w-full mt-1 p-2 text-xs font-cute rounded-xl border border-pastel-pink"
                />
              </div>
              <div>
                <label className="text-xs font-cute font-bold text-gray-700">Open Gift Button Text:</label>
                <input
                  type="text"
                  value={formData.surpriseGift?.openPrompt || formData.card6Surprise?.openPrompt || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({
                      ...formData,
                      surpriseGift: { ...formData.surpriseGift, openPrompt: val },
                      card6Surprise: { ...formData.card6Surprise, openPrompt: val },
                    });
                  }}
                  className="w-full mt-1 p-2 text-xs font-cute rounded-xl border border-pastel-pink"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-cute font-bold text-gray-700">Surprise Message (Revealed when box opens):</label>
              <textarea
                rows={8}
                value={formData.surpriseGift?.message || formData.card6Surprise?.message || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({
                    ...formData,
                    surpriseGift: { ...formData.surpriseGift, message: val },
                    card6Surprise: { ...formData.card6Surprise, message: val },
                  });
                }}
                className="w-full mt-1 p-3 text-sm font-handwriting leading-relaxed rounded-xl border border-pastel-pink focus:outline-none focus:ring-1 focus:ring-pastel-pink"
              />
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 8: ANNIVERSARY & SPECIAL DATES */}
        {/* ======================================================== */}
        {activeTab === 'dates' && (
          <div className="bg-white rounded-3xl p-6 shadow-scrapbook border border-pastel-pink/40 space-y-5 animate-in fade-in duration-150">
            <h2 className="text-xl font-bold font-handwriting text-gray-800 flex items-center gap-2">
              ⏳ Our Special Dates & Live Countdown
            </h2>

            {/* Anniversary Hero Editor */}
            <div className="p-4 bg-pink-50/60 rounded-2xl border border-pink-200 space-y-3">
              <span className="text-xs font-cute font-bold text-pastel-pink-deep block">
                ⭐ Main Anniversary (Powers the Live Countdown Timer):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-cute text-gray-600">Title:</label>
                  <input
                    type="text"
                    value={formData.anniversaryInfo?.title || formData.specialDates?.anniversary?.title || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({
                        ...formData,
                        anniversaryInfo: { ...formData.anniversaryInfo, title: val },
                      });
                    }}
                    className="w-full mt-1 p-2 text-xs font-cute rounded-xl border border-pastel-pink bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-cute text-gray-600">Anniversary Date (YYYY-MM-DD):</label>
                  <input
                    type="date"
                    value={formData.anniversaryInfo?.date || formData.specialDates?.anniversary?.date || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({
                        ...formData,
                        anniversaryInfo: { ...formData.anniversaryInfo, date: val },
                      });
                    }}
                    className="w-full mt-1 p-2 text-xs font-cute rounded-xl border border-pastel-pink bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-cute text-gray-600">Caption / Sweet Note:</label>
                <input
                  type="text"
                  value={formData.anniversaryInfo?.caption || formData.specialDates?.anniversary?.caption || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({
                      ...formData,
                      anniversaryInfo: { ...formData.anniversaryInfo, caption: val },
                    });
                  }}
                  className="w-full mt-1 p-2 text-xs font-cute rounded-xl border border-pastel-pink bg-white"
                />
              </div>
            </div>

            {/* Other Milestones */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-cute font-bold text-gray-700">Other Milestone Dates:</span>
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="px-3 py-1 bg-pastel-pink-soft text-pastel-pink-deep rounded-full font-cute text-xs font-bold hover:bg-pastel-pink hover:text-white transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Milestone
                </button>
              </div>

              {datesList.map((milestone) => (
                <div key={milestone.id} className="p-3 bg-gray-50/70 rounded-xl border border-pastel-pink/40 flex flex-col sm:flex-row gap-3 items-center">
                  <div className="w-full sm:w-1/3">
                    <input
                      type="text"
                      placeholder="Title (e.g. First Date)"
                      value={milestone.title || ''}
                      onChange={(e) => handleMilestoneChange(milestone.id, 'title', e.target.value)}
                      className="w-full p-2 text-xs font-cute rounded-lg border border-pastel-pink bg-white"
                    />
                  </div>
                  <div className="w-full sm:w-1/4">
                    <input
                      type="date"
                      value={milestone.date || ''}
                      onChange={(e) => handleMilestoneChange(milestone.id, 'date', e.target.value)}
                      className="w-full p-2 text-xs font-cute rounded-lg border border-pastel-pink bg-white"
                    />
                  </div>
                  <div className="w-full sm:flex-1">
                    <input
                      type="text"
                      placeholder="Caption"
                      value={milestone.caption || ''}
                      onChange={(e) => handleMilestoneChange(milestone.id, 'caption', e.target.value)}
                      className="w-full p-2 text-xs font-cute rounded-lg border border-pastel-pink bg-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMilestone(milestone.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-white transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 9: FINAL SECRET SURPRISE */}
        {/* ======================================================== */}
        {activeTab === 'secret' && (
          <div className="bg-white rounded-3xl p-6 shadow-scrapbook border border-pastel-pink/40 space-y-4 animate-in fade-in duration-150">
            <h2 className="text-xl font-bold font-handwriting text-gray-800 flex items-center gap-2">
              🔒 Secret Final Surprise (Revealed after all 6 cards are opened)
            </h2>
            <p className="text-xs font-cute text-gray-500">
              This message appears in the full-screen romantic reveal modal once Vanshu explores all 6 scrapbook memories:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-cute font-bold text-gray-700">Section Title:</label>
                <input
                  type="text"
                  value={formData.finalSecretSurprise?.sectionTitle || formData.secretSurprise?.sectionTitle || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({
                      ...formData,
                      finalSecretSurprise: { ...formData.finalSecretSurprise, sectionTitle: val },
                      secretSurprise: { ...formData.secretSurprise, sectionTitle: val },
                    });
                  }}
                  className="w-full mt-1 p-2 text-xs font-cute rounded-xl border border-pastel-pink"
                />
              </div>
              <div>
                <label className="text-xs font-cute font-bold text-gray-700">Full-Screen Modal Header:</label>
                <input
                  type="text"
                  value={formData.finalSecretSurprise?.fullScreenTitle || formData.secretSurprise?.fullScreenTitle || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({
                      ...formData,
                      finalSecretSurprise: { ...formData.finalSecretSurprise, fullScreenTitle: val },
                      secretSurprise: { ...formData.secretSurprise, fullScreenTitle: val },
                    });
                  }}
                  className="w-full mt-1 p-2 text-xs font-cute rounded-xl border border-pastel-pink"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-cute font-bold text-gray-700">Final Secret Love Message:</label>
              <textarea
                rows={10}
                value={formData.finalSecretSurprise?.message || formData.secretSurprise?.message || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({
                    ...formData,
                    finalSecretSurprise: { ...formData.finalSecretSurprise, message: val },
                    secretSurprise: { ...formData.secretSurprise, message: val },
                  });
                }}
                className="w-full mt-1 p-3 text-base font-handwriting leading-relaxed rounded-xl border border-pastel-pink focus:outline-none focus:ring-1 focus:ring-pastel-pink"
              />
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 10: PASSWORD & SECURITY SETTINGS */}
        {/* ======================================================== */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 shadow-scrapbook border border-pastel-pink/40 space-y-6 animate-in fade-in duration-150">
            <h2 className="text-xl font-bold font-handwriting text-gray-800 flex items-center gap-2">
              🔐 Security & Password Settings
            </h2>

            {/* Change Password Form */}
            <form onSubmit={handleChangePassword} className="p-4 bg-pastel-pink-soft/40 rounded-2xl border border-pastel-pink/40 max-w-md space-y-3">
              <span className="text-xs font-cute font-bold text-gray-800 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-pastel-pink-deep" /> Change Admin Editor Password:
              </span>
              <input
                type="password"
                required
                placeholder="Enter new password..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 text-xs font-cute rounded-xl border border-pastel-pink bg-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-pastel-pink-deep text-white rounded-full font-cute text-xs font-bold hover:bg-pink-600 transition-colors shadow-sm"
              >
                Update Password
              </button>
              {passwordChangedMsg && (
                <p className="text-xs font-cute text-green-700 font-bold">{passwordChangedMsg}</p>
              )}
            </form>

            {/* Technical Security Documentation */}
            <div className="p-5 bg-amber-50/80 rounded-2xl border border-amber-300 space-y-3">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Frontend Authentication Security Notice
              </div>
              <p className="text-xs font-cute text-gray-700 leading-relaxed">
                This editor uses SHA-256 password hashing in the browser, ensuring your password is never stored as plaintext in source code. However, on pure static hosts (like Netlify or Vercel without an active backend/database), all JavaScript files sent to a browser can be inspected by tech-savvy users using DevTools.
              </p>
              <div className="text-xs font-cute text-gray-700 space-y-1">
                <strong>Recommended ways to add true zero-leak security for public deployment:</strong>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li><strong>Vercel Password Protection:</strong> Go to Vercel Project Settings &gt; Security &gt; Enable Password Protection (one-click native server-level gate).</li>
                  <li><strong>Netlify Identity or Basic Auth:</strong> Enable Netlify password protection in your Netlify Site Configuration.</li>
                  <li><strong>Localhost-Only Workflow:</strong> Keep the editor for your own use on <code className="bg-white px-1 rounded border">localhost:3000/admin</code>, export your <code className="bg-white px-1 rounded border">content.js</code>, and deploy a completely static public site for Vanshu!</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Save Footer */}
      <div className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t border-pastel-pink/40 p-3 shadow-lg z-30 flex items-center justify-between px-6 max-w-6xl mx-auto rounded-t-2xl">
        <span className="text-xs font-cute text-gray-500">
          💡 Click <strong>Save Changes</strong> to apply updates immediately to the website!
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-cute text-xs font-semibold"
          >
            Preview Site
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-pastel-pink to-pastel-pink-deep text-white rounded-full font-cute text-xs font-bold shadow hover:shadow-md transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminEditor;
