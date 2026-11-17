// =====================================================================
// PERSISTENT MEDIA STORAGE (IndexedDB for Photos & Audio)
// =====================================================================
// Provides reliable, high-capacity client-side storage for images and audio files
// without hitting localStorage's ~5MB limitation.
// For public deployment, assets placed in /public/ are bundled statically.

const DB_NAME = 'vanshu_little_world_db';
const STORE_NAME = 'photos';
const AUDIO_STORE_NAME = 'audio';
const DB_VERSION = 2;

let dbPromise = null;

const getDB = () => {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        return resolve(null);
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(AUDIO_STORE_NAME)) {
          db.createObjectStore(AUDIO_STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  return dbPromise;
};

// Store an image blob/dataUrl with an ID
export const saveImageToStorage = async (id, dataUrl, filename) => {
  try {
    const db = await getDB();
    if (!db) return false;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({ id, dataUrl, filename, updatedAt: Date.now() });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Error saving image to IndexedDB:', err);
    return false;
  }
};

// Retrieve an image by ID
export const getImageFromStorage = async (id) => {
  try {
    const db = await getDB();
    if (!db) return null;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result ? req.result.dataUrl : null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Error getting image from IndexedDB:', err);
    return null;
  }
};

// Retrieve all stored images
export const getAllImagesFromStorage = async () => {
  try {
    const db = await getDB();
    if (!db) return [];
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Error getting all images from IndexedDB:', err);
    return [];
  }
};

// Delete image by ID
export const deleteImageFromStorage = async (id) => {
  try {
    const db = await getDB();
    if (!db) return false;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Error deleting image from IndexedDB:', err);
    return false;
  }
};

// Store an audio file/blob in IndexedDB (handles large MP3 files without memory limits)
export const saveAudioToStorage = async (id, fileOrBlob, filename) => {
  try {
    const db = await getDB();
    if (!db) return false;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(AUDIO_STORE_NAME, 'readwrite');
      const store = tx.objectStore(AUDIO_STORE_NAME);
      store.put({ id, blob: fileOrBlob, filename, updatedAt: Date.now() });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Error saving audio to IndexedDB:', err);
    return false;
  }
};

// Retrieve an audio blob by ID
export const getAudioFromStorage = async (id) => {
  try {
    const db = await getDB();
    if (!db) return null;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(AUDIO_STORE_NAME, 'readonly');
      const store = tx.objectStore(AUDIO_STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result ? req.result.blob : null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Error getting audio from IndexedDB:', err);
    return null;
  }
};

// Delete audio from IndexedDB
export const deleteAudioFromStorage = async (id) => {
  try {
    const db = await getDB();
    if (!db) return false;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(AUDIO_STORE_NAME, 'readwrite');
      const store = tx.objectStore(AUDIO_STORE_NAME);
      store.delete(id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Error deleting audio from IndexedDB:', err);
    return false;
  }
};
