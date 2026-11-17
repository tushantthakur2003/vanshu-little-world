import React, { useState, useEffect } from 'react';
import {
  Heart, Sparkles, Save, Send, Eye, RotateCcw, Image as ImageIcon,
  Calendar, Gift, Lock, Music, User, Mail, Compass, HelpCircle,
  Plus, Trash2, ArrowUp, ArrowDown, Upload, Check, Cloud, Star,
  LogOut, ExternalLink, RefreshCw, Volume2, Play, Pause, Smartphone, AlertCircle, Download
} from 'lucide-react';
import {
  getDraftContent,
  saveDraftContent,
  publishContent,
  restoreBackup,
  uploadPhotoFile,
  uploadMusicFile,
  logoutAdmin
} from '../../services/contentService';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import { optimizeMultipleImages } from '../../utils/imageOptimizer';
import { PreviewModal } from './PreviewModal';
import { GiftBox } from '../illustrations/GiftBox';
import { WashiTape, PinkBow } from '../illustrations/ScrapbookDecorations';
import { playCutePop, playChime } from '../../utils/soundEffects';

export const AdminDashboard = ({ onNavigateHome, onContentUpdated }) => {
  const [formData, setFormData] = useState(null);
  const [activeSection, setActiveSection] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [statusNotice, setStatusNotice] = useState(null);
  const [hasBackup, setHasBackup] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [previewAudioPlaying, setPreviewAudioPlaying] = useState(false);
  const [audioPreviewObj, setAudioPreviewObj] = useState(null);
  const [isCloudConnected, setIsCloudConnected] = useState(isSupabaseConfigured());

  // Load draft & published content
  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      try {
        const data = await getDraftContent();
        setFormData(data.draft);
        setHasBackup(data.hasBackup);
      } catch (err) {
        console.error('Failed to load content in Admin:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadContent();
  }, []);

  // Show status notification
  const notify = (msg, type = 'success') => {
    setStatusNotice({ msg, type });
    setTimeout(() => setStatusNotice(null), 4000);
  };

  // 1. SAVE CHANGES (Persists immediately to website and storage)
  const handleSaveDraft = async () => {
    if (!formData) return;
    setIsSaving(true);
    playCutePop();
    try {
      await saveDraftContent(formData);
      if (onContentUpdated) onContentUpdated(formData);
      notify('All changes saved and updated on the website!', 'success');
    } catch (err) {
      notify('Failed to save changes. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // 2. PUBLISH CHANGES (Makes draft live for Vanshu)
  const handlePublish = async () => {
    if (!formData) return;
    setIsPublishing(true);
    playChime();
    try {
      await publishContent(formData);
      setHasBackup(true);
      if (onContentUpdated) onContentUpdated(formData);
      notify('🎉 Website published and updated live for Vanshu!', 'publish');
    } catch (err) {
      notify('Publishing failed. Please check your connection.', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  // 3. RESTORE BACKUP
  const handleRestoreBackup = async () => {
    if (!window.confirm("Are you sure you want to revert to your previous published backup?")) return;
    playCutePop();
    try {
      await restoreBackup();
      const updated = await getDraftContent();
      setFormData(updated.draft);
      notify('Previous published version restored successfully! ♡', 'success');
    } catch (err) {
      notify('No previous backup available to restore.', 'error');
    }
  };

  // 4. EXPORT CONTENT.JS (Downloads current content for permanent repository sync)
  const handleExportContent = () => {
    if (!formData) return;
    playCutePop();
    const fileContent = `// =====================================================================
// VANSHU'S LITTLE WORLD 🎀 - CENTRAL CONTENT CONFIGURATION
// =====================================================================

export const siteContent = ${JSON.stringify(formData, null, 2)};

siteContent.card1Letter = siteContent.loveLetter;
siteContent.card2Hug = siteContent.whenYouMissMe;
siteContent.card3Reasons = siteContent.reasonsILoveYou;
siteContent.card4Comfort = siteContent.openWhenSad;
siteContent.card5Memories = siteContent.photoGallery;
siteContent.card6Surprise = siteContent.surpriseGift;
siteContent.secretSurprise = siteContent.finalSecretSurprise;

export default siteContent;
`;
    const blob = new Blob([fileContent], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.js';
    a.click();
    URL.revokeObjectURL(url);
    notify('content.js exported to your downloads! ♡', 'success');
  };

  // Logout
  const handleLogout = async () => {
    await logoutAdmin();
    playCutePop();
    window.location.reload();
  };

  // Reasons helpers
  const reasonsList = formData?.reasonsILoveYou?.reasons || formData?.card3Reasons?.reasons || [];

  const handleAddReason = () => {
    const nextNum = reasonsList.length + 1;
    const updated = [...reasonsList, `${nextNum}. Your wonderful laugh.`];
    setFormData({
      ...formData,
      reasonsILoveYou: { ...formData.reasonsILoveYou, reasons: updated },
      card3Reasons: { ...formData.card3Reasons, reasons: updated },
    });
    playCutePop();
  };

  const handleRemoveReason = (idx) => {
    const updated = reasonsList.filter((_, i) => i !== idx);
    setFormData({
      ...formData,
      reasonsILoveYou: { ...formData.reasonsILoveYou, reasons: updated },
      card3Reasons: { ...formData.card3Reasons, reasons: updated },
    });
    playCutePop();
  };

  const handleMoveReason = (idx, direction) => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= reasonsList.length) return;
    const updated = [...reasonsList];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setFormData({
      ...formData,
      reasonsILoveYou: { ...formData.reasonsILoveYou, reasons: updated },
      card3Reasons: { ...formData.card3Reasons, reasons: updated },
    });
    playCutePop();
  };

  // Photo Gallery helpers
  const photosList = formData?.photoGallery?.photos || formData?.card5Memories?.photos || [];

  const handleAddPhoto = () => {
    const newP = {
      id: `photo-${Date.now()}`,
      title: 'Our Sweet Memory',
      date: 'Special Moment',
      caption: 'A moment I will treasure forever ♡',
      image: '/images/memory-1.svg',
      rotation: photosList.length % 2 === 0 ? '-rotate-2' : 'rotate-2',
      tapeColor: 'bg-pastel-pink/60',
      isFeatured: photosList.length === 0,
    };
    const updated = [...photosList, newP];
    setFormData({
      ...formData,
      photoGallery: { ...formData.photoGallery, photos: updated },
      card5Memories: { ...formData.card5Memories, photos: updated },
    });
    playCutePop();
  };

  const handleRemovePhoto = (id) => {
    const updated = photosList.filter((p) => p.id !== id);
    setFormData({
      ...formData,
      photoGallery: { ...formData.photoGallery, photos: updated },
      card5Memories: { ...formData.card5Memories, photos: updated },
    });
    playCutePop();
  };

  const handleMovePhoto = (idx, direction) => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= photosList.length) return;
    const updated = [...photosList];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setFormData({
      ...formData,
      photoGallery: { ...formData.photoGallery, photos: updated },
      card5Memories: { ...formData.card5Memories, photos: updated },
    });
    playCutePop();
  };

  const handleSetFeaturedPhoto = (id) => {
    const updated = photosList.map((p) => ({ ...p, isFeatured: p.id === id }));
    setFormData({
      ...formData,
      photoGallery: { ...formData.photoGallery, photos: updated },
      card5Memories: { ...formData.card5Memories, photos: updated },
    });
    playCutePop();
  };

  const handlePhotoFieldChange = (id, field, value) => {
    const updated = photosList.map((p) => (p.id === id ? { ...p, [field]: value } : p));
    setFormData({
      ...formData,
      photoGallery: { ...formData.photoGallery, photos: updated },
      card5Memories: { ...formData.card5Memories, photos: updated },
    });
  };

  // Multiple Photo Batch Upload
  const handleMultiplePhotoUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingPhoto(true);
    playCutePop();

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const uploadRes = await uploadPhotoFile(file);
        return {
          id: `photo-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '),
          date: 'Special Moment',
          caption: 'A cherished memory together ♡',
          image: uploadRes.url,
          rotation: Math.random() > 0.5 ? 'rotate-2' : '-rotate-2',
          tapeColor: 'bg-pastel-pink/60',
          isFeatured: false,
        };
      });

      const newPhotos = await Promise.all(uploadPromises);
      const updated = [...newPhotos, ...photosList];

      setFormData({
        ...formData,
        photoGallery: { ...formData.photoGallery, photos: updated },
        card5Memories: { ...formData.card5Memories, photos: updated },
      });
      notify(`Successfully uploaded and optimized ${newPhotos.length} photo(s)!`, 'success');
    } catch (err) {
      notify('Failed to upload some photos. Please try again.', 'error');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Dates helpers
  const datesList = Array.isArray(formData?.specialDates)
    ? formData.specialDates
    : formData?.specialDates?.datesList || [];

  const handleAddMilestoneDate = () => {
    const newD = {
      id: `date-${Date.now()}`,
      title: 'Our Special Day',
      date: new Date().toISOString().split('T')[0],
      caption: 'A milestone that made us stronger.',
    };
    const updated = [...datesList, newD];
    setFormData({ ...formData, specialDates: updated });
    playCutePop();
  };

  const handleRemoveMilestoneDate = (id) => {
    const updated = datesList.filter((d) => d.id !== id);
    setFormData({ ...formData, specialDates: updated });
    playCutePop();
  };

  // Music upload helper
  const handleMusicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    playCutePop();
    try {
      const res = await uploadMusicFile(file);
      const updatedForm = {
        ...formData,
        musicSettings: {
          ...formData?.musicSettings,
          customAudioUrl: res.url,
          title: file.name.replace(/\.[^/.]+$/, ""),
          hasCustomAudio: true,
          fileName: file.name,
        },
      };
      setFormData(updatedForm);
      await saveDraftContent(updatedForm);
      if (onContentUpdated) onContentUpdated(updatedForm);
      notify(`"${file.name}" uploaded and set as background music!`, 'success');
    } catch (err) {
      notify('Failed to upload audio file.', 'error');
    }
  };

  // Toggle preview audio in admin
  const toggleAudioPreview = () => {
    const audioUrl = formData?.musicSettings?.customAudioUrl || '/music.mp3';

    if (previewAudioPlaying && audioPreviewObj) {
      audioPreviewObj.pause();
      setPreviewAudioPlaying(false);
    } else {
      if (audioPreviewObj) {
        audioPreviewObj.pause();
      }
      const a = new Audio(audioUrl);
      a.volume = formData?.musicSettings?.volume || 0.35;
      a.play().then(() => {
        setAudioPreviewObj(a);
        setPreviewAudioPlaying(true);
      }).catch(() => {
        const fallbackAudio = new Audio('/music.mp3');
        fallbackAudio.volume = formData?.musicSettings?.volume || 0.35;
        fallbackAudio.play().then(() => {
          setAudioPreviewObj(fallbackAudio);
          setPreviewAudioPlaying(true);
        }).catch(() => {
          notify('Audio preview playback blocked by browser. Click to interact.', 'error');
        });
      });
      a.onended = () => setPreviewAudioPlaying(false);
    }
  };

  // -------------------------------------------------------------
  // RENDER SECTIONS
  // -------------------------------------------------------------

  if (isLoading || !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF9] font-cute text-pastel-pink-deep">
        <div className="flex flex-col items-center gap-2">
          <PinkBow className="w-8 h-8 animate-bounce" />
          <span className="font-bold">Loading Content Studio...</span>
        </div>
      </div>
    );
  }

  const sections = [
    { id: 'general', label: 'General Settings', icon: User },
    { id: 'welcome', label: 'Welcome Screen', icon: Sparkles },
    { id: 'letter', label: 'Love Letters', icon: Mail },
    { id: 'cards', label: 'Message Cards', icon: Heart },
    { id: 'reasons', label: 'Reasons I Love You', icon: Star },
    { id: 'photos', label: 'Photo Gallery 📸', icon: ImageIcon },
    { id: 'dates', label: 'Anniversary & Dates', icon: Calendar },
    { id: 'gift', label: 'Surprise Gift', icon: Gift },
    { id: 'secret', label: 'Secret Final Surprise', icon: Lock },
    { id: 'music', label: 'Music Settings', icon: Music },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-gray-700 flex flex-col font-body selection:bg-pastel-pink-soft selection:text-pastel-pink-deep">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-pastel-pink/40 px-4 sm:px-6 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Title & Subtitle */}
          <div className="flex items-center gap-3">
            <PinkBow className="w-8 h-8" />
            <div>
              <h1 className="font-handwriting font-bold text-2xl sm:text-3xl text-gray-800 leading-none">
                Vanshu's Little World – Content Studio
              </h1>
              <p className="text-[11px] sm:text-xs font-cute text-pastel-pink-deep mt-0.5">
                Manage your little world of memories and surprises.
              </p>
            </div>
          </div>

          {/* Action Center Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Live Website Button */}
            <button
              onClick={onNavigateHome}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-cute text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Return to the live public site"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Live Website</span>
            </button>

            {/* Preview Draft Button */}
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="px-3.5 py-1.5 bg-pastel-lavender hover:bg-pastel-lavender-deep text-purple-900 hover:text-white rounded-full font-cute text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Preview how draft will look to Vanshu"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>

            {/* Restore Backup (If available) */}
            {hasBackup && (
              <button
                onClick={handleRestoreBackup}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-full font-cute text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Restore previous published version"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Restore Backup</span>
              </button>
            )}

            {/* Export content.js Button */}
            <button
              onClick={handleExportContent}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-full font-cute text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Export content.js file to sync with mobile and permanent repo"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Export content.js</span>
            </button>

            {/* SAVE DRAFT BUTTON */}
            <button
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="px-4 py-1.5 bg-white hover:bg-pastel-pink-soft text-pastel-pink-deep border-2 border-pastel-pink rounded-full font-cute text-xs font-bold transition-all active:scale-95 flex items-center gap-1 shadow-sm disabled:opacity-50"
              title="Save draft without publishing live"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>

            {/* PUBLISH CHANGES BUTTON */}
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-5 py-1.5 bg-gradient-to-r from-pastel-pink-deep to-pink-600 hover:from-pink-600 hover:to-pastel-pink-deep text-white rounded-full font-cute text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5 disabled:opacity-50"
              title="Publish all approved changes to live website"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isPublishing ? 'Publishing...' : 'Publish Changes'}</span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
              title="Logout from Content Studio"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Notification Banner */}
        {statusNotice && (
          <div
            className={`max-w-7xl mx-auto mt-2 px-4 py-2 rounded-xl text-xs font-cute flex items-center gap-2 animate-in fade-in duration-200 ${
              statusNotice.type === 'publish'
                ? 'bg-pink-100 border border-pink-300 text-pink-900 font-bold'
                : statusNotice.type === 'error'
                ? 'bg-red-50 border border-red-200 text-red-700'
                : 'bg-green-50 border border-green-200 text-green-800'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{statusNotice.msg}</span>
          </div>
        )}
      </header>

      {/* Main Studio Body (Sidebar + Content Canvas) */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col md:flex-row p-4 sm:p-6 gap-6">
        {/* DESKTOP SIDEBAR / MOBILE NAV DRAWER */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-2 bg-white/90 rounded-3xl p-4 shadow-scrapbook border border-pastel-pink/40 h-fit sticky top-20">
          <div className="px-2 py-1 mb-1 border-b border-pastel-pink/30 flex items-center justify-between">
            <span className="text-[11px] font-cute font-bold text-pastel-pink-deep uppercase tracking-wider">
              Studio Sections
            </span>
            <span className="text-[10px] font-cute px-2 py-0.5 rounded-full bg-pastel-pink-soft text-pastel-pink-deep font-bold">
              10 Sections
            </span>
          </div>

          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-1 md:pb-0">
            {sections.map((sec, i) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSection(sec.id);
                    playCutePop();
                  }}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-cute font-bold transition-all text-left whitespace-nowrap md:whitespace-normal ${
                    isActive
                      ? 'bg-gradient-to-r from-pastel-pink-soft to-pastel-pink text-pastel-pink-deep shadow-sm border border-pastel-pink'
                      : 'text-gray-600 hover:bg-pastel-pink-soft/50 hover:text-gray-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-pastel-pink-deep' : 'text-gray-400'}`} />
                  <span className="flex-1">{sec.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Cloud Storage Status Card */}
          <div className="mt-4 pt-3 border-t border-pastel-pink/30 px-2 text-[11px] font-cute">
            <div className="flex items-center gap-1.5 text-gray-500 font-semibold mb-1">
              <Cloud className="w-3.5 h-3.5 text-pastel-pink-deep" />
              <span>Storage Connection</span>
            </div>
            <p className="text-[10px] text-gray-400 leading-tight">
              {isCloudConnected
                ? '✓ Cloud Storage & Database active'
                : 'Local Mode active. Photos saved to IndexedDB.'}
            </p>
          </div>
        </aside>

        {/* MAIN SECTION EDITOR CONTENT */}
        <main className="flex-1 bg-white rounded-3xl p-6 sm:p-8 shadow-scrapbook border border-pastel-pink/40 space-y-6">
          {/* ======================================================== */}
          {/* 1. GENERAL SETTINGS */}
          {/* ======================================================== */}
          {activeSection === 'general' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-pastel-pink/30 pb-3">
                <div className="flex items-center gap-2">
                  <User className="w-6 h-6 text-pastel-pink-deep" />
                  <h2 className="text-2xl font-bold font-handwriting text-gray-800">
                    1. General Settings
                  </h2>
                </div>
                <WashiTape color="bg-pastel-pink/80" pattern="hearts" className="w-24 h-5 hidden sm:block" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-cute font-bold text-gray-700">Girlfriend's Full Name:</label>
                  <input
                    type="text"
                    value={formData.girlfriendName || ''}
                    onChange={(e) => setFormData({ ...formData, girlfriendName: e.target.value })}
                    className="w-full mt-1.5 p-3 text-xs font-cute rounded-2xl border border-pastel-pink bg-[#FFFDF9] focus:outline-none focus:ring-2 focus:ring-pastel-pink"
                  />
                  <span className="text-[10px] font-cute text-gray-400 mt-1 block">Default: Vanshika Handoo</span>
                </div>

                <div>
                  <label className="text-xs font-cute font-bold text-gray-700">Nickname:</label>
                  <input
                    type="text"
                    value={formData.nickname || ''}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    className="w-full mt-1.5 p-3 text-xs font-cute rounded-2xl border border-pastel-pink bg-[#FFFDF9] focus:outline-none focus:ring-2 focus:ring-pastel-pink"
                  />
                  <span className="text-[10px] font-cute text-gray-400 mt-1 block">Default: Vanshu</span>
                </div>

                <div>
                  <label className="text-xs font-cute font-bold text-gray-700">Website Title:</label>
                  <input
                    type="text"
                    value={formData.siteTitle || ''}
                    onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
                    className="w-full mt-1.5 p-3 text-xs font-cute rounded-2xl border border-pastel-pink bg-[#FFFDF9] focus:outline-none focus:ring-2 focus:ring-pastel-pink"
                  />
                  <span className="text-[10px] font-cute text-gray-400 mt-1 block">Default: Vanshu's Little World ♡</span>
                </div>

                <div>
                  <label className="text-xs font-cute font-bold text-gray-700">Website Subtitle:</label>
                  <input
                    type="text"
                    value={formData.siteSubtitle || ''}
                    onChange={(e) => setFormData({ ...formData, siteSubtitle: e.target.value })}
                    className="w-full mt-1.5 p-3 text-xs font-cute rounded-2xl border border-pastel-pink bg-[#FFFDF9] focus:outline-none focus:ring-2 focus:ring-pastel-pink"
                  />
                  <span className="text-[10px] font-cute text-gray-400 mt-1 block">Default: A little scrapbook made with lots of love.</span>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. WELCOME SCREEN */}
          {/* ======================================================== */}
          {activeSection === 'welcome' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-pastel-pink/30 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-pastel-pink-deep" />
                  <h2 className="text-2xl font-bold font-handwriting text-gray-800">
                    2. Welcome Screen Editor
                  </h2>
                </div>
                <WashiTape color="bg-pastel-lavender/80" pattern="dots" className="w-24 h-5 hidden sm:block" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-cute font-bold text-gray-700">Main Heading / Greeting:</label>
                  <input
                    type="text"
                    value={formData.welcomeScreen?.heading || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        welcomeScreen: { ...formData.welcomeScreen, heading: e.target.value },
                      })
                    }
                    className="w-full mt-1.5 p-3 text-xs font-cute rounded-2xl border border-pastel-pink bg-[#FFFDF9]"
                  />
                </div>

                <div>
                  <label className="text-xs font-cute font-bold text-gray-700">Subtitle:</label>
                  <input
                    type="text"
                    value={formData.welcomeScreen?.subtitle || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        welcomeScreen: { ...formData.welcomeScreen, subtitle: e.target.value },
                      })
                    }
                    className="w-full mt-1.5 p-3 text-xs font-cute rounded-2xl border border-pastel-pink bg-[#FFFDF9]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-cute font-bold text-gray-700">Supporting Text:</label>
                  <input
                    type="text"
                    value={formData.welcomeScreen?.supportingText || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        welcomeScreen: { ...formData.welcomeScreen, supportingText: e.target.value },
                      })
                    }
                    className="w-full mt-1.5 p-3 text-xs font-cute rounded-2xl border border-pastel-pink bg-[#FFFDF9]"
                  />
                </div>

                <div>
                  <label className="text-xs font-cute font-bold text-gray-700">Animated Button Label:</label>
                  <input
                    type="text"
                    value={formData.welcomeScreen?.buttonText || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        welcomeScreen: { ...formData.welcomeScreen, buttonText: e.target.value },
                      })
                    }
                    className="w-full mt-1.5 p-3 text-xs font-cute rounded-2xl border border-pastel-pink bg-[#FFFDF9]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 3. LOVE LETTERS */}
          {/* ======================================================== */}
          {activeSection === 'letter' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-pastel-pink/30 pb-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-6 h-6 text-pastel-pink-deep" />
                  <h2 className="text-2xl font-bold font-handwriting text-gray-800">
                    3. Love Letter Editor (Card 1)
                  </h2>
                </div>
                <WashiTape color="bg-pastel-pink/80" pattern="hearts" className="w-24 h-5 hidden sm:block" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                    className="w-full mt-1.5 p-3 text-xs font-cute rounded-2xl border border-pastel-pink bg-[#FFFDF9]"
                  />
                </div>

                <div>
                  <label className="text-xs font-cute font-bold text-gray-700">Envelope Wax Seal Label:</label>
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
                    className="w-full mt-1.5 p-3 text-xs font-cute rounded-2xl border border-pastel-pink bg-[#FFFDF9]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-cute font-bold text-gray-700">Full Love Letter (Paragraphs & Message):</label>
                <textarea
                  rows={12}
                  value={formData.loveLetter?.message || formData.card1Letter?.message || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({
                      ...formData,
                      loveLetter: { ...formData.loveLetter, message: val },
                      card1Letter: { ...formData.card1Letter, message: val },
                    });
                  }}
                  className="w-full mt-1.5 p-4 text-base font-handwriting leading-relaxed rounded-2xl border border-pastel-pink bg-[#FFFDF9] focus:outline-none focus:ring-2 focus:ring-pastel-pink"
                />
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 4. MESSAGE CARDS */}
          {/* ======================================================== */}
          {activeSection === 'cards' && (
            <div className="space-y-8 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-pastel-pink/30 pb-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-6 h-6 text-pastel-pink-deep" />
                  <h2 className="text-2xl font-bold font-handwriting text-gray-800">
                    4. Message Cards Editor
                  </h2>
                </div>
                <WashiTape color="bg-pastel-blue/80" pattern="dots" className="w-24 h-5 hidden sm:block" />
              </div>

              {/* CARD 2: WHEN YOU MISS ME */}
              <div className="p-5 bg-sky-50/50 rounded-3xl border border-sky-200 space-y-4">
                <h3 className="text-lg font-bold font-handwriting text-sky-800 flex items-center gap-2">
                  🐧 Card 2: When You Miss Me
                </h3>
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
                      className="w-full mt-1 p-2.5 text-xs font-cute rounded-xl border border-sky-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-cute font-bold text-gray-700">Virtual Hug Button Label:</label>
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
                      className="w-full mt-1 p-2.5 text-xs font-cute rounded-xl border border-sky-200 bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-cute font-bold text-gray-700">Message Content:</label>
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
                    className="w-full mt-1 p-3 text-sm font-handwriting leading-relaxed rounded-xl border border-sky-200 bg-white"
                  />
                </div>
              </div>

              {/* CARD 4: OPEN WHEN SAD */}
              <div className="p-5 bg-amber-50/50 rounded-3xl border border-amber-200 space-y-4">
                <h3 className="text-lg font-bold font-handwriting text-amber-800 flex items-center gap-2">
                  🐰 Card 4: Open When You're Sad
                </h3>
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
                    className="w-full mt-1 p-2.5 text-xs font-cute rounded-xl border border-amber-200 bg-white"
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
                    className="w-full mt-1 p-3 text-sm font-handwriting leading-relaxed rounded-xl border border-amber-200 bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 5. REASONS I LOVE YOU */}
          {/* ======================================================== */}
          {activeSection === 'reasons' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-pastel-pink/30 pb-3">
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-pastel-pink-deep" />
                  <h2 className="text-2xl font-bold font-handwriting text-gray-800">
                    5. Reasons I Love You (Card 3)
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleAddReason}
                  className="px-4 py-2 bg-pastel-pink text-white rounded-full font-cute text-xs font-bold hover:bg-pastel-pink-deep transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add New Reason
                </button>
              </div>

              <p className="text-xs font-cute text-gray-500">
                Each reason appears as an individual interactive heart button on the public website. You can add as many as you wish and reorder them:
              </p>

              <div className="space-y-3">
                {reasonsList.map((reason, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-[#FFFDF9] p-3 rounded-2xl border border-pastel-pink shadow-sm"
                  >
                    <span className="w-8 h-8 rounded-full bg-pastel-pink-deep text-white flex items-center justify-center text-xs font-cute font-bold shrink-0">
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={reason}
                      onChange={(e) => {
                        const updated = [...reasonsList];
                        updated[idx] = e.target.value;
                        setFormData({
                          ...formData,
                          reasonsILoveYou: { ...formData.reasonsILoveYou, reasons: updated },
                          card3Reasons: { ...formData.card3Reasons, reasons: updated },
                        });
                      }}
                      className="flex-1 p-2 text-xs font-cute rounded-xl border border-pastel-pink/50 bg-white focus:outline-none focus:ring-1 focus:ring-pastel-pink"
                    />

                    {/* Move Up/Down buttons */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveReason(idx, 'up')}
                      className="p-1.5 text-gray-400 hover:text-pastel-pink-deep disabled:opacity-30 rounded-lg"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === reasonsList.length - 1}
                      onClick={() => handleMoveReason(idx, 'down')}
                      className="p-1.5 text-gray-400 hover:text-pastel-pink-deep disabled:opacity-30 rounded-lg"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveReason(idx)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete reason"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 6. PHOTO GALLERY */}
          {/* ======================================================== */}
          {activeSection === 'photos' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-wrap items-center justify-between border-b border-pastel-pink/30 pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-6 h-6 text-pastel-pink-deep" />
                  <h2 className="text-2xl font-bold font-handwriting text-gray-800">
                    6. Photo Gallery Manager (Card 5)
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  {/* Multi-upload file button */}
                  <label className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pastel-pink-deep text-white rounded-full font-cute text-xs font-bold cursor-pointer hover:shadow-md transition-all flex items-center gap-1.5">
                    <Upload className="w-4 h-4" />
                    <span>{isUploadingPhoto ? 'Uploading & Optimizing...' : 'Upload Photos (Multi)'}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      disabled={isUploadingPhoto}
                      onChange={handleMultiplePhotoUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="px-3.5 py-2 bg-pastel-pink-soft text-pastel-pink-deep rounded-full font-cute text-xs font-bold hover:bg-pastel-pink hover:text-white transition-all flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Empty Photo
                  </button>
                </div>
              </div>

              {/* Photo list */}
              <div className="space-y-4">
                {photosList.map((photo, idx) => (
                  <div
                    key={photo.id}
                    className={`p-4 rounded-3xl border-2 transition-all flex flex-col sm:flex-row gap-4 items-start ${
                      photo.isFeatured
                        ? 'bg-pink-50/70 border-pastel-pink shadow-md'
                        : 'bg-[#FFFDF9] border-pastel-pink/40 shadow-sm'
                    }`}
                  >
                    {/* Thumbnail preview */}
                    <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 shadow-inner flex items-center justify-center">
                      <img
                        src={photo.image}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/images/memory-1.svg';
                        }}
                      />
                      {photo.isFeatured && (
                        <span className="absolute top-1 left-1 px-2 py-0.5 bg-pastel-pink-deep text-white text-[9px] font-cute font-bold rounded-full flex items-center gap-0.5 shadow-sm">
                          <Star className="w-2.5 h-2.5 fill-white" /> Featured
                        </span>
                      )}
                    </div>

                    {/* Photo Details Form */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                      <div>
                        <label className="text-[11px] font-cute font-bold text-gray-700">Memory Title:</label>
                        <input
                          type="text"
                          value={photo.title || ''}
                          onChange={(e) => handlePhotoFieldChange(photo.id, 'title', e.target.value)}
                          className="w-full mt-1 p-2 text-xs font-cute rounded-xl border border-pastel-pink bg-white"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-cute font-bold text-gray-700">Date on Polaroid:</label>
                        <input
                          type="text"
                          value={photo.date || ''}
                          onChange={(e) => handlePhotoFieldChange(photo.id, 'date', e.target.value)}
                          placeholder="e.g. First Date"
                          className="w-full mt-1 p-2 text-xs font-cute rounded-xl border border-pastel-pink bg-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-cute font-bold text-gray-700">Sweet Caption:</label>
                        <input
                          type="text"
                          value={photo.caption || ''}
                          onChange={(e) => handlePhotoFieldChange(photo.id, 'caption', e.target.value)}
                          className="w-full mt-1 p-2 text-xs font-cute rounded-xl border border-pastel-pink bg-white"
                        />
                      </div>

                      <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
                        {/* Featured Button */}
                        <button
                          type="button"
                          onClick={() => handleSetFeaturedPhoto(photo.id)}
                          className={`text-xs font-cute font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg ${
                            photo.isFeatured
                              ? 'text-pastel-pink-deep font-bold bg-pastel-pink-soft'
                              : 'text-gray-400 hover:text-pastel-pink-deep'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${photo.isFeatured ? 'fill-pastel-pink-deep' : ''}`} />
                          <span>{photo.isFeatured ? 'Featured Cover Photo' : 'Make Featured Photo'}</span>
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMovePhoto(idx, 'up')}
                            className="p-1 text-gray-400 hover:text-pastel-pink-deep disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === photosList.length - 1}
                            onClick={() => handleMovePhoto(idx, 'down')}
                            className="p-1 text-gray-400 hover:text-pastel-pink-deep disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(photo.id)}
                            className="p-1 text-gray-400 hover:text-red-500 ml-2"
                            title="Delete photo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 7. ANNIVERSARY AND SPECIAL DATES */}
          {/* ======================================================== */}
          {activeSection === 'dates' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-pastel-pink/30 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-pastel-pink-deep" />
                  <h2 className="text-2xl font-bold font-handwriting text-gray-800">
                    7. Anniversary & Milestone Dates
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleAddMilestoneDate}
                  className="px-4 py-2 bg-pastel-pink text-white rounded-full font-cute text-xs font-bold hover:bg-pastel-pink-deep transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Special Date
                </button>
              </div>

              {/* Main Anniversary Hero */}
              <div className="p-5 bg-pink-50/70 rounded-3xl border border-pastel-pink space-y-4">
                <span className="text-xs font-cute font-bold text-pastel-pink-deep flex items-center gap-1">
                  <Heart className="w-4 h-4 fill-pastel-pink-deep" />
                  Main Anniversary (Powers the Live Countdown Timer on the Website):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-cute font-bold text-gray-700">Anniversary Title:</label>
                    <input
                      type="text"
                      value={formData.anniversaryInfo?.title || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          anniversaryInfo: { ...formData.anniversaryInfo, title: e.target.value },
                        })
                      }
                      className="w-full mt-1 p-2.5 text-xs font-cute rounded-xl border border-pastel-pink bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-cute font-bold text-gray-700">Anniversary Date (YYYY-MM-DD):</label>
                    <input
                      type="date"
                      value={formData.anniversaryInfo?.date || formData.anniversary?.date || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          anniversaryInfo: { ...formData.anniversaryInfo, date: e.target.value },
                          anniversary: { ...formData.anniversary, date: e.target.value },
                        })
                      }
                      className="w-full mt-1 p-2.5 text-xs font-cute rounded-xl border border-pastel-pink bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-cute font-bold text-gray-700">Anniversary Caption:</label>
                    <input
                      type="text"
                      value={formData.anniversaryInfo?.caption || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          anniversaryInfo: { ...formData.anniversaryInfo, caption: e.target.value },
                        })
                      }
                      className="w-full mt-1 p-2.5 text-xs font-cute rounded-xl border border-pastel-pink bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Milestone list */}
              <div className="space-y-3">
                <span className="text-xs font-cute font-bold text-gray-700 block">Milestones & Special Memories:</span>
                {datesList.map((d) => (
                  <div key={d.id} className="p-3 bg-[#FFFDF9] rounded-2xl border border-pastel-pink flex flex-col sm:flex-row gap-3 items-center">
                    <div className="w-full sm:w-1/3">
                      <input
                        type="text"
                        placeholder="Milestone Title (e.g. First Date)"
                        value={d.title || ''}
                        onChange={(e) => {
                          const updated = datesList.map((item) => item.id === d.id ? { ...item, title: e.target.value } : item);
                          setFormData({ ...formData, specialDates: updated });
                        }}
                        className="w-full p-2 text-xs font-cute rounded-xl border border-pastel-pink bg-white"
                      />
                    </div>
                    <div className="w-full sm:w-1/4">
                      <input
                        type="date"
                        value={d.date || ''}
                        onChange={(e) => {
                          const updated = datesList.map((item) => item.id === d.id ? { ...item, date: e.target.value } : item);
                          setFormData({ ...formData, specialDates: updated });
                        }}
                        className="w-full p-2 text-xs font-cute rounded-xl border border-pastel-pink bg-white"
                      />
                    </div>
                    <div className="w-full sm:flex-1">
                      <input
                        type="text"
                        placeholder="Sweet Caption"
                        value={d.caption || ''}
                        onChange={(e) => {
                          const updated = datesList.map((item) => item.id === d.id ? { ...item, caption: e.target.value } : item);
                          setFormData({ ...formData, specialDates: updated });
                        }}
                        className="w-full p-2 text-xs font-cute rounded-xl border border-pastel-pink bg-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestoneDate(d.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                      title="Delete milestone"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 8. SURPRISE GIFT */}
          {/* ======================================================== */}
          {activeSection === 'gift' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-pastel-pink/30 pb-3">
                <div className="flex items-center gap-2">
                  <Gift className="w-6 h-6 text-pastel-pink-deep" />
                  <h2 className="text-2xl font-bold font-handwriting text-gray-800">
                    8. Surprise Gift Box (Card 6)
                  </h2>
                </div>
                <WashiTape color="bg-pastel-pink/80" pattern="hearts" className="w-24 h-5 hidden sm:block" />
              </div>

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
                    className="w-full mt-1.5 p-3 text-xs font-cute rounded-2xl border border-pastel-pink bg-[#FFFDF9]"
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
                    className="w-full mt-1.5 p-3 text-xs font-cute rounded-2xl border border-pastel-pink bg-[#FFFDF9]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-cute font-bold text-gray-700">Hidden Gift Message (Revealed when opened):</label>
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
                  className="w-full mt-1.5 p-4 text-base font-handwriting leading-relaxed rounded-2xl border border-pastel-pink bg-[#FFFDF9]"
                />
              </div>

              {/* Animated Box Preview */}
              <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-cute font-bold text-gray-800 block">Interactive Gift Box Preview:</span>
                  <span className="text-[11px] font-cute text-gray-500">The animated opening and confetti flourish remain 100% active.</span>
                </div>
                <GiftBox className="w-20 h-20" isOpen={false} />
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 9. SECRET FINAL SURPRISE */}
          {/* ======================================================== */}
          {activeSection === 'secret' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-pastel-pink/30 pb-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-6 h-6 text-pastel-pink-deep" />
                  <h2 className="text-2xl font-bold font-handwriting text-gray-800">
                    9. Secret Final Surprise Editor
                  </h2>
                </div>
                <WashiTape color="bg-pastel-pink/80" pattern="hearts" className="w-24 h-5 hidden sm:block" />
              </div>

              <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-200 text-xs font-cute text-purple-900 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>Protected Mechanism:</strong> This section is strictly locked on the public website until Vanshu has opened all 6 scrapbook cards. The unlocking trigger is safely preserved!
                </p>
              </div>

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
                    className="w-full mt-1.5 p-3 text-xs font-cute rounded-2xl border border-pastel-pink bg-[#FFFDF9]"
                  />
                </div>
                <div>
                  <label className="text-xs font-cute font-bold text-gray-700">Full Screen Modal Header:</label>
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
                    className="w-full mt-1.5 p-3 text-xs font-cute rounded-2xl border border-pastel-pink bg-[#FFFDF9]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-cute font-bold text-gray-700">Final Romantic Letter to Vanshu:</label>
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
                  className="w-full mt-1.5 p-4 text-base font-handwriting leading-relaxed rounded-2xl border border-pastel-pink bg-[#FFFDF9]"
                />
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 10. MUSIC SETTINGS */}
          {/* ======================================================== */}
          {activeSection === 'music' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-pastel-pink/30 pb-3">
                <div className="flex items-center gap-2">
                  <Music className="w-6 h-6 text-pastel-pink-deep" />
                  <h2 className="text-2xl font-bold font-handwriting text-gray-800">
                    10. Music Settings
                  </h2>
                </div>
                <WashiTape color="bg-pastel-lavender/80" pattern="dots" className="w-24 h-5 hidden sm:block" />
              </div>

              <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200 text-xs font-cute text-purple-900 space-y-1">
                <strong>Audio System:</strong>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  By default, an enchanting synthesized music-box romantic lullaby plays. You can upload your own MP3 song, which is stored in persistent cloud storage so Vanshu hears it on her phone!
                </p>
              </div>

              {/* Upload music file */}
              <div>
                <label className="text-xs font-cute font-bold text-gray-700 block mb-1">
                  Upload Background Audio (MP3 / Audio File):
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleMusicUpload}
                  className="w-full p-3 border-2 border-dashed border-pastel-pink rounded-2xl bg-white text-xs font-cute cursor-pointer"
                />
              </div>

              {/* Custom audio link & volume */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-cute font-bold text-gray-700">Audio URL or File Path:</label>
                  <input
                    type="text"
                    value={formData.musicSettings?.customAudioUrl?.startsWith('blob:') || formData.musicSettings?.customAudioUrl?.startsWith('data:') ? (formData.musicSettings?.title || 'Custom Uploaded Audio File ✓') : (formData.musicSettings?.customAudioUrl || '/music.mp3')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        musicSettings: { ...formData.musicSettings, customAudioUrl: e.target.value, title: e.target.value },
                      })
                    }
                    placeholder="/music.mp3 or https://.../song.mp3"
                    className="w-full mt-1 p-2.5 text-xs font-cute rounded-xl border border-pastel-pink bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-cute font-bold text-gray-700">Default Soft Volume ({Math.round((formData.musicSettings?.volume || 0.35) * 100)}%):</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={formData.musicSettings?.volume || 0.35}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        musicSettings: { ...formData.musicSettings, volume: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full mt-2 accent-pastel-pink"
                  />
                </div>
              </div>

              {/* Preview Audio Controls */}
              {formData.musicSettings?.customAudioUrl && (
                <div className="flex items-center gap-3 bg-pastel-pink-soft/40 p-3 rounded-2xl border border-pastel-pink/50">
                  <button
                    type="button"
                    onClick={toggleAudioPreview}
                    className="px-4 py-2 bg-pastel-pink-deep text-white rounded-full font-cute text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    {previewAudioPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{previewAudioPlaying ? 'Pause Audio Preview' : 'Preview Uploaded Music'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        musicSettings: { ...formData.musicSettings, customAudioUrl: '' },
                      });
                      playCutePop();
                    }}
                    className="text-xs font-cute text-red-500 hover:underline"
                  >
                    Remove Custom Audio (Revert to Music Box)
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* FULL PREVIEW MODAL */}
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        draftContent={formData}
        onPublishFromPreview={handlePublish}
      />
    </div>
  );
};

export default AdminDashboard;
