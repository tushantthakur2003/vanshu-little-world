import React from 'react';

export const BunnyFlower = ({ className = "w-44 h-44" }) => {
  return (
    <div className={`relative inline-block select-none ${className}`}>
      <svg
        viewBox="0 0 200 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md animate-float-slow"
      >
        <defs>
          <linearGradient id="bunnyFlowerGrad" x1="100" y1="50" x2="100" y2="190" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFDF9" />
            <stop offset="1" stopColor="#FDE2E4" />
          </linearGradient>
          <linearGradient id="flowerPetal" x1="130" y1="100" x2="150" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF" />
            <stop offset="1" stopColor="#FFE4E8" />
          </linearGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="100" cy="198" rx="55" ry="12" fill="#E8D7F1" opacity="0.6" />

        {/* Bunny Left Long Ear */}
        <ellipse cx="78" cy="50" rx="13" ry="40" fill="url(#bunnyFlowerGrad)" transform="rotate(-15 78 50)" />
        <ellipse cx="78" cy="52" rx="6" ry="28" fill="#FFA3B5" transform="rotate(-15 78 52)" />

        {/* Bunny Right Long Ear gently drooped / tilted cute */}
        <ellipse cx="124" cy="54" rx="13" ry="40" fill="url(#bunnyFlowerGrad)" transform="rotate(20 124 54)" />
        <ellipse cx="124" cy="56" rx="6" ry="28" fill="#FFA3B5" transform="rotate(20 124 56)" />

        {/* Chubby Body & Head */}
        <ellipse cx="98" cy="142" rx="54" ry="52" fill="url(#bunnyFlowerGrad)" />
        <ellipse cx="98" cy="106" rx="46" ry="40" fill="url(#bunnyFlowerGrad)" />

        {/* Gentle comforting smiling eyes */}
        <path d="M74 104 Q81 98 88 104" stroke="#4A3E3D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M110 104 Q117 98 124 104" stroke="#4A3E3D" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Pink cute nose & soft smile */}
        <path d="M96 112 Q99 115 102 112 Z" fill="#FF758F" />
        <path d="M99 114 Q95 119 92 117" stroke="#4A3E3D" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        <path d="M99 114 Q103 119 106 117" stroke="#4A3E3D" strokeWidth="1.6" strokeLinecap="round" fill="none" />

        {/* Rosy Blushing Cheeks */}
        <ellipse cx="70" cy="112" rx="8" ry="5.5" fill="#FFA3B5" opacity="0.85" />
        <ellipse cx="126" cy="112" rx="8" ry="5.5" fill="#FFA3B5" opacity="0.85" />

        {/* Daisy Flower Stem & Leaves */}
        <path d="M115 155 Q130 145 142 125" stroke="#70B083" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M125 145 Q135 148 138 142" stroke="#70B083" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Daisy Flower Blossom held outward */}
        <g transform="translate(142, 122)" className="animate-wiggle-gentle origin-center">
          {/* Flower Petals */}
          <circle cx="0" cy="-12" r="7" fill="url(#flowerPetal)" stroke="#FFB6C1" strokeWidth="0.8" />
          <circle cx="11" cy="-5" r="7" fill="url(#flowerPetal)" stroke="#FFB6C1" strokeWidth="0.8" />
          <circle cx="8" cy="9" r="7" fill="url(#flowerPetal)" stroke="#FFB6C1" strokeWidth="0.8" />
          <circle cx="-8" cy="9" r="7" fill="url(#flowerPetal)" stroke="#FFB6C1" strokeWidth="0.8" />
          <circle cx="-11" cy="-5" r="7" fill="url(#flowerPetal)" stroke="#FFB6C1" strokeWidth="0.8" />
          {/* Flower Center */}
          <circle cx="0" cy="0" r="7.5" fill="#FFD166" />
        </g>

        {/* Bunny Paws holding the stem */}
        <ellipse cx="106" cy="148" rx="8" ry="6" fill="#FFFDF9" stroke="#FFE4E8" strokeWidth="2" transform="rotate(-10 106 148)" />
        <ellipse cx="118" cy="146" rx="8" ry="6" fill="#FFFDF9" stroke="#FFE4E8" strokeWidth="2" transform="rotate(15 118 146)" />

        {/* Bunny Feet */}
        <ellipse cx="74" cy="186" rx="15" ry="9" fill="#FFFDF9" stroke="#FFE4E8" strokeWidth="2" />
        <ellipse cx="122" cy="186" rx="15" ry="9" fill="#FFFDF9" stroke="#FFE4E8" strokeWidth="2" />

        {/* Soft floating sparkle */}
        <g className="animate-sparkle">
          <path d="M48 68 Q50 63 56 61 Q50 59 48 54 Q46 59 40 61 Q46 63 48 68 Z" fill="#FFD166" />
        </g>
      </svg>
    </div>
  );
};
