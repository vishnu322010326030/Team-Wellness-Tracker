import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import './HRDashboard.css';

function getRiskBadge(risk) {
  const map = {
    critical: { label: 'Critical',  className: 'badge-red'   },
    high:     { label: 'High Risk', className: 'badge-red'   },
    moderate: { label: 'Moderate',  className: 'badge-amber' },
    healthy:  { label: 'Healthy',   className: 'badge-green' },
  };
  return map[risk] || map.healthy;
}

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

const avatarColors = ['#F05C6E','#F5A623','#00C896','#4A9EFF','#9B59B6'];

function HRDashboard() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [filter,    setFilter]    = useState('all');

  // Get logged in user
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Fetch employees from API
  useEffect(() => {
    fetchEmployees();
  }, []);

  async function fetchEmployees() {
    try {
      setLoading(true);
      const res = await API.get('/employees');
      setEmployees(res.data);
    } catch (err) {
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  }

  // Filter employees
  const filtered = employees.filter(emp => {
    if (filter === 'all')      return true;
    if (filter === 'risk')     return emp.riskLevel === 'high' || emp.riskLevel === 'critical';
    if (filter === 'eligible') return emp.leaveDaysTaken === 0 && emp.consecutiveDaysWorked >= 10;
    if (filter === 'healthy')  return emp.riskLevel === 'healthy';
    return true;
  });

  // Calculate stats
  const avgScore   = employees.length
    ? Math.round(employees.reduce((sum, e) => sum + e.wellnessScore, 0) / employees.length)
    : 0;
  const atRisk     = employees.filter(e => e.riskLevel === 'high' || e.riskLevel === 'critical').length;
  const eligible   = employees.filter(e => e.consecutiveDaysWorked >= 10 && e.leaveDaysTaken === 0).length;
  const healthy    = employees.filter(e => e.riskLevel === 'healthy').length;

  return (
    <div className="hr-screen">
      <Sidebar role="hr" userName={user.name || 'HR Manager'} userRole="HR Manager" />

      <div className="main-content">

        {/* Page Top */}
        <div className="page-top">
          <div>
            <h1 className="page-title">
              Team Wellness <span>Overview</span>
            </h1>
            <p className="page-subtitle">
              {new Date().toDateString()} · {employees.length} employees
            </p>
          </div>
          <button className="add-emp-btn" onClick={() => navigate('/hr/employee/new')}>
            + Add Employee
          </button>
        </div>

        {/* Alert Banner — only show if at risk employees exist */}
        {atRisk > 0 && (
          <div className="alert-banner">
            <div className="alert-icon-box">⚠️</div>
            <div className="alert-content">
              <strong>{atRisk} employee{atRisk > 1 ? 's' : ''} flagged for high burnout risk</strong>
              <span>Consecutive overwork detected. Recommend scheduling 1:1 check-ins.</span>
            </div>
            <button className="alert-action" onClick={() => setFilter('risk')}>
              View All →
            </button>
          </div>
        )}

        {/* Stat Cards */}
        <div className="stats-grid">
          <StatCard label="Avg Wellness Score" value={avgScore} sub="Team average"        subType="pos"  color="#00C896" />
          <StatCard label="At Burnout Risk"     value={atRisk}  sub="Need attention"       subType="neg"  color="#F05C6E" />
          <StatCard label="Leave Eligible"      value={eligible} sub="Pending approval"    subType="warn" color="#F5A623" />
          <StatCard label="Healthy & Active"    value={healthy} sub={`${employees.length ? Math.round(healthy/employees.length*100) : 0}% of team`} subType="pos" color="#00C896" />
        </div>

        {/* Section Header */}
        <div className="section-header">
          <div className="section-title">Employee Wellness Status</div>
          <div className="filter-tabs">
            <button className={filter === 'all'      ? 'ftab active' : 'ftab'} onClick={() => setFilter('all')}>All</button>
            <button className={filter === 'risk'     ? 'ftab active' : 'ftab'} onClick={() => setFilter('risk')}>High Risk</button>
            <button className={filter === 'eligible' ? 'ftab active' : 'ftab'} onClick={() => setFilter('eligible')}>Leave Eligible</button>
            <button className={filter === 'healthy'  ? 'ftab active' : 'ftab'} onClick={() => setFilter('healthy')}>Healthy</button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-box">
            Loading employees...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-box">{error}</div>
        )}

        {/* Empty State */}
        {!loading && !error && employees.length === 0 && (
          <div className="empty-box">
            <div className="empty-icon">👥</div>
            <div className="empty-title">No employees yet</div>
            <div className="empty-sub">Click "Add Employee" to get started</div>
          </div>
        )}

        {/* Employee Table */}
        {!loading && filtered.length > 0 && (
          <div className="emp-table">
            <div className="emp-table-header">
              <div className="eth">Employee</div>
              <div className="eth">Days Worked</div>
              <div className="eth">Performance</div>
              <div className="eth">Meetings/wk</div>
              <div className="eth">Presentations</div>
              <div className="eth">Wellness Score</div>
              <div className="eth">Action</div>
            </div>

            {filtered.map((emp, index) => {
              const badge = getRiskBadge(emp.riskLevel);
              return (
                <div
                  className="emp-row"
                  key={emp._id}
                  onClick={() => navigate(`/hr/employee/${emp._id}`)}
                >
                  <div className="emp-info">
                    <div
                      className="emp-av"
                      style={{ background: avatarColors[index % avatarColors.length] }}
                    >
                      {getInitials(emp.name)}
                    </div>
                    <div>
                      <div className="emp-name">{emp.name}</div>
                      <div className="emp-dept">{emp.department}</div>
                    </div>
                  </div>
                  <div className="emp-cell">{emp.consecutiveDaysWorked} days</div>
                  <div className="emp-cell">{emp.performanceScore}%</div>
                  <div className="emp-cell">{emp.meetingsPerWeek}</div>
                  <div className="emp-cell">{emp.presentationsPerWeek}</div>
                  <div className="emp-cell">
                    <span className={`score-badge ${badge.className}`}>
                      <span className="score-dot"></span>
                      {emp.wellnessScore} — {badge.label}
                    </span>
                  </div>
                  <div>
                    <button
                      className="action-btn"
                      onClick={e => {
                        e.stopPropagation();
                        navigate(`/hr/employee/${emp._id}`);
                      }}
                    >
                      Edit Data
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

export default HRDashboard;