import React, { useState, useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import './Nav.css'

export default function Navbar({ onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : '');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div  className="navbar-s" style={{ position:'relative' }}>
      <div >
        <Link className='linkss' to="/home">
          <div className="brand">
          <div><img className='logo-sh' src="simple_hunt_logo.jpg" alt="logo"/></div>
          <div>
            <h1 className="nav-h1">Simple<span className="span-h1">Hunt</span></h1>
            <div style={{fontSize:'1rem', color:'black', fontWeight:500,top:-1,}}>Media Techologies LLP</div>
          </div>
        </div>

        </Link>
        
        <div className="nav-actions">
          <button className="menu-btn" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} title="Toggle theme">
            {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <button className="menu-btn" onClick={() => setMenuOpen(s => !s)}>Menu ▾</button>
        </div>
      </div>

      {menuOpen && (
        <div className="menu-list" onMouseLeave={() => setMenuOpen(false)}>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); setMenuOpen(false); }}>Home</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('add'); setMenuOpen(false); }}>Add Employee</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('about'); setMenuOpen(false); }}>About</a>
          <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); setMenuOpen(false); }}>Logout</a>
        </div>
      )}
    </div>
  );
}
