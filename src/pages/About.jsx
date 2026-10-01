import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import HeroNavbar from '../components/HeroNavbar';
import Footer from '../components/Footer';
import {
  AboutHero,
  AboutCTA,
  ChallengeSolution,
  CloudApproach,
  CloudExpertise,
  CloudJourney,
  CompanyOverview,
  CompanySnapshot,
  TeamSection,
  VisionMission,
  WhyChooseUs,
  WhoWeHelp,
  WorkingApproach,
} from '../components/about/AboutPageSections';
import '../components/Hero.css';
import '../styles/about/about.css';

export default function About() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'About KS Hire Heaven | Cloud Solutions';
    return () => { document.title = previousTitle; };
  }, []);

  return (
    <motion.div
      className="about-page-shell"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0.2 : 0.45, ease: 'easeOut' }}
    >
      <HeroNavbar />
      <main className="about-page-content">
        <AboutHero />
        <CompanyOverview />
        <CompanySnapshot />
        <VisionMission />
        <CloudApproach />
        <CloudExpertise />
        <WhyChooseUs />
        <TeamSection />
        <WorkingApproach />
        <WhoWeHelp />
        <ChallengeSolution />
        <CloudJourney />
        <AboutCTA />
      </main>
      <Footer />
    </motion.div>
  );
}