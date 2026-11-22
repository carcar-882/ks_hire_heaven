import React from 'react';
import { describe, it, expect, beforeEach, afterEach, beforeAll, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  DEFAULT_SETTINGS,
  normalizeSettings,
  getSettingsSync,
  fetchSettings,
  saveSettings,
  subscribeSettings,
} from './settingsService';
import Footer from '../components/Footer';

beforeAll(() => {
  global.IntersectionObserver = class {
    constructor() {}
    observe() { return null; }
    unobserve() { return null; }
    disconnect() { return null; }
  };
});

describe('Website CMS & Settings Synchronization Suite', () => {
  const SETTINGS_STORAGE_KEY = 'hireheaven_website_settings';

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // Scenario 1: Saving a new primary phone number updates the database/backend
  it('Scenario 1: Saving a new primary phone number sends authoritative payload to backend', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        phone: '70758364341',
        primaryPhone: '70758364341',
        updated_at: new Date().toISOString()
      })
    });
    global.fetch = fetchMock;

    const result = await saveSettings({ phone: '70758364341' });
    
    expect(result.success).toBe(true);
    expect(result.remoteSynced).toBe(true);
    expect(result.data.phone).toBe('70758364341');
    expect(result.data.primaryPhone).toBe('70758364341');
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/websiteSettings',
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({ 'Cache-Control': 'no-cache, no-store' })
      })
    );
  });

  // Scenario 2: Public website API returns the new phone number
  it('Scenario 2: Public website API returns the new phone number and normalizes aliases', async () => {
    const mockApiData = {
      phone: '70758364341',
      email: 'kshh@kshireheaven.in',
      office_location: 'Alt. F Begumpet',
      updated_at: '2026-11-22T10:00:00.000Z'
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockApiData
    });

    const settings = await fetchSettings();
    expect(settings.phone).toBe('70758364341');
    expect(settings.primaryPhone).toBe('70758364341');
    expect(settings.office_location).toBe('Alt. F Begumpet');
  });

  // Scenario 3: Rendered public website displays the updated phone number
  it('Scenario 3: Rendered public website (Footer) displays the updated phone number and office location', async () => {
    const updatedSettings = normalizeSettings({
      phone: '70758364341',
      primaryPhone: '70758364341',
      email: 'kshh@kshireheaven.in',
      whatsapp: '7981036434',
      office_location: 'Alt. F Begumpet',
      maps_link: 'https://maps.app.goo.gl/XfTbnEiJX9VfJzMD9'
    });

    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => updatedSettings
    });

    render(<Footer />);

    // Check phone number is displayed
    expect(screen.getByText('70758364341')).toBeInTheDocument();
    // Check office location is displayed
    expect(screen.getByText('Alt. F Begumpet')).toBeInTheDocument();
    // Check email is displayed
    expect(screen.getByText('kshh@kshireheaven.in')).toBeInTheDocument();
    // Check WhatsApp is displayed
    expect(screen.getByText(/7981036434/)).toBeInTheDocument();
  });

  // Scenario 4: Changes to email and WhatsApp number reflect correctly
  it('Scenario 4: Changes to email and WhatsApp number reflect correctly bidirectionally', () => {
    const fromAliases = normalizeSettings({
      supportEmail: 'contact@kshireheaven.in',
      whatsappNumber: '9876543210'
    });

    expect(fromAliases.email).toBe('contact@kshireheaven.in');
    expect(fromAliases.supportEmail).toBe('contact@kshireheaven.in');
    expect(fromAliases.whatsapp).toBe('9876543210');
    expect(fromAliases.whatsappNumber).toBe('9876543210');

    const fromCanonicals = normalizeSettings({
      email: 'new@kshireheaven.in',
      whatsapp: '1234567890'
    });

    expect(fromCanonicals.email).toBe('new@kshireheaven.in');
    expect(fromCanonicals.supportEmail).toBe('new@kshireheaven.in');
    expect(fromCanonicals.whatsapp).toBe('1234567890');
    expect(fromCanonicals.whatsappNumber).toBe('1234567890');
  });

  // Scenario 5: Office location and social media links update correctly
  it('Scenario 5: Office location and social media links update correctly with address aliases', () => {
    const settings = normalizeSettings({
      office_location: 'Alt. F Begumpet',
      maps_link: 'https://maps.app.goo.gl/XfTbnEiJX9VfJzMD9',
      linkedin: 'https://linkedin.com/company/hireheaven',
      x: '@Kshhsipl'
    });

    expect(settings.office_location).toBe('Alt. F Begumpet');
    expect(settings.address).toBe('Alt. F Begumpet');
    expect(settings.officeLocation).toBe('Alt. F Begumpet');
    expect(settings.maps_link).toBe('https://maps.app.goo.gl/XfTbnEiJX9VfJzMD9');
    expect(settings.mapsLink).toBe('https://maps.app.goo.gl/XfTbnEiJX9VfJzMD9');
    expect(settings.linkedin).toBe('https://linkedin.com/company/hireheaven');
    expect(settings.x).toBe('@Kshhsipl');
  });

  // Scenario 6: Cached responses are invalidated/refreshed after saving
  it('Scenario 6: Fetch requests bypass cache using timestamp query params and anti-cache headers', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ phone: '70758364341' })
    });
    global.fetch = fetchMock;

    await fetchSettings();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const calledUrl = fetchMock.mock.calls[0][0];
    const calledOptions = fetchMock.mock.calls[0][1];

    expect(calledUrl).toMatch(/\/api\/websiteSettings\?t=\d+/);
    expect(calledOptions.cache).toBe('no-store');
    expect(calledOptions.headers['Cache-Control']).toContain('no-cache');
  });

  // Scenario 7: Failed database writes do not display a success message
  it('Scenario 7: Failed database writes return failure and do not claim success', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500
    });

    const result = await saveSettings({ phone: '70758364341' });

    expect(result.success).toBe(false);
    expect(result.remoteSynced).toBe(false);
    expect(result.message).toContain('Unable to synchronize');
  });

  // Scenario 8: Failed publication/synchronization does not falsely report live update
  it('Scenario 8: Network failure during save returns failure and prevents false live update report', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error: connection refused'));

    const result = await saveSettings({ phone: '70758364341' });

    expect(result.success).toBe(false);
    expect(result.remoteSynced).toBe(false);
    expect(result.error).toContain('connection refused');
  });

  // Scenario 9: Reloading admin page shows persisted database values
  it('Scenario 9: Reloading admin page retrieves and synchronizes persisted database values', async () => {
    const persistedDbSettings = {
      phone: '70758364341',
      primaryPhone: '70758364341',
      email: 'kshh@kshireheaven.in',
      office_location: 'Alt. F Begumpet',
      updated_at: '2026-11-22T12:00:00.000Z'
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => persistedDbSettings
    });

    const loadedSettings = await fetchSettings();
    expect(loadedSettings.phone).toBe('70758364341');
    expect(loadedSettings.office_location).toBe('Alt. F Begumpet');
    
    // Check it is also persisted in localStorage for immediate sync on next reload
    const cached = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY));
    expect(cached.phone).toBe('70758364341');
  });

  // Scenario 10: Multiple consecutive updates do not restore stale values
  it('Scenario 10: Multiple consecutive updates reconcile by timestamp and reject older replicas', async () => {
    const now = Date.now();
    const newerTime = new Date(now + 10000).toISOString();
    const staleServerTime = new Date(now - 10000).toISOString();

    // 1. Admin locally saves newer value (e.g., 70758364341)
    const localSettings = normalizeSettings({
      phone: '70758364341',
      updated_at: newerTime
    });
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(localSettings));

    // 2. A stale server replica responds with old value (7075836434) and older timestamp
    const staleServerResponse = {
      phone: '7075836434',
      updated_at: staleServerTime
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => staleServerResponse
    });
    global.fetch = fetchMock;

    // 3. fetchSettings is triggered (e.g. by tab focus)
    const result = await fetchSettings();

    // 4. The newer value MUST NOT be overwritten by the stale server response
    expect(result.phone).toBe('70758364341');
    expect(result.primaryPhone).toBe('70758364341');
  });
});
