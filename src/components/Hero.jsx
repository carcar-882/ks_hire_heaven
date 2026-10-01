import HeroContent from './HeroContent';
import HeroCloud from './HeroCloud';
import HeroNavbar from './HeroNavbar';
import './Hero.css';

export default function Hero({ platforms, benefits }) {
  return (
    <>
      <HeroNavbar />
      <section id="home" className="hero-section" aria-label="KS Hire Heaven cloud solutions">
        <div className="hero-layout">
          <HeroContent benefits={benefits} />
          <HeroCloud platforms={platforms} />
        </div>
      </section>
    </>
  );
}