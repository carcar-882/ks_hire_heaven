import { supabase } from '../lib/supabase.js';

const SETTINGS_STORAGE_KEY = 'hireheaven_website_settings';
const SETTINGS_EVENT = 'website-settings-updated';

export const DEFAULT_SETTINGS = {
  company_name: 'KS HIRE HEAVEN SOFTWARE INDIA PRIVATE LIMITED',
  tagline: 'Cloud Solutions. Digital Innovation. Business Growth.',
  description: 'KS HIRE HEAVEN SOFTWARE INDIA PRIVATE LIMITED is an emerging technology company focused on cloud solutions, digital transformation, Azure infrastructure, data, DevOps, analytics, and business technology.',
  email: 'kshh@kshireheaven.in',
  phone: '7075836434',
  whatsapp: '7981036434',
  office_location: 'Alt. F, Begumpet, Hyderabad, Telangana, India.',
  maps_link: 'https://maps.google.com/?q=Alt.+F,+Begumpet,+Hyderabad,+Telangana,+India',
  registered_address: 'Plot No. 230 N/P, Sri Bhagya Nagar Colony, Hayathnagar, Hayathnagar, K.V. Rangareddy – 501505, Telangana, India.',
  cin: 'U62020TS2026PTC225045',
  incorporation_date: '28 October 2026',
  linkedin: 'https://linkedin.com/company/hireheaven',
  instagram: 'https://instagram.com/hireheaven',
  x: '@Kshhsipl'
};

const hasCustomSupabase = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) {
    return !import.meta.env.VITE_SUPABASE_URL.includes('gzspuubdjcllvejfqcmz');
  }
  if (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) {
    return !process.env.VITE_SUPABASE_URL.includes('gzspuubdjcllvejfqcmz');
  }
  return false;
};

export const getSettingsSync = () => {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const local = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.error('Error reading settings from localStorage:', e);
  }
  return DEFAULT_SETTINGS;
};

export const fetchSettings = async () => {
  let settings = getSettingsSync();

  // 1. Try local/Vercel API endpoint if available in browser
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/websiteSettings');
      if (res.ok) {
        const apiData = await res.json();
        if (apiData && typeof apiData === 'object') {
          settings = { ...settings, ...apiData };
          try {
            localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
          } catch (e) {}
        }
      }
    } catch (e) {
      // Local/offline API fallback
    }
  }

  // 2. Try Supabase if an active production project is configured
  if (hasCustomSupabase()) {
    try {
      const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
      if (data && !error) {
        const remoteMapped = {
          company_name: data.company_name || settings.company_name,
          tagline: data.tagline || settings.tagline,
          description: data.description || settings.description,
          email: data.email || settings.email,
          phone: data.phone || settings.phone,
          whatsapp: data.whatsapp || settings.whatsapp,
          office_location: data.address || data.office_location || settings.office_location,
          maps_link: data.maps_link || settings.maps_link,
          registered_address: data.registered_address || settings.registered_address,
          cin: data.cin || settings.cin,
          incorporation_date: data.incorporation_date || settings.incorporation_date,
          linkedin: data.linkedin || settings.linkedin,
          instagram: data.instagram || settings.instagram,
          x: data.x || settings.x,
        };
        settings = { ...settings, ...remoteMapped };
        try {
          localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
        } catch (err) {}
      }
    } catch (err) {
      console.warn('Supabase fetch notice:', err);
    }
  }

  return settings;
};

export const saveSettings = async (newSettings) => {
  const merged = { ...getSettingsSync(), ...newSettings };
  
  // 1. Persist locally first so changes are immediate & durable
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));
    } catch (err) {
      console.error('Failed to write to localStorage:', err);
    }
  }

  // 2. Dispatch event for real-time live synchronization in this and other components
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: merged }));
  }

  // 3. Try to sync with /api/websiteSettings backend endpoint if available
  if (typeof window !== 'undefined') {
    try {
      await fetch('/api/websiteSettings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged)
      });
    } catch (e) {
      // API sync notice
    }
  }

  // 4. Sync with Supabase if configured with active credentials
  if (hasCustomSupabase()) {
    try {
      await supabase.from('settings').upsert({
        id: 1,
        company_name: merged.company_name,
        tagline: merged.tagline,
        description: merged.description,
        email: merged.email,
        phone: merged.phone,
        whatsapp: merged.whatsapp,
        address: merged.office_location,
        office_location: merged.office_location,
        maps_link: merged.maps_link,
        registered_address: merged.registered_address,
        cin: merged.cin,
        incorporation_date: merged.incorporation_date,
        linkedin: merged.linkedin,
        instagram: merged.instagram,
        x: merged.x,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase sync notice:', err);
    }
  }

  return {
    success: true,
    data: merged
  };
};

export const subscribeSettings = (callback) => {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = (event) => {
    if (event.detail) callback(event.detail);
  };

  const handleStorageEvent = (event) => {
    if (event.key === SETTINGS_STORAGE_KEY && event.newValue) {
      try {
        callback(JSON.parse(event.newValue));
      } catch (e) {}
    }
  };

  window.addEventListener(SETTINGS_EVENT, handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    window.removeEventListener(SETTINGS_EVENT, handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
  };
};
