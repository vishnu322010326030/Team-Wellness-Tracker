import { useState, useEffect } from 'react';
import API from '../api';
import Sidebar from '../components/Sidebar';

function EmpHistory() {
  const user     = JSON.parse(localStorage.getItem('user') || '{}');
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    API.get('/employees').then(res => {
      const me = res.data.find(e => e.email === user.email);
      if (me) setEmployee(me);
    });
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F7F4' }}>
      <Sidebar role="employee" userName={user.name} userRole="Employee" />
      <div style={{ flex: 1, padding: '36px 40px' }}>
        <h1 style={{ fontFamily: 'sans-serif', fontSize: '26px', fontWeight: '700', color: '#0D1117', marginBottom: '24px' }}>
          My <span style={{ color: '#00C896' }}>History</span>
        </h1>
        {employee ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '16px' }}>
            {[
              { label: 'Consecutive Days Worked', value: employee.consecutiveDaysWorked, color: '#F05C6E' },
              { label: 'Performance Score',        value: `${employee.performanceScore}%`, color: '#F5A623' },
              { label: 'Overtime Hours/Week',       value: `${employee.overtimeHoursPerWeek}h`, color: '#4A9EFF' },
              { label: 'Leave Days Taken',          value: employee.leaveDaysTaken, color: '#00C896' },
              { label: 'Meetings This Week',        value: employee.meetingsPerWeek, color: '#9B59B6' },
              { label: 'Presentations Given',       value: employee.presentationsPerWeek, color: '#F5A623' },
              { label: 'Wellness Score',            value: employee.wellnessScore, color: '#00C896' },
              { label: 'Risk Level',                value: employee.riskLevel?.toUpperCase(), color: '#F05C6E' },
            ].map(item => (
              <div key={item.label} style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', border: '1px solid #E4E1DA' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '8px' }}>{item.label}</div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: item.color }}>{item.value}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '16px', padding: '48px', textAlign: 'center', border: '1px solid #E4E1DA' }}>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>No history found. Contact your HR manager.</div>
          </div>
        )}
      </div>
    </div>
  );
}
export default EmpHistory;