import { useState, useRef, useEffect } from 'react';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSubmitState('submitting');
    
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          job_id: jobId, // Attach database job ID
          dateApplied: new Date().toISOString(),
          status: 'New',
          statusHistory: [{
            status: 'New',
            changedAt: new Date().toISOString(),
            changedBy: 'System'
          }],
          resume: resume ? {
            name: resume.name,
            size: resume.size,
            type: resume.type,
            url: `/uploads/${resume.name}` // Mock URL for json-server
          } : null
        })
      });
      
      if(response.ok) {
        setSubmitState('success');
      } else {
        setSubmitState('error');
      }
    } catch(err) {
      console.error(err);
      setSubmitState('error');
    }
  };

  const handleOpenWhatsApp = () => {
    const message = encodeURIComponent(
      `*Application for ${formData.role}*\n\n` +
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
              <p>Thank you for applying to Hire Heaven Software India Private Limited. Our recruitment team will review your application and contact you if your profile matches the role requirements.</p>
              <div className="applied-role">
                <span>Applied Role:</span>
                <strong>{formData.role}</strong>
              </div>
              <div className="state-actions">
                <button className="btn-secondary" onClick={onClose}>Explore More Positions</button>
                <button className="btn-primary" onClick={onClose}>Close</button>
              </div>
            </div>
          )}

          {submitState === 'error' && (
            <div className="modal-state error-state">
              <AlertCircle size={56} className="state-icon" />
              <h2>Something Went Wrong</h2>
              <p>We couldn't submit your application right now. Please try again or contact our recruitment team.</p>
              <div className="state-actions">
                <button className="btn-secondary" onClick={() => setSubmitState('idle')}>Try Again</button>
                <a href={`mailto:${careersEmail}`} className="btn-primary">Contact Recruitment Team</a>
              </div>
            </div>
          )}

          {submitState === 'fallback' && (
            <div className="modal-state fallback-state">
              <CheckCircle size={56} className="state-icon" />
              <h2>Application Ready</h2>
              <p>Your application is ready to be sent. Please send this message via WhatsApp and attach your resume in the chat.</p>
              <div className="state-actions">
                <button className="btn-primary" onClick={handleOpenWhatsApp}>Send via WhatsApp</button>
                <button className="btn-secondary" onClick={onClose}>Close</button>
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
