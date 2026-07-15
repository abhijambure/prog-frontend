import React, { useState, useEffect } from 'react';
import { Save, Plus, X, User, AlertCircle, Info, Sparkles } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import Loading from '../components/Loading';
import { studentAPI } from '../services/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Input states for list arrays
  const [newSubject, setNewSubject] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newGoal, setNewGoal] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await studentAPI.getProfile();
      setProfile(data);
    } catch (err) {
      console.error(err);
      setError('Could not load profile details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const updated = await studentAPI.updateProfile(profile);
      setProfile(updated);
      setSuccess('Profile details saved successfully!');
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      setError('Failed to save profile. Make sure inputs are valid.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };

  // Tag list operation helpers
  const addTag = (field, tag, setter) => {
    if (!tag.trim()) return;
    const currentTags = profile[field] || [];
    if (!currentTags.includes(tag.trim())) {
      setProfile({
        ...profile,
        [field]: [...currentTags, tag.trim()]
      });
    }
    setter('');
  };

  const removeTag = (field, tagToRemove) => {
    setProfile({
      ...profile,
      [field]: profile[field].filter(t => t !== tagToRemove)
    });
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="main-content">
          <Loading message="Fetching student profile details..." />
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-content">
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Student Profile Details</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Provide detailed academic and career tags to improve compatibility scoring</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.2)',
            color: 'var(--accent-rose)',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            color: 'var(--accent-emerald)',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <Info size={16} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Section 1: Demographics */}
          <GlassCard>
            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="var(--accent-indigo)" />
              Basic Demographics
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  required
                  className="input-field"
                  value={profile.full_name || ''}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Current Standard / Class</label>
                <select
                  name="class_name"
                  className="input-field"
                  value={profile.class_name || ''}
                  onChange={handleChange}
                  style={{ background: 'rgba(0,0,0,0.15)' }}
                >
                  <option value="">Select Class</option>
                  <option value="10th Standard">10th Standard</option>
                  <option value="12th Standard">12th Standard</option>
                  <option value="Undergraduate">Undergraduate</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Academic Board</label>
                <input
                  type="text"
                  name="academic_board"
                  placeholder="e.g. CBSE, ICSE, State Board"
                  className="input-field"
                  value={profile.academic_board || ''}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Academic Percentage / GPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  name="percentage"
                  placeholder="e.g. 85.5"
                  className="input-field"
                  value={profile.percentage || ''}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>City</label>
                <input
                  type="text"
                  name="city"
                  className="input-field"
                  value={profile.city || ''}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>State</label>
                <input
                  type="text"
                  name="state"
                  className="input-field"
                  value={profile.state || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </GlassCard>

          {/* Section 2: Stream & Personality */}
          <GlassCard>
            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="var(--accent-indigo)" />
              Career Preferences & Style
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Preferred Stream</label>
                <select
                  name="preferred_stream"
                  className="input-field"
                  value={profile.preferred_stream || ''}
                  onChange={handleChange}
                  style={{ background: 'rgba(0,0,0,0.15)' }}
                >
                  <option value="">Select Stream</option>
                  <option value="Science">Science (PCM/PCB)</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Arts">Arts / Humanities</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Personality Self-Type</label>
                <select
                  name="personality_type"
                  className="input-field"
                  value={profile.personality_type || ''}
                  onChange={handleChange}
                  style={{ background: 'rgba(0,0,0,0.15)' }}
                >
                  <option value="">Select Personality Type</option>
                  <option value="Analytical">Analytical (Logical, Math-focused)</option>
                  <option value="Creative">Creative (Visual, Art, Innovation)</option>
                  <option value="Social">Social (Patient-care, Customer-focused)</option>
                  <option value="Enterprising">Enterprising (Business, Leader, Lawyer)</option>
                </select>
              </div>
            </div>
          </GlassCard>

          {/* Section 3: Tag lists (Favorite subjects, interests, skills, career goals) */}
          <GlassCard>
            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>Skills & Interests Keywords</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              
              {/* Favorite Subjects */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>Favorite Subjects</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Mathematics"
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag('favorite_subjects', newSubject, setNewSubject))}
                  />
                  <button type="button" className="btn-secondary" style={{ padding: '0 16px' }} onClick={() => addTag('favorite_subjects', newSubject, setNewSubject)}>
                    <Plus size={16} />
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                  {(profile.favorite_subjects || []).map(tag => (
                    <span key={tag} className="badge badge-blue" style={{ gap: '6px', padding: '6px 12px' }}>
                      {tag}
                      <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeTag('favorite_subjects', tag)} />
                    </span>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>Interests</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Coding, Space"
                    value={newInterest}
                    onChange={e => setNewInterest(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag('interests', newInterest, setNewInterest))}
                  />
                  <button type="button" className="btn-secondary" style={{ padding: '0 16px' }} onClick={() => addTag('interests', newInterest, setNewInterest)}>
                    <Plus size={16} />
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                  {(profile.interests || []).map(tag => (
                    <span key={tag} className="badge badge-indigo" style={{ gap: '6px', padding: '6px 12px' }}>
                      {tag}
                      <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeTag('interests', tag)} />
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>Key Skills</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Problem Solving"
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag('skills', newSkill, setNewSkill))}
                  />
                  <button type="button" className="btn-secondary" style={{ padding: '0 16px' }} onClick={() => addTag('skills', newSkill, setNewSkill)}>
                    <Plus size={16} />
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                  {(profile.skills || []).map(tag => (
                    <span key={tag} className="badge badge-emerald" style={{ gap: '6px', padding: '6px 12px' }}>
                      {tag}
                      <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeTag('skills', tag)} />
                    </span>
                  ))}
                </div>
              </div>

              {/* Career Goals */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>Long-term Career Goals</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Build mobile apps"
                    value={newGoal}
                    onChange={e => setNewGoal(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag('career_goals', newGoal, setNewGoal))}
                  />
                  <button type="button" className="btn-secondary" style={{ padding: '0 16px' }} onClick={() => addTag('career_goals', newGoal, setNewGoal)}>
                    <Plus size={16} />
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                  {(profile.career_goals || []).map(tag => (
                    <span key={tag} className="badge badge-amber" style={{ gap: '6px', padding: '6px 12px' }}>
                      {tag}
                      <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeTag('career_goals', tag)} />
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </GlassCard>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
            style={{ alignSelf: 'flex-start', padding: '14px 28px' }}
          >
            <Save size={18} />
            {saving ? 'Saving Details...' : 'Save Profile details'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Profile;
