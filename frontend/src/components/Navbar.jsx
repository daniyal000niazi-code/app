import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-content">
        <div className="navbar-left">
          <h1 className="navbar-logo" onClick={() => navigate('/')}>HoioFlix</h1>
          <div className="navbar-links">
            <a href="/" className="navbar-link">Home</a>
            <a href="/" className="navbar-link">TV Shows</a>
            <a href="/" className="navbar-link">Movies</a>
            <a href="/" className="navbar-link">New & Popular</a>
            <a href="/" className="navbar-link">My List</a>
          </div>
        </div>
        
        <div className="navbar-right">
          <div className="search-container">
            {showSearch ? (
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Titles, people, genres"
                  className="search-input"
                  autoFocus
                  onBlur={() => {
                    if (!searchQuery) {
                      setTimeout(() => setShowSearch(false), 200);
                    }
                  }}
                />
              </form>
            ) : (
              <Search 
                className="navbar-icon" 
                size={22}
                onClick={() => setShowSearch(true)}
              />
            )}
          </div>
          <Bell className="navbar-icon" size={22} />
          <div className="navbar-profile">
            <img 
              src="https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-qo9h82134t9nv0j0.jpg" 
              alt="Profile" 
              className="profile-img"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
