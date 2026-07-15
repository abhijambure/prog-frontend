import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, User, BookOpen, Star, Compass, 
  School, Trophy, FileText, MessageSquare, Settings, 
  LogOut, BarChart3, Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const studentLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/profile', label: 'My Profile', icon: User },
    { to: '/assessment', label: 'Career Assessment', icon: BookOpen },
    { to: '/recommendations', label: 'Match Scores', icon: Star },
    { to: '/careers', label: 'Career Directory', icon: Compass },
    { to: '/colleges', label: 'Colleges', icon: School },
    { to: '/scholarships', label: 'Scholarships', icon: Trophy },
    { to: '/exams', label: 'Entrance Exams', icon: FileText },
    { to: '/assistant', label: 'AI Assistant', icon: MessageSquare },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Analytics Dashboard', icon: BarChart3 },
    { to: '/admin/careers', label: 'Manage Careers', icon: Database },
    { to: '/admin/colleges', label: 'Manage Colleges', icon: School },
    { to: '/admin/exams', label: 'Manage Exams', icon: FileText },
    { to: '/admin/scholarships', label: 'Manage Scholarships', icon: Trophy },
  ];

  const links = role === 'admin' ? adminLinks : studentLinks;

  return (
    <aside className="sidebar" style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '20px', borderBottom: '1px solid var(--border-glass)' }}>
        <Compass size={28} color="var(--accent-indigo)" />
        <span style={{ fontWeight: '800', fontSize: '18px' }}>
          Career Compass
        </span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1, marginTop: '20px' }}>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin'} // enforce exact match on dashboard panels
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                background: isActive ? 'linear-gradient(135deg, var(--accent-indigo), var(--accent-violet))' : 'transparent',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '14px',
                boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.2)' : 'none',
              })}
            >
              <Icon size={18} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border-glass)' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '8px',
            color: 'var(--accent-rose)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            textAlign: 'left'
          }}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
