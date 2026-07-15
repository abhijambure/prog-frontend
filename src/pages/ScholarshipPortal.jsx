import React, { useState, useEffect } from 'react';
import { Search, Trophy, Globe, Calendar, AlertCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import Loading from '../components/Loading';
import { directoryAPI } from '../services/api';

const ScholarshipPortal = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await directoryAPI.getScholarships({ search: search || undefined });
      setScholarships(data);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve scholarship listings.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchScholarships();
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-content">
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Scholarship & Financial Aid Portal</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Explore national grants, award amounts, deadlines, and eligibility criteria</p>
        </div>

        {/* Search bar block */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          <div style={{ position: 'relative', flexGrow: 1 }}>
            <span style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-muted)' }}>
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search scholarships by name or eligibility criteria..."
              className="input-field"
              style={{ paddingLeft: '44px' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '0 24px' }}>Search</button>
        </form>

        {loading ? (
          <Loading message="Filtering scholarships..." />
        ) : error ? (
          <GlassCard style={{ padding: '32px', textAlign: 'center', borderColor: 'var(--accent-rose)' }}>
            <AlertCircle size={48} color="var(--accent-rose)" style={{ marginBottom: '16px' }} />
            <h2>Failed to load scholarships</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
          </GlassCard>
        ) : scholarships.length > 0 ? (
          <div className="grid-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
            {scholarships.map(sch => (
              <GlassCard key={sch.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800' }}>{sch.name}</h3>
                    <span className="badge badge-emerald" style={{ fontWeight: '700' }}>
                      {sch.award_amount}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-rose)', fontSize: '13px', fontWeight: '600' }}>
                    <Calendar size={14} />
                    <span>Deadline: {sch.deadline}</span>
                  </div>
                </div>

                <div style={{ flexGrow: 1 }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>ELIGIBILITY</h4>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{sch.eligibility}</p>
                </div>

                <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  {sch.website && (
                    <a 
                      href={sch.website} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn-secondary" 
                      style={{ padding: '8px 12px', fontSize: '12px', gap: '4px' }}
                    >
                      <Globe size={12} /> Official Website
                    </a>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            <Trophy size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
            <p>No scholarships found matching your query.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ScholarshipPortal;
