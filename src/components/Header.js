import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=User&background=bbb&color=fff"; // Or any image you prefer

function Header({ currentPage, setCurrentPage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Home', key: 'home' },
    { label: 'Attractions', key: 'attractions' },
    { label: 'Restaurants', key: 'restaurants' },
    { label: 'Checklist', key: 'checklist' },
    { label: 'Community', key: 'community' },
  ];

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="text-xl font-bold">Chi-Go</div>
        <button
          className="md:hidden block text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {/* [Hamburger Menu SVG Here] */}
        </button>
        <nav className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setCurrentPage(item.key)}
              className={`py-2 px-3 rounded ${currentPage === item.key ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        {/* User Avatar and Info */}
        <div className="flex items-center space-x-2 ml-4">
          <img
            src={user?.avatar || DEFAULT_AVATAR}
            alt="User avatar"
            className="w-10 h-10 rounded-full object-cover bg-gray-100"
            onError={e => { e.target.src = DEFAULT_AVATAR; }}
          />
          {user && (
            <>
              <span className="text-gray-700">Hello, {user.username}</span>
              <button
                onClick={logout}
                className="text-gray-700 hover:underline flex items-center"
                title="Logout"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"/></svg>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
      {/* Mobile Menu ... */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-3">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setCurrentPage(item.key);
                  setMenuOpen(false);
                }}
                className={`py-2 px-3 rounded text-left w-full ${currentPage === item.key ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
