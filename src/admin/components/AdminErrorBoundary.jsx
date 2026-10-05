import React, { Component } from 'react';

class AdminErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Admin Panel Error Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
          height: '100vh', width: '100vw', backgroundColor: '#f8fafc', color: '#334155', fontFamily: 'system-ui'
        }}>
          <div style={{
            background: 'white', padding: '40px', borderRadius: '12px', 
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            maxWidth: '500px', textAlign: 'center'
          }}>
            <h1 style={{color: '#ef4444', marginBottom: '16px'}}>Something went wrong in the Admin Panel.</h1>
            <p style={{marginBottom: '24px'}}>An unexpected error occurred while loading this module.</p>
            <div style={{display: 'flex', gap: '16px', justifyContent: 'center'}}>
              <button 
                onClick={() => window.location.reload()}
                style={{padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600}}
              >
                Retry
              </button>
              <button 
                onClick={() => {
                  localStorage.removeItem('hireheaven_admin_auth');
                  window.location.href = '/admin/login';
                }}
                style={{padding: '10px 20px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600}}
              >
                Logout
              </button>
            </div>
            {this.state.error && (
              <div style={{marginTop: '24px', padding: '16px', background: '#f1f5f9', borderRadius: '6px', textAlign: 'left', fontSize: '0.875rem', overflowX: 'auto'}}>
                <code>{this.state.error.toString()}</code>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default AdminErrorBoundary;
