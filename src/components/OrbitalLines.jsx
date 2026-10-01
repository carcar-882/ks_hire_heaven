export default function OrbitalLines() {
  return (
    <svg className="orbital-svg" viewBox="0 0 920 580" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <linearGradient id="orbitGlow" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
          <stop offset="20%" stopColor="rgba(116,187,255,0.9)" />
          <stop offset="55%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="100%" stopColor="rgba(132,197,255,0.5)" />
        </linearGradient>
      </defs>

      <path d="M 160 300 C 220 110, 430 80, 520 200 S 740 390, 820 270" fill="none" stroke="url(#orbitGlow)" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <path d="M 120 330 C 150 160, 350 120, 470 200 S 760 390, 860 350" fill="none" stroke="url(#orbitGlow)" strokeWidth="1.5" strokeLinecap="round" opacity="0.65" />

      <circle cx="164" cy="300" r="5" fill="#effbff" />
      <circle cx="520" cy="200" r="5" fill="#effbff" />
      <circle cx="825" cy="270" r="5" fill="#effbff" />
      <circle cx="120" cy="330" r="5" fill="#effbff" />
      <circle cx="860" cy="350" r="5" fill="#effbff" />
    </svg>
  );
}
