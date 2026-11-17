// =====================================================================
// ADMIN AUTHENTICATION UTILITY
// =====================================================================
// Uses Web Crypto API (SHA-256) to verify passwords without exposing
// plaintext credentials in the source code.
//
// ⚠️ IMPORTANT SECURITY NOTE FOR PUBLIC DEPLOYMENTS:
// On static frontend hosting (Vercel, Netlify, GitHub Pages) without a backend,
// all client-side JavaScript can be inspected via browser DevTools.
// For true server-side security when deployed publicly:
// - Enable "Vercel Password Protection" (in Vercel Project Settings > Security)
// - Or use Netlify Identity / Basic Auth
// - Or deploy with a protected backend route.

const SALT = 'vanshu_world_scrapbook_secret_salt_';

// Default password hash for: "vanshu2024"
// (SHA-256 of SALT + "vanshu2024")
const DEFAULT_PASSWORD_HASH = '163bb40e0377c5eea184caa6e334b5d46fb96019251a6a92a137fc30530073de';

const AUTH_SESSION_KEY = 'vanshu_admin_session_active';
const CUSTOM_HASH_KEY = 'vanshu_admin_custom_hash';

// Compute SHA-256 hex string using standard browser Web Crypto
export const hashString = async (text) => {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    return '';
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(SALT + text);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

// Check if currently authenticated in this browser session
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(AUTH_SESSION_KEY) === 'true';
};

// Verify user password against stored hash
export const verifyPassword = async (inputPassword) => {
  try {
    const inputHash = await hashString(inputPassword.trim());
    const targetHash = localStorage.getItem(CUSTOM_HASH_KEY) || DEFAULT_PASSWORD_HASH;
    
    // Constant-time like comparison
    if (inputHash === targetHash) {
      sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
      return true;
    }
    return false;
  } catch (err) {
    console.error('Password verification error:', err);
    return false;
  }
};

// Update admin password
export const updatePassword = async (newPassword) => {
  const newHash = await hashString(newPassword.trim());
  localStorage.setItem(CUSTOM_HASH_KEY, newHash);
  return true;
};

// Logout
export const logout = () => {
  sessionStorage.removeItem(AUTH_SESSION_KEY);
};
