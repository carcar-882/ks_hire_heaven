import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Menu, Search, X } from 'lucide-react';
import DropdownMenu from './DropdownMenu';
import brandLogo from '../assets/logo.jpg';

const contactHref = 'mailto:?subject=Cloud%20solutions%20enquiry%20-%20KS%20Hire%20Heaven';

const navItems = [
  { label: 'Home', href: '#home', active: true },
  {
    label: 'Services',
    href: '#services',
    dropdown: [
      { label: 'Azure-focused solutions', href: '#services', icon: 'A' },
      { label: 'Multi-cloud capabilities', href: '#services', icon: '◎' },
      { label: 'Security-led delivery', href: '#services', icon: '+' },
      { label: 'Business-ready cloud', href: '#services', icon: '↗' },
    ],
  },
  {
    label: 'Cloud Platforms',
    href: '#platforms',
    dropdown: [
      { label: 'Microsoft Azure', href: '#platforms', icon: 'A' },
      { label: 'Amazon Web Services', href: '#platforms', icon: 'AWS' },
      { label: 'Google Cloud', href: '#platforms', icon: 'GC' },
      { label: 'Multi-cloud solutions', href: '#platforms', icon: '◎' },
    ],
  },
  { label: 'How We Work', href: '#how-we-work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: contactHref },
];

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  const searchResults = useMemo(() => {
    const entries = navItems.flatMap((item) => [
      { label: item.label, href: item.href },
      ...(item.dropdown || []),
    ]);
    const query = searchQuery.trim().toLowerCase();
    return entries
      .filter((item) => !query || item.label.toLowerCase().includes(query))
      .slice(0, 6);
  }, [searchQuery]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpenMenu(null);
        setSearchOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const closeMenus = () => {
    setOpenMenu(null);
    setMobileOpen(false);
    setSearchOpen(false);
  };

  return (
    <header
      className={`topbar ${scrolled ? 'topbar--scrolled' : ''}`}
      aria-label="Primary navigation"
      onKeyDown={(event) => event.key === 'Escape' && closeMenus()}
    >
      <a className="brand" href="#home" aria-label="KS Hire Heaven home" onClick={closeMenus}>
        <img src={brandLogo} alt="KS Hire Heaven" className="brand-logo" />
      </a>

      <nav className="main-nav" aria-label="Main menu">
        {navItems.map((item) => {
          const hasDropdown = Boolean(item.dropdown?.length);
          const isActive = item.active;

          return (
            <div
              key={item.label}
              className="nav-item"
              onMouseEnter={() => hasDropdown && setOpenMenu(item.label)}
              onMouseLeave={() => hasDropdown && setOpenMenu(null)}
            >
              {hasDropdown ? (
                <button
                  type="button"
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setOpenMenu(item.label)}
                  onFocus={() => setOpenMenu(item.label)}
                  aria-expanded={openMenu === item.label}
                >
                  <span>{item.label}</span>
                  <ChevronDown size={14} className="nav-chevron" />
                </button>
              ) : (
                <a className={`nav-link ${isActive ? 'active' : ''}`} href={item.href} onClick={closeMenus}>
                  {item.label}
                </a>
              )}

              {hasDropdown && (
                <DropdownMenu
                  items={item.dropdown}
                  isOpen={openMenu === item.label}
                  onClose={closeMenus}
                />
              )}
            </div>
          );
        })}
      </nav>

      <div className="nav-actions">
        <button
          type="button"
          className="icon-button"
          aria-label={searchOpen ? 'Close search' : 'Search'}
          aria-expanded={searchOpen}
          onClick={() => {
            setSearchOpen((open) => !open);
            setOpenMenu(null);
          }}
        >
          <Search size={18} />
        </button>
        <a className="header-cta" href={contactHref}>
          Get in Touch
          <ArrowRight size={18} />
        </a>
      </div>

      <button
        type="button"
        className="mobile-menu-toggle"
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setMobileOpen((prev) => !prev)}
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="nav-search-panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <label className="nav-search-label" htmlFor="nav-search-input">Search this page</label>
            <div className="nav-search-field">
              <Search size={17} aria-hidden="true" />
              <input
                id="nav-search-input"
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search cloud solutions"
              />
              <button type="button" aria-label="Close search" onClick={() => setSearchOpen(false)}>
                <X size={17} />
              </button>
            </div>
            <div className="nav-search-results" aria-live="polite">
              {searchResults.length ? searchResults.map((result, index) => (
                <a key={`${result.label}-${index}`} href={result.href} onClick={closeMenus}>
                  {result.label}<ArrowRight size={14} />
                </a>
              )) : <p>No matching sections found.</p>}
            </div>
          </motion.div>
        )}
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="mobile-menu-item" onClick={closeMenus}>
                {item.label}
              </a>
            ))}
            <button
              type="button"
              className="mobile-search-button"
              onClick={() => {
                setMobileOpen(false);
                setSearchOpen(true);
              }}
            >
              <Search size={17} />
              Search this page
            </button>
            <a href={contactHref} className="mobile-cta" onClick={closeMenus}>
              Get in Touch
              <ArrowRight size={18} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
