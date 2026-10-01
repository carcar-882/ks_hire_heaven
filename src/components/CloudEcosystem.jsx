import { motion, useMotionValue, useSpring } from 'framer-motion';
import { BarChart3, CloudCog, Gauge, ShieldCheck, TrendingUp } from 'lucide-react';
import CloudCore from './CloudCore';
import CloudPlatformCard from './CloudPlatformCard';
import FloatingBenefitCard from './FloatingBenefitCard';
import OrbitalLines from './OrbitalLines';

const iconMap = {
  chart: BarChart3,
  gear: CloudCog,
  shield: ShieldCheck,
  growth: TrendingUp,
  gauge: Gauge,
};

export default function CloudEcosystem({ platforms, benefits }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 110, damping: 18, mass: 0.8 });
  const springY = useSpring(y, { stiffness: 110, damping: 18, mass: 0.8 });

  const handleMouseMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const px = ((event.clientX - bounds.left) / bounds.width - 0.5) * 26;
    const py = ((event.clientY - bounds.top) / bounds.height - 0.5) * 18;
    x.set(px);
    y.set(py);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      id="platforms"
      className="cloud-ecosystem"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <motion.div className="ecosystem-scene" style={{ x: springX, y: springY }}>
        <div className="cloud-ambient" aria-hidden="true" />
        <OrbitalLines />

        <CloudPlatformCard item={platforms[0]} className="platform-card--azure" />
        <CloudPlatformCard item={platforms[1]} className="platform-card--aws" />
        <CloudPlatformCard item={platforms[2]} className="platform-card--gcp" />

        <CloudCore />

        <FloatingBenefitCard className="floating-card--top-left" title="Scalable Infrastructure" iconName="chart" />
        <FloatingBenefitCard className="floating-card--top-right" title="Enhanced Security" iconName="shield" />
        <FloatingBenefitCard className="floating-card--bottom-left" title="Operational Efficiency" iconName="gear" />
        <FloatingBenefitCard className="floating-card--bottom-right" title="Business Growth" iconName="growth" />
      </motion.div>
    </motion.div>
  );
}
