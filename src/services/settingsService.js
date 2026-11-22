import { supabase, hasCustomSupabase } from '../lib/supabase.js';

const SETTINGS_STORAGE_KEY = 'hireheaven_website_settings';
const SETTINGS_EVENT = 'website-settings-updated';
const SETTINGS_CHANNEL_NAME = 'ks_settings_sync_channel';

export const DEFAULT_SETTINGS = {
  company_name: 'KS HIRE HEAVEN SOFTWARE INDIA PRIVATE LIMITED',
  tagline: 'Cloud Solutions. Digital Innovation. Business Growth.',
  description: 'KS HIRE HEAVEN SOFTWARE INDIA PRIVATE LIMITED is an emerging technology company focused on cloud solutions, digital transformation, Azure infrastructure, data, DevOps, analytics, and business technology.',
  email: 'kshh@kshireheaven.in',
  phone: '7075836434',
  whatsapp: '7981036434',
  office_location: 'Alt. F Begumpet',
  maps_link: 'https://maps.app.goo.gl/XfTbnEiJX9VfJzMD9',
  cin: 'U62020TS2026PTC225045',
  incorporation_date: '2026',
  linkedin: 'https://linkedin.com/company/hireheaven',
  instagram: 'https://instagram.com/hireheaven',
  x: '@Kshhsipl',
  // Canonical aliases
  primaryPhone: '7075836434',
  supportEmail: 'kshh@kshireheaven.in',
  companyEmail: 'kshh@kshireheaven.in',
  whatsappNumber: '7981036434',
  officeLocation: 'Alt. F Begumpet',
  address: 'Alt. F Begumpet',
  mapsLink: 'https://maps.app.goo.gl/XfTbnEiJX9VfJzMD9',
  companyName: 'KS HIRE HEAVEN SOFTWARE INDIA PRIVATE LIMITED',
  incorporationDate: '2026'
};

/**
 * Normalizes settings objects to prevent field-name mismatches between
 * admin form, backend API, database, and public frontend components.
 */
export const normalizeSettings = (raw = {}) => {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_SETTINGS };

  // Resolve Phone (canonical: phone; aliases: primaryPhone, contactPhone)
  const phone = raw.phone !== undefined
    ? String(raw.phone)
    : (raw.primaryPhone !== undefined ? String(raw.primaryPhone) : (raw.contactPhone !== undefined ? String(raw.contactPhone) : (DEFAULT_SETTINGS.phone || '')));

  // Resolve Email (canonical: email; aliases: supportEmail, companyEmail)
  const email = raw.email !== undefined
    ? String(raw.email)
    : (raw.supportEmail !== undefined ? String(raw.supportEmail) : (raw.companyEmail !== undefined ? String(raw.companyEmail) : (DEFAULT_SETTINGS.email || '')));

  // Resolve WhatsApp (canonical: whatsapp; alias: whatsappNumber)
  const whatsapp = raw.whatsapp !== undefined
    ? String(raw.whatsapp)
    : (raw.whatsappNumber !== undefined ? String(raw.whatsappNumber) : (DEFAULT_SETTINGS.whatsapp || ''));

  // Resolve Office Location (canonical: office_location; aliases: address, officeLocation)
  const office_location = raw.office_location !== undefined
    ? String(raw.office_location)
    : (raw.address !== undefined ? String(raw.address) : (raw.officeLocation !== undefined ? String(raw.officeLocation) : (DEFAULT_SETTINGS.office_location || '')));

  // Resolve Maps Link (canonical: maps_link; alias: mapsLink)
  const maps_link = raw.maps_link !== undefined
    ? String(raw.maps_link)
    : (raw.mapsLink !== undefined ? String(raw.mapsLink) : (DEFAULT_SETTINGS.maps_link || ''));

  // Resolve Company Name (canonical: company_name; alias: companyName)
  const company_name = raw.company_name !== undefined
    ? String(raw.company_name)
    : (raw.companyName !== undefined ? String(raw.companyName) : (DEFAULT_SETTINGS.company_name || ''));

  // Resolve Incorporation Date (canonical: incorporation_date; alias: incorporationDate)
  let incorporation_date = raw.incorporation_date !== undefined
    ? String(raw.incorporation_date)
    : (raw.incorporationDate !== undefined ? String(raw.incorporationDate) : (DEFAULT_SETTINGS.incorporation_date || '2026'));
  if (incorporation_date.includes('October') || incorporation_date.includes('28')) {
    incorporation_date = '2026';
  }

  const cin = raw.cin !== undefined ? String(raw.cin) : (DEFAULT_SETTINGS.cin || 'U62020TS2026PTC225045');
  const tagline = raw.tagline !== undefined ? String(raw.tagline) : (DEFAULT_SETTINGS.tagline || '');
  const description = raw.description !== undefined ? String(raw.description) : (DEFAULT_SETTINGS.description || '');
  const linkedin = raw.linkedin !== undefined ? String(raw.linkedin) : (DEFAULT_SETTINGS.linkedin || '');
  const instagram = raw.instagram !== undefined ? String(raw.instagram) : (DEFAULT_SETTINGS.instagram || '');
  const x = raw.x !== undefined ? String(raw.x) : (DEFAULT_SETTINGS.x || '');
  const updated_at = raw.updated_at || raw.updatedAt || null;

  return {
    company_name,
    tagline,
    description,
    email,
    phone,
    whatsapp,
    office_location,
    address: office_location,
    officeLocation: office_location,
    maps_link,
    mapsLink: maps_link,
    cin,
    incorporation_date,
    incorporationDate: incorporation_date,
    linkedin,
    instagram,
    x,
    updated_at,
    // Cross-mapping aliases to guarantee no field is undefined
    primaryPhone: phone,
    supportEmail: email,
    companyEmail: email,
    whatsappNumber: whatsapp,
    companyName: company_name,
  };
};

