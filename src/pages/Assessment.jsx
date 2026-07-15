import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, ArrowLeft, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import Loading from '../components/Loading';
import { assessmentAPI } from '../services/api';

const Assessment = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [responses, setResponses] = useState({}); // { q_id_str: option_idx }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await assessmentAPI.getQuestions();
      setQuestions(data);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve assessment questionnaire. Please verify the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optIdx) => {
    const qId = questions[currentIdx].id.toString();
    setResponses({
      ...responses,
      [qId]: optIdx
    });
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);

    try {
      await assessmentAPI.submitResponses(responses);
      navigate('/recommendations');
    } catch (err) {
      console.error(err);
      setError('Failed to submit responses. Ensure all questions are answered.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="main-content">
          <Loading message="Loading assessment questionnaire..." />
        </main>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="main-content">
          <GlassCard style={{ padding: '32px', textAlign: 'center', borderColor: 'var(--accent-rose)' }}>
            <BookOpen size={48} color="var(--accent-rose)" style={{ marginBottom: '16px' }} />
            <h2>Assessment Connection Issue</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{error}</p>
            <button className="btn-primary" onClick={fetchQuestions}>Retry load</button>
          </GlassCard>
        </main>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];
  const qIdStr = currentQuestion?.id.toString();
  const selectedOptIdx = responses[qIdStr];
  const progressPercent = Math.round(((currentIdx) / questions.length) * 100);
  const isFinished = Object.keys(responses).length === questions.length;

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-content" style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', padding: '40px' }}>
        
        <div style={{ maxWidth: '750px', margin: '0 auto', width: '100%' }}>
          
          {/* Header Progress indicator */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-indigo)' }}>
              QUESTION {currentIdx + 1} OF {questions.length}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>
              {progressPercent}% Complete
            </span>
          </div>

          {/* Progress bar container */}
          <div style={{ background: 'rgba(255,255,255,0.05)', height: '6px', borderRadius: '3px', overflow: 'hidden', position: 'relative', marginBottom: '40px' }}>
            <div style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${(currentIdx + 1) / questions.length * 100}%`,
              background: 'linear-gradient(90deg, var(--accent-indigo), var(--accent-violet))',
              transition: 'width 0.3s ease'
            }} />
          </div>

          {submitting ? (
            <GlassCard style={{ padding: '60px 40px', textAlign: 'center' }}>
              <div style={{ animation: 'pulse 1.5s infinite', marginBottom: '24px' }}>
                <Sparkles size={48} color="var(--accent-indigo)" />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>Computing Career Pathways...</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Our rule-based engine is checking your weights against directories</p>
              <style>{`
                @keyframes pulse {
                  0% { transform: scale(1); opacity: 1; }
                  50% { transform: scale(1.1); opacity: 0.7; }
                  100% { transform: scale(1); opacity: 1; }
                }
              `}</style>
            </GlassCard>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* Question Text */}
              <h2 style={{ fontSize: '24px', fontWeight: '800', lineHeight: '1.4' }}>
                {currentQuestion.question_text}
              </h2>

              {/* Options Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = selectedOptIdx === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      style={{
                        width: '100%',
                        padding: '20px 24px',
                        textAlign: 'left',
                        background: isSelected ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-glass)',
                        border: isSelected ? '2px solid var(--accent-indigo)' : '1px solid var(--border-glass)',
                        borderRadius: '12px',
                        color: 'var(--text-primary)',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: isSelected ? '0 4px 12px rgba(99, 102, 241, 0.1)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span>{opt.text}</span>
                      {isSelected && <CheckCircle2 size={20} color="var(--accent-indigo)" />}
                    </button>
                  );
                })}
              </div>

              {/* Error messages if submit failed */}
              {error && <p style={{ color: 'var(--accent-rose)', fontSize: '13px', textAlign: 'center' }}>{error}</p>}

              {/* Navigation Controls Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={currentIdx === 0}
                  onClick={handlePrev}
                  style={{ opacity: currentIdx === 0 ? 0.5 : 1 }}
                >
                  <ArrowLeft size={16} />
                  Back
                </button>

                {currentIdx < questions.length - 1 ? (
                  <button
                    type="button"
                    className="btn-primary"
                    disabled={selectedOptIdx === undefined}
                    onClick={handleNext}
                    style={{ opacity: selectedOptIdx === undefined ? 0.5 : 1 }}
                  >
                    Next Question
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ background: 'linear-gradient(135deg, var(--accent-emerald), var(--accent-indigo))' }}
                    disabled={!isFinished}
                    onClick={handleSubmit}
                  >
                    Submit Assessment
                    <Send size={16} />
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Assessment;
