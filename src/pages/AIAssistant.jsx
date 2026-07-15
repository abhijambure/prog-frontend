import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Cpu } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import { chatAPI } from '../services/api';
import { Link } from 'react-router-dom';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am your AI Career Counselor. You can ask me questions about stream choices after 10th/12th, specific career prerequisites, average salaries, or standard exam syllabi.\n\nWhat are you interested in studying?",
      suggestedCareers: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const preselectedSuggestions = [
    "What should I do after 10th standard?",
    "Tell me about B.Tech in AI/ML Engineer.",
    "Which careers earn the most money in India?",
    "How do I become a Chartered Accountant?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (messageText) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    setInput('');
    // 1. Add user message
    const userMsg = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // Create simplified history in prompt schema: [{"sender": "user"|"ai", "text": "..."}]
      const chatHistory = messages.map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await chatAPI.sendMessage(textToSend, chatHistory);
      
      const aiReply = {
        sender: 'ai',
        text: res.reply,
        suggestedCareers: res.suggested_careers || []
      };
      
      setMessages(prev => [...prev, aiReply]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: "I apologize, but I am having trouble connecting to the recommendation service. Please verify the backend API is running.",
          suggestedCareers: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-content" style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '40px' }}>
        
        {/* Title Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: '24px', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={28} color="var(--accent-indigo)" />
              AI Career Assistant
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>Get instant guidance on streams, qualifications, and roadmap details</p>
          </div>
        </div>

        {/* Chat History Panel Box */}
        <GlassCard style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          maxHeight: 'calc(100vh - 220px)',
          padding: '24px',
          overflow: 'hidden'
        }}>
          
          {/* Scrollable messages box */}
          <div style={{
            flexGrow: 1,
            overflowY: 'auto',
            paddingRight: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            marginBottom: '20px'
          }}>
            {messages.map((msg, idx) => {
              const isAI = msg.sender === 'ai';
              return (
                <div 
                  key={idx} 
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isAI ? 'flex-start' : 'flex-end',
                    maxWidth: '85%',
                    alignSelf: isAI ? 'flex-start' : 'flex-end'
                  }}
                >
                  <div style={{
                    padding: '16px 20px',
                    borderRadius: '16px',
                    fontSize: '14.5px',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-line',
                    background: isAI ? 'rgba(255, 255, 255, 0.03)' : 'linear-gradient(135deg, var(--accent-indigo), var(--accent-violet))',
                    border: isAI ? '1px solid var(--border-glass)' : 'none',
                    color: '#ffffff',
                    boxShadow: !isAI ? '0 4px 12px rgba(99, 102, 241, 0.2)' : 'none'
                  }}>
                    {msg.text}
                  </div>
                  
                  {/* Dynamic linked careers if returned from model query */}
                  {isAI && msg.suggestedCareers && msg.suggestedCareers.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', width: '100%', fontWeight: '600' }}>LINKED PATHS:</span>
                      {msg.suggestedCareers.map((c) => (
                        <Link 
                          key={c.id} 
                          to={`/careers/${c.id}`} 
                          className="badge badge-indigo text-glow"
                          style={{ textDecoration: 'none', padding: '6px 12px', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                          View {c.name} Roadmap →
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-start', alignItems: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                <div style={{ animation: 'spin 1.5s linear infinite' }}>
                  <Sparkles size={16} color="var(--accent-indigo)" />
                </div>
                <span>AI Counselor is thinking...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick recommendations chips */}
          {messages.length === 1 && (
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', fontWeight: '600' }}>COMMON QUESTIONS:</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {preselectedSuggestions.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(s)}
                    className="btn-secondary"
                    style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '20px' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input field actions row */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            style={{ 
              display: 'flex', 
              gap: '12px',
              borderTop: '1px solid var(--border-glass)',
              paddingTop: '20px'
            }}
          >
            <input
              type="text"
              placeholder="Ask about streams, qualifications, exams, roadmaps..."
              className="input-field"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
            />
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ padding: '0 24px' }}
              disabled={loading || !input.trim()}
            >
              <Send size={16} />
              Send
            </button>
          </form>

        </GlassCard>
      </main>
    </div>
  );
};

export default AIAssistant;
