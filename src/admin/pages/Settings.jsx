import React, { useState, useEffect } from 'react';
import { Save, Globe, LayoutTemplate, Mail, Phone, MapPin, Building2, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import { getSettingsSync, fetchSettings, saveSettings } from '../../services/settingsService';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState(() => getSettingsSync());
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetchSettings().then((remoteSettings) => {
      if (isMounted && remoteSettings) {
        setFormData(remoteSettings);
      }
      if (isMounted) setLoading(false);
    }).catch(() => {
      if (isMounted) setLoading(false);
    });
    return () => { isMounted = false; };
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const result = await saveSettings(formData);
      if (result.success) {
        setFeedback({
          type: 'success',
          message: 'Settings saved successfully! The live website and footer have been updated immediately.'
        });
      } else {
        setFeedback({
          type: 'error',
          message: 'Failed to save settings: ' + (result.error || 'Unknown error')
        });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setFeedback({
        type: 'error',
        message: 'Error saving settings: ' + (error?.message || error)
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '48px', textAlign: 'center' }}>Loading Website CMS Settings...</div>;

  return (
    <div className="settings-module">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, marginBottom: '8px' }}>Website CMS &amp; Settings</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Manage live website details, footer information, incorporation data, and contact addresses.
          </p>
        </div>
        <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <Save size={16} /> {saving ? 'Saving Changes...' : 'Save & Update Live Site'}
        </button>
      </div>

      {feedback && (
        <div style={{
          padding: '14px 18px',
          borderRadius: '8px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.9rem',
          backgroundColor: feedback.type === 'success' ? '#e8f5e9' : feedback.type === 'info' ? '#e0f2fe' : '#fef2f2',
          border: `1px solid ${feedback.type === 'success' ? '#a5d6a7' : feedback.type === 'info' ? '#bae6fd' : '#fecaca'}`,
          color: feedback.type === 'success' ? '#1b5e20' : feedback.type === 'info' ? '#0369a1' : '#991b1b'
        }}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : feedback.type === 'info' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 250px) 1fr', gap: '24px' }}>
        <div className="admin-card" style={{ padding: '0', alignSelf: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <button
              className="icon-btn"
              style={{
                borderRadius: 0,
                justifyContent: 'flex-start',
                padding: '16px',
                background: activeTab === 'general' ? 'var(--bg-color)' : 'transparent',
                borderLeft: activeTab === 'general' ? '3px solid var(--primary-purple)' : '3px solid transparent',
                width: '100%',
                display: 'flex',
                gap: '12px',
                fontWeight: activeTab === 'general' ? '600' : 'normal'
              }}
              onClick={() => setActiveTab('general')}
            >
              <Globe size={18} /> Contact &amp; Office
            </button>
            <button
              className="icon-btn"
              style={{
                borderRadius: 0,
                justifyContent: 'flex-start',
                padding: '16px',
                background: activeTab === 'legal' ? 'var(--bg-color)' : 'transparent',
                borderLeft: activeTab === 'legal' ? '3px solid var(--primary-purple)' : '3px solid transparent',
                width: '100%',
                display: 'flex',
                gap: '12px',
                fontWeight: activeTab === 'legal' ? '600' : 'normal'
              }}
              onClick={() => setActiveTab('legal')}
            >
              <Building2 size={18} /> Legal &amp; Incorporation
            </button>
            <button
              className="icon-btn"
              style={{
                borderRadius: 0,
                justifyContent: 'flex-start',
                padding: '16px',
                background: activeTab === 'footer' ? 'var(--bg-color)' : 'transparent',
                borderLeft: activeTab === 'footer' ? '3px solid var(--primary-purple)' : '3px solid transparent',
                width: '100%',
                display: 'flex',
                gap: '12px',
                fontWeight: activeTab === 'footer' ? '600' : 'normal'
              }}
              onClick={() => setActiveTab('footer')}
            >
              <LayoutTemplate size={18} /> Footer &amp; Social Links
            </button>
          </div>
        </div>

        <div className="admin-card">
          {activeTab === 'general' && (
            <div>
              <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                Company Contact &amp; Office Details
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem' }}>Company Display Name</label>
                  <input
                    type="text"
                    value={formData.company_name || ''}
                    onChange={e => handleInputChange('company_name', e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem' }}>Company / Support Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={e => handleInputChange('email', e.target.value)}
                      placeholder="kshh@kshireheaven.in"
                      style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid var(--border-color)', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem' }}>Primary Phone</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type="text"
                      value={formData.phone || ''}
                      onChange={e => handleInputChange('phone', e.target.value)}
                      style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid var(--border-color)', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem' }}>WhatsApp Number</label>
                  <input
                    type="text"
                    value={formData.whatsapp || ''}
                    onChange={e => handleInputChange('whatsapp', e.target.value)}
                    placeholder="7981036434"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem' }}>
                    Office Location
                  </label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type="text"
                      value={formData.office_location || ''}
                      onChange={e => handleInputChange('office_location', e.target.value)}
                      placeholder="Hyderabad"
                      style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid var(--border-color)', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem' }}>Google Maps Location URL</label>
                  <input
                    type="url"
                    value={formData.maps_link || ''}
                    onChange={e => handleInputChange('maps_link', e.target.value)}
                    placeholder="https://maps.google.com/?q=Hyderabad,+Telangana,+India"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'legal' && (
            <div>
              <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                Legal &amp; Company Incorporation Information
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
                These details appear in the official Legal section of the Footer and About Us pages according to the Certificate of Incorporation.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem' }}>Full Registered Company Name</label>
                  <input
                    type="text"
                    value={formData.company_name || ''}
                    onChange={e => handleInputChange('company_name', e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem' }}>Corporate Identity Number (CIN)</label>
                  <input
                    type="text"
                    value={formData.cin || ''}
                    onChange={e => handleInputChange('cin', e.target.value)}
                    placeholder="U62020TS2026PTC225045"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', boxSizing: 'border-box', fontFamily: 'monospace' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem' }}>Date of Incorporation</label>
                  <input
                    type="text"
                    value={formData.incorporation_date || ''}
                    onChange={e => handleInputChange('incorporation_date', e.target.value)}
                    placeholder="October 2026"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'footer' && (
            <div>
              <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                Footer Content &amp; Social Media
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem' }}>Footer Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline || ''}
                    onChange={e => handleInputChange('tagline', e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem' }}>Footer Bio / Description</label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={e => handleInputChange('description', e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', boxSizing: 'border-box', resize: 'vertical' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem' }}>LinkedIn URL</label>
                  <input
                    type="text"
                    value={formData.linkedin || ''}
                    onChange={e => handleInputChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/company/hireheaven"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem' }}>X (Twitter) Handle</label>
                  <input
                    type="text"
                    value={formData.x || ''}
                    onChange={e => handleInputChange('x', e.target.value)}
                    placeholder="@Kshhsipl"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem' }}>Instagram URL</label>
                  <input
                    type="text"
                    value={formData.instagram || ''}
                    onChange={e => handleInputChange('instagram', e.target.value)}
                    placeholder="https://instagram.com/hireheaven"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Save size={16} /> {saving ? 'Saving Changes...' : 'Save & Update Live Site'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
