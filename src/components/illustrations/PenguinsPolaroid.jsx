import React from 'react';

export const PenguinsPolaroid = ({ className = "w-48 h-48" }) => {
  return (
    <div className={`relative inline-block select-none ${className}`}>
      <svg
        viewBox="0 0 240 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md animate-float-slow"
      >
        <defs>
          <linearGradient id="polaroidBodyLeft" x1="60" y1="50" x2="60" y2="180" gradientUnits="userSpaceOnUse">
            <stop stopColor="#374151" />
            <stop offset="1" stopColor="#1F2937" />
          </linearGradient>
          <linearGradient id="polaroidBodyRight" x1="180" y1="50" x2="180" y2="180" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4B5563" />
            <stop offset="1" stopColor="#374151" />
          </linearGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="120" cy="198" rx="80" ry="12" fill="#E8D7F1" opacity="0.6" />

        {/* Left Penguin */}
        <ellipse cx="64" cy="120" rx="38" ry="52" fill="url(#polaroidBodyLeft)" />
        <ellipse cx="68" cy="125" rx="26" ry="36" fill="#FFFDF9" />
        <ellipse cx="54" cy="100" rx="4.5" ry="6" fill="#1F2937" />
        <circle cx="53" cy="98" r="1.8" fill="#FFFFFF" />
        <ellipse cx="74" cy="100" rx="4.5" ry="6" fill="#1F2937" />
        <circle cx="73" cy="98" r="1.8" fill="#FFFFFF" />
        <path d="M61 106 L67 106 L64 111 Z" fill="#FFA94D" />
        <circle cx="48" cy="108" r="5" fill="#FFA3B5" opacity="0.8" />
        <circle cx="80" cy="108" r="5" fill="#FFA3B5" opacity="0.8" />
        <ellipse cx="52" cy="172" rx="11" ry="6" fill="#FFB088" />
        <ellipse cx="76" cy="172" rx="11" ry="6" fill="#FFB088" />

        {/* Right Penguin */}
        <ellipse cx="176" cy="120" rx="38" ry="52" fill="url(#polaroidBodyRight)" />
        <ellipse cx="172" cy="125" rx="26" ry="36" fill="#FFFDF9" />
        <ellipse cx="166" cy="100" rx="4.5" ry="6" fill="#1F2937" />
        <circle cx="165" cy="98" r="1.8" fill="#FFFFFF" />
        <ellipse cx="186" cy="100" rx="4.5" ry="6" fill="#1F2937" />
        <circle cx="185" cy="98" r="1.8" fill="#FFFFFF" />
        <path d="M173 106 L179 106 L176 111 Z" fill="#FFA94D" />
        <circle cx="160" cy="108" r="5" fill="#FFA3B5" opacity="0.8" />
        <circle cx="192" cy="108" r="5" fill="#FFA3B5" opacity="0.8" />
        <ellipse cx="164" cy="172" rx="11" ry="6" fill="#FFB088" />
        <ellipse cx="188" cy="172" rx="11" ry="6" fill="#FFB088" />

        {/* Cute Bow on Left Penguin */}
        <g transform="translate(50, 68) rotate(-15)">
          <path d="M0 0 C-8 -8 -10 4 0 0 Z" fill="#FF758F" />
          <path d="M0 0 C8 -8 10 4 0 0 Z" fill="#FF758F" />
          <circle cx="0" cy="0" r="2.5" fill="#FF4D6D" />
        </g>

        {/* Held Polaroid Frame between them */}
        <g transform="translate(85, 68) rotate(-4)">
          {/* Polaroid Border */}
          <rect x="0" y="0" width="70" height="85" rx="3" fill="#FFFDF9" stroke="#E2E8F0" strokeWidth="1" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.08))" />
          {/* Polaroid Picture area */}
          <rect x="6" y="6" width="58" height="56" rx="2" fill="#FFE4E8" />
          {/* Mini heart inside photo */}
          <path d="M35 34 C30 26 22 32 26 38 C30 43 35 48 35 48 C35 48 40 43 44 38 C48 32 40 26 35 34 Z" fill="#FF758F" />
          {/* Handdrawn caption lines on polaroid bottom */}
          <line x1="16" y1="72" x2="54" y2="72" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
          {/* Cute washi tape on top of polaroid */}
          <rect x="22" y="-5" width="26" height="10" fill="#B388EB" opacity="0.6" transform="rotate(3 35 0)" />
        </g>

        {/* Flippers holding the polaroid */}
        <ellipse cx="88" cy="115" rx="8" ry="5" fill="#2B3441" transform="rotate(25 88 115)" />
        <ellipse cx="152" cy="115" rx="8" ry="5" fill="#374151" transform="rotate(-25 152 115)" />

        {/* Flash camera sparkle */}
        <g className="animate-sparkle">
          <path d="M120 40 Q122 34 128 32 Q122 30 120 24 Q118 30 112 32 Q118 34 120 40 Z" fill="#FFD166" />
        </g>
      </svg>
    </div>
  );
};
