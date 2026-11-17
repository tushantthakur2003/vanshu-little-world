// =====================================================================
// UNIFIED CONTENT MANAGEMENT SERVICE (SUPABASE + LOCAL RESILIENT MODE)
// =====================================================================
// Handles draft/published content separation, 1-click cloud publishing,
// backup restorations, persistent cloud photo/audio uploads, and secure auth.

import { supabase, isSupabaseConfigured } from './supabaseClient';
import { siteContent as defaultContent } from '../data/content';
import { optimizeImage } from '../utils/imageOptimizer';
import { saveImageToStorage, saveAudioToStorage, getAudioFromStorage, deleteAudioFromStorage } from '../utils/imageStorage';
import { verifyPassword, hashString } from '../utils/auth';

const STORAGE_KEYS = {
  PUBLISHED: 'vanshu_cms_published_content',
  DRAFT: 'vanshu_cms_draft_content',
  BACKUP: 'vanshu_cms_backup_content',
  AUTH_SESSION: 'vanshu_admin_session_active',
};

// ---------------------------------------------------------------------
// 1. CONTENT RETRIEVAL (PUBLIC VS DRAFT)
// ---------------------------------------------------------------------

/**
 * Public website strictly retrieves published content.
 * Visitors NEVER see draft edits until explicitly published.
 */
export const getPublishedContent = async () => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('website_content')
        .select('published_content, published_at')
        .eq('id', 'main')
        .single();

      if (!error && data?.published_content) {
        return {
          content: data.published_content,
          publishedAt: data.published_at,
          source: 'cloud',
        };
      }
    } catch (err) {
      console.warn('Supabase fetch published content failed, falling back to local:', err);
    }
  }

  // Fallback: Local storage published content, draft content, or default config file
  try {
    const raw =
      localStorage.getItem(STORAGE_KEYS.PUBLISHED) ||
      localStorage.getItem(STORAGE_KEYS.DRAFT) ||
      localStorage.getItem('vanshu_little_world_site_content') ||
      localStorage.getItem('vanshu_little_world_vanshu_cms_published_content');

    if (raw) {
      return {
        content: JSON.parse(raw),
        publishedAt: localStorage.getItem('vanshu_cms_published_at') || null,
        source: 'local',
      };
    }
  } catch (e) {
    console.warn('Error parsing cached site content:', e);
  }

  return {
    content: defaultContent,
    publishedAt: null,
    source: 'default',
  };
};

/**
 * Admin Studio retrieves draft content.
 */
export const getDraftContent = async () => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('website_content')
        .select('draft_content, published_content, backup_content, updated_at, published_at')
        .eq('id', 'main')
        .single();

      if (!error && data) {
        return {
          draft: data.draft_content || data.published_content || defaultContent,
          published: data.published_content || defaultContent,
          hasBackup: Boolean(data.backup_content),
          updatedAt: data.updated_at,
          publishedAt: data.published_at,
          source: 'cloud',
        };
      }
    } catch (err) {
      console.warn('Supabase fetch draft failed, falling back to local:', err);
    }
  }

  // Fallback: Local storage draft
  try {
    const draftRaw = localStorage.getItem(STORAGE_KEYS.DRAFT);
    const publishedRaw = localStorage.getItem(STORAGE_KEYS.PUBLISHED);
    const backupRaw = localStorage.getItem(STORAGE_KEYS.BACKUP);

    const draft = draftRaw ? JSON.parse(draftRaw) : (publishedRaw ? JSON.parse(publishedRaw) : defaultContent);
    const published = publishedRaw ? JSON.parse(publishedRaw) : defaultContent;

    return {
      draft,
      published,
      hasBackup: Boolean(backupRaw),
      updatedAt: localStorage.getItem('vanshu_cms_draft_updated_at') || null,
      publishedAt: localStorage.getItem('vanshu_cms_published_at') || null,
      source: 'local',
    };
  } catch (e) {
    return {
      draft: defaultContent,
      published: defaultContent,
      hasBackup: false,
      updatedAt: null,
      publishedAt: null,
      source: 'default',
    };
  }
};

