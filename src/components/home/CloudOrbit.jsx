export default function CloudOrbit({ activePlatform, reduced }) {
  return (
    <svg
      className={`home-platform-orbit${activePlatform ? ` is-${activePlatform}-active` : ''}${reduced ? ' is-reduced' : ''}`}
      viewBox="0 0 1200 660"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="homePlatformLine" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#68baff" stopOpacity="0.08" />
          <stop offset="0.5" stopColor="#168cff" stopOpacity="0.68" />
          <stop offset="1" stopColor="#68baff" stopOpacity="0.08" />
        </linearGradient>
        <filter id="homePlatformGlow"><feGaussianBlur stdDeviation="2.5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <g className="home-platform-orbit-lines" fill="none" stroke="url(#homePlatformLine)" strokeWidth="1.4" filter="url(#homePlatformGlow)">
        <path id="homeAzureConnector" className="orbit-azure-path" d="M600 160 C600 225 600 235 600 292" />
        <path id="homeAwsConnector" className="orbit-aws-path" d="M520 365 C420 393 350 441 290 493" />
        <path id="homeGcpConnector" className="orbit-gcp-path" d="M680 365 C780 393 850 441 910 493" />
        <path d="M260 502 C420 590 780 590 940 502" strokeOpacity="0.28" />
      </g>
      <g className="home-platform-orbit-nodes" fill="#fff" filter="url(#homePlatformGlow)">
        <circle className="orbit-azure-node" cx="600" cy="214" r="4">
          {!reduced && <animateMotion dur="6s" repeatCount="indefinite"><mpath href="#homeAzureConnector" /></animateMotion>}
        </circle>
        <circle className="orbit-aws-node" cx="392" cy="429" r="4">
          {!reduced && <animateMotion dur="8s" repeatCount="indefinite"><mpath href="#homeAwsConnector" /></animateMotion>}
        </circle>
        <circle className="orbit-gcp-node" cx="808" cy="429" r="4">
          {!reduced && <animateMotion dur="8s" begin="-3s" repeatCount="indefinite"><mpath href="#homeGcpConnector" /></animateMotion>}
        </circle>
      </g>
    </svg>
  );
}