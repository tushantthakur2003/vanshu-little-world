import React from 'react';

export const BunnyHearts = ({ className = "w-44 h-44" }) => {
  return (
    <div className={`relative inline-block select-none ${className}`}>
      <svg
        viewBox="0 0 200 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md animate-float-slow"
      >
        <defs>
          <linearGradient id="bunnyGrad" x1="100" y1="50" x2="100" y2="190" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFDF9" />
            <stop offset="1" stopColor="#FDE2E4" />
          </linearGradient>
          <linearGradient id="earInner" x1="100" y1="20" x2="100" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFA3B5" />
            <stop offset="1" stopColor="#FFD1DC" />
          </linearGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="100" cy="198" rx="55" ry="12" fill="#E8D7F1" opacity="0.6" />

        {/* Bunny Left Long Ear */}
        <ellipse cx="78" cy="50" rx="14" ry="42" fill="url(#bunnyGrad)" transform="rotate(-12 78 50)" />
        <ellipse cx="78" cy="52" rx="7" ry="30" fill="url(#earInner)" transform="rotate(-12 78 52)" />

        {/* Bunny Right Long Ear (with cute bent tip) */}
        <ellipse cx="122" cy="50" rx="14" ry="42" fill="url(#bunnyGrad)" transform="rotate(12 122 50)" />
        <ellipse cx="122" cy="52" rx="7" ry="30" fill="url(#earInner)" transform="rotate(12 122 52)" />

        {/* Bunny Chubby Head & Body */}
        <ellipse cx="100" cy="140" rx="56" ry="54" fill="url(#bunnyGrad)" />
        <ellipse cx="100" cy="105" rx="48" ry="42" fill="url(#bunnyGrad)" />

        {/* Cute Bow on Ear */}
        <g transform="translate(68, 76) rotate(-20)">
          <path d="M0 0 C-10 -10 -12 6 0 0 Z" fill="#FF758F" />
          <path d="M0 0 C10 -10 12 6 0 0 Z" fill="#FF758F" />
          <circle cx="0" cy="0" r="3" fill="#FF4D6D" />
        </g>

        {/* Shiny Big Kawaii Eyes */}
        <ellipse cx="82" cy="102" rx="5.5" ry="7" fill="#4A3E3D" />
        <circle cx="80" cy="99" r="2.2" fill="#FFFFFF" />
        <circle cx="83.5" cy="104.5" r="1.2" fill="#FFFFFF" />

        <ellipse cx="118" cy="102" rx="5.5" ry="7" fill="#4A3E3D" />
        <circle cx="116" cy="99" r="2.2" fill="#FFFFFF" />
        <circle cx="119.5" cy="104.5" r="1.2" fill="#FFFFFF" />

        {/* Cute Pink Bunny Nose & Mouth */}
        <path d="M97 112 Q100 115 103 112 Z" fill="#FF758F" />
        <path d="M100 114 Q95 120 93 117" stroke="#4A3E3D" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M100 114 Q105 120 107 117" stroke="#4A3E3D" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* Blushing Cheeks */}
        <ellipse cx="70" cy="112" rx="8" ry="5.5" fill="#FFA3B5" opacity="0.8" />
        <ellipse cx="130" cy="112" rx="8" ry="5.5" fill="#FFA3B5" opacity="0.8" />

        {/* Little Paws folded in front */}
        <ellipse cx="88" cy="148" rx="10" ry="7" fill="#FFFDF9" stroke="#FFE4E8" strokeWidth="2" transform="rotate(15 88 148)" />
        <ellipse cx="112" cy="148" rx="10" ry="7" fill="#FFFDF9" stroke="#FFE4E8" strokeWidth="2" transform="rotate(-15 112 148)" />

        {/* Bunny Feet */}
        <ellipse cx="75" cy="184" rx="16" ry="10" fill="#FFFDF9" stroke="#FFE4E8" strokeWidth="2" />
        <ellipse cx="125" cy="184" rx="16" ry="10" fill="#FFFDF9" stroke="#FFE4E8" strokeWidth="2" />

        {/* Surrounding Pink Hearts */}
        <g className="animate-heartbeat-soft origin-center" style={{ transformOrigin: '40px 80px' }}>
          <path d="M40 85 C32 75 22 84 27 92 C32 98 40 104 40 104 C40 104 48 98 53 92 C58 84 48 75 40 85 Z" fill="#FF758F" />
        </g>

        <g className="animate-float-reverse origin-center" style={{ transformOrigin: '160px 85px' }}>
          <path d="M160 85 C153 76 144 84 149 91 C153 96 160 102 160 102 C160 102 167 96 171 91 C176 84 167 76 160 85 Z" fill="#FF8FA3" />
        </g>

        <g className="animate-sparkle" style={{ animationDelay: '0.4s' }}>
          <path d="M100 24 C95 16 86 23 90 29 C94 33 100 38 100 38 C100 38 106 33 110 29 C114 23 105 16 100 24 Z" fill="#FFA3B5" />
        </g>
      </svg>
    </div>
  );
};
