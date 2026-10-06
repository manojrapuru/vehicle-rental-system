import React, { useState, useEffect } from 'react';
import LabConcepts from '../components/LabConcepts';

/**
 * LabDemo Page Component
 * Academic lab suite providing viva question cards, server health checks, and concept breakdown
 */
export default function LabDemo() {
  const [healthData, setHealthData] = useState(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  const checkApiHealth = async () => {
    setCheckingHealth(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealthData(data);
    } catch (err) {
      setHealthData({ status: 'Error', message: err.message });
    } finally {
      setCheckingHealth(false);
    }
  };

  useEffect(() => {
    checkApiHealth();
  }, []);

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '2.2rem' }}>🎓 Full Stack Lab & Viva Showcase</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Complete evaluation portal covering JavaScript, React.js, Node.js + Express.js, and MySQL.
          </p>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={checkApiHealth}
          disabled={checkingHealth}
        >
          {checkingHealth ? 'Testing Connection...' : '🔄 Check API Health'}
        </button>
      </div>

      {/* Backend API & MySQL Status Banner */}
      {healthData && (
        <div
          style={{
            padding: '16px 20px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: healthData.status === 'OK' ? 'var(--success)' : 'var(--danger)',
                display: 'inline-block',
              }}
            ></span>
            <span style={{ fontWeight: 'bold' }}>
              Express API Status: {healthData.status === 'OK' ? 'Connected (Port 5000)' : 'Offline / Error'}
            </span>
          </div>

          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Database Mode:{' '}
            <strong style={{ color: 'var(--primary)' }}>
              {healthData.databaseMode || 'MySQL Active'}
            </strong>
          </div>
        </div>
      )}

      {/* Interactive Concept Demonstrator */}
      <LabConcepts />

      {/* Viva Questions Cheat Sheet Section */}
      <div style={{ marginTop: '40px' }}>
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '20px' }}>
          <span className="section-tag">Viva Preparation</span>
          <h2 className="section-title">💡 Top Full Stack Viva Questions & Answers</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="concept-card">
            <h4>Q1: What is the difference between Class and Functional Components in React?</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '8px' }}>
              <strong>Answer:</strong> Class components extend <code>React.Component</code> and manage state using <code>this.state</code> and <code>this.setState()</code>. Functional components are simpler JavaScript functions that use <strong>React Hooks</strong> (such as <code>useState</code> and <code>useEffect</code>) for managing state and lifecycle events.
            </p>
          </div>

          <div className="concept-card">
            <h4>Q2: What is a MySQL Subquery and why is it used?</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '8px' }}>
              <strong>Answer:</strong> A subquery is an inner query nested within another SQL statement (e.g., inside a <code>WHERE</code> clause). In our project, it dynamically computes the average rent <code>(SELECT AVG(rent) FROM vehicles)</code> and filters vehicles priced above that average.
            </p>
          </div>

          <div className="concept-card">
            <h4>Q3: Why do we use CORS middleware in Express?</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '8px' }}>
              <strong>Answer:</strong> Cross-Origin Resource Sharing (CORS) allows frontend clients running on one origin/port (e.g. React on <code>localhost:3000</code>) to securely communicate with the backend on a different origin (e.g. Express on <code>localhost:5000</code>).
            </p>
          </div>

          <div className="concept-card">
            <h4>Q4: What is a Controlled Component in React Forms?</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '8px' }}>
              <strong>Answer:</strong> In a controlled form component, input element values are driven by React state via the <code>value</code> attribute, and state is updated on every keystroke through the <code>onChange</code> event handler.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
