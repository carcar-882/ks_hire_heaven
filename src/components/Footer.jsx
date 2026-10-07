import { useReducedMotion, motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, AtSign, Linkedin, Mail, MessageCircle, Phone, Youtube } from 'lucide-react';
import brandLogo from '../assets/logo.png';
import { contact, company } from './about/aboutData';
import './Footer.css';
import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';

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
  const [cms, setCms] = useState({
    companyName: company.name,
    phone: '7075836434',
    email: contact.email,
    linkedin: `LinkedIn A ${company.name}`
  });

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
        if (data) {
          setCms({
            companyName: data.company_name || company.name,
            phone: data.phone || '7075836434',
            email: data.email || contact.email,
            linkedin: data.linkedin || `LinkedIn A ${company.name}`
          });
        }
      } catch (err) {
        console.error('Failed to load CMS settings', err);
      }
    };
    fetchCMS();
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
          href="/contact"
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
            <img src={brandLogo} alt="Hire Heaven Software India Private Limited Logo" />
          </motion.a>
          <motion.a
            className="site-footer-youtube-link"
            href="https://youtu.be/5tTtIX92ipY?si=5FNj79hWHgwWRPx3"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Watch the KS Hire Heaven YouTube channel in a new tab"
            whileHover={reduceMotion ? undefined : { scale: 1.03, y: -2 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 450, damping: 20 }}
          >
            <Youtube size={18} aria-hidden="true" />
            <span>Watch Our Channel</span>
            <ArrowRight size={15} aria-hidden="true" />
          </motion.a>
          <p className="site-footer-tagline">Cloud Solutions. Digital Innovation. Business Growth.</p>
          <p className="site-footer-description">{cms.companyName} is an emerging technology company focused on cloud solutions, digital transformation, Azure infrastructure, data, DevOps, analytics, and business technology.</p>
        </motion.section>

        <motion.nav className="site-footer-column" aria-label="Company links" variants={footerReveal} transition={{ duration: reduceMotion ? 0.2 : 0.42 }}>
          <h2>Company</h2>
          {companyLinks.map((item) => <a key={item.label} href={item.href}>{item.label}</a>)}
        </motion.nav>

        <motion.nav className="site-footer-column" aria-label="Cloud services" variants={footerReveal} transition={{ duration: reduceMotion ? 0.2 : 0.42 }}>
          <h2>Cloud Services</h2>
          {serviceLinks.map((service) => <a key={service} href="/#services">{service}</a>)}
        </motion.nav>

        <motion.address className="site-footer-column site-footer-contact" variants={footerReveal} transition={{ duration: reduceMotion ? 0.2 : 0.42 }}>
          <h2>Get in Touch</h2>
          <p className="site-footer-company-name">{cms.companyName}</p>
          <a href={`mailto:${cms.email}`}><Mail size={16} aria-hidden="true" /><span>{cms.email}</span></a>
          <a href={`tel:${cms.phone.replace(/[^0-9+]/g, '')}`}><Phone size={16} aria-hidden="true" /><span>{cms.phone}</span></a>
          <a href="https://wa.me/917981036434" target="_blank" rel="noopener noreferrer"><MessageCircle size={16} aria-hidden="true" /><span>WhatsApp · 7981036434</span><ArrowUpRight size={13} aria-hidden="true" /></a>
          <a href="https://x.com/Kshhsipl" target="_blank" rel="noopener noreferrer"><AtSign size={16} aria-hidden="true" /><span>X · {contact.x}</span><ArrowUpRight size={13} aria-hidden="true" /></a>
          {cms.linkedin && <p className="site-footer-linkedin"><Linkedin size={16} aria-hidden="true" /><a href={cms.linkedin.startsWith('http') ? cms.linkedin : `https://${cms.linkedin}`} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'inherit'}}><span>LinkedIn</span></a></p>}
        </motion.address>
      </motion.div>

      <div className="site-footer-bottom">
        <span>© 2026 {cms.companyName}. All rights reserved.</span>
        <div className="site-footer-legal"><span aria-disabled="true">Privacy Policy</span><span aria-disabled="true">Terms &amp; Conditions</span></div>
      </div>
    </motion.footer>
  );
}
