import React from "react";

interface NeuralBrainIconProps {
  className?: string;
  size?: number | string;
}

export const NeuralBrainIcon: React.FC<NeuralBrainIconProps> = ({
  className = "w-5 h-5",
  size
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={className}
      referrerPolicy="no-referrer"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <defs>
        <radialGradient id="nbi-bg" cx="65%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#1e1035" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#0f172a" stopOpacity="0.98" />
          <stop offset="100%" stopColor="#030408" stopOpacity="1" />
        </radialGradient>
        <filter id="nbi-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="nbi-gold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="60%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#fef08a" />
        </linearGradient>
        <linearGradient id="nbi-pink" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#db2777" />
          <stop offset="60%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#fda4af" />
        </linearGradient>
        <linearGradient id="nbi-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="60%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#67e8f9" />
        </linearGradient>
        <linearGradient id="nbi-magenta" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9333ea" />
          <stop offset="60%" stopColor="#d946ef" />
          <stop offset="100%" stopColor="#f0abfc" />
        </linearGradient>
        <linearGradient id="nbi-lime" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#65a30d" />
          <stop offset="60%" stopColor="#84cc16" />
          <stop offset="100%" stopColor="#bef264" />
        </linearGradient>
      </defs>

      {/* Rounded Squircle Background */}
      <rect width="512" height="512" rx="112" fill="url(#nbi-bg)" />
      <rect
        x="18"
        y="18"
        width="476"
        height="476"
        rx="96"
        fill="none"
        stroke="#38bdf8"
        strokeWidth="3"
        strokeOpacity="0.3"
      />

      {/* Horizontal Axon Bundle Tracks */}
      <g filter="url(#nbi-glow)">
        {/* Track 1: Amber Gold */}
        <path
          d="M 28 112 C 120 118, 190 98, 280 115 S 370 125, 484 102"
          fill="none"
          stroke="url(#nbi-gold)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Track 2: Hot Pink */}
        <path
          d="M 24 165 C 130 160, 210 174, 310 162 S 410 156, 488 170"
          fill="none"
          stroke="url(#nbi-pink)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        {/* Track 3: Electric Cyan */}
        <path
          d="M 20 216 C 110 225, 220 208, 320 220 S 420 212, 492 226"
          fill="none"
          stroke="url(#nbi-cyan)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Track 4: Fuchsia / Magenta */}
        <path
          d="M 22 268 C 125 260, 215 278, 315 264 S 405 258, 490 274"
          fill="none"
          stroke="url(#nbi-magenta)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        {/* Track 5: Turquoise / Teal */}
        <path
          d="M 24 322 C 115 330, 210 316, 310 326 S 425 320, 488 332"
          fill="none"
          stroke="url(#nbi-cyan)"
          strokeWidth="4.2"
          strokeLinecap="round"
        />
        {/* Track 6: Violet Pink */}
        <path
          d="M 26 376 C 120 370, 225 385, 330 372 S 430 368, 486 384"
          fill="none"
          stroke="url(#nbi-pink)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Track 7: Lime Green */}
        <path
          d="M 28 434 C 110 442, 215 428, 315 438 S 420 430, 488 446"
          fill="none"
          stroke="url(#nbi-lime)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
      </g>

      {/* Dendrite Branching Filaments */}
      <g strokeLinecap="round" strokeLinejoin="round" opacity={0.85}>
        <path d="M 330 105 L 310 65 M 330 105 L 345 50 M 330 105 L 375 70" fill="none" stroke="#facc15" strokeWidth="2.2" />
        <path d="M 435 185 L 395 145 M 435 185 L 465 140 M 435 185 L 475 225" fill="none" stroke="#f43f5e" strokeWidth="2.5" />
        <path d="M 460 240 L 420 220 M 460 240 L 435 275 M 460 240 L 485 265" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
        <path d="M 430 440 L 385 410 M 430 440 L 445 390 M 430 440 L 470 420" fill="none" stroke="#a3e635" strokeWidth="2.5" />
        <path d="M 145 160 L 115 120 M 145 160 L 125 195 M 145 160 L 175 125" fill="none" stroke="#84cc16" strokeWidth="2.2" />
        <path d="M 170 360 L 130 330 M 170 360 L 150 395 M 170 360 L 205 335" fill="none" stroke="#ec4899" strokeWidth="2.2" />

        {/* Vertical Connective Bridges */}
        <path d="M 210 165 Q 235 190, 220 216" fill="none" stroke="#38bdf8" strokeWidth="1.8" />
        <path d="M 285 216 Q 270 240, 290 264" fill="none" stroke="#f472b6" strokeWidth="1.8" />
        <path d="M 330 264 Q 355 295, 340 322" fill="none" stroke="#38bdf8" strokeWidth="1.8" />
        <path d="M 260 326 Q 240 350, 255 374" fill="none" stroke="#a78bfa" strokeWidth="1.8" />
        <path d="M 320 374 Q 340 405, 325 434" fill="none" stroke="#bef264" strokeWidth="1.8" />
      </g>

      {/* Glowing Neuron Somas */}
      <g filter="url(#nbi-glow)">
        <circle cx="330" cy="105" r="10" fill="#facc15" />
        <circle cx="330" cy="105" r="5" fill="#ffffff" />

        <circle cx="145" cy="160" r="8.5" fill="#a3e635" />
        <circle cx="145" cy="160" r="4" fill="#ffffff" />

        <circle cx="435" cy="185" r="12" fill="#f43f5e" />
        <circle cx="435" cy="185" r="6" fill="#ffffff" />

        <circle cx="460" cy="240" r="11" fill="#22d3ee" />
        <circle cx="460" cy="240" r="5.5" fill="#ffffff" />

        <circle cx="170" cy="360" r="9" fill="#ec4899" />
        <circle cx="170" cy="360" r="4.5" fill="#ffffff" />

        <circle cx="430" cy="440" r="12" fill="#84cc16" />
        <circle cx="430" cy="440" r="6" fill="#ffffff" />

        {/* Axon Nodes */}
        <circle cx="215" cy="218" r="5.5" fill="#67e8f9" />
        <circle cx="240" cy="272" r="5.5" fill="#f0abfc" />
        <circle cx="225" cy="320" r="5" fill="#67e8f9" />
      </g>
    </svg>
  );
};
