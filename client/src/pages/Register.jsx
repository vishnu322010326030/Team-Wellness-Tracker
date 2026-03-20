import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import './Login.css';

function Register() {
  const navigate = useNavigate();

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [role,     setRole]     = useState('employee');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);

  async function handleRegister() {
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await API.post('/auth/register', {
        name,
        email,
        password,
        role
      });

      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
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
          <h2>Create your account</h2>
          <p>Join your team's wellness tracker.</p>

          {/* Role Toggle */}
          <div className="role-tabs">
            <button
              className={role === 'employee' ? 'rtab active' : 'rtab'}
              onClick={() => setRole('employee')}
            >
              Employee
            </button>
            <button
              className={role === 'hr' ? 'rtab active' : 'rtab'}
              onClick={() => setRole('hr')}
            >
              HR Manager
            </button>
          </div>

          {/* Success Message */}
          {success && (
            <div className="success-msg">
              ✅ Account created! Redirecting to login...
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="error-msg">{error}</div>
          )}

          {/* Fields */}
          <div className="field">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="e.g. Alex Kim"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleRegister()}
            />
          </div>

          <div className="field">
            <label>Work Email</label>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleRegister()}
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleRegister()}
            />
          </div>

          <button
            className="login-submit"
            onClick={handleRegister}
            disabled={loading || success}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <div className="login-footer">
            Already have an account?{' '}
            <a href="#" onClick={() => navigate('/')}>Sign in</a>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;