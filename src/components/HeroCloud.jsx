import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import heroCloudArtwork from '../../473e6bde-b299-414d-abad-953a1c297678.png';
import HeroParticles from './HeroParticles';

export default function HeroCloud({ platforms }) {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 85, damping: 22, mass: 0.7 });
  const springY = useSpring(pointerY, { stiffness: 85, damping: 22, mass: 0.7 });
  const cloudX = useTransform(springX, (value) => value * 0.55);
  const cloudY = useTransform(springY, (value) => value * 0.55);
  const platformNames = platforms.map((platform) => platform.title).join(', ');

  const onPointerMove = (event) => {
    if (reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 16);
    pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 14);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <motion.div
      id="platforms"
      className="hero-cloud-scene"
      style={{ x: cloudX, y: cloudY }}
      aria-label={`${platformNames} cloud ecosystem`}
      onMouseMove={onPointerMove}
      onMouseLeave={resetPointer}
      initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reduceMotion ? 0.25 : 0.9, delay: reduceMotion ? 0 : 0.2, ease: 'easeOut' }}
    >
      <motion.div
        className="hero-cloud-halo"
        aria-hidden="true"
        animate={reduceMotion ? undefined : { scale: [0.95, 1.05, 0.95], opacity: [0.75, 1, 0.75] }}
        transition={reduceMotion ? undefined : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <HeroParticles reduced={reduceMotion} />

      <motion.div
        className="hero-cloud-art"
        animate={reduceMotion ? { y: 0 } : { y: [0, -12, 0], rotate: [-0.6, 0.6, -0.6] }}
        transition={reduceMotion ? { duration: 0.2 } : { duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={reduceMotion ? undefined : { scale: 1.015 }}
      >
        <img
          className="hero-cloud-image"
          src={heroCloudArtwork}
          alt={`Glowing glass cloud with ${platformNames} platform panels`}
          draggable="false"
        />
      </motion.div>
    </motion.div>
  );
}