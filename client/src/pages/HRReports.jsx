import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

function HRReports() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F7F4' }}>
      <Sidebar role="hr" userName={user.name} userRole="HR Manager" />
      <div style={{ flex: 1, padding: '36px 40px' }}>
        <h1 style={{ fontFamily: 'sans-serif', fontSize: '26px', fontWeight: '700', color: '#0D1117' }}>
          Reports <span style={{ color: '#00C896' }}>Coming Soon</span>
        </h1>
        <p style={{ color: '#6B7280', marginTop: '8px' }}>
          Wellness trend reports and analytics will be available here.
        </p>
      </div>
    </div>
  );
}
export default HRReports;