import React from 'react';
import { Compass } from 'lucide-react';

const Loading = ({ message = "Loading career pathways..." }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
      gap: '16px',
      width: '100%'
    }}>
      <div style={{
        animation: 'spin 2s linear infinite',
        display: 'inline-block'
      }}>
        <Compass size={48} color="var(--accent-indigo)" className="text-glow" />
      </div>
      <p style={{
        color: 'var(--text-secondary)',
        fontSize: '14px',
        fontWeight: '500',
        letterSpacing: '0.5px'
      }}>
        {message}
      </p>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loading;
