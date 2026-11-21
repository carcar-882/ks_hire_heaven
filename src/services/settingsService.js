import { supabase, hasCustomSupabase } from '../lib/supabase.js';

const SETTINGS_STORAGE_KEY = 'hireheaven_website_settings';
const SETTINGS_EVENT = 'website-settings-updated';

export const DEFAULT_SETTINGS = {
  company_name: 'KS HIRE HEAVEN SOFTWARE INDIA PRIVATE LIMITED',
  tagline: 'Cloud Solutions. Digital Innovation. Business Growth.',
  description: 'KS HIRE HEAVEN SOFTWARE INDIA PRIVATE LIMITED is an emerging technology company focused on cloud solutions, digital transformation, Azure infrastructure, data, DevOps, analytics, and business technology.',
  email: 'kshh@kshireheaven.in',
  phone: '7075836434',
  whatsapp: '7981036434',
  office_location: 'Hyderabad',
  maps_link: 'https://maps.google.com/?q=Hyderabad,+Telangana,+India',
  cin: 'U62020TS2026PTC225045',
  incorporation_date: '2026',
  linkedin: 'https://linkedin.com/company/hireheaven',
  instagram: 'https://instagram.com/hireheaven',
  x: '@Kshhsipl'
};

export const getSettingsSync = () => {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const local = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      // Cleanse outdated cached values
      if (parsed.office_location && (parsed.office_location.includes('Begumpet') || parsed.office_location.includes('Alt. F'))) {
        parsed.office_location = 'Hyderabad';
      }
      if (parsed.maps_link && parsed.maps_link.includes('Begumpet')) {
        parsed.maps_link = 'https://maps.google.com/?q=Hyderabad,+Telangana,+India';
      }
      if (parsed.incorporation_date && (parsed.incorporation_date.includes('October') || parsed.incorporation_date.includes('28'))) {
        parsed.incorporation_date = '2026';
      }
      delete parsed.registered_address;
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.error('Error reading settings from localStorage:', e);
  }
  return DEFAULT_SETTINGS;
};

export const fetchSettings = async () => {
  let settings = getSettingsSync();

  // 1. Try local/Vercel API endpoint as the primary remote database source of truth
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(`/api/websiteSettings?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache, no-store', 'Pragma': 'no-cache' }
      });
      if (res.ok) {
        const apiData = await res.json();
        if (apiData && typeof apiData === 'object') {
          if (apiData.office_location && (apiData.office_location.includes('Begumpet') || apiData.office_location.includes('Alt. F'))) {
            apiData.office_location = 'Hyderabad';
          }
          if (apiData.incorporation_date && (apiData.incorporation_date.includes('October') || apiData.incorporation_date.includes('28'))) {
            apiData.incorporation_date = '2026';
          }
          delete apiData.registered_address;
          settings = { ...DEFAULT_SETTINGS, ...settings, ...apiData };
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
          office_location: (data.address || data.office_location || settings.office_location || '').includes('Begumpet') ? 'Hyderabad' : (data.address || data.office_location || settings.office_location),
          maps_link: data.maps_link || settings.maps_link,
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

export const saveSettings = async (newSettings, options = {}) => {
  const current = getSettingsSync();
  const merged = { ...current, ...newSettings };
  delete merged.registered_address;
  if (merged.office_location && (merged.office_location.includes('Begumpet') || merged.office_location.includes('Alt. F'))) {
    merged.office_location = 'Hyderabad';
  }
  if (merged.incorporation_date && (merged.incorporation_date.includes('October') || merged.incorporation_date.includes('28'))) {
    merged.incorporation_date = '2026';
  }

  let remoteSuccess = false;
  let remoteError = null;
  let confirmedData = { ...merged };

  // 1. Send the updated settings to the central remote database endpoint (/api/websiteSettings)
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/websiteSettings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store'
        },
        body: JSON.stringify(merged)
      });

      if (res.ok) {
        const json = await res.json();
        if (json && typeof json === 'object') {
          confirmedData = { ...confirmedData, ...json };
        }
        remoteSuccess = true;
      } else {
        // Fallback attempt with POST
        const postRes = await fetch('/api/websiteSettings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store'
          },
          body: JSON.stringify(merged)
        });
        if (postRes.ok) {
          const json = await postRes.json();
          if (json && typeof json === 'object') {
            confirmedData = { ...confirmedData, ...json };
          }
          remoteSuccess = true;
        } else {
          remoteError = `Backend error ${res.status}`;
        }
      }
    } catch (err) {
      remoteError = err?.message || 'Network request failed';
    }
  }

  // 2. Also synchronize with Supabase if a valid custom production database is connected
  if (hasCustomSupabase()) {
    try {
      const { data, error } = await supabase.from('settings').upsert({
        id: 1,
        company_name: confirmedData.company_name,
        tagline: confirmedData.tagline,
        description: confirmedData.description,
        email: confirmedData.email,
        phone: confirmedData.phone,
        whatsapp: confirmedData.whatsapp,
        address: confirmedData.office_location,
        office_location: confirmedData.office_location,
        maps_link: confirmedData.maps_link,
        cin: confirmedData.cin,
        incorporation_date: confirmedData.incorporation_date,
        linkedin: confirmedData.linkedin,
        instagram: confirmedData.instagram,
        x: confirmedData.x,
        updated_at: new Date().toISOString()
      }).select().single();

      if (!error) {
        remoteSuccess = true;
        if (data) {
          confirmedData = { ...confirmedData, ...data };
        }
      } else if (!remoteSuccess) {
        remoteError = error.message;
      }
    } catch (err) {
      if (!remoteSuccess) {
        remoteError = err?.message || 'Remote database error';
      }
    }
  }

  // 3. Evaluate persistence: Remote database persistence must be the source of truth
  if (remoteSuccess) {
    // Persist to local cache only AFTER remote database confirms persistence
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(confirmedData));
      } catch (err) {
        console.error('Failed to write to localStorage:', err);
      }
    }

    // Dispatch event for instant multi-component reactivity
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: confirmedData }));
    }

    return {
      success: true,
      remoteSynced: true,
      localOnly: false,
      data: confirmedData,
      message: 'Settings saved successfully! Remote database synchronized and live website updated.'
    };
  } else {
    // Remote database save failed - do NOT treat localStorage as success
    if (options && options.allowLocalFallback) {
      if (typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));
        } catch (err) {}
      }
      return {
        success: false,
        remoteSynced: false,
        localOnly: true,
        error: remoteError,
        message: 'Changes saved locally but not synchronized with the server.'
      };
    }

    return {
      success: false,
      remoteSynced: false,
      localOnly: false,
      error: remoteError,
      message: 'Unable to synchronize settings with the remote database. Please check your connection and try again.'
    };
  }
};

export const subscribeToSettings = (callback) => {
  if (typeof window === 'undefined') return () => {};
  
  const handleCustomEvent = (e) => {
    callback(e.detail);
  };
  
  const handleStorageEvent = (e) => {
    if (e.key === SETTINGS_STORAGE_KEY && e.newValue) {
      try {
        callback(JSON.parse(e.newValue));
      } catch (err) {}
    }
  };

  window.addEventListener(SETTINGS_EVENT, handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    window.removeEventListener(SETTINGS_EVENT, handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
  };
};

export const subscribeSettings = subscribeToSettings;

