import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  ChartNoAxesCombined,
  Cloud,
  CloudCog,
  Compass,
  GitBranch,
  Lightbulb,
  Linkedin,
  LockKeyhole,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
} from 'lucide-react';
import cloudArtwork from '../../../473e6bde-b299-414d-abad-953a1c297678.png';
import {
  cloudJourney,
  company,
  contact,
  customerTypes,
  differentiators,
  expertise,
  snapshots,
  teamMembers,
  workingProcess,
} from './aboutData';

function SectionLabel({ number, children }) {
  return <div className="about-section-label"><span>{number}</span><i aria-hidden="true">/</i>{children}</div>;
}

function SectionHeading({ number, label, title, lead }) {
  return (
    <header className="about-section-heading">
      {number && <SectionLabel number={number}>{label}</SectionLabel>}
      <h2>{title}</h2>
      {lead && <p>{lead}</p>}
    </header>
  );
}

function Reveal({ children, className = '', delay = 0, hover = false, hoverY = -7, hoverScale = 1.02 }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 24, scale: hover && !reduceMotion ? 0.98 : 1 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{
        duration: reduceMotion ? 0.25 : 0.52,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={reduceMotion || !hover ? undefined : {
        y: hoverY,
        scale: hoverScale,
        transition: { type: 'spring', stiffness: 380, damping: 22 },
      }}
      whileTap={reduceMotion || !hover ? undefined : { scale: 0.985 }}
    >
      {children}
    </motion.div>
  );
}

export function AboutHero() {
  return (
    <section className="about-hero-page" aria-labelledby="about-page-title">
      <div className="about-hero-copy">
        <div className="about-section-label about-who-label">WHO WE ARE</div>
        <h1 id="about-page-title">About <span>KS Hire Heaven</span></h1>
        <p className="about-hero-statement">Building secure, scalable cloud environments for businesses ready to move forward.</p>
        <p className="about-hero-description">KS Hire Heaven Software India Pvt Ltd is an emerging IT and cloud technology company helping businesses adopt, manage, and optimize modern cloud infrastructure.</p>
        <a className="hero-primary-cta" href="#company-overview">Inside KS Hire Heaven<ArrowRight size={18} /></a>
      </div>
      <motion.div
        className="about-hero-art"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <span className="about-hero-art-glow" aria-hidden="true" />
        <img src={cloudArtwork} alt="Azure, AWS, and Google Cloud within a glass cloud network" />
        <span className="about-hero-art-caption"><Cloud size={15} /> Azure-first · Multi-cloud ready</span>
      </motion.div>
    </section>
  );
}

export function CompanyOverview() {
  return (
    <section id="company-overview" className="about-company-section">
      <Reveal className="about-company-editorial">
        <SectionLabel number="01">ABOUT THE COMPANY</SectionLabel>
        <h2>Cloud technology built around your business.</h2>
        <div className="about-company-tags"><span>AZURE-FIRST</span><span>MULTI-CLOUD</span><span>SECURITY-LED</span></div>
      </Reveal>
      <Reveal className="about-company-copy" delay={0.08}>
        <p>{company.about}</p>
        <p>{company.goal}</p>
      </Reveal>
    </section>
  );
}

export function CompanySnapshot() {
  return (
    <section className="about-snapshot" aria-label="Company at a glance">
      {snapshots.map((item, index) => (
        <Reveal hover hoverY={-4} hoverScale={1.03} className="about-snapshot-item" key={item.label} delay={index * 0.04}>
          <span>{item.label}</span><strong>{item.value}</strong>
        </Reveal>
      ))}
    </section>
  );
}

