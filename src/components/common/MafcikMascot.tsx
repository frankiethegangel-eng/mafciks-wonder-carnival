import React from 'react';

export type MascotMood = 'happy' | 'cheering' | 'thinking' | 'winking';

interface MafcikMascotProps {
  mood?: MascotMood;
  speech?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  showNameTag?: boolean;
}

export const MafcikMascot: React.FC<MafcikMascotProps> = ({
  mood = 'happy',
  speech,
  size = 'md',
  className = '',
  showNameTag = true,
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-36 h-36 sm:w-44 sm:h-44',
    hero: 'w-48 h-48 sm:w-60 sm:h-60',
  };

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      {/* Dialogue Speech Bubble if provided */}
      {speech && (
        <div className="relative mb-2 px-4 py-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-pink-200 text-slate-800 text-xs sm:text-sm font-medium max-w-xs text-center animate-fade-in z-20">
          <p className="leading-snug">{speech}</p>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white/95" />
        </div>
      )}

      {/* SVG Pug Mascot */}
      <div className={`${sizeClasses[size]} relative transition-transform duration-300 hover:scale-105 select-none`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-[0_10px_20px_rgba(244,114,182,0.3)]"
          role="img"
          aria-label="Mafcik, the friendly carnival pug mascot"
        >
          <defs>
            <linearGradient id="pugCoat" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f7d9aa" />
              <stop offset="50%" stopColor="#eed09f" />
              <stop offset="100%" stopColor="#dfbf89" />
            </linearGradient>
            <linearGradient id="pugMuzzle" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3d2b24" />
              <stop offset="100%" stopColor="#251711" />
            </linearGradient>
            <linearGradient id="ribbonPink" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Sparkles if cheering */}
          {mood === 'cheering' && (
            <g className="animate-pulse">
              <path d="M 30,50 L 35,40 L 40,50 L 50,55 L 40,60 L 35,70 L 30,60 L 20,55 Z" fill="#fde047" />
              <path d="M 160,40 L 164,32 L 168,40 L 176,44 L 168,48 L 164,56 L 160,48 L 152,44 Z" fill="#f472b6" />
              <path d="M 170,110 L 173,103 L 176,110 L 183,113 L 176,116 L 173,123 L 170,116 L 163,113 Z" fill="#6ee7b7" />
            </g>
          )}

          {/* Pug Body */}
          <ellipse cx="100" cy="148" rx="55" ry="44" fill="url(#pugCoat)" stroke="#b8935c" strokeWidth="2.5" />

          {/* Little Front Paws */}
          {mood === 'cheering' ? (
            <g>
              {/* Paws raised in celebration */}
              <ellipse cx="60" cy="110" rx="14" ry="12" fill="#eed09f" stroke="#b8935c" strokeWidth="2" transform="rotate(-20 60 110)" />
              <ellipse cx="140" cy="110" rx="14" ry="12" fill="#eed09f" stroke="#b8935c" strokeWidth="2" transform="rotate(20 140 110)" />
            </g>
          ) : (
            <g>
              <ellipse cx="75" cy="165" rx="13" ry="10" fill="#eed09f" stroke="#b8935c" strokeWidth="2" />
              <ellipse cx="125" cy="165" rx="13" ry="10" fill="#eed09f" stroke="#b8935c" strokeWidth="2" />
            </g>
          )}

          {/* Carnival Bowtie / Collar */}
          <g>
            <path d="M 75 130 C 85 136, 115 136, 125 130 C 120 138, 80 138, 75 130 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
            {/* Pink Ribbon Bow */}
            <path d="M 88 132 L 80 124 C 77 122, 75 125, 78 128 L 86 135 L 78 142 C 75 145, 77 148, 80 146 L 88 138 Z" fill="url(#ribbonPink)" />
            <path d="M 112 132 L 120 124 C 123 122, 125 125, 122 128 L 114 135 L 122 142 C 125 145, 123 148, 120 146 L 112 138 Z" fill="url(#ribbonPink)" />
            {/* Center Bow Knot with Star Medal */}
            <circle cx="100" cy="135" r="7" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
            <polygon points="100,130 102,134 106,134 103,136 104,140 100,137 96,140 97,136 94,134 98,134" fill="#ffffff" />
          </g>

          {/* Pug Head (Tilted slightly if thinking) */}
          <g transform={mood === 'thinking' ? 'rotate(8 100 85)' : ''}>
            {/* Velvet Floppy Ears */}
            <path
              d="M 45 45 C 30 55, 32 85, 48 95 C 55 80, 58 60, 52 50 Z"
              fill="#2e1f18"
              stroke="#1f140f"
              strokeWidth="2"
            />
            <path
              d="M 155 45 C 170 55, 168 85, 152 95 C 145 80, 142 60, 148 50 Z"
              fill="#2e1f18"
              stroke="#1f140f"
              strokeWidth="2"
            />

            {/* Pug Head Main Shape */}
            <ellipse cx="100" cy="85" rx="54" ry="46" fill="url(#pugCoat)" stroke="#b8935c" strokeWidth="2.5" />

            {/* Forehead Wrinkles (Classic Pug signature) */}
            <path d="M 85 52 Q 100 48 115 52" fill="none" stroke="#9a733e" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 88 59 Q 100 55 112 59" fill="none" stroke="#9a733e" strokeWidth="2" strokeLinecap="round" />
            <path d="M 94 66 Q 100 64 106 66" fill="none" stroke="#9a733e" strokeWidth="2" strokeLinecap="round" />

            {/* Dark Mask / Muzzle */}
            <path
              d="M 68 88 C 65 110, 80 120, 100 120 C 120 120, 135 110, 132 88 C 130 75, 115 72, 100 72 C 85 72, 70 75, 68 88 Z"
              fill="url(#pugMuzzle)"
            />

            {/* Pug Nose */}
            <path
              d="M 91 87 C 91 83, 109 83, 109 87 C 109 94, 91 94, 91 87 Z"
              fill="#100a08"
            />
            {/* Nostrils */}
            <ellipse cx="96" cy="88" rx="1.5" ry="2" fill="#302018" />
            <ellipse cx="104" cy="88" rx="1.5" ry="2" fill="#302018" />

            {/* Pug Lips and Tongue */}
            <path d="M 91 96 Q 100 102 109 96" fill="none" stroke="#120c09" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 100 90 L 100 99" fill="none" stroke="#120c09" strokeWidth="2" />

            {/* Adorable little pink tongue peeking out if happy/cheering */}
            {(mood === 'happy' || mood === 'cheering') && (
              <path
                d="M 96 99 C 96 107, 104 107, 104 99 Z"
                fill="#f472b6"
                stroke="#db2777"
                strokeWidth="1"
              />
            )}

            {/* Eyes */}
            {mood === 'winking' ? (
              <g>
                {/* Left eye open, big and shiny */}
                <ellipse cx="78" cy="74" rx="11" ry="12" fill="#201511" />
                <ellipse cx="78" cy="74" rx="9" ry="10" fill="#45271a" />
                <circle cx="75" cy="70" r="4" fill="#ffffff" />
                <circle cx="81" cy="77" r="1.5" fill="#ffffff" />
                {/* Right eye playful wink */}
                <path d="M 114 74 Q 123 68 132 74" fill="none" stroke="#251711" strokeWidth="3.5" strokeLinecap="round" />
              </g>
            ) : mood === 'thinking' ? (
              <g>
                {/* Looking upwards thoughtfully */}
                <ellipse cx="78" cy="74" rx="11" ry="12" fill="#201511" />
                <ellipse cx="78" cy="72" rx="9" ry="10" fill="#45271a" />
                <circle cx="76" cy="68" r="4" fill="#ffffff" />
                <circle cx="82" cy="75" r="1.5" fill="#ffffff" />

                <ellipse cx="122" cy="74" rx="11" ry="12" fill="#201511" />
                <ellipse cx="122" cy="72" rx="9" ry="10" fill="#45271a" />
                <circle cx="120" cy="68" r="4" fill="#ffffff" />
                <circle cx="126" cy="75" r="1.5" fill="#ffffff" />
              </g>
            ) : (
              <g>
                {/* Both eyes big, warm brown, glossy highlights */}
                <ellipse cx="78" cy="74" rx="11" ry="12" fill="#201511" />
                <ellipse cx="78" cy="74" rx="9" ry="10" fill="#45271a" />
                <circle cx="75" cy="70" r="4" fill="#ffffff" />
                <circle cx="81" cy="77" r="1.5" fill="#ffffff" />

                <ellipse cx="122" cy="74" rx="11" ry="12" fill="#201511" />
                <ellipse cx="122" cy="74" rx="9" ry="10" fill="#45271a" />
                <circle cx="119" cy="70" r="4" fill="#ffffff" />
                <circle cx="125" cy="77" r="1.5" fill="#ffffff" />
              </g>
            )}

            {/* Cute Rosy Pug Cheeks */}
            <circle cx="64" cy="85" r="8" fill="#f472b6" opacity="0.35" />
            <circle cx="136" cy="85" r="8" fill="#f472b6" opacity="0.35" />
          </g>
        </svg>
      </div>

      {showNameTag && (
        <span className="mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-pink-100/90 text-pink-700 border border-pink-300 shadow-sm">
          Mafcik 🐾
        </span>
      )}
    </div>
  );
};
