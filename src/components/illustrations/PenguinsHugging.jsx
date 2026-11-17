import React from 'react';

export const PenguinsHugging = ({ className = "w-48 h-48", isHugging = false }) => {
  return (
    <div className={`relative inline-block select-none ${className}`}>
      <svg
        viewBox="0 0 240 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full drop-shadow-md transition-transform duration-300 ${
          isHugging ? 'scale-110' : 'animate-float-slow'
        }`}
      >
        <defs>
          <linearGradient id="pBodyLeft" x1="75" y1="30" x2="75" y2="180" gradientUnits="userSpaceOnUse">
            <stop stopColor="#374151" />
            <stop offset="1" stopColor="#1F2937" />
          </linearGradient>
          <linearGradient id="pBodyRight" x1="165" y1="35" x2="165" y2="185" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4B5563" />
            <stop offset="1" stopColor="#374151" />
          </linearGradient>
          <linearGradient id="pBellyGrad" x1="120" y1="70" x2="120" y2="180" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFDF9" />
            <stop offset="1" stopColor="#F5EEFC" />
          </linearGradient>
        </defs>

        {/* Shadows under feet */}
        <ellipse cx="120" cy="198" rx="75" ry="14" fill="#E8D7F1" opacity="0.6" />

        {/* Feet */}
        <ellipse cx="65" cy="190" rx="14" ry="8" fill="#FFB088" />
        <ellipse cx="95" cy="190" rx="13" ry="8" fill="#FFB088" />
        <ellipse cx="145" cy="190" rx="13" ry="8" fill="#FFB088" />
        <ellipse cx="175" cy="190" rx="14" ry="8" fill="#FFB088" />

        {/* Left Penguin Body */}
        <ellipse cx="88" cy="120" rx="52" ry="68" fill="url(#pBodyLeft)" transform="rotate(8 88 120)" />

        {/* Right Penguin Body */}
        <ellipse cx="152" cy="120" rx="52" ry="68" fill="url(#pBodyRight)" transform="rotate(-8 152 120)" />

        {/* Left Penguin Belly */}
        <ellipse cx="98" cy="128" rx="36" ry="50" fill="url(#pBellyGrad)" transform="rotate(8 98 128)" />

        {/* Right Penguin Belly */}
        <ellipse cx="142" cy="128" rx="36" ry="50" fill="url(#pBellyGrad)" transform="rotate(-8 142 128)" />

        {/* Left Penguin Closed Happy Eyes (^_^) */}
        <path d="M72 82 Q80 75 88 82" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" fill="none" />
        {/* Right Penguin Closed Happy Eyes */}
        <path d="M152 82 Q160 75 168 82" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Squished Blushing Cheeks */}
        <circle cx="68" cy="92" r="8" fill="#FFA3B5" opacity="0.8" />
        <circle cx="118" cy="94" r="10" fill="#FF758F" opacity="0.85" />
        <circle cx="172" cy="92" r="8" fill="#FFA3B5" opacity="0.8" />

        {/* Cute Beaks touching */}
        <path d="M102 88 L114 92 L102 96 Z" fill="#FFA94D" />
        <path d="M138 88 L126 92 L138 96 Z" fill="#FFA94D" />

        {/* Bow on Left Penguin */}
        <g transform="translate(68, 52) rotate(-15)">
          <path d="M0 0 C-10 -10 -14 5 0 0 Z" fill="#FF758F" />
          <path d="M0 0 C10 -10 14 5 0 0 Z" fill="#FF758F" />
          <circle cx="0" cy="0" r="3" fill="#FF4D6D" />
        </g>

        {/* Penguin Hugging Flippers Wrapping Around Each Other! */}
        {/* Left arm wrapping across right penguin */}
        <path
          d="M70 120 C 85 140 140 145 160 130 C 158 122 135 125 100 115 Z"
          fill="#2B3441"
          stroke="#FFFDF9"
          strokeWidth="1.5"
          className="transition-all duration-300"
        />
        {/* Right arm wrapping across left penguin */}
        <path
          d="M170 120 C 155 140 100 145 80 130 C 82 122 105 125 140 115 Z"
          fill="#374151"
          stroke="#FFFDF9"
          strokeWidth="1.5"
          className="transition-all duration-300"
        />

        {/* Floating Heart between them */}
        <g className="animate-heartbeat-soft origin-center" style={{ transformOrigin: '120px 42px' }}>
          <path
            d="M120 48 C 108 34 94 48 102 58 C 108 66 120 74 120 74 C 120 74 132 66 138 58 C 146 48 132 34 120 48 Z"
            fill="#FF4D6D"
            stroke="#FFFFFF"
            strokeWidth="2"
          />
        </g>

        {/* Tiny Floating Hearts popping */}
        <g className="animate-float-reverse">
          <path d="M85 30 C 78 22 68 30 74 36 C 78 41 85 46 85 46 C 85 46 92 41 96 36 C 102 30 92 22 85 30 Z" fill="#FFA3B5" />
          <path d="M155 32 C 149 25 140 32 145 37 C 149 41 155 46 155 46 C 155 46 161 41 165 37 C 170 32 161 25 155 32 Z" fill="#FFA3B5" />
        </g>
      </svg>
    </div>
  );
};
