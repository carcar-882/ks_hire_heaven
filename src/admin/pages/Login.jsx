import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/admin.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/admin/dashboard');
  };

  return (
    <div style={{
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: 'var(--bg-color)'
    }}>
      <div className="admin-card" style={{width: '400px', padding: '40px', textAlign: 'center'}}>
        <h2 style={{fontFamily: 'var(--font-heading)', color: 'var(--deep-purple)', marginBottom: '8px'}}>HIRE HEAVEN</h2>
        <p style={{color: 'var(--text-muted)', marginBottom: '32px'}}>Sign in to your admin account</p>
        
        <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
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
            <a href="#" style={{color: 'var(--primary-purple)', textDecoration: 'none'}}>Forgot Password?</a>
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
