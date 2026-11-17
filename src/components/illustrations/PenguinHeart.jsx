import React from 'react';

export const PenguinHeart = ({ className = "w-44 h-44", animated = true }) => {
  return (
    <div className={`relative inline-block select-none ${className}`}>
      <svg
        viewBox="0 0 200 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full drop-shadow-md ${animated ? 'animate-float-slow' : ''}`}
      >
        <defs>
          <linearGradient id="bodyGrad" x1="100" y1="20" x2="100" y2="190" gradientUnits="userSpaceOnUse">
            <stop stopColor="#374151" />
            <stop offset="1" stopColor="#1F2937" />
          </linearGradient>
          <linearGradient id="bellyGrad" x1="100" y1="70" x2="100" y2="185" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFDF9" />
            <stop offset="1" stopColor="#F5F3FF" />
          </linearGradient>
          <linearGradient id="heartGrad" x1="100" y1="105" x2="100" y2="155" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF758F" />
            <stop offset="1" stopColor="#FF4D6D" />
          </linearGradient>
          <filter id="blushFilter" x="0" y="0" width="200" height="200" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Shadow */}
        <ellipse cx="100" cy="198" rx="55" ry="12" fill="#E8D7F1" opacity="0.6" />

        {/* Feet */}
        <ellipse cx="78" cy="190" rx="16" ry="9" fill="#FFB088" />
        <ellipse cx="122" cy="190" rx="16" ry="9" fill="#FFB088" />

        {/* Chubby Body */}
        <ellipse cx="100" cy="115" rx="65" ry="78" fill="url(#bodyGrad)" />

        {/* Little Flippers / Wings */}
        <path d="M40 100 C 25 115 22 135 34 150 C 38 140 45 130 52 120 Z" fill="#2B3441" />
        <path d="M160 100 C 175 115 178 135 166 150 C 162 140 155 130 148 120 Z" fill="#2B3441" />

        {/* White Chubby Belly */}
        <ellipse cx="100" cy="125" rx="46" ry="58" fill="url(#bellyGrad)" />

        {/* Kawaii Eyes */}
        <ellipse cx="80" cy="85" rx="6" ry="8" fill="#1F2937" />
        <circle cx="78" cy="82" r="2.5" fill="#FFFFFF" />
        <circle cx="82" cy="88" r="1.2" fill="#FFFFFF" />

        <ellipse cx="120" cy="85" rx="6" ry="8" fill="#1F2937" />
        <circle cx="118" cy="82" r="2.5" fill="#FFFFFF" />
        <circle cx="122" cy="88" r="1.2" fill="#FFFFFF" />

        {/* Blushing Cheeks */}
        <circle cx="68" cy="98" r="8" fill="#FFA3B5" opacity="0.75" />
        <circle cx="132" cy="98" r="8" fill="#FFA3B5" opacity="0.75" />

        {/* Orange Beak */}
        <path d="M94 92 C94 92 100 102 106 92 C103 89 97 89 94 92 Z" fill="#FFA94D" />

        {/* Pink Bow on Head */}
        <g transform="translate(112, 42) rotate(15)">
          <path d="M0 0 C-12 -12 -16 6 0 0 Z" fill="#FF758F" />
          <path d="M0 0 C12 -12 16 6 0 0 Z" fill="#FF758F" />
          <circle cx="0" cy="0" r="3.5" fill="#FF4D6D" />
          {/* Bow tails */}
          <path d="M-2 2 L-6 12 L-1 10 L-2 2 Z" fill="#FF758F" />
          <path d="M2 2 L6 12 L1 10 L2 2 Z" fill="#FF758F" />
        </g>

        {/* Big Pink Heart held with paws */}
        <g className="animate-heartbeat-soft origin-center" style={{ transformOrigin: '100px 135px' }}>
          <path
            d="M100 155 C 80 140 60 120 72 105 C 82 93 96 100 100 108 C 104 100 118 93 128 105 C 140 120 120 140 100 155 Z"
            fill="url(#heartGrad)"
            stroke="#FFFFFF"
            strokeWidth="2.5"
          />
          {/* Heart highlight shine */}
          <ellipse cx="85" cy="110" rx="3.5" ry="6" fill="#FFFFFF" opacity="0.65" transform="rotate(-30 85 110)" />

          {/* Little penguin paws holding the heart */}
          <ellipse cx="68" cy="125" rx="7" ry="5" fill="#2B3441" transform="rotate(20 68 125)" />
          <ellipse cx="132" cy="125" rx="7" ry="5" fill="#2B3441" transform="rotate(-20 132 125)" />
        </g>

        {/* Tiny Sparkles around */}
        <g className="animate-sparkle">
          <path d="M42 50 Q45 42 53 40 Q45 38 42 30 Q39 38 31 40 Q39 42 42 50 Z" fill="#FFD166" />
        </g>
        <g className="animate-sparkle" style={{ animationDelay: '0.9s' }}>
          <path d="M165 70 Q167 64 173 62 Q167 60 165 54 Q163 60 157 62 Q163 64 165 70 Z" fill="#FFA3B5" />
        </g>
      </svg>
    </div>
  );
};
