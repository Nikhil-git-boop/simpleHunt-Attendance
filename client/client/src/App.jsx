// src/App.jsx
import React, { createContext, useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation
} from 'react-router-dom';

// Pages & Components (adjust paths if needed)
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Navbar from './components/Navbar';

// Global styles (make sure your CSS defines light/dark themes)
import './styles/global.css';

// Theme context so components can consume theme if needed
export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {}
});

function AppInner() {
  const navigate = useNavigate();
  const location = useLocation();

  // initial theme from localStorage or default to 'light'
  const getInitialTheme = () => {
    try {
      return localStorage.getItem('theme') || 'light';
    } catch {
      return 'light';
    }
  };

  const [theme, setTheme] = useState(getInitialTheme());
  // auth state derived from token; kept in state so we can re-render Navbar conditionally
  const [isAuth, setIsAuth] = useState(Boolean(localStorage.getItem('token')));

  // Keep auth in sync when route changes (after login the login component navigates to /home)
  useEffect(() => {
    setIsAuth(Boolean(localStorage.getItem('token')));
  }, [location]);

  // Apply theme class (data-theme or class) to document root for CSS variables
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch {}
  }, [theme]);

  // Toggle between 'light' and 'dark'
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  // logout handler - removes token & user and redirects to login
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuth(false);
    navigate('/login');
  };

  // Protected route wrapper
  const RequireAuth = ({ children }) => {
    return isAuth ? children : <Navigate to="/login" replace />;
  };

  // Redirect logged-in users away from auth pages
  const RedirectIfAuth = ({ children }) => {
    return isAuth ? <Navigate to="/home" replace /> : children;
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="app-root">
        {/* Navbar shows only when authenticated */}
        

        <main style={{ padding: 16 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />

            <Route
              path="/register"
              element={
                <RedirectIfAuth>
                  <Register />
                </RedirectIfAuth>
              }
            />

            <Route
              path="/login"
              element={
                <RedirectIfAuth>
                  <Login />
                </RedirectIfAuth>
              }
            />

            <Route
              path="/home"
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to={isAuth ? '/home' : '/login'} replace />} />
          </Routes>
        </main>
      </div>
    </ThemeContext.Provider>
  );
}

// Top-level App that wraps Router (keeps Router at top-level so useNavigate/useLocation work)
export default function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}
