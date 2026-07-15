import React, { useState, useEffect } from 'react';
import { Search, School, Globe, MapPin, Award, AlertCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import Loading from '../components/Loading';
import { directoryAPI } from '../services/api';

const CollegeDirectory = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await directoryAPI.getColleges({ search: search || undefined });
      setColleges(data);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve college list.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchColleges();
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800' }}>College & Institute Directory</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Explore premier institutions, rankings, and program criteria</p>
          </div>
        </div>

        {/* Search bar block */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          <div style={{ position: 'relative', flexGrow: 1 }}>
            <span style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-muted)' }}>
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search colleges by name or details..."
              className="input-field"
              style={{ paddingLeft: '44px' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '0 24px' }}>Search</button>
        </form>

        {loading ? (
          <Loading message="Filtering institutions..." />
        ) : error ? (
          <GlassCard style={{ padding: '32px', textAlign: 'center', borderColor: 'var(--accent-rose)' }}>
            <AlertCircle size={48} color="var(--accent-rose)" style={{ marginBottom: '16px' }} />
            <h2>Failed to load colleges</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
          </GlassCard>
        ) : colleges.length > 0 ? (
          <div className="grid-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
            {colleges.map(college => (
              <GlassCard key={college.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800' }}>{college.name}</h3>
                    {college.ranking && (
                      <span className="badge badge-indigo" style={{ display: 'inline-flex', gap: '4px' }}>
                        <Award size={12} /> Rank #{college.ranking}
                      </span>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '12px' }}>
                    <MapPin size={14} color="var(--accent-indigo)" />
                    <span>{college.city}, {college.state}</span>
                  </div>
                </div>

                <div style={{ flexGrow: 1 }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>AVAILABLE PROGRAMS</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {college.programs.map((prog, idx) => (
                      <span key={idx} className="badge badge-blue" style={{ fontSize: '11px' }}>{prog}</span>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Admission: CUET / Entrance exam</span>
                  {college.website && (
                    <a 
                      href={college.website} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn-secondary" 
                      style={{ padding: '8px 12px', fontSize: '12px', gap: '4px' }}
                    >
                      <Globe size={12} /> Visit Site
                    </a>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            <School size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
            <p>No colleges found matching your query.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CollegeDirectory;
