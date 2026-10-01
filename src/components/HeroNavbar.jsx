import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Menu, Search, X } from 'lucide-react';
import DropdownMenu from './DropdownMenu';
import brandLogo from '../assets/logo.png';

const contactHref = 'mailto:?subject=Cloud%20solutions%20enquiry%20-%20KS%20Hire%20Heaven';

const navigationItems = [
  { label: 'Home', href: '/', hash: 'home' },
  { label: 'About', href: '/about' },
  {
    label: 'Services',
    href: '/',
    hash: 'services',
    dropdown: [
      { label: 'Azure-focused solutions', href: '/', hash: 'services', icon: 'A' },
      { label: 'Multi-cloud capabilities', href: '/', hash: 'services', icon: '◎' },
      { label: 'Security-led delivery', href: '/', hash: 'services', icon: '+' },
      { label: 'How we work', href: '/', hash: 'how-we-work', icon: '↗' },
    ],
  },
  {
    label: 'Cloud Platforms',
    href: '/',
    hash: 'cloud-platforms',
    dropdown: [
      { label: 'Microsoft Azure', href: '/', hash: 'cloud-platforms', icon: 'A' },
      { label: 'Amazon Web Services', href: '/', hash: 'cloud-platforms', icon: 'AWS' },
      { label: 'Google Cloud', href: '/', hash: 'cloud-platforms', icon: 'GC' },
      { label: 'Multi-cloud solutions', href: '/', hash: 'cloud-platforms', icon: '◎' },
    ],
  },
  {
    label: 'Industries',
    href: '/',
    hash: 'industries',
    dropdown: [
      { label: 'Startups & scale-ups', href: '/', hash: 'industries', icon: '↗' },
      { label: 'Small and medium business', href: '/', hash: 'industries', icon: '▣' },
      { label: 'Enterprise', href: '/', hash: 'industries', icon: '▤' },
      { label: 'Education & healthcare', href: '/', hash: 'industries', icon: '+' },
    ],
  },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: contactHref, external: true },
];

