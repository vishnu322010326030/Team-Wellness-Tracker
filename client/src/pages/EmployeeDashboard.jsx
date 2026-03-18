import { useState, useEffect } from 'react';
import API from '../api';
import Sidebar from '../components/Sidebar';
import './EmployeeDashboard.css';

function EmployeeDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [employee,      setEmployee]      = useState(null);
  const [meetings,      setMeetings]      = useState(0);
  const [presentations, setPresentations] = useState(0);
  const [note,          setNote]          = useState('');
  const [loading,       setLoading]       = useState(true);
  const [submitting,    setSubmitting]    = useState(false);
  const [submitted,     setSubmitted]     = useState(false);
  const [error,         setError]         = useState('');

  useEffect(() => {
    fetchMyData();
  }, []);

  async function fetchMyData() {
    try {
      setLoading(true);
      // Get all employees and find the one matching logged in user email
      const res = await API.get('/employees');
      const me  = res.data.find(emp => emp.email === user.email);

      if (me) {
        setEmployee(me);
        setMeetings(me.meetingsPerWeek || 0);
        setPresentations(me.presentationsPerWeek || 0);
        setNote(me.notes || '');
      }
    } catch (err) {
      setError('Failed to load your wellness data');
    } finally {
      setLoading(false);
    }
  }

  function changeCount(type, delta) {
    if (type === 'meetings') {
      setMeetings(prev => Math.max(0, prev + delta));
    } else {
      setPresentations(prev => Math.max(0, prev + delta));
    }
  }

  async function handleSubmit() {
    if (!employee) return;

    try {
      setSubmitting(true);
      await API.put(`/employees/${employee._id}/log`, {
        meetingsPerWeek:      meetings,
        presentationsPerWeek: presentations,
        notes:                note
      });

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2500);

      // Refresh data
      fetchMyData();

    } catch (err) {
      setError('Failed to submit log');
    } finally {
      setSubmitting(false);
    }
  }

  function getScoreColor(score) {
    if (score < 40) return '#F05C6E';
    if (score < 65) return '#F5A623';
    return '#00C896';
  }

  function getScoreStatus(score) {
    if (score < 25) return '🔴 Critical';
    if (score < 40) return '🔴 High Risk';
    if (score < 65) return '🟡 Moderate';
    return '🟢 Healthy';
  }

  function isLeaveEligible(emp) {
    return emp.consecutiveDaysWorked >= 10 && emp.leaveDaysTaken === 0;
  }

  if (loading) {
    return (
      <div className="emp-screen">
        <Sidebar role="employee" userName={user.name} userRole="Employee" />
        <div className="main-content">
          <div className="loading-state">Loading your wellness data...</div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="emp-screen">
        <Sidebar role="employee" userName={user.name} userRole="Employee" />
        <div className="main-content">
          <div className="not-found-box">
            <div className="nf-icon">🔍</div>
            <div className="nf-title">No employee record found</div>
            <div className="nf-sub">
              Your HR team hasn't created your profile yet.
              Please contact your HR manager.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const score       = employee.wellnessScore;
  const scoreColor  = getScoreColor(score);
  const scoreStatus = getScoreStatus(score);
  const eligible    = isLeaveEligible(employee);

  return (
    <div className="emp-screen">
      <Sidebar
        role="employee"
        userName={user.name || 'Employee'}
        userRole={employee.role}
      />

      <div className="main-content">

        {/* Welcome Banner */}
        <div className="emp-welcome">
          <div className="welcome-glow"></div>
          <div className="emp-welcome-text">
            <h2>Good morning, {user.name?.split(' ')[0]} 👋</h2>
            <p>
              Your wellness data is updated by HR. Log your
              meetings and presentations to keep it accurate.
            </p>
          </div>
          <div className="wellness-score-display">
            <div className="wsd-score" style={{ color: scoreColor }}>
              {score}
            </div>
            <div className="wsd-info">
              <div className="wsd-label">Wellness Score</div>
              <div className="wsd-status" style={{ color: scoreColor }}>
                {scoreStatus}
              </div>
              <div className="wsd-sub">Updated by HR</div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && <div className="emp-error">{error}</div>}

        {/* Stat Cards */}
        <div className="emp-stats">
          <div className="emp-stat">
            <div className="es-label">Days Worked</div>
            <div
              className="es-value"
              style={{ color: employee.consecutiveDaysWorked >= 10 ? '#F05C6E' : '#0D1117' }}
            >
              {employee.consecutiveDaysWorked}
            </div>
            <div className={`es-sub ${employee.consecutiveDaysWorked >= 10 ? 'red' : 'green'}`}>
              {employee.consecutiveDaysWorked >= 10 ? 'High streak ⚠️' : 'This streak 🟢'}
            </div>
          </div>
          <div className="emp-stat">
            <div className="es-label">Performance</div>
            <div className="es-value">{employee.performanceScore}%</div>
            <div className="es-sub muted">Rated by HR</div>
          </div>
          <div className="emp-stat">
            <div className="es-label">Meetings This Week</div>
            <div className="es-value">{meetings}</div>
            <div className="es-sub muted">You logged these</div>
          </div>
          <div className="emp-stat">
            <div className="es-label">Leave Status</div>
            <div
              className="es-value small"
              style={{ color: eligible ? '#00C896' : '#6B7280' }}
            >
              {eligible ? 'Eligible' : 'Not Yet'}
            </div>
            <div className="es-sub muted">
              {eligible ? 'Contact HR to apply' : 'Keep working'}
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="emp-bottom">

          {/* Log Activity */}
          <div className="log-card">
            <h3 className="log-card-title">Log Your Activity</h3>
            <p className="log-card-sub">
              Your honest data helps HR get an accurate wellness picture
            </p>

            {/* Meetings Counter */}
            <div className="counter-section">
              <div className="counter-label-text">
                Meetings attended this week
              </div>
              <div className="counter-row">
                <button
                  className="counter-btn"
                  onClick={() => changeCount('meetings', -1)}
                >−</button>
                <span className="counter-val">{meetings}</span>
                <button
                  className="counter-btn"
                  onClick={() => changeCount('meetings', 1)}
                >+</button>
                <span className="counter-unit">meetings</span>
              </div>
            </div>

            {/* Presentations Counter */}
            <div className="counter-section">
              <div className="counter-label-text">
                Presentations given this week
              </div>
              <div className="counter-row">
                <button
                  className="counter-btn"
                  onClick={() => changeCount('presentations', -1)}
                >−</button>
                <span className="counter-val">{presentations}</span>
                <button
                  className="counter-btn"
                  onClick={() => changeCount('presentations', 1)}
                >+</button>
                <span className="counter-unit">presentations</span>
              </div>
            </div>

            {/* Notes */}
            <div className="notes-field">
              <label>Any notes for HR? (optional)</label>
              <input
                type="text"
                placeholder="e.g. Had a very heavy sprint this week..."
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>

            <button
              className={submitted ? 'submit-log-btn submitted' : 'submit-log-btn'}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting  ? 'Submitting...' :
               submitted   ? '✓ Log submitted to HR!' :
               'Submit This Week\'s Log →'}
            </button>
          </div>

          {/* Wellness Info */}
          <div className="log-card">
            <h3 className="log-card-title">Your Wellness Breakdown</h3>
            <p className="log-card-sub">Based on data HR has entered for you</p>

            <div className="breakdown-list">
              {[
                {
                  label: 'Work-life balance',
                  pct:   Math.max(5, Math.min(95, score - 10)),
                  color: scoreColor
                },
                {
                  label: 'Overtime impact',
                  pct:   Math.max(10, 100 - (employee.overtimeHoursPerWeek * 3)),
                  color: '#4A9EFF'
                },
                {
                  label: 'Performance level',
                  pct:   Math.min(95, employee.performanceScore - 5),
                  color: '#F5A623'
                },
                {
                  label: 'Recovery rate',
                  pct:   Math.max(5, employee.leaveDaysTaken * 15),
                  color: '#00C896'
                },
              ].map(item => (
                <div className="breakdown-item" key={item.label}>
                  <div className="breakdown-top">
                    <span className="breakdown-name">{item.label}</span>
                    <span className="breakdown-pct">{item.pct}%</span>
                  </div>
                  <div className="breakdown-bar-bg">
                    <div
                      className="breakdown-bar-fill"
                      style={{
                        width:      `${item.pct}%`,
                        background: item.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Leave eligible message */}
            {eligible && (
              <div className="eligible-box">
                <div className="eligible-title">🎉 You're eligible for leave!</div>
                <div className="eligible-text">
                  You've worked {employee.consecutiveDaysWorked} consecutive days.
                  Contact your HR manager to apply for leave.
                </div>
              </div>
            )}

            {/* High risk message */}
            {score < 40 && (
              <div className="risk-box">
                <div className="risk-title">⚠️ Your wellness needs attention</div>
                <div className="risk-text">
                  Your score is low. Please speak to your HR manager
                  about your current workload.
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;