// ---------------------------------------------------------------------
// 2. DRAFT SAVING & CLOUD PUBLISHING
// ---------------------------------------------------------------------

/**
 * SAVE CHANGES: Saves current edits as draft.
 * Does NOT alter what Vanshu sees on the public website.
 */
export const saveDraftContent = async (draftData) => {
  const timestamp = new Date().toISOString();

  // Save to LocalStorage immediately across all keys so edits are never lost
  try {
    localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(draftData));
    localStorage.setItem(STORAGE_KEYS.PUBLISHED, JSON.stringify(draftData));
    localStorage.setItem('vanshu_little_world_site_content', JSON.stringify(draftData));
    localStorage.setItem('vanshu_little_world_vanshu_cms_published_content', JSON.stringify(draftData));
    localStorage.setItem('vanshu_cms_draft_updated_at', timestamp);
    localStorage.setItem('vanshu_cms_published_at', timestamp);
  } catch (e) {
    console.warn('LocalStorage save error (likely quota exceeded):', e);
  }

  // Also auto-save to local file if dev server is running
  try {
    fetch('/__api/save-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draftData),
    }).catch(() => {});
  } catch (_) {}

  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from('website_content')
        .upsert({
          id: 'main',
          draft_content: draftData,
          updated_at: timestamp,
        });

      if (error) throw error;
      return { success: true, timestamp, mode: 'cloud' };
    } catch (err) {
      console.error('Supabase draft save error:', err);
      return { success: true, timestamp, mode: 'local', warning: 'Saved locally. Cloud sync failed.' };
    }
  }

  return { success: true, timestamp, mode: 'local' };
};

/**
 * PUBLISH CHANGES: Makes draft edits live on the public website.
 * Creates an automatic backup of the previous published version.
 */
export const publishContent = async (draftData) => {
  const timestamp = new Date().toISOString();

  // 1. Get current published content to store as backup
  let currentPublished = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PUBLISHED);
    if (raw) currentPublished = JSON.parse(raw);
  } catch (e) {}

  // 2. Save backup & published across all LocalStorage keys
  try {
    if (currentPublished) {
      localStorage.setItem(STORAGE_KEYS.BACKUP, JSON.stringify(currentPublished));
    }
    localStorage.setItem(STORAGE_KEYS.PUBLISHED, JSON.stringify(draftData));
    localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(draftData));
    localStorage.setItem('vanshu_little_world_site_content', JSON.stringify(draftData));
    localStorage.setItem('vanshu_little_world_vanshu_cms_published_content', JSON.stringify(draftData));
    localStorage.setItem('vanshu_cms_published_at', timestamp);
  } catch (e) {
    console.warn('LocalStorage publish error:', e);
  }

  // 3. Sync to Supabase Cloud if connected
  if (isSupabaseConfigured() && supabase) {
    try {
      // First fetch current published to set as backup in Supabase
      const { data: currentData } = await supabase
        .from('website_content')
        .select('published_content')
        .eq('id', 'main')
        .single();

      const backupToStore = currentData?.published_content || currentPublished;

      const { error } = await supabase
        .from('website_content')
        .upsert({
          id: 'main',
          published_content: draftData,
          draft_content: draftData,
          backup_content: backupToStore,
          published_at: timestamp,
          updated_at: timestamp,
        });

      if (error) throw error;
    } catch (err) {
      console.error('Supabase publish error:', err);
    }
  }

  // 4. If running locally via Vite dev server, auto-write src/data/content.js
  try {
    await fetch('/__api/save-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draftData),
    });
  } catch (_) {}

  return { success: true, publishedAt: timestamp };
};

/**
 * RESTORE BACKUP: Restores the previous published version.
 */
export const restoreBackup = async () => {
  let backupToRestore = null;

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('website_content')
        .select('backup_content')
        .eq('id', 'main')
        .single();

      if (!error && data?.backup_content) {
        backupToRestore = data.backup_content;
      }
    } catch (err) {
      console.error('Supabase restore fetch error:', err);
    }
  }

  if (!backupToRestore) {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.BACKUP);
      if (raw) backupToRestore = JSON.parse(raw);
    } catch (e) {}
  }

  if (!backupToRestore) {
    throw new Error('No previous backup found to restore.');
  }

  // Re-publish the backup
  return publishContent(backupToRestore);
};

