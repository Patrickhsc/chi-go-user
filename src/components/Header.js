import React, { useState } from 'react';

function Header({ currentPage, setCurrentPage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', key: 'home' },
    { label: 'Attractions', key: 'attractions' },
    { label: 'Restaurants', key: 'restaurants' },
    { label: 'Checklist', key: 'checklist' },
    { label: 'Community', key: 'community' },
    { label: 'Login', key: 'login' },
    { label: 'Admin', key: 'admin' },
  ];

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="text-xl font-bold">Chi-Go-User</div>
        {/* Hamburger menu button (mobile only) */}
        <button
          className="md:hidden block text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>
        {/* Desktop navigation */}
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
      </div>
      {/* Mobile navigation menu */}
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
