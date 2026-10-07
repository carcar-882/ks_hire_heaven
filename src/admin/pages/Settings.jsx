import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Save, Globe, LayoutTemplate, Mail, Phone, MapPin } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    companyName: 'KS Hire Heaven Software India Pvt Ltd',
    phone: '+91 800-HIRE-HEAVEN',
    email: 'contact@hireheaven.com',
    address: 'Tech Park, Bangalore, India',
    linkedin: 'https://linkedin.com/company/hireheaven',
    instagram: 'https://instagram.com/hireheaven'
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
        if (data) {
          setFormData({
            companyName: data.company_name || formData.companyName,
            phone: data.phone || formData.phone,
            email: data.email || formData.email,
            address: data.address || formData.address,
            linkedin: data.linkedin || formData.linkedin,
            instagram: data.instagram || formData.instagram
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from('settings').upsert({
        id: 1,
        company_name: formData.companyName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        linkedin: formData.linkedin,
        instagram: formData.instagram
      });
      if (error) throw error;
      alert('CMS Settings saved successfully! The live site will update immediately.');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{padding: '48px'}}>Loading Settings...</div>;

  return (
    <div className="settings-module">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
        <div>
          <h2 style={{margin: 0, marginBottom: '8px'}}>Website CMS & Settings</h2>
          <p style={{margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem'}}>Manage global website content, footer links, and company details.</p>
        </div>
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '250px 1fr', gap: '24px'}}>
        <div className="admin-card" style={{padding: '0'}}>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <button 
              className="icon-btn" 
              style={{borderRadius: 0, justifyContent: 'flex-start', padding: '16px', background: activeTab === 'general' ? 'var(--bg-color)' : 'transparent', borderLeft: activeTab === 'general' ? '3px solid var(--primary-purple)' : '3px solid transparent', width: '100%', display: 'flex', gap: '12px'}}
              onClick={() => setActiveTab('general')}
            >
              <Globe size={18} /> General Info
            </button>
            <button 
              className="icon-btn" 
              style={{borderRadius: 0, justifyContent: 'flex-start', padding: '16px', background: activeTab === 'footer' ? 'var(--bg-color)' : 'transparent', borderLeft: activeTab === 'footer' ? '3px solid var(--primary-purple)' : '3px solid transparent', width: '100%', display: 'flex', gap: '12px'}}
              onClick={() => setActiveTab('footer')}
            >
              <LayoutTemplate size={18} /> Footer Layout
            </button>
          </div>
        </div>

        <div className="admin-card">
          {activeTab === 'general' && (
            <div>
              <h3 style={{marginBottom: '24px'}}>Company Information</h3>
              <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '16px'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem'}}>Company Name</label>
                  <input type="text" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', boxSizing: 'border-box'}} />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem'}}>Contact Phone</label>
                  <div style={{position: 'relative'}}>
                    <Phone size={16} color="var(--text-muted)" style={{position: 'absolute', left: '12px', top: '12px'}} />
                    <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid var(--border-color)', boxSizing: 'border-box'}} />
                  </div>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem'}}>Support Email</label>
                  <div style={{position: 'relative'}}>
                    <Mail size={16} color="var(--text-muted)" style={{position: 'absolute', left: '12px', top: '12px'}} />
                    <input type="text" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid var(--border-color)', boxSizing: 'border-box'}} />
                  </div>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem'}}>Headquarters Address</label>
                  <div style={{position: 'relative'}}>
                    <MapPin size={16} color="var(--text-muted)" style={{position: 'absolute', left: '12px', top: '12px'}} />
                    <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={{width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid var(--border-color)', boxSizing: 'border-box'}} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'footer' && (
            <div>
              <h3 style={{marginBottom: '24px'}}>Social Media Links</h3>
              <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '16px'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem'}}>LinkedIn URL</label>
                  <input type="text" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', boxSizing: 'border-box'}} />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem'}}>Instagram URL</label>
                  <input type="text" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', boxSizing: 'border-box'}} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
