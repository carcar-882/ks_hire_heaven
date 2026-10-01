export default function CloudOrbit() {
  return (
    <svg className="hero-orbit-svg" viewBox="0 0 800 560" aria-hidden="true">
      <defs>
        <linearGradient id="heroOrbitLine" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="0.28" stopColor="#50bfff" stopOpacity="0.9" />
          <stop offset="0.56" stopColor="#ffffff" stopOpacity="0.94" />
          <stop offset="1" stopColor="#1787ff" stopOpacity="0.15" />
        </linearGradient>
        <filter id="heroOrbitGlow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <g className="hero-orbit-rotor" fill="none" stroke="url(#heroOrbitLine)" strokeWidth="1.5" filter="url(#heroOrbitGlow)">
        <ellipse cx="400" cy="280" rx="362" ry="154" transform="rotate(-14 400 280)" />
        <ellipse cx="400" cy="280" rx="330" ry="188" transform="rotate(17 400 280)" strokeOpacity="0.72" />
        <path d="M58 342C176 143 287 96 402 188s191 219 340 85" strokeOpacity="0.62" />
      </g>
      <g className="hero-orbit-points" filter="url(#heroOrbitGlow)">
        <circle cx="70" cy="350" r="5" fill="#ffffff" />
        <circle cx="213" cy="140" r="4" fill="#7ce0ff" />
        <circle cx="738" cy="226" r="5" fill="#ffffff" />
        <circle cx="592" cy="464" r="4" fill="#9bdcff" />
        <circle cx="405" cy="92" r="3" fill="#ffffff" />
      </g>
    </svg>
  );
}