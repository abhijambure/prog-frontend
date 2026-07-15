import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileDown, ArrowRight, AlertTriangle,
  CheckCircle, Cpu, Bookmark, BookmarkCheck
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import Loading from '../components/Loading';
import { assessmentAPI, careerAPI, studentAPI } from '../services/api';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const Recommendations = () => {
  const [results, setResults] = useState([]);
  const [profile, setProfile] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load user profile
      const profData = await studentAPI.getProfile();
      setProfile(profData);
      
      if (!profData.completed_assessment) {
        setResults([]);
        setLoading(false);
        return;
      }
      
      // Load results
      const data = await assessmentAPI.getResults();
      setResults(data);
      
      // Load saved careers list to check bookmarks
      const saved = await careerAPI.getSavedCareers();
      setSavedIds(new Set(saved.map(c => c.id)));
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Could not fetch recommendation results.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async (careerId) => {
    try {
      const res = await careerAPI.toggleSaveCareer(careerId);
      const newSaved = new Set(savedIds);
      if (res.saved) {
        newSaved.add(careerId);
      } else {
        newSaved.delete(careerId);
      }
      setSavedIds(newSaved);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadPDFReport = () => {
    if (!profile || results.length === 0) return;

    try {
      const doc = new jsPDF();
      
      // Document Style Configuration
      doc.setFillColor(15, 22, 38); // Navy blue header
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("CAREER COMPASS AI", 14, 20);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Personalized Student Compatibility Guidance Report", 14, 28);
      
      // Student Metadata Details
      doc.setTextColor(15, 22, 38);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("STUDENT PROFILE", 14, 52);
      
      const metaRows = [
        ["Full Name", profile.full_name || "N/A", "Current Class", profile.class_name || "N/A"],
        ["Academic Board", profile.academic_board || "N/A", "Stream Preference", profile.preferred_stream || "N/A"],
        ["Location", `${profile.city || ""}, ${profile.state || ""}`, "Academic Score", `${profile.percentage || "N/A"}%`],
        ["Personality Style", profile.personality_type || "N/A", "Key Skills", (profile.skills || []).join(", ") || "N/A"]
      ];
      
      doc.autoTable({
        startY: 56,
        body: metaRows,
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 4 },
        columnStyles: {
          0: { fontStyle: 'bold', width: 35 },
          1: { width: 60 },
          2: { fontStyle: 'bold', width: 35 },
          3: { width: 60 }
        }
      });
      
      // Career Recommendations Table
      const finalY = doc.previousAutoTable.finalY + 12;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("TOP CAREER RECOMMENDATIONS", 14, finalY);
      
      const tableHeaders = [["Rank", "Career Pathway", "Sector / Category", "Match Score", "Primary Compatibility Reason"]];
      const tableRows = results.map((r, index) => [
        index + 1,
        r.career.name,
        r.career.category,
        `${r.score}%`,
        r.reasons[0] || "Aligned based on general interest weights."
      ]);
      
      doc.autoTable({
        startY: finalY + 4,
        head: tableHeaders,
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [99, 102, 241] }, // Indigo header
        styles: { fontSize: 9, cellPadding: 5 }
      });
      
      // Next Steps section
      const finalTableY = doc.previousAutoTable.finalY + 12;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("SUGGESTED NEXT STEPS", 14, finalTableY);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      
      const steps = [
        "1. Study the vertical milestones in the detailed roadmap view for your top matches.",
        "2. Review eligibility prerequisites, entrance examinations (like JEE, NEET, CLAT), and timelines.",
        "3. Book counseling guides or search for scholarships matching your profile in our Scholarship Directory.",
        "4. Ask the Career Compass AI Chatbot for custom curriculum details or favorite subjects questions."
      ];
      
      steps.forEach((step, index) => {
        doc.text(step, 14, finalTableY + 8 + (index * 6));
      });
      
      // Footer signature
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("Report compiled dynamically by Career Compass AI recommendation service layer. Validated standard report.", 14, 280);
      
      doc.save(`${profile.full_name.replace(/\s+/g, '_')}_Career_Report.pdf`);
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF. Check console logs.");
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="main-content">
          <Loading message="Compiling match score ratings..." />
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
            <h2>Failed to load recommendation matches</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{error}</p>
            <button className="btn-primary" onClick={fetchRecommendations}>Retry load</button>
          </GlassCard>
        </main>
      </div>
    );
  }

  // Handle case where user hasn't completed assessment yet
  if (!profile?.completed_assessment) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <GlassCard style={{ maxWidth: '500px', textAlign: 'center', padding: '40px' }}>
            <Cpu size={48} color="var(--accent-indigo)" style={{ marginBottom: '16px', animation: 'bounce 2s infinite' }} />
            <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '12px' }}>Assessment Not Taken Yet</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '32px' }}>
              Your compatibility scores have not been computed because you have not completed the Career Assessment. Take the short questionnaire to map your skills and interests.
            </p>
            <Link to="/assessment" className="btn-primary" style={{ textDecoration: 'none' }}>
              Start Assessment Now
              <ArrowRight size={18} />
            </Link>
          </GlassCard>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Your Compatibility Match Scores</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Based on your academic profile and assessment weights</p>
          </div>

          <button className="btn-primary" onClick={downloadPDFReport} style={{ background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-violet))' }}>
            <FileDown size={16} />
            Download PDF Report
          </button>
        </div>

        {/* List of recommended careers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {results.map((rec) => {
            const isSaved = savedIds.has(rec.career.id);
            return (
              <GlassCard 
                key={rec.career.id} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '32px',
                  flexWrap: 'wrap',
                  padding: '30px'
                }}
              >
                {/* Score badge circle */}
                <div 
                  className="compatibility-radial text-glow" 
                  style={{
                    background: `conic-gradient(var(--accent-emerald) ${rec.score * 3.6}deg, rgba(255,255,255,0.05) 0deg)`,
                    color: 'var(--text-primary)',
                    flexShrink: 0
                  }}
                >
                  {/* Inside circle mask for conic outline style */}
                  <div style={{
                    position: 'absolute',
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    background: 'var(--bg-secondary)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontWeight: '800',
                    fontSize: '18px'
                  }}>
                    {rec.score}%
                  </div>
                </div>

                {/* Details info */}
                <div style={{ flexGrow: 1, minWidth: '260px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: '800' }}>{rec.career.name}</h2>
                    <span className="badge badge-indigo">{rec.career.category}</span>
                    <span className="badge badge-emerald" style={{ textTransform: 'capitalize' }}>{rec.career.demand} Demand</span>
                  </div>

                  {/* Reasons list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '14px 0' }}>
                    {rec.reasons.map((reason, rIdx) => (
                      <div key={rIdx} style={{ display: 'flex', alignItems: 'start', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        <CheckCircle size={14} color="var(--accent-emerald)" style={{ marginTop: '2px', flexShrink: 0 }} />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    <span>Degree: <strong>{rec.career.degree} ({rec.career.duration})</strong></span>
                    <span>Average Salary (India): <strong>₹{(rec.career.salary_india.average / 100000).toFixed(1)} LPA</strong></span>
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
                  <button
                    onClick={() => handleToggleSave(rec.career.id)}
                    className="btn-secondary"
                    style={{
                      padding: '12px',
                      color: isSaved ? 'var(--accent-indigo)' : 'var(--text-muted)',
                      borderColor: isSaved ? 'var(--accent-indigo)' : 'var(--border-glass)'
                    }}
                    title={isSaved ? "Saved to Bookmarks" : "Save to Bookmarks"}
                  >
                    {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                  </button>
                  
                  <Link to={`/careers/${rec.career.id}`} className="btn-primary" style={{ textDecoration: 'none', padding: '12px 20px' }}>
                    View Roadmap
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Recommendations;
