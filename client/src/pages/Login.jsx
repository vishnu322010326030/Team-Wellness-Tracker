import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [role, setRole]       = useState('hr');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Call the real API
      const res = await API.post('/auth/login', { email, password });

      // Save token and user info
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user',  JSON.stringify(res.data.user));

      // Navigate based on role
      if (res.data.user.role === 'hr') {
        navigate('/hr');
      } else {
        navigate('/employee');
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-screen">
      <div className="lbc1"></div>
      <div className="lbc2"></div>

      <div className="login-container">

        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/>
              <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>
            </svg>
          </div>
          <div>
            <div className="login-logo-name">ClearMind</div>
            <div className="login-logo-tag">Wellness Intelligence</div>
          </div>
        </div>

        {/* Card */}
        <div className="login-card">
          <h2>Sign in to your workspace</h2>
          <p>Objective wellness tracking, powered by real work data.</p>

          {/* Role Toggle */}
          <div className="role-tabs">
            <button
              className={role === 'hr' ? 'rtab active' : 'rtab'}
              onClick={() => setRole('hr')}
            >
              HR Manager
            </button>
            <button
              className={role === 'employee' ? 'rtab active' : 'rtab'}
              onClick={() => setRole('employee')}
            >
              Employee
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="error-msg">{error}</div>
          )}

          {/* Fields */}
          <div className="field">
            <label>Work Email</label>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <button
            className="login-submit"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Signing in...' : `Sign in as ${role === 'hr' ? 'HR Manager' : 'Employee'}`}
          </button>

          <div className="login-footer">
            No account? <a href="#">Request access from your HR team</a>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;