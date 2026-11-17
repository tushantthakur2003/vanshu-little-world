import React, { useState } from 'react';
import { Lock, Unlock, ArrowLeft, AlertTriangle, Sparkles, Cloud, ShieldCheck } from 'lucide-react';
import { loginAdmin } from '../../services/contentService';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import { WashiTape, PinkBow } from '../illustrations/ScrapbookDecorations';
import { playCutePop, playChime } from '../../utils/soundEffects';

export const AdminLogin = ({ onLoginSuccess, onNavigateHome }) => {
  const [emailOrPassword, setEmailOrPassword] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isCloud = isSupabaseConfigured();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await loginAdmin(emailOrPassword, password);
      if (res.success) {
        playChime();
        onLoginSuccess();
      } else {
        playCutePop();
        setErrorMsg(res.error || 'Authentication failed. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Error authenticating. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pastel-pink-soft via-pastel-cream-soft to-pastel-lavender-soft">
      <div className="relative max-w-md w-full bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-scrapbook border-2 border-pastel-pink/60 flex flex-col items-center text-center">
        {/* Top Washi Tape */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <WashiTape color="bg-pastel-pink/90" pattern="hearts" angle="-rotate-1" />
        </div>

        <PinkBow className="w-8 h-8 mb-2" />

        <div className="w-14 h-14 rounded-full bg-pastel-pink-soft text-pastel-pink-deep flex items-center justify-center mb-2 shadow-inner">
          <Lock className="w-7 h-7" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold font-handwriting text-gray-800">
          Content Studio Login
        </h1>
        <p className="text-xs font-cute text-gray-500 mt-1 mb-6">
          Private dashboard to manage Vanshu's Little World ♡
        </p>

        {/* Cloud Connection Badge */}
        <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-cute font-semibold border bg-purple-50/70 border-purple-200 text-purple-700">
          {isCloud ? (
            <>
              <Cloud className="w-3.5 h-3.5 text-purple-500" />
              <span>Supabase Cloud Connected</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-pastel-pink-deep" />
              <span>Secure Local CMS Mode Active</span>
            </>
          )}
        </div>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-3 text-left">
          {isCloud ? (
            <>
              <div>
                <label className="text-xs font-cute text-gray-700 font-bold">Admin Email:</label>
                <input
                  type="email"
                  required
                  placeholder="admin@example.com"
                  value={emailOrPassword}
                  onChange={(e) => setEmailOrPassword(e.target.value)}
                  className="w-full mt-1 p-3 rounded-xl border border-pastel-pink text-sm font-cute focus:outline-none focus:ring-2 focus:ring-pastel-pink"
                />
              </div>
              <div>
                <label className="text-xs font-cute text-gray-700 font-bold">Password:</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 p-3 rounded-xl border border-pastel-pink text-sm font-cute focus:outline-none focus:ring-2 focus:ring-pastel-pink"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="text-xs font-cute text-gray-700 font-bold">Studio Master Password:</label>
              <input
                type="password"
                required
                placeholder="Enter password..."
                value={emailOrPassword}
                onChange={(e) => setEmailOrPassword(e.target.value)}
                className="w-full mt-1 p-3 rounded-xl border border-pastel-pink text-sm font-cute focus:outline-none focus:ring-2 focus:ring-pastel-pink"
              />
              <span className="text-[10px] font-cute text-gray-400 mt-1 block">
                Initial password: <code className="bg-pastel-pink-soft px-1.5 py-0.5 rounded font-bold text-pastel-pink-deep">vanshu2024</code>
              </span>
            </div>
          )}

          {errorMsg && (
            <p className="text-xs font-cute text-red-600 font-semibold bg-red-50 p-2.5 rounded-xl border border-red-200">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 bg-gradient-to-r from-pastel-pink to-pastel-pink-deep hover:from-pink-500 hover:to-pastel-pink-deep text-white rounded-full font-cute font-bold text-sm shadow hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Unlock className="w-4 h-4" />
            <span>{isLoading ? 'Verifying...' : 'Unlock Content Studio'}</span>
          </button>
        </form>

        {/* Security Note */}
        <div className="mt-6 p-3 bg-amber-50/80 rounded-2xl border border-amber-200 text-left flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] font-cute text-amber-800 leading-relaxed">
            <strong>Private Access:</strong> This Content Studio is strictly hidden from the public website. Only you can enter and manage messages, memories, and surprises.
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
};
