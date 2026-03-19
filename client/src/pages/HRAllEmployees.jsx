import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Sidebar from '../components/Sidebar';

function HRAllEmployees() {
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem('user') || '{}');
  const [employees, setEmployees] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    API.get('/employees')
      .then(res => setEmployees(res.data))
      .finally(() => setLoading(false));
  }, []);

  const avatarColors = ['#F05C6E','#F5A623','#00C896','#4A9EFF','#9B59B6'];

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#F8F7F4' }}>
      <Sidebar role="hr" userName={user.name} userRole="HR Manager" />
      <div style={{ flex:1, padding:'36px 40px' }}>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
          <div>
            <h1 style={{ fontSize:'26px', fontWeight:'700', color:'#0D1117' }}>
              All <span style={{ color:'#00C896' }}>Employees</span>
            </h1>
            <p style={{ fontSize:'14px', color:'#6B7280', marginTop:'4px' }}>
              {employees.length} employees total
            </p>
          </div>
          <button
            onClick={() => navigate('/hr/employee/new')}
            style={{ padding:'11px 20px', background:'#0D1117', color:'white', border:'none', borderRadius:'12px', fontSize:'14px', fontWeight:'600', cursor:'pointer', fontFamily:'inherit' }}
          >
            + Add Employee
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:'48px', color:'#6B7280' }}>Loading...</div>
        ) : employees.length === 0 ? (
          <div style={{ background:'white', borderRadius:'16px', padding:'64px', textAlign:'center', border:'1px solid #E4E1DA' }}>
            <div style={{ fontSize:'40px', marginBottom:'12px' }}>👥</div>
            <div style={{ fontSize:'18px', fontWeight:'700', color:'#0D1117', marginBottom:'6px' }}>No employees yet</div>
            <div style={{ fontSize:'14px', color:'#6B7280' }}>Click "Add Employee" to get started</div>
          </div>
        ) : (
          <div style={{ background:'white', borderRadius:'16px', border:'1px solid #E4E1DA', overflow:'hidden' }}>

            {/* Table Header */}
            <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1.4fr 100px', gap:'16px', padding:'14px 20px', borderBottom:'1px solid #E4E1DA', background:'#F8F7F4' }}>
              {['Employee','Days Worked','Performance','Meetings/wk','Wellness Score','Action'].map(h => (
                <div key={h} style={{ fontSize:'11px', fontWeight:'600', color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.4px' }}>{h}</div>
              ))}
            </div>

            {/* Table Rows */}
            {employees.map((emp, index) => (
              <div
                key={emp._id}
                onClick={() => navigate(`/hr/employee/${emp._id}`)}
                style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1.4fr 100px', gap:'16px', padding:'16px 20px', borderBottom:'1px solid #E4E1DA', alignItems:'center', cursor:'pointer', transition:'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background='#FAFAF8'}
                onMouseLeave={e => e.currentTarget.style.background='white'}
              >
                <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                  <div style={{ width:'36px', height:'36px', borderRadius:'50%', background: avatarColors[index % avatarColors.length], display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:'700', color:'white', flexShrink:0 }}>
                    {emp.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontSize:'14px', fontWeight:'500', color:'#0D1117' }}>{emp.name}</div>
                    <div style={{ fontSize:'12px', color:'#6B7280' }}>{emp.department}</div>
                  </div>
                </div>
                <div style={{ fontSize:'14px', color:'#0D1117' }}>{emp.consecutiveDaysWorked} days</div>
                <div style={{ fontSize:'14px', color:'#0D1117' }}>{emp.performanceScore}%</div>
                <div style={{ fontSize:'14px', color:'#0D1117' }}>{emp.meetingsPerWeek}</div>
                <div>
                  <span style={{
                    display:'inline-flex', alignItems:'center', gap:'6px',
                    padding:'5px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'600',
                    background: emp.wellnessScore >= 65 ? 'rgba(0,200,150,0.1)' : emp.wellnessScore >= 40 ? 'rgba(245,166,35,0.1)' : 'rgba(240,92,110,0.1)',
                    color: emp.wellnessScore >= 65 ? '#009970' : emp.wellnessScore >= 40 ? '#C47A00' : '#C0192E'
                  }}>
                    {emp.wellnessScore} — {emp.riskLevel}
                  </span>
                </div>
                <div>
                  <button
                    onClick={e => { e.stopPropagation(); navigate(`/hr/employee/${emp._id}`); }}
                    style={{ padding:'7px 14px', border:'1px solid #E4E1DA', borderRadius:'8px', fontSize:'12px', fontWeight:'500', color:'#6B7280', background:'transparent', cursor:'pointer', fontFamily:'inherit' }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HRAllEmployees;