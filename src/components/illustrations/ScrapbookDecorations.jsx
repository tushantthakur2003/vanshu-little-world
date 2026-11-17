import React from 'react';

// Decorative Washi Tape Strips
export const WashiTape = ({
  color = "bg-pastel-pink/70",
  pattern = "dots",
  className = "w-28 h-6",
  angle = "-rotate-2"
}) => {
  return (
    <div
      className={`relative inline-block ${className} ${angle} backdrop-blur-[1px] shadow-sm select-none pointer-events-none z-10`}
      style={{
        clipPath: 'polygon(0% 0%, 97% 1%, 100% 97%, 3% 100%, 0% 0%)',
      }}
    >
      <div className={`w-full h-full ${color} flex items-center justify-center opacity-85 border-y border-white/40`}>
        {pattern === 'dots' && (
          <div className="w-full h-full opacity-30 flex justify-around items-center px-2">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
            ))}
          </div>
        )}
        {pattern === 'stripes' && (
          <div className="w-full h-full opacity-25 bg-[repeating-linear-gradient(45deg,#fff,#fff_4px,transparent_4px,transparent_8px)]" />
        )}
        {pattern === 'hearts' && (
          <div className="w-full h-full opacity-40 flex justify-around items-center px-1 text-[9px] text-white">
            <span>♡</span>
            <span>♡</span>
            <span>♡</span>
            <span>♡</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Cute Decorative Postage Stamp
export const PostageStamp = ({ label = "LOVE", postmark = "VANSHU", className = "w-16 h-20" }) => {
  return (
    <div className={`relative ${className} bg-[#FFFDF9] p-1.5 rounded-sm shadow-md border border-dashed border-pastel-pink/80 select-none`}>
      <div className="w-full h-full bg-pastel-pink-soft/60 rounded flex flex-col items-center justify-between p-1 border border-pastel-pink/30">
        <span className="text-[8px] font-bold tracking-widest text-pastel-pink-deep uppercase font-cute">{label}</span>
        <div className="text-xl">💌</div>
        <span className="text-[7px] text-gray-400 font-mono tracking-tighter">{postmark}</span>
      </div>
      {/* Stamp jagged edges illusion */}
      <div className="absolute -top-1 left-2 text-pastel-pink-deep text-[10px] font-mono">〰️</div>
    </div>
  );
};

// Cute Satin Bow SVG
export const PinkBow = ({ className = "w-8 h-8" }) => {
  return (
    <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={`inline-block ${className}`}>
      {/* Left loop */}
      <path d="M50 40 C10 10 0 60 50 42 Z" fill="#FF758F" />
      <path d="M48 40 C20 18 12 50 48 42 Z" fill="#FFA3B5" />
      {/* Right loop */}
      <path d="M50 40 C90 10 100 60 50 42 Z" fill="#FF758F" />
      <path d="M52 40 C80 18 88 50 52 42 Z" fill="#FFA3B5" />
      {/* Center knot */}
      <ellipse cx="50" cy="40" rx="9" ry="8" fill="#FF4D6D" stroke="#FFF" strokeWidth="1.5" />
      {/* Ribbon tails */}
      <path d="M46 46 C35 62 25 72 15 78 C25 72 32 74 38 75 C44 65 47 52 49 46 Z" fill="#FF758F" />
      <path d="M54 46 C65 62 75 72 85 78 C75 72 68 74 62 75 C56 65 53 52 51 46 Z" fill="#FF758F" />
    </svg>
  );
};

// Cute Paper Clip
export const PaperClip = ({ className = "w-6 h-12" }) => {
  return (
    <svg viewBox="0 0 30 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={`inline-block ${className} drop-shadow-sm`}>
      <path
        d="M10 20 L10 45 C10 52 20 52 20 45 L20 10 C20 3 5 3 5 15 L5 48 C5 58 25 58 25 45 L25 22"
        stroke="#FFB6C1"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};