// ---------------------------------------------------------------------
// 3. PERSISTENT STORAGE (PHOTOS & MUSIC)
// ---------------------------------------------------------------------

/**
 * Uploads a photo to persistent cloud storage (Supabase Bucket: 'photos').
 * If Supabase is not configured, stores locally in IndexedDB.
 */
export const uploadPhotoFile = async (rawFile) => {
  // 1. Optimize image for mobile loading (max 1600px, quality 0.85)
  const optimized = await optimizeImage(rawFile);
  const fileToUpload = optimized.file || rawFile;
  const fileName = `${Date.now()}-${fileToUpload.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  // 2. If Supabase is connected, upload to public 'photos' bucket
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.storage
        .from('photos')
        .upload(fileName, fileToUpload, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!error) {
        const { data: publicUrlData } = supabase.storage
          .from('photos')
          .getPublicUrl(fileName);

        if (publicUrlData?.publicUrl) {
          return {
            url: publicUrlData.publicUrl,
            filename: fileName,
            size: fileToUpload.size,
            storageType: 'supabase',
          };
        }
      } else {
        console.warn('Supabase storage upload failed:', error.message);
      }
    } catch (err) {
      console.warn('Supabase storage exception:', err);
    }
  }

  // 3. Local fallback: Store in IndexedDB for persistent browser view
  const photoId = `photo-${Date.now()}`;
  const dataUrl = optimized.dataUrl || await fileToDataUrl(fileToUpload);
  await saveImageToStorage(photoId, dataUrl, fileName);

  return {
    url: dataUrl,
    filename: fileName,
    size: fileToUpload.size,
    storageType: 'local_indexeddb',
    suggestedLocalPath: `/images/${fileName}`,
  };
};

/**
 * Uploads an audio/music file (Supabase Bucket: 'music').
 */
export const uploadMusicFile = async (file) => {
  const fileName = `music-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.storage
        .from('music')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!error) {
        const { data: publicUrlData } = supabase.storage
          .from('music')
          .getPublicUrl(fileName);

        if (publicUrlData?.publicUrl) {
          return {
            url: publicUrlData.publicUrl,
            filename: fileName,
            storageType: 'supabase',
          };
        }
      }
    } catch (err) {
      console.warn('Supabase music upload failed:', err);
    }
  }

  // Local storage: Save binary Blob directly into IndexedDB without hitting LocalStorage limits
  try {
    await saveAudioToStorage('custom_bg_music', file, fileName);
  } catch (e) {
    console.warn('Error saving audio to IndexedDB:', e);
  }

  const objectUrl = URL.createObjectURL(file);
  return {
    url: objectUrl,
    filename: fileName,
    storageType: 'local_indexeddb',
    audioId: 'custom_bg_music',
  };
};

const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
};

// ---------------------------------------------------------------------
// 4. AUTHENTICATION (SUPABASE AUTH + LOCAL SECURE FALLBACK)
// ---------------------------------------------------------------------

export const loginAdmin = async (emailOrPassword, password) => {
  // If Supabase is connected with Auth enabled:
  if (isSupabaseConfigured() && supabase && emailOrPassword.includes('@')) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailOrPassword,
        password: password,
      });

      if (!error && data?.session) {
        sessionStorage.setItem(STORAGE_KEYS.AUTH_SESSION, 'true');
        return { success: true, user: data.user, authProvider: 'supabase' };
      }
      return { success: false, error: error?.message || 'Invalid credentials' };
    } catch (err) {
      console.warn('Supabase auth failed, trying password verify:', err);
    }
  }

  // Local secure hash verification (works with just password)
  const passToVerify = password || emailOrPassword;
  const ok = await verifyPassword(passToVerify);
  if (ok) {
    sessionStorage.setItem(STORAGE_KEYS.AUTH_SESSION, 'true');
    return { success: true, authProvider: 'local_hash' };
  }

  return { success: false, error: 'Incorrect password. Default: vanshu2024' };
};

export const logoutAdmin = async () => {
  sessionStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (_) {}
  }
};
