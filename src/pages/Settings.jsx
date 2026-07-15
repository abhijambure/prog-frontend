import React from 'react';
import { Settings as SettingsIcon, Sun, Moon, Bell, ShieldCheck } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-content">
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SettingsIcon size={28} color="var(--accent-indigo)" />
            Account Settings
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage theme modes and profile credentials</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px' }}>
          {/* User profile settings card */}
          <GlassCard>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="var(--accent-emerald)" />
              Account Credentials
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Email:</span>
                <strong>{user?.email || 'student@careercompass.com'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Role:</span>
                <strong style={{ textTransform: 'capitalize' }}>{user?.role || 'student'}</strong>
              </div>
            </div>
          </GlassCard>

          {/* Theme Preferences card */}
          <GlassCard>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>Theme Preference</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '14px', fontWeight: '600', display: 'block', color: 'var(--text-primary)' }}>Dark Theme Mode</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Toggle visual themes for lighter backgrounds</span>
              </div>
              <button 
                onClick={toggleTheme}
                className="btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px' }}
              >
                {isDark ? (
                  <>
                    <Sun size={16} /> Light Mode
                  </>
                ) : (
                  <>
                    <Moon size={16} /> Dark Mode
                  </>
                )}
              </button>
            </div>
          </GlassCard>

          {/* Notifications config */}
          <GlassCard>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} color="var(--accent-indigo)" />
              Notification Settings
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Email Exam Alerts</span>
                <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
                <span>Dashboard Activity Logs</span>
                <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              </div>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
};

export default Settings;
