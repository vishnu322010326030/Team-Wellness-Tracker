import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API from '../api';
import Sidebar from '../components/Sidebar';

function HRBurnout() {
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem('user') || '{}');
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    API.get('/employees').then(res => {
      setEmployees(res.data.filter(e =>
        e.riskLevel === 'high' || e.riskLevel === 'critical'
      ));
    });
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F7F4' }}>
      <Sidebar role="hr" userName={user.name} userRole="HR Manager" />
      <div style={{ flex: 1, padding: '36px 40px' }}>
        <h1 style={{ fontFamily: 'sans-serif', fontSize: '26px', fontWeight: '700', color: '#0D1117', marginBottom: '24px' }}>
          Burnout <span style={{ color: '#F05C6E' }}>Risks</span>
        </h1>
        {employees.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '16px', padding: '48px', textAlign: 'center', border: '1px solid #E4E1DA' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎉</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#0D1117' }}>No burnout risks!</div>
            <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '6px' }}>All employees are in a healthy range.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {employees.map(emp => (
              <div
                key={emp._id}
                onClick={() => navigate(`/hr/employee/${emp._id}`)}
                style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', border: '1px solid #E4E1DA', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}
              >
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#F05C6E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '14px' }}>
                  {emp.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: '#0D1117' }}>{emp.name}</div>
                  <div style={{ fontSize: '13px', color: '#6B7280' }}>{emp.department} · {emp.consecutiveDaysWorked} consecutive days</div>
                </div>
                <div style={{ background: 'rgba(240,92,110,0.1)', color: '#C0192E', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
                  Score: {emp.wellnessScore}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default HRBurnout;