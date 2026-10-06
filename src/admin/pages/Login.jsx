import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import brandLogo from '../../assets/logo.png';
import '../styles/admin.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const { login, isAuthenticated } = useAdmin();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'ks.hireheavensoftwareindia@gmail.com' && password === 'Hireheaven@2026##') {
      login();
      navigate('/admin/dashboard');
    } else {
      setError('Invalid email or password.');
    }
  };

  const handleForgot = (e) => {
    e.preventDefault();
    // Simulate sending reset email
    if (resetEmail) {
      setResetSuccess(true);
    }
  };

  if (showForgot) {
    return (
      <div style={{
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: 'var(--bg-color)'
      }}>
        <div className="admin-card" style={{width: '400px', padding: '40px', textAlign: 'center'}}>
          <img src={brandLogo} alt="KS Hire Heaven Software India Pvt Ltd" style={{height: '60px', width: 'auto', marginBottom: '16px', objectFit: 'contain'}} />
          <h2 style={{fontFamily: 'var(--font-heading)', color: 'var(--deep-purple)', marginBottom: '8px', fontSize: '1.25rem'}}>Reset Password</h2>
          <p style={{color: 'var(--text-muted)', marginBottom: '32px'}}>Enter your email to receive reset instructions</p>
          
          {resetSuccess ? (
            <div style={{color: 'var(--success)', marginBottom: '16px', padding: '12px', backgroundColor: '#e8f5e9', borderRadius: '8px'}}>
              Password reset instructions have been sent to your email!
            </div>
          ) : (
            <form onSubmit={handleForgot} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <input 
                type="email" 
                placeholder="Email address" 
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                style={{padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', width: '100%', boxSizing: 'border-box'}}
                required
              />
              <button type="submit" className="btn-primary" style={{width: '100%', justifyContent: 'center', marginTop: '16px', padding: '12px'}}>
                Send Reset Link
              </button>
            </form>
          )}
          
          <button 
            onClick={() => { setShowForgot(false); setResetSuccess(false); }} 
            style={{background: 'none', border: 'none', color: 'var(--primary-purple)', marginTop: '24px', cursor: 'pointer'}}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: 'var(--bg-color)'
    }}>
      <div className="admin-card" style={{width: '400px', padding: '40px', textAlign: 'center'}}>
        <img src={brandLogo} alt="KS Hire Heaven Software India Pvt Ltd" style={{height: '60px', width: 'auto', marginBottom: '16px', objectFit: 'contain'}} />
        <p style={{color: 'var(--text-muted)', marginBottom: '32px'}}>Sign in to your admin account</p>
        
        <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          {error && <div style={{color: 'var(--danger)', fontSize: '0.875rem'}}>{error}</div>}
          <input 
            type="email" 
            placeholder="Email address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', width: '100%', boxSizing: 'border-box'}}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', width: '100%', boxSizing: 'border-box'}}
            required
          />
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem'}}>
            <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <input type="checkbox" /> Remember me
            </label>
            <button type="button" onClick={() => setShowForgot(true)} style={{background: 'none', border: 'none', color: 'var(--primary-purple)', cursor: 'pointer', padding: 0}}>
              Forgot Password?
            </button>
          </div>
          <button type="submit" className="btn-primary" style={{width: '100%', justifyContent: 'center', marginTop: '16px', padding: '12px'}}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