export function VisionMission() {
  const cards = [
    { number: '01', name: 'VISION', text: company.vision, Icon: Compass, theme: 'vision' },
    { number: '02', name: 'MISSION', text: company.mission, Icon: Target, theme: 'mission' },
  ];
  return (
    <section className="about-vision-section">
      <SectionHeading number="02" label="VISION & MISSION" title={<>Where we’re going.<br /><span>How we’re getting there.</span></>} />
      <div className="about-vision-grid">
        {cards.map(({ number, name, text, Icon, theme }, index) => (
          <Reveal hover hoverY={-8} hoverScale={1.02} className={`about-vision-card about-vision-${theme}`} key={number} delay={index * 0.1}>
            <span className="about-vision-number">{number}</span>
            <span className="about-vision-icon"><Icon size={27} aria-hidden="true" /></span>
            <div><span className="about-kicker">{name}</span><p>{text}</p></div>
            <Sparkles className="about-vision-spark" size={92} aria-hidden="true" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function CloudApproach() {
  const stages = [
    { title: 'Plan', description: 'Cloud strategy and infrastructure planning.', Icon: Compass },
    { title: 'Migrate', description: 'Cloud migration and modernization.', Icon: CloudCog },
    { title: 'Secure', description: 'Security, compliance, backup and disaster recovery.', Icon: LockKeyhole },
    { title: 'Optimize', description: 'Monitoring, performance and cost optimization.', Icon: ChartNoAxesCombined },
  ];
  const reduceMotion = useReducedMotion();
  return (
    <section id="cloud-approach" className="about-approach-section">
      <SectionHeading number="03" label="WHAT WE DO" title="From cloud adoption to continuous optimization." lead="We help businesses navigate cloud complexity with practical technology solutions across infrastructure, migration, security, DevOps, monitoring, and technical consulting." />
      <div className="about-approach-flow">
        <motion.span className="about-approach-line" aria-hidden="true" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: reduceMotion ? 0.2 : 0.9, ease: 'easeOut' }} />
        {stages.map(({ title, description, Icon }, index) => (
          <Reveal hover hoverY={-6} hoverScale={1.02} className="about-approach-step" key={title} delay={index * 0.08}>
            <span className="about-approach-node"><Icon size={22} aria-hidden="true" /></span>
            <span className="about-kicker">0{index + 1}</span>
            <h3>{title}</h3>
            <p>{description}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function CloudExpertise() {
  return (
    <section id="cloud-expertise" className="about-expertise-section">
      <SectionHeading number="04" label="CLOUD EXPERTISE" title="Azure-first. Multi-cloud ready." />
      <div className="about-expertise-grid">
        {expertise.map((platform, index) => (
          <Reveal hover hoverY={-8} hoverScale={1.025} className={`about-expertise-card about-expertise-${platform.accent}`} key={platform.name} delay={index * 0.08}>
            <span className="about-expertise-mark"><Cloud size={25} aria-hidden="true" /></span>
            <span className="about-kicker">{platform.accent === 'azure' ? 'PRIMARY PLATFORM' : 'CLOUD PLATFORM'}</span>
            <h3>{platform.name}</h3>
            <p>{platform.description}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function WhyChooseUs() {
  const iconMap = { cloud: Cloud, layers: GitBranch, shield: ShieldCheck, scale: Target, chart: ChartNoAxesCombined, support: UsersRound };
  return (
    <section className="about-why-section">
      <SectionHeading number="05" label="WHY KS HIRE HEAVEN" title="Cloud expertise with a business-first mindset." />
      <div className="about-why-grid">
        {differentiators.map((item, index) => {
          const Icon = iconMap[item.icon];
          return (
            <Reveal hover hoverY={-7} hoverScale={1.02} className="about-why-card" key={item.title} delay={index * 0.045}>
              <span className="about-why-number">0{index + 1}</span>
              <span className="about-why-icon"><Icon size={22} aria-hidden="true" /></span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export function TeamSection() {
  return (
    <section className="about-team-section">
      <SectionHeading 
        number="06" 
        label="MEET OUR LEADERSHIP TEAM" 
        title="Experienced leadership driving cloud innovation, digital transformation, and sustainable business growth." 
        lead="Behind every technology transformation is a team committed to building reliable solutions, creating lasting partnerships, and enabling business growth." 
      />
      <div className="about-team-grid">
        {teamMembers.map((member) => (
          <Reveal hover hoverY={-7} hoverScale={1.015} className="about-team-card" key={member.id}>
            <div className="about-team-portrait" role="img" aria-label={member.image ? `${member.name} portrait` : `Professional placeholder for ${member.name}`}>
              {member.image ? (
                <img src={member.image} alt={`${member.name} portrait`} style={{ objectFit: 'cover', objectPosition: 'center' }} />
              ) : (
                <span className="about-team-initials">{member.initials}</span>
              )}
            </div>
            <div className="about-team-details">
              <h3>{member.name}</h3>
              <p className="about-team-role">{member.role}</p>
              <p>{member.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function WorkingApproach() {
  return (
    <section id="working-approach" className="about-working-section">
      <SectionHeading number="07" label="HOW WE WORK" title="Simple process. Practical cloud outcomes." />
      <div className="about-working-grid">
        {workingProcess.map((step, index) => (
          <Reveal hover hoverY={-6} hoverScale={1.02} className="about-working-step" key={step.number} delay={index * 0.08}>
            <span className="about-working-number">{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function WhoWeHelp() {
  return (
    <section id="who-we-help" className="about-customers-section">
      <SectionHeading label="WHO WE HELP" title="Cloud support for businesses at every stage." />
      <div className="about-customer-list">
        {customerTypes.map((type, index) => (
          <Reveal hover hoverY={-4} hoverScale={1.04} className="about-customer-chip" key={type} delay={index * 0.035}>
            <Cloud size={17} aria-hidden="true" />{type}
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function ChallengeSolution() {
  const challenge = ['Complex infrastructure', 'Migration challenges', 'Security concerns', 'Scalability', 'Cost management', 'Technical expertise'];
  const approach = ['Cloud strategy', 'Migration', 'Security', 'Optimization', 'Monitoring', 'Technical support'];
  return (
    <section className="about-transformation-section" aria-label="The cloud challenge and our approach">
      <Reveal className="about-transformation-panel about-challenge-panel">
        <span className="about-kicker">THE CHALLENGE</span>
        <h2>Cloud infrastructure can become complex as businesses grow.</h2>
        <ul>{challenge.map((item) => <li key={item}><span />{item}</li>)}</ul>
      </Reveal>
      <motion.div className="about-transformation-arrow" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} aria-hidden="true"><ArrowRight size={23} /></motion.div>
      <Reveal className="about-transformation-panel about-approach-panel" delay={0.1}>
        <span className="about-kicker">OUR APPROACH</span>
        <h2>KS Hire Heaven simplifies these challenges through practical cloud solutions and technical support.</h2>
        <ul>{approach.map((item) => <li key={item}><span />{item}</li>)}</ul>
      </Reveal>
    </section>
  );
}

export function CloudJourney() {
  const reduceMotion = useReducedMotion();
  return (
    <section id="cloud-journey" className="about-journey-section">
      <SectionHeading label="A SERVICE FRAMEWORK" title="Our Cloud Journey" lead="A practical framework for moving forward in the cloud. No shortcuts, no one-size-fits-all path." />
      <div className="about-journey-track">
        <motion.span className="about-journey-progress" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: reduceMotion ? 0.2 : 1, ease: 'easeOut' }} aria-hidden="true" />
        {cloudJourney.map((stage, index) => (
          <Reveal hover hoverY={-6} hoverScale={1.03} className="about-journey-item" key={stage} delay={index * 0.07}>
            <span className="about-journey-node">0{index + 1}</span>
            <h3>{stage}</h3>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function AboutCTA() {
  return (
    <section className="about-final-cta">
      <span className="about-final-cta-glow" aria-hidden="true" />
      <span className="about-kicker">LET’S MOVE FORWARD</span>
      <h2>Ready to build what’s next?</h2>
      <p>Let’s simplify your cloud journey and build a secure, scalable environment around your business.</p>
      <div className="about-final-cta-actions">
        <a className="hero-primary-cta" href={`mailto:${contact.email}`}>Get in Touch<ArrowRight size={18} /></a>
        <a className="hero-secondary-cta" href="/#services">Explore Our Services<ArrowDown size={18} /></a>
      </div>
    </section>
  );
}