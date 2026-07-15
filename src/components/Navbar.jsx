import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Sun, Moon, LogOut, LayoutDashboard, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { token, role, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass-panel" style={{
      margin: '16px 24px',
      padding: '16px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: '16px',
      zIndex: 100,
      borderRadius: '16px'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
        <Compass size={32} color="var(--accent-indigo)" className="text-glow" />
        <span style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' }}>
          Career <span style={{ color: 'var(--accent-indigo)' }}>Compass</span> <span style={{ fontSize: '12px', verticalAlign: 'super', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-indigo)', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>AI</span>
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-glass)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            color: 'var(--text-primary)'
          }}
          title="Toggle Light/Dark Theme"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {token ? (
          <>
            <Link 
              to={role === 'admin' ? '/admin' : '/dashboard'} 
              className="btn-secondary" 
              style={{ padding: '8px 16px', fontSize: '14px', textDecoration: 'none' }}
            >
              <LayoutDashboard size={16} />
              {role === 'admin' ? 'Admin Panel' : 'Dashboard'}
            </Link>
            
            {role !== 'admin' && (
              <Link 
                to="/profile" 
                style={{ 
                  color: 'var(--text-secondary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                <UserIcon size={16} />
                Profile
              </Link>
            )}

            <button 
              onClick={handleLogout}
              className="btn-secondary"
              style={{ 
                padding: '8px 16px', 
                fontSize: '14px', 
                color: 'var(--accent-rose)', 
                borderColor: 'rgba(244, 63, 94, 0.2)' 
              }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}
            >
              Log in
            </Link>
            
            <Link 
              to="/register" 
              className="btn-primary" 
              style={{ textDecoration: 'none', padding: '10px 20px', fontSize: '14px' }}
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
