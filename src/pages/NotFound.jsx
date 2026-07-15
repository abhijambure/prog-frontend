import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const NotFound = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px',
      position: 'relative'
    }}>
      <div className="glow-spot-1" />
      <div className="glow-spot-2" />
      
      <GlassCard style={{ maxWidth: '460px', textAlign: 'center', padding: '40px' }}>
        <ShieldAlert size={48} color="var(--accent-rose)" style={{ marginBottom: '16px', animation: 'pulse 1.5s infinite' }} />
        <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px' }}>404 - Not Found</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', lineHeight: '1.6', marginBottom: '32px' }}>
          The pathway you are seeking does not exist or has been shifted. Check the spelling or return back home.
        </p>
        <Link to="/" className="btn-primary" style={{ textDecoration: 'none' }}>
          <Home size={18} />
          Return Home
        </Link>
      </GlassCard>
    </div>
  );
};

export default NotFound;
