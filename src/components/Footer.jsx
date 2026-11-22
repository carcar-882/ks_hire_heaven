import { useEffect, useState } from 'react';
import { useReducedMotion, motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  AtSign,
  Building2,
  FileCheck2,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck
} from 'lucide-react';
import brandLogo from '../assets/logo.png';
import { getSettingsSync, fetchSettings, subscribeSettings } from '../services/settingsService';
import './Footer.css';

const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Services', href: '/#services' },
  { label: 'Cloud Platforms', href: '/#cloud-platforms' },
  { label: 'Industries', href: '/#industries' },
  { label: 'How We Work', href: '/#how-we-work' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact Us', href: '/contact' },
];

const serviceLinks = [
  'Cloud Infrastructure',
  'Cloud Migration & Modernization',
  'Cloud Security',
  'DevOps & CI/CD',
  'Monitoring & Optimization',
  'Backup & Disaster Recovery',
  'Technical Consulting',
];

const footerReveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function Footer() {
  const reduceMotion = useReducedMotion();
  const [cms, setCms] = useState(() => getSettingsSync());

  useEffect(() => {
    // 1. Fetch remote settings if available
    let isMounted = true;
    fetchSettings().then((updated) => {
      if (isMounted && updated) {
        setCms(updated);
      }
    });

    // 2. Subscribe to real-time updates from Admin panel & localStorage
    const unsubscribe = subscribeSettings((updated) => {
      if (isMounted && updated) {
        setCms(updated);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return (
    <motion.footer
      id="contact"
      className="site-footer"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduceMotion ? 0.2 : 0.5, ease: 'easeOut' }}
    >
      <motion.section
        className="site-footer-cta"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={footerReveal}
        transition={{ duration: reduceMotion ? 0.2 : 0.42, ease: 'easeOut' }}
      >
        <div>
          <h2>Ready to build a smarter cloud environment?</h2>
          <p>Let’s discuss your cloud requirements and find a practical path forward.</p>
        </div>
        <motion.a
          className="hero-primary-cta site-footer-cta-button"
          href={`mailto:${cms.email}?subject=Cloud%20solutions%20enquiry%20-%20KS%20Hire%20Heaven`}
          whileHover={reduceMotion ? undefined : { scale: 1.05, y: -2 }}
          whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 450, damping: 20 }}
        >
          <span>Talk to Our Team</span>
          <ArrowRight size={17} />
        </motion.a>
      </motion.section>

      <div className="site-footer-divider" />

      <motion.div
        className="site-footer-main"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
        variants={{ visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.08 } } }}
      >
        <motion.section className="site-footer-brand" variants={footerReveal} transition={{ duration: reduceMotion ? 0.2 : 0.42 }}>
          <motion.a
            className="site-footer-logo"
            href="/#home"
            aria-label="KS Hire Heaven home"
            whileHover={reduceMotion ? undefined : { scale: 1.03 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          >
            <img src={brandLogo} alt="KS Hire Heaven Software India Private Limited Logo" />
          </motion.a>
          <p className="site-footer-tagline">{cms.tagline || 'Cloud Solutions. Digital Innovation. Business Growth.'}</p>
          <p className="site-footer-description">
            {cms.description || `${cms.company_name} is an emerging technology company focused on cloud solutions, digital transformation, Azure infrastructure, data, DevOps, analytics, and business technology.`}
          </p>
        </motion.section>

        <motion.nav className="site-footer-column" aria-label="Company links" variants={footerReveal} transition={{ duration: reduceMotion ? 0.2 : 0.42 }}>
          <h2>Company</h2>
          {companyLinks.map((item) => (
            <a key={item.label} href={item.href}>{item.label}</a>
          ))}
        </motion.nav>

        <motion.nav className="site-footer-column" aria-label="Cloud services" variants={footerReveal} transition={{ duration: reduceMotion ? 0.2 : 0.42 }}>
          <h2>Cloud Services</h2>
          {serviceLinks.map((service) => (
            <a key={service} href="/#services">{service}</a>
          ))}
        </motion.nav>

        <motion.address className="site-footer-column site-footer-contact" variants={footerReveal} transition={{ duration: reduceMotion ? 0.2 : 0.42 }}>
          <h2>Get in Touch</h2>
          <p className="site-footer-company-name">{cms.company_name}</p>
          
          <a href={`mailto:${cms.email}`} title="Email Us">
            <Mail size={16} aria-hidden="true" />
            <span>{cms.email}</span>
          </a>

          <a href={`tel:${(cms.phone || '').replace(/[^0-9+]/g, '')}`} title="Call Us">
            <Phone size={16} aria-hidden="true" />
            <span>{cms.phone}</span>
          </a>

          {cms.whatsapp && (
            <a href={`https://wa.me/91${cms.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" title="Chat on WhatsApp">
              <MessageCircle size={16} aria-hidden="true" />
              <span>WhatsApp · {cms.whatsapp}</span>
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          )}

          <a href={cms.maps_link || "https://maps.app.goo.gl/XfTbnEiJX9VfJzMD9"} target="_blank" rel="noopener noreferrer" title="View Office on Google Maps">
            <MapPin size={16} aria-hidden="true" />
            <span>{cms.office_location || 'Alt. F Begumpet'}</span>
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>

          {cms.x && (
            <a href="https://x.com/Kshhsipl" target="_blank" rel="noopener noreferrer" title="Follow us on X">
              <AtSign size={16} aria-hidden="true" />
              <span>X · {cms.x}</span>
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          )}

          {cms.linkedin && (
            <p className="site-footer-linkedin">
              <Linkedin size={16} aria-hidden="true" />
              <a href={cms.linkedin.startsWith('http') ? cms.linkedin : `https://${cms.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                <span>LinkedIn</span>
                <ArrowUpRight size={13} aria-hidden="true" style={{ display: 'inline', marginLeft: '4px' }} />
              </a>
            </p>
          )}
        </motion.address>
      </motion.div>

      {/* Official Legal & Company Incorporation Section */}
      <motion.div
        className="site-footer-legal-panel"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
        variants={footerReveal}
        transition={{ duration: reduceMotion ? 0.2 : 0.42 }}
      >
        <div className="legal-panel-header">
          <div className="legal-panel-title">
            <Building2 size={16} className="legal-icon" />
            <span>Company &amp; Legal Information</span>
          </div>
          <span className="legal-badge"><ShieldCheck size={13} /> Certificate of Incorporation Verified</span>
        </div>

        <div className="legal-details-grid">
          <div className="legal-item">
            <span className="legal-label">Company Name:</span>
            <span className="legal-value legal-highlight">{cms.company_name}</span>
          </div>
          <div className="legal-item">
            <span className="legal-label">Corporate Identity Number (CIN):</span>
            <span className="legal-value code-font">{cms.cin || 'U62020TS2026PTC225045'}</span>
          </div>
          <div className="legal-item">
            <span className="legal-label">Date of Incorporation:</span>
            <span className="legal-value">{cms.incorporation_date || '2026'}</span>
          </div>
        </div>
      </motion.div>

      <div className="site-footer-bottom">
        <span>© 2026 {cms.company_name}. All rights reserved.</span>
        <div className="site-footer-legal">
          <span aria-disabled="true">Privacy Policy</span>
          <span aria-disabled="true">Terms &amp; Conditions</span>
          <a href="/about" style={{ color: 'inherit', textDecoration: 'none' }}>About Company</a>
          <a href="/careers" style={{ color: 'inherit', textDecoration: 'none' }}>Careers</a>
        </div>
      </div>
    </motion.footer>
  );
}
