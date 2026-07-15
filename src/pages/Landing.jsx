import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, BookOpen, School, ArrowRight, Cpu, MessageSquare } from 'lucide-react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { token } = useAuth();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Background glow animations */}
      <div className="glow-spot-1" />
      <div className="glow-spot-2" />

      <Navbar />

      <main style={{ flexGrow: 1, maxWidth: '1200px', margin: '0 auto', padding: '60px 24px', width: '100%' }}>
        {/* Hero Section */}
        <section style={{ textAlign: 'center', marginBottom: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            background: 'rgba(99, 102, 241, 0.1)',
            padding: '8px 16px',
            borderRadius: '9999px',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px'
          }}>
            <Cpu size={16} color="var(--accent-indigo)" />
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--accent-indigo)' }}>
              Next Generation AI Recommendation Engine V1.0
            </span>
          </div>

          <h1 style={{
            fontSize: '56px',
            fontWeight: '800',
            lineHeight: '1.15',
            letterSpacing: '-1.5px',
            marginBottom: '24px',
            maxWidth: '900px'
          }}>
            Discover Your Perfect Career Path With <span className="text-gradient-rainbow text-glow">Career Compass AI</span>
          </h1>

          <p style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            maxWidth: '650px',
            lineHeight: '1.6',
            marginBottom: '40px'
          }}>
            Take a structured academic, personality, and interest assessment to unlock data-backed compatibility scores. Explore colleges, scholarships, and exam alerts in one place.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to={token ? "/assessment" : "/register"} className="btn-primary" style={{ textDecoration: 'none', padding: '14px 28px' }}>
              Take Career Assessment
              <ArrowRight size={18} />
            </Link>
            <Link to="/careers" className="btn-secondary" style={{ textDecoration: 'none', padding: '14px 28px' }}>
              Explore Career Directory
            </Link>
          </div>
        </section>

        {/* Stats Grid */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '80px' }}>
          {[
            { metric: "15+", label: "Target Industries Mapped" },
            { metric: "98%", label: "Student Satisfaction Score" },
            { metric: "50+", label: "Colleges & Institutes" },
            { metric: "100%", label: "Privacy Protected & Secure" }
          ].map((stat, idx) => (
            <GlassCard key={idx} style={{ textAlign: 'center', padding: '32px 16px' }}>
              <h3 style={{ fontSize: '36px', fontWeight: '800', color: 'var(--accent-indigo)', marginBottom: '8px' }} className="text-glow">
                {stat.metric}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600' }}>
                {stat.label}
              </p>
            </GlassCard>
          ))}
        </section>

        {/* Feature Sections */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: '800', marginBottom: '48px' }}>
            A Complete Career Exploration Ecosystem
          </h2>

          <div className="grid-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            <GlassCard>
              <div style={{ background: 'rgba(99, 102, 241, 0.1)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                <BookOpen size={24} color="var(--accent-indigo)" />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>AI Career Matchmaker</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                Answer multi-dimensional questions about interests, personality, and subjects. Our weighted scoring engine computes your exact compatibility matches.
              </p>
            </GlassCard>

            <GlassCard>
              <div style={{ background: 'rgba(139, 92, 246, 0.1)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                <Compass size={24} color="var(--accent-violet)" />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>Timeline Roadmaps</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                Visualize complete educational and growth progression pathing: 10th choices, 12th subjects, entrance exams, graduation college, and salary milestones.
              </p>
            </GlassCard>

            <GlassCard>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                <School size={24} color="var(--accent-blue)" />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>Colleges & Exam Alerts</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                Stay updated with critical alerts for registration deadlines, eligibility details, college rankings, admission processes, and scholarships.
              </p>
            </GlassCard>

            <GlassCard>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                <MessageSquare size={24} color="var(--accent-emerald)" />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>AI Career Chatbot</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                Have questions? Speak with our context-aware assistant to get instant answers about stream choices, subject prerequisites, and specific career profiles.
              </p>
            </GlassCard>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="glass-panel" style={{
          padding: '60px 40px',
          textAlign: 'center',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
          border: '1px solid var(--border-glass)'
        }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800' }}>Ready to Take Control of Your Future?</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '600px', lineHeight: '1.6' }}>
            Register your profile today to access personalized recommendations, download printable PDF career reports, and track your achievements.
          </p>
          <Link to={token ? "/dashboard" : "/register"} className="btn-primary" style={{ textDecoration: 'none', padding: '14px 32px' }}>
            Create Free Account
            <ArrowRight size={18} />
          </Link>
        </section>
      </main>

      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-glass)',
        padding: '30px 24px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '14px'
      }}>
        © 2026 Career Compass AI. Made with love for students everywhere.
      </footer>
    </div>
  );
};

export default Landing;
