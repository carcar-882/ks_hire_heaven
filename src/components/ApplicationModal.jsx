import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { careersEmail } from '../data/jobs';
import '../styles/careers/application-modal.css';

export default function ApplicationModal({ isOpen, onClose, initialRole, jobId }) {
  const modalRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    role: '',
    experience: '',
    location: '',
    currentCTC: '',
    expectedCTC: '',
    noticePeriod: '',
    message: ''
  });
  
  const [resume, setResume] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitState, setSubmitState] = useState('idle'); // idle, submitting, success, error, fallback

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, role: initialRole || '' }));
      setErrors({});
      setSubmitState('idle');
      setResume(null);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialRole]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, resume: 'File exceeds maximum size of 5 MB.' }));
        setResume(null);
        e.target.value = '';
      } else {
        setResume(file);
        if (errors.resume) setErrors(prev => ({ ...prev, resume: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your name.';
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter your contact number.';
    } else if (!/^(\+91[\-\s]?)?[0-9]{10}$/.test(formData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.role) newErrors.role = 'Please select a job role.';
    if (!formData.experience.trim()) newErrors.experience = 'Please enter your experience.';
    if (!formData.location.trim()) newErrors.location = 'Please enter your current location.';
    if (!formData.noticePeriod.trim()) newErrors.noticePeriod = 'Please specify your notice period.';
    
    if (!resume) newErrors.resume = 'Please upload your resume.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [submitState, setSubmitState] = useState('idle');
  const [dbErrorMsg, setDbErrorMsg] = useState('');
  
  const [applicationId, setApplicationId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSubmitState('submitting');
    setDbErrorMsg('');
    
    try {
      let resume_url = null;
      let resume_name = null;
      
      if (resume) {
        const fileExt = resume.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(fileName, resume);
          
        if (uploadError) {
          console.error('Resume upload error:', uploadError);
          setDbErrorMsg(`Resume Upload Failed: ${uploadError.message}`);
          setSubmitState('error');
          return;
        }
        
        const { data: { publicUrl } } = supabase.storage.from('resumes').getPublicUrl(fileName);
        resume_url = publicUrl;
        resume_name = resume.name;
      }

      const payload = {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          role: formData.role,
          experience: formData.experience,
          location: formData.location,
          currentctc: formData.currentCTC,
          expectedctc: formData.expectedCTC,
          noticeperiod: formData.noticePeriod,
          message: formData.message,
          job_id: jobId === 'general-application' ? null : jobId,
          status: 'New',
          resume_url: resume_url,
          resume_name: resume_name
      };
      
      console.log('SUBMITTING PAYLOAD:', payload);

      const { data, error } = await supabase
        .from('applications')
        .insert([payload])
        .select()
        .single();
      
      if (error) {
        console.error('Application insert failed:', error);
        setDbErrorMsg(`DB Error: ${error.message} (Code: ${error.code})`);
        setSubmitState('error');
        return;
      }

      if (!data) {
        throw new Error('Application was not saved');
      }
      
      setApplicationId(data.id);
      setSubmitState('success');

    } catch(err) {
      console.error(err);
      setSubmitState('error');
    }
  };

  const handleOpenWhatsApp = () => {
    const message = encodeURIComponent(
      `*Application for ${formData.role}*\n` +
      `*Application ID:* KSHH${applicationId.substring(0, 4).toUpperCase()}\n\n` +
      `*Name:* ${formData.name}\n` +
      `*Contact Number:* ${formData.phone}\n` +
      `*Email:* ${formData.email}\n` +
      `*Experience:* ${formData.experience}\n` +
      `*Location:* ${formData.location}\n` +
      `*Current CTC:* ${formData.currentCTC || 'N/A'}\n` +
      `*Expected CTC:* ${formData.expectedCTC || 'N/A'}\n` +
      `*Notice Period:* ${formData.noticePeriod}\n\n` +
      `*Message:*\n${formData.message || 'N/A'}`
    );
    window.open(`https://api.whatsapp.com/send?phone=917981036434&text=${message}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={handleOutsideClick}>
        <motion.div
          ref={modalRef}
          className="application-modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={24} />
          </button>

          {submitState === 'success' && (
            <div className="modal-state success-state">
              <CheckCircle size={56} className="state-icon" />
              <h2>Application Submitted Successfully</h2>
              <p>Your application has been recorded successfully. You can also send your application details and resume through WhatsApp to the recruitment team.</p>
              <div className="applied-role">
                <span>Application ID:</span>
                <strong>{'KSHH' + applicationId.substring(0, 4).toUpperCase()}</strong>
              </div>
              <div className="applied-role" style={{marginTop: '8px'}}>
                <span>Applied Role:</span>
                <strong>{formData.role}</strong>
              </div>
              <div className="state-actions" style={{marginTop: '24px'}}>
                <button className="btn-primary" onClick={handleOpenWhatsApp}>Send via WhatsApp</button>
                <button className="btn-secondary" onClick={onClose}>Close</button>
              </div>
            </div>
          )}

          {submitState === 'error' && (
            <div className="modal-state error-state">
              <AlertCircle size={56} className="state-icon" />
              <h2>We couldn't submit your application right now.</h2>
              <p>Please try again in a few moments. Your information has not been submitted yet.</p>
              {dbErrorMsg && (
                <div style={{background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', fontSize: '0.875rem', marginTop: '16px', textAlign: 'left', wordBreak: 'break-all'}}>
                  <strong>Developer Error Details:</strong><br/>
                  {dbErrorMsg}
                </div>
              )}
              <div className="state-actions">
                <button className="btn-secondary" onClick={() => setSubmitState('idle')}>Try Again</button>
                <button className="btn-primary" onClick={onClose}>Cancel</button>
              </div>
            </div>
          )}

          {(submitState === 'idle' || submitState === 'submitting') && (
            <>
              <h2 className="modal-header">APPLY NOW!</h2>
              <form onSubmit={handleSubmit} className="application-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Name <span className="required">*</span></label>
                    <input type="text" id="name" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleInputChange} disabled={submitState === 'submitting'} />
                    {errors.name && <span className="error-msg">{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Contact Number <span className="required">*</span></label>
                    <input type="text" id="phone" name="phone" placeholder="Enter your contact number" value={formData.phone} onChange={handleInputChange} disabled={submitState === 'submitting'} />
                    {errors.phone && <span className="error-msg">{errors.phone}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address <span className="required">*</span></label>
                    <input type="email" id="email" name="email" placeholder="Enter your email address" value={formData.email} onChange={handleInputChange} disabled={submitState === 'submitting'} />
                    {errors.email && <span className="error-msg">{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="role">Job Role <span className="required">*</span></label>
                    <input type="text" id="role" name="role" value={formData.role} disabled style={{ backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'not-allowed', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', width: '100%', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="experience">Experience <span className="required">*</span></label>
                  <input type="text" id="experience" name="experience" placeholder="e.g. 5 Years" value={formData.experience} onChange={handleInputChange} disabled={submitState === 'submitting'} />
                  {errors.experience && <span className="error-msg">{errors.experience}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="location">Current Location <span className="required">*</span></label>
                  <input type="text" id="location" name="location" placeholder="Enter your current location" value={formData.location} onChange={handleInputChange} disabled={submitState === 'submitting'} />
                  {errors.location && <span className="error-msg">{errors.location}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="currentCTC">Current CTC</label>
                    <input type="text" id="currentCTC" name="currentCTC" placeholder="e.g. ₹8 LPA" value={formData.currentCTC} onChange={handleInputChange} disabled={submitState === 'submitting'} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="expectedCTC">Expected CTC</label>
                    <input type="text" id="expectedCTC" name="expectedCTC" placeholder="e.g. ₹10 LPA" value={formData.expectedCTC} onChange={handleInputChange} disabled={submitState === 'submitting'} />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="noticePeriod">Notice Period <span className="required">*</span></label>
                  <input type="text" id="noticePeriod" name="noticePeriod" placeholder="e.g. Immediate / 30 Days / 60 Days / 90 Days" value={formData.noticePeriod} onChange={handleInputChange} disabled={submitState === 'submitting'} />
                  {errors.noticePeriod && <span className="error-msg">{errors.noticePeriod}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="message">Subject / Message</label>
                  <textarea id="message" name="message" placeholder="Tell us briefly about your experience and interest in this role." rows={4} value={formData.message} onChange={handleInputChange} disabled={submitState === 'submitting'}></textarea>
                </div>

                <div className="form-group file-upload-group">
                  <label htmlFor="resume">Upload Resume <span className="required">*</span></label>
                  <span className="file-hint">PDF or DOC/DOCX • Maximum 5 MB</span>
                  <div className="file-input-wrapper">
                    <input type="file" id="resume" name="resume" accept=".pdf,.doc,.docx" onChange={handleFileChange} disabled={submitState === 'submitting'} className="sr-only" />
                    <label htmlFor="resume" className="btn-file">Choose File</label>
                    <span className="file-name">{resume ? resume.name : 'No file chosen'}</span>
                  </div>
                  <p className="upload-note">Please upload your latest resume.</p>
                  {errors.resume && <span className="error-msg">{errors.resume}</span>}
                </div>

                <div className="form-submit">
                  <button type="submit" className="btn-submit" disabled={submitState === 'submitting'}>
                    {submitState === 'submitting' ? (
                      <><Loader2 size={18} className="spinner" /> Submitting Application...</>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
