import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';

const Header = () => {
  return (
    <header className="admin-header">
      <div className="admin-header-title">
        <h1>Good morning, Admin 👋</h1>
        <p>Here's what's happening with your recruitment today.</p>
      </div>

      <div className="admin-header-actions">
        <div className="search-box">
          <Search size={18} color="var(--text-muted)" />
          <input type="text" placeholder="Search candidates... (Ctrl+K)" />
        </div>

        <button className="icon-btn">
          <Bell size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
