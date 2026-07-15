import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Bookmark, BookmarkCheck, Calendar, School, 
  Trophy, GraduationCap, Clock, Flame, AlertCircle
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import Loading from '../components/Loading';
import { careerAPI } from '../services/api';

const CareerDetails = () => {
  const { id } = useParams();
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCareerDetails();
  }, [id]);

  const fetchCareerDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await careerAPI.getCareer(id);
      setCareer(data);
      
      // Check if saved
      const saved = await careerAPI.getSavedCareers();
      setIsSaved(saved.some(c => c.id === parseInt(id)));
    } catch (err) {
      console.error(err);
      setError('Could not retrieve career details. Ensure backend services are running.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async () => {
    try {
      const res = await careerAPI.toggleSaveCareer(id);
      setIsSaved(res.saved);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="main-content">
          <Loading message="Loading career milestones..." />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="main-content">
          <GlassCard style={{ padding: '32px', textAlign: 'center', borderColor: 'var(--accent-rose)' }}>
            <AlertCircle size={48} color="var(--accent-rose)" style={{ marginBottom: '16px' }} />
            <h2>Career Load Failure</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{error}</p>
            <Link to="/careers" className="btn-primary">Back to Directory</Link>
          </GlassCard>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-content">
        {/* Back Link */}
        <div style={{ marginBottom: '20px' }}>
          <Link to="/careers" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
            <ArrowLeft size={16} />
            Back to Careers Directory
          </Link>
        </div>

        {/* Title Block Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span className="badge badge-indigo">{career.category}</span>
              <span className="badge badge-emerald" style={{ display: 'inline-flex', gap: '4px' }}>
                <Flame size={12} /> {career.demand} Demand
              </span>
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: '800' }}>{career.name}</h1>
          </div>

          <button 
            onClick={handleToggleSave}
            className="btn-secondary"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              color: isSaved ? 'var(--accent-indigo)' : 'var(--text-primary)',
              borderColor: isSaved ? 'var(--accent-indigo)' : 'var(--border-glass)'
            }}
          >
            {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            {isSaved ? 'Saved to Bookmarks' : 'Save to Bookmarks'}
          </button>
        </div>

        {/* Quick specs grid row */}
        <div className="grid-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '32px' }}>
          <GlassCard style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <GraduationCap size={32} color="var(--accent-blue)" />
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>DEGREE PATH</span>
              <span style={{ fontWeight: '700', fontSize: '15px' }}>{career.degree}</span>
            </div>
          </GlassCard>

          <GlassCard style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Clock size={32} color="var(--accent-violet)" />
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>DURATION</span>
              <span style={{ fontWeight: '700', fontSize: '15px' }}>{career.duration}</span>
            </div>
          </GlassCard>

          <GlassCard style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Trophy size={32} color="var(--accent-emerald)" />
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>AVERAGE SALARY (IN)</span>
              <span style={{ fontWeight: '700', fontSize: '15px' }}>₹{(career.salary_india.average / 100000).toFixed(1)} LPA</span>
            </div>
          </GlassCard>
        </div>

        {/* Overview & Responsibilities Grid */}
        <div className="grid-container" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '32px', marginBottom: '40px', alignItems: 'start' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Overview */}
            <GlassCard>
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Career Overview</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6' }}>{career.overview}</p>
              
              <h4 style={{ fontSize: '15px', fontWeight: '700', marginTop: '24px', marginBottom: '8px' }}>Eligibility Requirements</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>{career.eligibility}</p>
            </GlassCard>

            {/* Interactive Vertical Timeline Roadmap */}
            <GlassCard>
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>Educational & Growth Roadmap</h3>
              
              <div className="timeline">
                {career.roadmap.map((stage, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className="timeline-dot" />
                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>{stage.stage}</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>{stage.desc}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Salary Scales */}
            <GlassCard>
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Expected Salary Ranges</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>DOMESTIC (INDIA)</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '14px' }}>
                    <span>Starting: <strong>₹{(career.salary_india.min / 100000).toFixed(1)} LPA</strong></span>
                    <span>High End: <strong>₹{(career.salary_india.max / 100000).toFixed(1)}+ LPA</strong></span>
                  </div>
                </div>
                
                <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>GLOBAL EXPECTATIONS</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '14px' }}>
                    <span>Min Average: <strong>${(career.salary_global.min / 1000).toFixed(0)}k/yr</strong></span>
                    <span>Max Average: <strong>${(career.salary_global.max / 1000).toFixed(0)}k+/yr</strong></span>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Responsibilities */}
            <GlassCard>
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Key Responsibilities</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '18px', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {career.responsibilities.map((resp, idx) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
            </GlassCard>

            {/* Directories Links */}
            <GlassCard>
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Directory Connections</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Colleges list */}
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <School size={14} /> TOP COLLEGES
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {career.colleges.length > 0 ? career.colleges.map(col => (
                      <Link key={col.id} to="/colleges" style={{ fontSize: '13px', color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: '600' }}>
                        {col.name} ({col.city})
                      </Link>
                    )) : <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>None linked.</span>}
                  </div>
                </div>

                {/* Exams list */}
                <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '12px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <Calendar size={14} /> ENTRANCE EXAMS
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {career.exams.length > 0 ? career.exams.map(exam => (
                      <Link key={exam.id} to="/exams" style={{ fontSize: '13px', color: 'var(--accent-violet)', textDecoration: 'none', fontWeight: '600' }}>
                        {exam.name}
                      </Link>
                    )) : <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>None linked.</span>}
                  </div>
                </div>

                {/* Scholarships list */}
                <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '12px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <Trophy size={14} /> SCHOLARSHIPS
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {career.scholarships.length > 0 ? career.scholarships.map(sch => (
                      <Link key={sch.id} to="/scholarships" style={{ fontSize: '13px', color: 'var(--accent-amber)', textDecoration: 'none', fontWeight: '600' }}>
                        {sch.name} - {sch.award_amount}
                      </Link>
                    )) : <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>None linked.</span>}
                  </div>
                </div>

              </div>
            </GlassCard>
          </div>

        </div>
      </main>
    </div>
  );
};

export default CareerDetails;
