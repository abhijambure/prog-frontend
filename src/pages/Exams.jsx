import React, { useState, useEffect } from 'react';
import { Search, Calendar, FileText, Globe, AlertCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import Loading from '../components/Loading';
import { directoryAPI } from '../services/api';

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await directoryAPI.getExams({ search: search || undefined });
      setExams(data);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve exam details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchExams();
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-content">
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Entrance Examinations Directory</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Explore qualifying national exams, syllabi, patterns, and registration deadlines</p>
        </div>

        {/* Search bar block */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          <div style={{ position: 'relative', flexGrow: 1 }}>
            <span style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-muted)' }}>
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search entrance exams by name or syllabus details..."
              className="input-field"
              style={{ paddingLeft: '44px' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '0 24px' }}>Search</button>
        </form>

        {loading ? (
          <Loading message="Filtering examinations..." />
        ) : error ? (
          <GlassCard style={{ padding: '32px', textAlign: 'center', borderColor: 'var(--accent-rose)' }}>
            <AlertCircle size={48} color="var(--accent-rose)" style={{ marginBottom: '16px' }} />
            <h2>Failed to load examinations</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
          </GlassCard>
        ) : exams.length > 0 ? (
          <div className="grid-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
            {exams.map(exam => (
              <GlassCard key={exam.id} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px' }}>{exam.name}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    <strong>Eligibility:</strong> {exam.eligibility}
                  </p>
                </div>

                {/* Important dates subsection */}
                <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '14px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="var(--accent-indigo)" />
                    IMPORTANT DEADLINES & DATES
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
                    {Object.entries(exam.important_dates).map(([event, date_str]) => (
                      <div key={event} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{event}:</span>
                        <strong style={{ color: 'var(--accent-rose)' }}>{date_str}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Syllabus items */}
                <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '14px', flexGrow: 1 }}>
                  <h4 style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>CORE SYLLABUS TOPICS</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {exam.syllabus.map((topic, idx) => (
                      <span key={idx} className="badge badge-indigo" style={{ fontSize: '11px' }}>{topic}</span>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '180px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    Pattern: {exam.exam_pattern}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {exam.registration_link && (
                      <a 
                        href={exam.registration_link} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn-primary" 
                        style={{ padding: '8px 12px', fontSize: '11px', boxShadow: 'none' }}
                      >
                        Register
                      </a>
                    )}
                    {exam.website && (
                      <a 
                        href={exam.website} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn-secondary" 
                        style={{ padding: '8px 12px', fontSize: '11px', gap: '4px' }}
                      >
                        <Globe size={11} /> Site
                      </a>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            <FileText size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
            <p>No examinations found matching your query.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Exams;