export const getSettingsSync = () => {
  if (typeof window === 'undefined') return { ...DEFAULT_SETTINGS };
  try {
    const local = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      delete parsed.registered_address;
      return normalizeSettings({ ...DEFAULT_SETTINGS, ...parsed });
    }
  } catch (e) {
    console.error('Error reading settings from localStorage:', e);
  }
  return { ...DEFAULT_SETTINGS };
};

export const fetchSettings = async () => {
  let localSettings = getSettingsSync();
  let serverSettings = null;

  // 1. Fetch from live API endpoint with strict anti-caching
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(`/api/websiteSettings?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache, no-store', 'Pragma': 'no-cache' }
      });
      if (res.ok) {
        const apiData = await res.json();
        if (apiData && typeof apiData === 'object' && Object.keys(apiData).length > 0) {
          serverSettings = normalizeSettings(apiData);
        }
      }
    } catch (e) {
      // Offline/API fallback
    }
  }

  // 2. Fetch from Supabase if configured with custom credentials
  if (hasCustomSupabase()) {
    try {
      const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
      if (data && !error) {
        serverSettings = normalizeSettings({ ...(serverSettings || {}), ...data });
      }
    } catch (err) {
      console.warn('Supabase fetch notice:', err);
    }
  }

  // 3. Stale Response Reconciliation:
  // If we got a server response, compare timestamps to prevent an older/cold-start server
  // response from overwriting newer local admin changes.
  if (serverSettings) {
    const localTime = localSettings.updated_at ? new Date(localSettings.updated_at).getTime() : 0;
    const serverTime = serverSettings.updated_at ? new Date(serverSettings.updated_at).getTime() : 0;

    // If local settings were saved more recently than the server's replica, protect local settings
    // and re-persist local settings to heal the server replica.
    if (localTime > serverTime && localSettings.phone) {
      saveSettings(localSettings).catch(() => {});
      return localSettings;
    }

    // Server is newer or equal: adopt server data as authoritative source of truth
    const authoritative = normalizeSettings({ ...localSettings, ...serverSettings });
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(authoritative));
    } catch (e) {}
    return authoritative;
  }

  return localSettings;
};

export const notifySettingsUpdated = (data) => {
  if (typeof window === 'undefined') return;

  const normalized = normalizeSettings(data);

  // 1. BroadcastChannel for cross-tab synchronization
  try {
    const channel = new BroadcastChannel(SETTINGS_CHANNEL_NAME);
    channel.postMessage({ timestamp: Date.now(), data: normalized });
    setTimeout(() => {
      try { channel.close(); } catch (e) {}
    }, 500);
  } catch (e) {}

  // 2. CustomEvent for within-page synchronization
  try {
    window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: normalized }));
  } catch (e) {}

  // 3. Storage timestamp for cross-window notification
  try {
    localStorage.setItem('hireheaven_settings_last_updated', Date.now().toString());
  } catch (e) {}
};

export const saveSettings = async (newSettings, options = {}) => {
  const current = getSettingsSync();
  const normalizedIncoming = normalizeSettings({ ...current, ...newSettings });
  normalizedIncoming.updated_at = new Date().toISOString();

  let remoteSuccess = false;
  let remoteError = null;
  let confirmedData = { ...normalizedIncoming };

  // 1. Send authoritative update to backend database API (/api/websiteSettings)
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/websiteSettings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store'
        },
        body: JSON.stringify(normalizedIncoming)
      });

      if (res.ok) {
        const json = await res.json();
        if (json && typeof json === 'object') {
          confirmedData = normalizeSettings({ ...normalizedIncoming, ...json });
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
          body: JSON.stringify(normalizedIncoming)
        });
        if (postRes.ok) {
          const json = await postRes.json();
          if (json && typeof json === 'object') {
            confirmedData = normalizeSettings({ ...normalizedIncoming, ...json });
          }
          remoteSuccess = true;
        } else {
          remoteError = `Server responded with status ${res.status}`;
        }
      }
    } catch (err) {
      remoteError = err?.message || 'Network request failed';
    }
  }

  // 2. Also persist to Supabase if custom credentials configured
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
        updated_at: confirmedData.updated_at
      }).select().single();

      if (!error) {
        remoteSuccess = true;
        if (data) {
          confirmedData = normalizeSettings({ ...confirmedData, ...data });
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

  // 3. Authoritative verification: only confirm persistence if remote DB write succeeded
  if (remoteSuccess) {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(confirmedData));
      } catch (err) {
        console.error('Failed to write to localStorage:', err);
      }
    }

    notifySettingsUpdated(confirmedData);

    return {
      success: true,
      remoteSynced: true,
      localOnly: false,
      data: confirmedData,
      message: 'Settings saved successfully! Remote database synchronized and live website updated.'
    };
  } else {
    // Database write failed: do NOT treat localStorage as success
    if (options && options.allowLocalFallback) {
      if (typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(normalizedIncoming));
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
  
  let channel = null;
  try {
    channel = new BroadcastChannel(SETTINGS_CHANNEL_NAME);
    channel.onmessage = (event) => {
      if (event?.data?.data) {
        callback(normalizeSettings(event.data.data));
      } else {
        fetchSettings().then(res => callback(normalizeSettings(res)));
      }
    };
  } catch (e) {}

  const handleCustomEvent = (e) => {
    if (e.detail) {
      callback(normalizeSettings(e.detail));
    }
  };
  
  const handleStorageEvent = (e) => {
    if (e.key === SETTINGS_STORAGE_KEY && e.newValue) {
      try {
        callback(normalizeSettings(JSON.parse(e.newValue)));
      } catch (err) {}
    } else if (e.key === 'hireheaven_settings_last_updated') {
      fetchSettings().then(res => callback(normalizeSettings(res)));
    }
  };

  const handleFocus = () => {
    fetchSettings().then(res => callback(normalizeSettings(res)));
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      fetchSettings().then(res => callback(normalizeSettings(res)));
    }
  };

  window.addEventListener(SETTINGS_EVENT, handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);
  window.addEventListener('focus', handleFocus);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    if (channel) {
      try { channel.close(); } catch (e) {}
    }
    window.removeEventListener(SETTINGS_EVENT, handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
    window.removeEventListener('focus', handleFocus);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
};

export const subscribeSettings = subscribeToSettings;

