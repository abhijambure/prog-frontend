import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, ShieldAlert,
  TrendingUp, Users, BookOpen, Compass, School, 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import Loading from '../components/Loading';
import { adminAPI, careerAPI, directoryAPI } from '../services/api';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, 
  Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Active Management Tab: 'analytics', 'careers', 'colleges', 'exams', 'scholarships'
  const [activeTab, setActiveTab] = useState('analytics');

  // CRUD Data States
  const [careers, setCareers] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [exams, setExams] = useState([]);
  const [scholarships, setScholarships] = useState([]);

  // Form Model States for creating items
  const [showAddModal, setShowAddModal] = useState(false);
  const [careerForm, setCareerForm] = useState({
    name: '', category: 'Engineering', overview: '', eligibility: '',
    demand: 'High', duration: '4 Years', degree: '',
    salary_india: { min: 400000, max: 2000000, average: 900000 },
    salary_global: { min: 60000, max: 150000, average: 95000 },
    responsibilities: [], roadmap: []
  });

  const [collegeForm, setCollegeForm] = useState({
    name: '', city: '', state: '', ranking: 1, website: '',
    programs: [], admission_process: ''
  });

  const [examForm, setExamForm] = useState({
    name: '', eligibility: '', exam_pattern: '', website: '',
    registration_link: '', syllabus: [], important_dates: {}
  });

  const [scholarshipForm, setScholarshipForm] = useState({
    name: '', eligibility: '', award_amount: '', deadline: '', website: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, [activeTab]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (activeTab === 'analytics') {
        const stats = await adminAPI.getAnalytics();
        setAnalytics(stats);
      } else if (activeTab === 'careers') {
        const data = await careerAPI.getCareers();
        setCareers(data);
      } else if (activeTab === 'colleges') {
        const data = await directoryAPI.getColleges();
        setColleges(data);
      } else if (activeTab === 'exams') {
        const data = await directoryAPI.getExams();
        setExams(data);
      } else if (activeTab === 'scholarships') {
        const data = await directoryAPI.getScholarships();
        setScholarships(data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to query administrative API logs. Make sure you are logged in as admin.');
    } finally {
      setLoading(false);
    }
  };

  // CRUD Delete operations
  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      if (type === 'career') await adminAPI.deleteCareer(id);
      else if (type === 'college') await adminAPI.deleteCollege(id);
      else if (type === 'exam') await adminAPI.deleteExam(id);
      else if (type === 'scholarship') await adminAPI.deleteScholarship(id);
      
      fetchInitialData(); // reload
    } catch {
      alert('Delete failed.');
    }
  };

  // CRUD Create operations submit handlers
  const handleCreateCareer = async (e) => {
    e.preventDefault();
    try {
      // Split comma separated tags
      const cleanForm = {
        ...careerForm,
        responsibilities: typeof careerForm.responsibilities === 'string' ? careerForm.responsibilities.split(',').map(s => s.trim()) : [],
        roadmap: [
          { stage: "10th", desc: "Select stream" },
          { stage: "12th", desc: "Prepare for entry exams" },
          { stage: "College", desc: `Enroll in ${careerForm.degree}` },
          { stage: "Employment", desc: "Start career" }
        ]
      };
      await adminAPI.createCareer(cleanForm);
      setShowAddModal(false);
      fetchInitialData();
    } catch (err) {
      alert('Create failed: ' + (err.response?.data?.detail || 'General Error'));
    }
  };

  const handleCreateCollege = async (e) => {
    e.preventDefault();
    try {
      const cleanForm = {
        ...collegeForm,
        programs: typeof collegeForm.programs === 'string' ? collegeForm.programs.split(',').map(s => s.trim()) : []
      };
      await adminAPI.createCollege(cleanForm);
      setShowAddModal(false);
      fetchInitialData();
    } catch (err) {
      alert('Create failed: ' + (err.response?.data?.detail || 'General Error'));
    }
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      const cleanForm = {
        ...examForm,
        syllabus: typeof examForm.syllabus === 'string' ? examForm.syllabus.split(',').map(s => s.trim()) : [],
        important_dates: { "Registration Starts": "Nov 2026", "Exam Date": "May 2027" }
      };
      await adminAPI.createExam(cleanForm);
      setShowAddModal(false);
      fetchInitialData();
    } catch (err) {
      alert('Create failed: ' + (err.response?.data?.detail || 'General Error'));
    }
  };

  const handleCreateScholarship = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createScholarship(scholarshipForm);
      setShowAddModal(false);
      fetchInitialData();
    } catch (err) {
      alert('Create failed: ' + (err.response?.data?.detail || 'General Error'));
    }
  };

  const renderAnalytics = () => {
    if (!analytics) return null;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Metric Cards Row */}
        <div className="grid-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {analytics.cards.map((card, idx) => (
            <GlassCard key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '700' }}>
                <span>{card.label.toUpperCase()}</span>
                {idx === 0 && <Users size={16} />}
                {idx === 1 && <BookOpen size={16} />}
                {idx === 2 && <Compass size={16} />}
                {idx === 3 && <School size={16} />}
              </div>
              <div style={{ fontSize: '32px', fontWeight: '800' }}>{card.value}</div>
              <div style={{ fontSize: '12px', color: card.change >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <TrendingUp size={12} />
                <span>+{card.change}% since last week</span>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid-container" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
          <GlassCard style={{ minHeight: '340px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px' }}>Sign-ups Over Time (Active Students)</h3>
            <div style={{ width: '100%', height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.registrations_over_time}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} />
                  <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: '#fff' }} />
                  <Line type="monotone" dataKey="students" stroke="var(--accent-indigo)" strokeWidth={3} dot={{ fill: 'var(--accent-indigo)', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard style={{ minHeight: '340px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px' }}>Popular Target Careers</h3>
            <div style={{ width: '100%', height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.popular_careers}>
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} />
                  <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)' }} />
                  <Bar dataKey="count" fill="var(--accent-emerald)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Popular subjects and interests tags lists */}
        <div className="grid-container" style={{ gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <GlassCard>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>Student Favorite Subjects</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {analytics.popular_subjects.map((sub, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span>{sub.name}</span>
                  <strong style={{ color: 'var(--accent-indigo)' }}>{sub.count} selections</strong>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>Student Hobbies / Interests</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {analytics.popular_interests.map((interest, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span>{interest.name}</span>
                  <strong style={{ color: 'var(--accent-emerald)' }}>{interest.count} selections</strong>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

      </div>
    );
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={28} color="var(--accent-rose)" />
              Administrative Dashboard
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>Manage platform directory databases and review student metrics</p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className={`btn-secondary ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
              style={{ borderColor: activeTab === 'analytics' ? 'var(--accent-indigo)' : 'var(--border-glass)' }}
            >
              Analytics
            </button>
            <button 
              className={`btn-secondary ${activeTab === 'careers' ? 'active' : ''}`}
              onClick={() => setActiveTab('careers')}
              style={{ borderColor: activeTab === 'careers' ? 'var(--accent-indigo)' : 'var(--border-glass)' }}
            >
              Careers
            </button>
            <button 
              className={`btn-secondary ${activeTab === 'colleges' ? 'active' : ''}`}
              onClick={() => setActiveTab('colleges')}
              style={{ borderColor: activeTab === 'colleges' ? 'var(--accent-indigo)' : 'var(--border-glass)' }}
            >
              Colleges
            </button>
            <button 
              className={`btn-secondary ${activeTab === 'exams' ? 'active' : ''}`}
              onClick={() => setActiveTab('exams')}
              style={{ borderColor: activeTab === 'exams' ? 'var(--accent-indigo)' : 'var(--border-glass)' }}
            >
              Exams
            </button>
            <button 
              className={`btn-secondary ${activeTab === 'scholarships' ? 'active' : ''}`}
              onClick={() => setActiveTab('scholarships')}
              style={{ borderColor: activeTab === 'scholarships' ? 'var(--accent-indigo)' : 'var(--border-glass)' }}
            >
              Scholarships
            </button>
          </div>
        </div>

        {error && (
          <GlassCard style={{ borderColor: 'var(--accent-rose)', padding: '20px', marginBottom: '24px' }}>
            <p style={{ color: 'var(--accent-rose)' }}>{error}</p>
          </GlassCard>
        )}

        {loading ? (
          <Loading message={`Loading ${activeTab} configurations...`} />
        ) : (
          <>
            {activeTab === 'analytics' && renderAnalytics()}
            
            {/* CRUD list controls */}
            {activeTab !== 'analytics' && (
              <GlassCard>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', textTransform: 'capitalize' }}>Manage {activeTab}</h3>
                  <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => setShowAddModal(true)}>
                    <Plus size={16} /> Add New {activeTab.slice(0, -1)}
                  </button>
                </div>

                {/* Lists mapping */}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-glass)', textAlign: 'left' }}>
                        <th style={{ padding: '12px 8px', color: 'var(--text-primary)' }}>Name</th>
                        <th style={{ padding: '12px 8px', color: 'var(--text-primary)' }}>Detail Info</th>
                        <th style={{ padding: '12px 8px', color: 'var(--text-primary)', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeTab === 'careers' && careers.map(c => (
                        <tr key={c.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                          <td style={{ padding: '16px 8px', fontWeight: '700', color: 'var(--text-primary)' }}>{c.name}</td>
                          <td style={{ padding: '16px 8px' }}>Category: {c.category} | Degree: {c.degree}</td>
                          <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                            <button className="btn-secondary" style={{ padding: '6px', color: 'var(--accent-rose)', borderColor: 'rgba(244,63,94,0.1)' }} onClick={() => handleDelete('career', c.id)}>
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {activeTab === 'colleges' && colleges.map(c => (
                        <tr key={c.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                          <td style={{ padding: '16px 8px', fontWeight: '700', color: 'var(--text-primary)' }}>{c.name}</td>
                          <td style={{ padding: '16px 8px' }}>{c.city}, {c.state} | Ranking: #{c.ranking || 'N/A'}</td>
                          <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                            <button className="btn-secondary" style={{ padding: '6px', color: 'var(--accent-rose)', borderColor: 'rgba(244,63,94,0.1)' }} onClick={() => handleDelete('college', c.id)}>
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {activeTab === 'exams' && exams.map(e => (
                        <tr key={e.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                          <td style={{ padding: '16px 8px', fontWeight: '700', color: 'var(--text-primary)' }}>{e.name}</td>
                          <td style={{ padding: '16px 8px' }}>{e.eligibility.slice(0, 80)}...</td>
                          <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                            <button className="btn-secondary" style={{ padding: '6px', color: 'var(--accent-rose)', borderColor: 'rgba(244,63,94,0.1)' }} onClick={() => handleDelete('exam', e.id)}>
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {activeTab === 'scholarships' && scholarships.map(s => (
                        <tr key={s.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                          <td style={{ padding: '16px 8px', fontWeight: '700', color: 'var(--text-primary)' }}>{s.name}</td>
                          <td style={{ padding: '16px 8px' }}>Award: {s.award_amount} | Deadline: {s.deadline}</td>
                          <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                            <button className="btn-secondary" style={{ padding: '6px', color: 'var(--accent-rose)', borderColor: 'rgba(244,63,94,0.1)' }} onClick={() => handleDelete('scholarship', s.id)}>
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            )}
          </>
        )}

        {/* Simplistic Modal popup for adding items */}
        {showAddModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
          }}>
            <GlassCard style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', padding: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Add New {activeTab.slice(0, -1).toUpperCase()}</h3>
                <button className="btn-secondary" style={{ padding: '4px 8px' }} onClick={() => setShowAddModal(false)}>Close</button>
              </div>

              {activeTab === 'careers' && (
                <form onSubmit={handleCreateCareer} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <input type="text" placeholder="Career Name" required className="input-field" onChange={e => setCareerForm({...careerForm, name: e.target.value})} />
                  <input type="text" placeholder="Category (e.g. Engineering)" required className="input-field" onChange={e => setCareerForm({...careerForm, category: e.target.value})} />
                  <textarea placeholder="Overview" required className="input-field" style={{ minHeight: '80px' }} onChange={e => setCareerForm({...careerForm, overview: e.target.value})} />
                  <input type="text" placeholder="Eligibility prerequisites" required className="input-field" onChange={e => setCareerForm({...careerForm, eligibility: e.target.value})} />
                  <input type="text" placeholder="Degree (e.g. B.Tech)" required className="input-field" onChange={e => setCareerForm({...careerForm, degree: e.target.value})} />
                  <input type="text" placeholder="Responsibilities (comma separated)" className="input-field" onChange={e => setCareerForm({...careerForm, responsibilities: e.target.value})} />
                  <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Submit</button>
                </form>
              )}

              {activeTab === 'colleges' && (
                <form onSubmit={handleCreateCollege} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <input type="text" placeholder="College Name" required className="input-field" onChange={e => setCollegeForm({...collegeForm, name: e.target.value})} />
                  <input type="text" placeholder="City" required className="input-field" onChange={e => setCollegeForm({...collegeForm, city: e.target.value})} />
                  <input type="text" placeholder="State" required className="input-field" onChange={e => setCollegeForm({...collegeForm, state: e.target.value})} />
                  <input type="number" placeholder="Ranking" className="input-field" onChange={e => setCollegeForm({...collegeForm, ranking: parseInt(e.target.value)})} />
                  <input type="text" placeholder="Website URL" className="input-field" onChange={e => setCollegeForm({...collegeForm, website: e.target.value})} />
                  <input type="text" placeholder="Programs (comma separated)" className="input-field" onChange={e => setCollegeForm({...collegeForm, programs: e.target.value})} />
                  <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Submit</button>
                </form>
              )}

              {activeTab === 'exams' && (
                <form onSubmit={handleCreateExam} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <input type="text" placeholder="Exam Name" required className="input-field" onChange={e => setExamForm({...examForm, name: e.target.value})} />
                  <input type="text" placeholder="Eligibility" required className="input-field" onChange={e => setExamForm({...examForm, eligibility: e.target.value})} />
                  <input type="text" placeholder="Pattern (e.g. Offline MCQ)" required className="input-field" onChange={e => setExamForm({...examForm, exam_pattern: e.target.value})} />
                  <input type="text" placeholder="Website" className="input-field" onChange={e => setExamForm({...examForm, website: e.target.value})} />
                  <input type="text" placeholder="Syllabus (comma separated topics)" className="input-field" onChange={e => setExamForm({...examForm, syllabus: e.target.value})} />
                  <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Submit</button>
                </form>
              )}

              {activeTab === 'scholarships' && (
                <form onSubmit={handleCreateScholarship} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <input type="text" placeholder="Scholarship Name" required className="input-field" onChange={e => setScholarshipForm({...scholarshipForm, name: e.target.value})} />
                  <input type="text" placeholder="Eligibility details" required className="input-field" onChange={e => setScholarshipForm({...scholarshipForm, eligibility: e.target.value})} />
                  <input type="text" placeholder="Award Amount (e.g. ₹50,000/yr)" required className="input-field" onChange={e => setScholarshipForm({...scholarshipForm, award_amount: e.target.value})} />
                  <input type="text" placeholder="Deadline (e.g. October annually)" required className="input-field" onChange={e => setScholarshipForm({...scholarshipForm, deadline: e.target.value})} />
                  <input type="text" placeholder="Website URL" className="input-field" onChange={e => setScholarshipForm({...scholarshipForm, website: e.target.value})} />
                  <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Submit</button>
                </form>
              )}
            </GlassCard>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
