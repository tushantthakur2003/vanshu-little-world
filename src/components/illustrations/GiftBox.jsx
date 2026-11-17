import React from 'react';

export const GiftBox = ({ className = "w-44 h-44", isOpen = false }) => {
  return (
    <div className={`relative inline-block select-none ${className}`}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="boxGrad" x1="100" y1="90" x2="100" y2="180" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFCCD5" />
            <stop offset="1" stopColor="#FFB3C1" />
          </linearGradient>
          <linearGradient id="lidGrad" x1="100" y1="65" x2="100" y2="95" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFA3B5" />
            <stop offset="1" stopColor="#FF758F" />
          </linearGradient>
          <linearGradient id="ribbonGrad" x1="100" y1="50" x2="100" y2="180" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFDF9" />
            <stop offset="1" stopColor="#FFE4E8" />
          </linearGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="100" cy="184" rx="55" ry="10" fill="#E8D7F1" opacity="0.6" />

        {/* Box Body */}
        <rect x="45" y="90" width="110" height="85" rx="10" fill="url(#boxGrad)" stroke="#FF8FA3" strokeWidth="2" />

        {/* Vertical Ribbon on Box */}
        <rect x="88" y="90" width="24" height="85" fill="url(#ribbonGrad)" stroke="#FFA3B5" strokeWidth="1" />

        {/* Floating elements when open */}
        {isOpen && (
          <g className="animate-float-slow">
            {/* Surprise big glowing heart popping out of box */}
            <path
              d="M100 65 C85 45 60 58 70 76 C80 90 100 105 100 105 C100 105 120 90 130 76 C140 58 115 45 100 65 Z"
              fill="#FF4D6D"
              stroke="#FFF"
              strokeWidth="2"
              className="animate-heartbeat-soft origin-center"
              style={{ transformOrigin: '100px 75px' }}
            />
            {/* Sparkles around popped heart */}
            <path d="M60 40 Q62 34 68 32 Q62 30 60 24 Q58 30 52 32 Q58 34 60 40 Z" fill="#FFD166" className="animate-sparkle" />
            <path d="M140 45 Q142 39 148 37 Q142 35 140 29 Q138 35 132 37 Q138 39 140 45 Z" fill="#FFD166" className="animate-sparkle" style={{ animationDelay: '0.6s' }} />
          </g>
        )}

        {/* Lid (Slides up and tilts when opened!) */}
        <g
          className={`transition-all duration-700 transform origin-top-left ${
            isOpen ? '-translate-y-14 -rotate-12 opacity-95' : 'translate-y-0 rotate-0'
          }`}
        >
          {/* Lid Box */}
          <rect x="38" y="70" width="124" height="25" rx="6" fill="url(#lidGrad)" stroke="#FF5376" strokeWidth="2" />
          {/* Lid Vertical Ribbon */}
          <rect x="88" y="70" width="24" height="25" fill="url(#ribbonGrad)" stroke="#FFA3B5" strokeWidth="1" />

          {/* Big Satin Ribbon Bow on Top */}
          <g transform="translate(100, 70)">
            {/* Left Bow Loop */}
            <path
              d="M0 0 C -30 -25 -40 5 -5 -3 Z"
              fill="#FFFDF9"
              stroke="#FF8FA3"
              strokeWidth="1.8"
            />
            {/* Right Bow Loop */}
            <path
              d="M0 0 C 30 -25 40 5 5 -3 Z"
              fill="#FFFDF9"
              stroke="#FF8FA3"
              strokeWidth="1.8"
            />
            {/* Ribbon Knot */}
            <circle cx="0" cy="-2" r="7" fill="#FF4D6D" stroke="#FFF" strokeWidth="1.5" />
            {/* Ribbon Tails hanging down */}
            <path d="M-4 3 C-12 16 -18 24 -24 32 C-20 30 -14 31 -10 32 C-6 24 -3 14 -1 4 Z" fill="#FFFDF9" stroke="#FFA3B5" strokeWidth="1" />
            <path d="M4 3 C12 16 18 24 24 32 C20 30 14 31 10 32 C6 24 3 14 1 4 Z" fill="#FFFDF9" stroke="#FFA3B5" strokeWidth="1" />
          </g>
        </g>
      </svg>
    </div>
  );
};