function scrollToSection(hash) {
  if (!hash) return;
  const el = document.getElementById(hash);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export default function HeroNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAboutPage = location.pathname.replace(/\/$/, '') === '/about';
  const isCareersPage = location.pathname.replace(/\/$/, '') === '/careers';
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  // Handle hash scrolling after navigation
  useEffect(() => {
    const hash = location.hash?.replace('#', '');
    if (hash) {
      // slight delay to let the page render
      const timer = setTimeout(() => scrollToSection(hash), 80);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const searchResults = useMemo(() => {
    const entries = navigationItems.flatMap((item) => [
      { label: item.label, href: item.href, hash: item.hash, external: item.external },
      ...(item.dropdown || []),
    ]);
    const query = searchQuery.trim().toLowerCase();
    return entries.filter((item) => !query || item.label.toLowerCase().includes(query)).slice(0, 6);
  }, [searchQuery]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setOpenMenu(null);
        setMobileOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  const closeOverlays = () => {
    setOpenMenu(null);
    setMobileOpen(false);
    setSearchOpen(false);
  };

  const handleNavClick = (item, event) => {
    if (item.external) return; // let browser handle mailto
    event.preventDefault();
    closeOverlays();
    if (item.href === '/about' || item.href === '/careers') {
      navigate(item.href);
      return;
    }
    // Internal hash link — navigate to home then scroll
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => scrollToSection(item.hash), 120);
    } else {
      scrollToSection(item.hash);
    }
  };

  const renderLink = (item, className = 'hero-nav-link') => {
    const hasDropdown = Boolean(item.dropdown?.length);
    if (!hasDropdown) {
      const isActive =
        (item.label === 'About' && isAboutPage) ||
        (item.label === 'Careers' && isCareersPage) ||
        (item.label === 'Home' && !isAboutPage && !isCareersPage);
      return (
        <a
          className={`${className}${isActive ? ' is-active' : ''}`}
          href={item.external ? item.href : item.href + (item.hash ? `#${item.hash}` : '')}
          aria-current={isActive ? 'page' : undefined}
          onClick={(e) => handleNavClick(item, e)}
        >
          {item.label}
        </a>
      );
    }

    return (
      <div
        className="hero-nav-item-inner"
        onMouseEnter={() => setOpenMenu(item.label)}
        onMouseLeave={() => setOpenMenu(null)}
      >
        <button
          className={className}
          type="button"
          aria-expanded={openMenu === item.label}
          onFocus={() => setOpenMenu(item.label)}
          onClick={() => setOpenMenu((current) => current === item.label ? null : item.label)}
        >
          {item.label}<ChevronDown size={13} className="hero-nav-chevron" />
        </button>
        <DropdownMenu
          items={item.dropdown}
          isOpen={openMenu === item.label}
          onClose={closeOverlays}
          onItemClick={handleNavClick}
        />
      </div>
    );
  };

  return (
    <motion.header
      className="hero-navbar"
      aria-label="Primary navigation"
      initial={{ x: '-50%', y: -28, opacity: 0 }}
      animate={{ x: '-50%', y: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.a
        className="hero-brand"
        href="/"
        aria-label="KS Hire Heaven home"
        onClick={(e) => { e.preventDefault(); closeOverlays(); navigate('/'); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 60); }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="hero-brand-mark"><img src={brandLogo} alt="" /></span>
        <span className="hero-brand-copy">
          <span className="hero-brand-name">HIRE HEAVEN</span>
          <span className="hero-brand-subtitle">SOFTWARE INDIA PVT LTD</span>
        </span>
      </motion.a>

      <nav className="hero-main-nav" aria-label="Main menu">
        {navigationItems.map((item) => (
          <div className="hero-nav-item" key={item.label}>
            {renderLink(item)}
          </div>
        ))}
      </nav>

      <div className="hero-nav-actions">
        <motion.button
          className="hero-search-button"
          type="button"
          aria-label={searchOpen ? 'Close search' : 'Search'}
          aria-expanded={searchOpen}
          onClick={() => { setSearchOpen((open) => !open); setOpenMenu(null); }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
        >
          <Search size={18} />
        </motion.button>
        <motion.a
          className="hero-contact-button"
          href={contactHref}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 450, damping: 20 }}
        >
          <span>Get in Touch</span>
          <ArrowRight size={16} />
        </motion.a>
      </div>

      <button
        className="hero-mobile-toggle"
        type="button"
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((open) => !open)}
      >
        {mobileOpen ? <X size={21} /> : <Menu size={21} />}
      </button>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="hero-search-panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <label htmlFor="hero-search-input">Search this page</label>
            <div className="hero-search-field">
              <Search size={17} aria-hidden="true" />
              <input
                id="hero-search-input"
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search cloud solutions"
              />
              <button type="button" aria-label="Close search" onClick={() => setSearchOpen(false)}><X size={17} /></button>
            </div>
            <div className="hero-search-results" aria-live="polite">
              {searchResults.length ? searchResults.map((item, index) => (
                <a
                  key={`${item.label}-${index}`}
                  href={item.external ? item.href : item.href + (item.hash ? `#${item.hash}` : '')}
                  onClick={(e) => handleNavClick(item, e)}
                >
                  {item.label}<ArrowRight size={14} />
                </a>
              )) : <p>No matching sections found.</p>}
            </div>
          </motion.div>
        )}
        {mobileOpen && (
          <motion.nav
            className="hero-mobile-menu"
            aria-label="Mobile menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {navigationItems.map((item) => item.dropdown ? (
              <div className="hero-mobile-group" key={item.label}>
                <button
                  type="button"
                  aria-expanded={expandedMobileMenu === item.label}
                  onClick={() => setExpandedMobileMenu((current) => current === item.label ? null : item.label)}
                >
                  {item.label}<ChevronDown size={15} />
                </button>
                {expandedMobileMenu === item.label && (
                  <div className="hero-mobile-submenu">
                    {item.dropdown.map((subitem) => (
                      <a
                        key={subitem.label}
                        href={subitem.external ? subitem.href : subitem.href + (subitem.hash ? `#${subitem.hash}` : '')}
                        onClick={(e) => handleNavClick(subitem, e)}
                      >
                        {subitem.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a
                key={item.label}
                href={item.external ? item.href : item.href + (item.hash ? `#${item.hash}` : '')}
                className={(item.label === 'About' && isAboutPage) || (item.label === 'Careers' && isCareersPage) || (item.label === 'Home' && !isAboutPage && !isCareersPage) ? 'is-active' : undefined}
                aria-current={(item.label === 'About' && isAboutPage) || (item.label === 'Careers' && isCareersPage) || (item.label === 'Home' && !isAboutPage && !isCareersPage) ? 'page' : undefined}
                onClick={(e) => handleNavClick(item, e)}
              >
                {item.label}
              </a>
            ))}
            <button type="button" onClick={() => { setMobileOpen(false); setSearchOpen(true); }}><Search size={16} />Search this page</button>
            <a className="hero-mobile-contact" href={contactHref}>Get in Touch<ArrowRight size={16} /></a>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}