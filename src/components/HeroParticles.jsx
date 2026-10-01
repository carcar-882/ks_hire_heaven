const particlePositions = [
  ['8%', '40%', '0.2s'], ['18%', '18%', '1.1s'], ['29%', '74%', '1.8s'],
  ['40%', '7%', '2.5s'], ['52%', '87%', '0.7s'], ['64%', '18%', '1.4s'],
  ['76%', '72%', '2.1s'], ['88%', '31%', '0.9s'], ['94%', '54%', '1.7s'],
  ['13%', '82%', '2.8s'], ['70%', '8%', '1.2s'], ['48%', '34%', '2.3s'],
];

export default function HeroParticles({ reduced }) {
  return (
    <div className={`hero-particles${reduced ? ' is-reduced' : ''}`} aria-hidden="true">
      {particlePositions.map(([left, top, delay], index) => (
        <span key={index} style={{ left, top, animationDelay: delay }} />
      ))}
    </div>
  );
}