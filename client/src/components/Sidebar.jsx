import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ role, userName, userRole }) {
  const navigate  = useNavigate();
  const location  = useLocation();

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  }

  function isActive(path) {
    return location.pathname === path;
  }

  return (
    <div className="sidebar">

      {/* Logo */}
      <div className="sb-logo">
        <div className="sb-logo-mark">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" width="18" height="18">
            <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/>
            <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>
          </svg>
        </div>
        <span className="sb-logo-name">ClearMind</span>
      </div>

      {/* HR Nav */}
      {role === 'hr' && (
        <>
          <div className="sb-section-label">Main</div>
          <button
            className={isActive('/hr') ? 'sb-item active' : 'sb-item'}
            onClick={() => navigate('/hr')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            Overview
          </button>

          <button
            className={isActive('/hr/employees') ? 'sb-item active' : 'sb-item'}
            onClick={() => navigate('/hr/employees')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
            All Employees
          </button>

          <button
            className={isActive('/hr/reports') ? 'sb-item active' : 'sb-item'}
            onClick={() => navigate('/hr/reports')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18">
              <path d="M18 20V10M12 20V4M6 20v-6"/>
            </svg>
            Reports
          </button>

          <div className="sb-section-label">Alerts</div>

          <button
            className={isActive('/hr/burnout') ? 'sb-item active' : 'sb-item'}
            onClick={() => navigate('/hr/burnout')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            Burnout Risks
            <span className="sb-badge">3</span>
          </button>

          <button
            className={isActive('/hr/leave') ? 'sb-item active' : 'sb-item'}
            onClick={() => navigate('/hr/leave')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
            Leave Queue
          </button>
        </>
      )}

      {/* Employee Nav */}
      {role === 'employee' && (
        <>
          <div className="sb-section-label">My Wellness</div>
          <button
            className={isActive('/employee') ? 'sb-item active' : 'sb-item'}
            onClick={() => navigate('/employee')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            My Dashboard
          </button>

          <button
            className={isActive('/employee/history') ? 'sb-item active' : 'sb-item'}
            onClick={() => navigate('/employee/history')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18">
              <path d="M18 20V10M12 20V4M6 20v-6"/>
            </svg>
            My History
          </button>

          <button
            className={isActive('/employee/leave') ? 'sb-item active' : 'sb-item'}
            onClick={() => navigate('/employee/leave')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
            Leave Status
          </button>
        </>
      )}

      {/* Bottom User */}
      <div className="sb-bottom">
        <div className="sb-user">
          <div
            className="sb-avatar"
            style={{ background: role === 'hr' ? '#00C896' : '#4A9EFF' }}
          >
            {userName?.slice(0, 2).toUpperCase()}
          </div>
          <div className="sb-user-info">
            <div className="sb-user-name">{userName}</div>
            <div className="sb-user-role">{userRole}</div>
          </div>
        </div>
        <button className="sb-logout" onClick={handleLogout}>
          ← Log out
        </button>
      </div>

    </div>
  );
}

export default Sidebar;