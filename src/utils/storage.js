// LocalStorage management for Vanshu's Little World 🎀
const STORAGE_PREFIX = 'vanshu_little_world_';

export const loadStoredData = (key, fallback) => {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key) || localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Error loading key ${key} from localStorage:`, err);
    return fallback;
  }
};

export const saveStoredData = (key, data) => {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Error saving key ${key} to localStorage:`, err);
  }
};

export const clearStoredData = (key) => {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key);
  } catch (err) {
    console.warn(`Error clearing key ${key}:`, err);
  }
};
