import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Calendar, CheckCircle2, AlertTriangle,
  HelpCircle, Play, School, Sparkles, Trophy
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import Loading from '../components/Loading';
import { studentAPI } from '../services/api';

const Dashboard = () => {
  const [widgets, setWidgets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await studentAPI.getDashboardWidgets();
      setWidgets(data);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve dashboard statistics. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="main-content">
          <Loading message="Fetching dashboard widgets..." />
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
            <AlertTriangle size={48} color="var(--accent-rose)" style={{ marginBottom: '16px' }} />
            <h2 style={{ marginBottom: '8px' }}>Dashboard Connection Issue</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{error}</p>
            <button className="btn-primary" onClick={fetchDashboardData}>Retry Load</button>
          </GlassCard>
        </main>
      </div>
    );
  }

  const { profile_completion, completed_assessment, recommendations_count, top_recommendations, saved_count, exam_alerts, recent_activities } = widgets;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <main className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Student Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Welcome to your personalized career roadmap center</p>
          </div>
          
          <Link to="/assistant" className="btn-primary" style={{ background: 'linear-gradient(135deg, var(--accent-emerald), var(--accent-blue))', boxShadow: 'none' }}>
            <Sparkles size={16} />
            Chat with AI Counselor
          </Link>
        </div>

        {/* Main metrics overview row */}
        <div className="grid-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '32px' }}>
          <GlassCard>
            <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px' }}>PROFILE COMPLETION</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '32px', fontWeight: '800' }}>{profile_completion}%</div>
              <div style={{ flexGrow: 1, background: 'rgba(255, 255, 255, 0.05)', height: '8px', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${profile_completion}%`,
                  background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-indigo))'
                }} />
              </div>
            </div>
            <Link to="/profile" style={{ fontSize: '12px', color: 'var(--accent-indigo)', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '16px' }}>
              Update profile details <ArrowRight size={12} />
            </Link>
          </GlassCard>

          <GlassCard>
            <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px' }}>CAREER MATCHES</h3>
            <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>
              {recommendations_count} <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>Careers</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {completed_assessment ? "Generated from your quiz metrics" : "Complete assessment to generate"}
            </p>
            <Link to="/recommendations" style={{ fontSize: '12px', color: 'var(--accent-indigo)', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '16px' }}>
              View matches <ArrowRight size={12} />
            </Link>
          </GlassCard>

          <GlassCard>
            <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px' }}>SAVED CAREERS</h3>
            <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>
              {saved_count} <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>Saved</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Items marked for quick reference</p>
            <Link to="/careers" style={{ fontSize: '12px', color: 'var(--accent-indigo)', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '16px' }}>
              Browse directory <ArrowRight size={12} />
            </Link>
          </GlassCard>
        </div>

        {/* Assessment call to action block */}
        {!completed_assessment && (
          <GlassCard style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05))',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
            padding: '32px',
            marginBottom: '32px'
          }}>
            <div style={{ maxWidth: '600px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Sparkles size={20} color="var(--accent-amber)" />
                <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Unlock AI Career Matches</h2>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                You have not completed the Career Assessment yet. Take our 5-minute quiz focusing on academic preferences, key skills, and hobbies to view compatibility rankings.
              </p>
            </div>
            <Link to="/assessment" className="btn-primary" style={{ padding: '12px 24px' }}>
              <Play size={16} fill="white" />
              Start Assessment
            </Link>
          </GlassCard>
        )}

        {/* Inner layout grid: Left = Matches, Right = Exam Alerts + Activities */}
        <div className="grid-container" style={{ gridTemplateColumns: '2fr 1fr', alignItems: 'start' }}>
          
          {/* Left panel: Top Recommendations */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <GlassCard>
              <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px' }}>Top Career Compatibility Recommendations</h2>
              {top_recommendations.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {top_recommendations.map((rec) => (
                    <div 
                      key={rec.id}
                      style={{
                        padding: '16px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>{rec.name}</h4>
                        <span className="badge badge-indigo">{rec.category}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block' }}>Match score</span>
                          <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--accent-emerald)' }}>{rec.score}%</span>
                        </div>
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '8px 12px', fontSize: '12px' }}
                          onClick={() => navigate(`/careers/${rec.id}`)}
                        >
                          View Roadmap
                        </button>
                      </div>
                    </div>
                  ))}
                  <Link to="/recommendations" style={{ textAlign: 'center', fontSize: '14px', fontWeight: '600', color: 'var(--accent-indigo)', textDecoration: 'none', display: 'block', marginTop: '10px' }}>
                    View all matching career profiles
                  </Link>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
                  <HelpCircle size={36} style={{ marginBottom: '8px', opacity: 0.5 }} />
                  <p style={{ fontSize: '14px' }}>No recommendations calculated. Start by taking the quiz!</p>
                </div>
              )}
            </GlassCard>
            
            {/* Direct directory cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <GlassCard style={{ padding: '24px' }}>
                <School size={28} color="var(--accent-blue)" style={{ marginBottom: '16px' }} />
                <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>Colleges & Universities</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.5', marginBottom: '16px' }}>Explore programs, admission criteria, rankings and direct links.</p>
                <Link to="/colleges" style={{ fontSize: '13px', color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: '600' }}>Browse Colleges →</Link>
              </GlassCard>
              <GlassCard style={{ padding: '24px' }}>
                <Trophy size={28} color="var(--accent-violet)" style={{ marginBottom: '16px' }} />
                <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>Scholarship Portal</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.5', marginBottom: '16px' }}>Filter active student awards, eligibility scopes and apply directly.</p>
                <Link to="/scholarships" style={{ fontSize: '13px', color: 'var(--accent-violet)', textDecoration: 'none', fontWeight: '600' }}>Browse Scholarships →</Link>
              </GlassCard>
            </div>
          </div>

          {/* Right panel: Exam alerts and activities */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Exam alerts widget */}
            <GlassCard>
              <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} color="var(--accent-indigo)" />
                Exam Dates & Alerts
              </h3>
              {exam_alerts && exam_alerts.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {exam_alerts.map((alert, index) => (
                    <div key={index} style={{ borderBottom: index < exam_alerts.length - 1 ? '1px solid var(--border-glass)' : 'none', paddingBottom: '12px' }}>
                      <h5 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '2px' }}>{alert.exam_name}</h5>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{alert.event}: <strong style={{ color: 'var(--accent-rose)' }}>{alert.date}</strong></p>
                      <a href={alert.registration_link} target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: 'var(--accent-indigo)', textDecoration: 'none', fontWeight: '600' }}>Apply Online</a>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No upcoming exam alerts.</p>
              )}
            </GlassCard>

            {/* Activities widget */}
            <GlassCard>
              <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="var(--accent-emerald)" />
                Recent Progress
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recent_activities.map((act, index) => (
                  <div key={index} style={{ display: 'flex', gap: '8px', fontSize: '13px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-indigo)', marginTop: '6px', flexShrink: 0 }} />
                    <div>
                      <p style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{act.action}</p>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
