interface LoopLogoProps {
  size?: number;
  className?: string;
}

export default function LoopLogo({ size = 36, className = '' }: LoopLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="THE LOOP"
    >
      <defs>
        <linearGradient id="loopGrad" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#A855F7" />
          <stop offset="0.5" stopColor="#C084FC" />
          <stop offset="1" stopColor="#A855F7" />
        </linearGradient>
        <filter id="loopGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer interwoven loop - an imperfect organic ring */}
      <path
        d="M50 8 C72 8 88 24 86 48 C84 72 66 90 44 88 C22 86 8 68 10 46 C12 28 26 12 50 8 Z"
        stroke="url(#loopGrad)"
        strokeWidth="3.5"
        fill="none"
        filter="url(#loopGlow)"
        strokeLinecap="round"
      />

      {/* Inner flowing curve creating interwoven structure */}
      <path
        d="M30 62 C38 44 58 40 66 52 C72 62 64 74 52 72 C42 70 36 60 42 50"
        stroke="#C084FC"
        strokeWidth="2.5"
        fill="none"
        filter="url(#loopGlow)"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Central node - the intelligence core */}
      <circle cx="50" cy="50" r="5" fill="#C084FC" filter="url(#loopGlow)" />
      <circle cx="50" cy="50" r="2.5" fill="#F8F7FC" opacity="0.9" />
    </svg>
  );
}
