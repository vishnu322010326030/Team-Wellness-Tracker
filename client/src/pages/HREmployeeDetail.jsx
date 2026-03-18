import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api';
import Sidebar from '../components/Sidebar';
import './HREmployeeDetail.css';

function HREmployeeDetail() {
  const navigate     = useNavigate();
  const { id }       = useParams();
  const isNew        = id === 'new';

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Form state
  const [name,       setName]       = useState('');
  const [email,      setEmail]      = useState('');
  const [department, setDepartment] = useState('');
  const [role,       setRole]       = useState('');
  const [days,       setDays]       = useState(0);
  const [perf,       setPerf]       = useState(100);
  const [overtime,   setOvertime]   = useState(0);
  const [leave,      setLeave]      = useState(0);
  const [pressure,   setPressure]   = useState(1);

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState('');

  // Load existing employee if editing
  useEffect(() => {
    if (!isNew) {
      fetchEmployee();
    }
  }, [id]);

  async function fetchEmployee() {
    try {
      setLoading(true);
      const res = await API.get(`/employees/${id}`);
      const emp = res.data;

      setName(emp.name);
      setEmail(emp.email);
      setDepartment(emp.department);
      setRole(emp.role);
      setDays(emp.consecutiveDaysWorked);
      setPerf(emp.performanceScore);
      setOvertime(emp.overtimeHoursPerWeek);
      setLeave(emp.leaveDaysTaken);
      setPressure(emp.deadlinePressure);
    } catch (err) {
      setError('Failed to load employee');
    } finally {
      setLoading(false);
    }
  }

  // Live wellness score calculation
  function calcScore(d, p, ot, l, pr) {
    const risk = (d * 2) + (ot * 1.5) + (pr * 8) - (l * 5) - (p * 0.1);
    return Math.max(0, Math.min(100, Math.round(100 - risk)));
  }

  const score = calcScore(days, perf, overtime, leave, pressure);

  function getStatus() {
    if (score < 25) return { label: '🔴 Critical',  color: '#F05C6E' };
    if (score < 40) return { label: '🔴 High Risk', color: '#F05C6E' };
    if (score < 65) return { label: '🟡 Moderate',  color: '#F5A623' };
    return             { label: '🟢 Healthy',    color: '#00C896' };
  }

  function getRecommendation() {
    if (score < 25) return {
      type: 'critical',
      title: '🚨 Immediate Action Required',
      text: `Score is critically low at ${score}. Mandatory leave recommended immediately.`
    };
    if (score < 40) return {
      type: 'warning',
      title: '⚠️ System Recommendation',
      text: `Score is ${score}. Employee has worked ${days} consecutive days. Immediate leave recommended.`
    };
    if (score < 65) return {
      type: 'warning',
      title: '⚡ Monitor Closely',
      text: `Score is ${score}. Schedule a 1:1 check-in and review sprint assignments.`
    };
    return {
      type: 'good',
      title: '✅ Looking Good',
      text: `Score is ${score}. Employee is in a healthy range. Continue monitoring.`
    };
  }

  const status = getStatus();
  const rec    = getRecommendation();

  // Save to database
  async function handleSave() {
    setError('');

    // Validate required fields for new employee
    if (isNew && (!name || !email || !department || !role)) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);

      const data = {
        consecutiveDaysWorked: days,
        performanceScore:      perf,
        overtimeHoursPerWeek:  overtime,
        leaveDaysTaken:        leave,
        deadlinePressure:      pressure,
      };

      if (isNew) {
        // Create new employee
        await API.post('/employees', {
          name,
          email,
          department,
          role,
          ...data
        });
      } else {
        // Update existing employee
        await API.put(`/employees/${id}`, data);
      }

      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        if (isNew) navigate('/hr');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save employee');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="detail-screen">
        <Sidebar role="hr" userName={user.name} userRole="HR Manager" />
        <div className="main-content">
          <div className="loading-state">Loading employee data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-screen">
      <Sidebar role="hr" userName={user.name || 'HR Manager'} userRole="HR Manager" />

      <div className="main-content">

        {/* Back Button */}
        <button className="back-btn" onClick={() => navigate('/hr')}>
          ← Back to overview
        </button>

        {/* Header */}
        <div className="detail-header">
          <div className="detail-av" style={{ background: '#F05C6E' }}>
            {name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'NEW'}
          </div>
          <div>
            <div className="detail-name">
              {isNew ? 'Add New Employee' : name}
            </div>
            <div className="detail-meta">
              {isNew ? 'Fill in the details below' : `${department} · ${role}`}
            </div>
          </div>
          {!isNew && (
            <div className="detail-score-box">
              <div className="detail-score-label">Wellness Score</div>
              <div className="detail-score-val" style={{ color: status.color }}>
                {score}
              </div>
              <div className="detail-score-status" style={{ color: status.color }}>
                {status.label}
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && <div className="form-error">{error}</div>}

        <div className="detail-grid">

          {/* Form */}
          <div className="form-card">
            <h3 className="form-card-title">
              {isNew ? 'Employee Details' : 'Update Work Data'}
            </h3>
            <p className="form-card-sub">
              {isNew
                ? 'Enter the new employee information'
                : 'HR enters objective performance and workload data'}
            </p>

            {/* Only show for new employees */}
            {isNew && (
              <>
                <div className="form-row">
                  <div className="form-field">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Tom Nguyen"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label>Email *</label>
                    <input
                      type="email"
                      placeholder="tom@company.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label>Department *</label>
                    <input
                      type="text"
                      placeholder="e.g. Engineering"
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label>Job Role *</label>
                    <input
                      type="text"
                      placeholder="e.g. Backend Developer"
                      value={role}
                      onChange={e => setRole(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Work Data */}
            <div className="form-row">
              <div className="form-field">
                <label>Consecutive Days Worked</label>
                <input
                  type="number" min="0" max="30"
                  value={days}
                  onChange={e => setDays(Number(e.target.value))}
                />
              </div>
              <div className="form-field">
                <label>Performance Score (%)</label>
                <input
                  type="number" min="0" max="100"
                  value={perf}
                  onChange={e => setPerf(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Overtime Hours / Week</label>
                <input
                  type="number" min="0" max="40"
                  value={overtime}
                  onChange={e => setOvertime(Number(e.target.value))}
                />
              </div>
              <div className="form-field">
                <label>Leave Days Taken (Month)</label>
                <input
                  type="number" min="0" max="30"
                  value={leave}
                  onChange={e => setLeave(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="form-field">
              <label>Deadline Pressure</label>
              <select
                value={pressure}
                onChange={e => setPressure(Number(e.target.value))}
              >
                <option value={3}>Critical Sprint / Crunch</option>
                <option value={2}>Moderate Deadline</option>
                <option value={1}>Normal Workload</option>
              </select>
            </div>

            <button
              className={saved ? 'save-btn saved' : 'save-btn'}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' :
               saved  ? '✓ Saved Successfully!' :
               isNew  ? 'Create Employee' :
               'Save & Update Score'}
            </button>

          </div>

          {/* Right Column — only show for existing employee */}
          {!isNew && (
            <div className="right-col">
              <div className="gauge-card">
                <h3 className="gauge-title">Wellness Breakdown</h3>
                <p className="gauge-sub">Calculated from HR data in real time</p>

                <div className="gauge-items">
                  {[
                    {
                      label: 'Work-life balance',
                      pct:   Math.max(5, Math.min(95, score - 10)),
                      color: score < 40 ? '#F05C6E' : score < 65 ? '#F5A623' : '#00C896'
                    },
                    {
                      label: 'Overtime impact',
                      pct:   Math.max(10, 100 - (overtime * 3)),
                      color: '#4A9EFF'
                    },
                    {
                      label: 'Performance sustainability',
                      pct:   Math.min(95, perf - 5),
                      color: '#F5A623'
                    },
                    {
                      label: 'Recovery rate',
                      pct:   Math.max(5, leave * 15),
                      color: '#00C896'
                    },
                  ].map(item => (
                    <div className="gauge-item" key={item.label}>
                      <div className="gauge-item-top">
                        <span className="gauge-item-name">{item.label}</span>
                        <span className="gauge-item-val">{item.pct}%</span>
                      </div>
                      <div className="gauge-bar-bg">
                        <div
                          className="gauge-bar-fill"
                          style={{
                            width:      `${item.pct}%`,
                            background: item.color
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`rec-box rec-${rec.type}`}>
                  <div className="rec-title">{rec.title}</div>
                  <div className="rec-text">{rec.text}</div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default HREmployeeDetail;