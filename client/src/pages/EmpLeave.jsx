import { useState, useEffect } from 'react';
import API from '../api';
import Sidebar from '../components/Sidebar';

function EmpLeave() {
  const user     = JSON.parse(localStorage.getItem('user') || '{}');
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    API.get('/employees').then(res => {
      const me = res.data.find(e => e.email === user.email);
      if (me) setEmployee(me);
    });
  }, []);

  const eligible = employee && employee.consecutiveDaysWorked >= 10 && employee.leaveDaysTaken === 0;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F7F4' }}>
      <Sidebar role="employee" userName={user.name} userRole="Employee" />
      <div style={{ flex: 1, padding: '36px 40px' }}>
        <h1 style={{ fontFamily: 'sans-serif', fontSize: '26px', fontWeight: '700', color: '#0D1117', marginBottom: '24px' }}>
          Leave <span style={{ color: '#00C896' }}>Status</span>
        </h1>

        {employee ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Status Card */}
            <div style={{ background: eligible ? 'linear-gradient(135deg,#F0FFF9,#E6FFF4)' : 'white', border: `1px solid ${eligible ? 'rgba(0,200,150,0.2)' : '#E4E1DA'}`, borderRadius: '20px', padding: '28px 32px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ fontSize: '48px' }}>{eligible ? '🎉' : '⏳'}</div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: eligible ? '#006644' : '#0D1117' }}>
                  {eligible ? 'You are eligible for leave!' : 'Not eligible yet'}
                </div>
                <div style={{ fontSize: '14px', color: eligible ? '#008855' : '#6B7280', marginTop: '4px' }}>
                  {eligible
                    ? 'Contact your HR manager to apply for leave.'
                    : `You need to work ${Math.max(0, 10 - employee.consecutiveDaysWorked)} more consecutive days to be eligible.`}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
              {[
                { label: 'Days Worked',    value: employee.consecutiveDaysWorked, note: 'Need 10+ for eligibility' },
                { label: 'Leave Taken',    value: employee.leaveDaysTaken,        note: 'This month' },
                { label: 'Wellness Score', value: employee.wellnessScore,         note: 'Current score' },
              ].map(item => (
                <div key={item.label} style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', border: '1px solid #E4E1DA' }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '8px' }}>{item.label}</div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#0D1117' }}>{item.value}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>{item.note}</div>
                </div>
              ))}
            </div>

          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '16px', padding: '48px', textAlign: 'center', border: '1px solid #E4E1DA' }}>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>No data found. Contact your HR manager.</div>
          </div>
        )}
      </div>
    </div>
  );
}
export default EmpLeave;