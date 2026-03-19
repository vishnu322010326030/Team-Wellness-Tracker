import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login            from './pages/Login';
import HRDashboard      from './pages/HRDashboard';
import HREmployeeDetail from './pages/HREmployeeDetail';
import EmployeeDashboard from './pages/EmployeeDashboard';
import HRReports        from './pages/HRReports';
import HRBurnout        from './pages/HRBurnout';
import HRLeaveQueue     from './pages/HRLeaveQueue';
import EmpHistory       from './pages/EmpHistory';
import EmpLeave         from './pages/EmpLeave';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                    element={<Login />} />
        <Route path="/hr"                  element={<HRDashboard />} />
        <Route path="/hr/employee/:id"     element={<HREmployeeDetail />} />
        <Route path="/hr/reports"          element={<HRReports />} />
        <Route path="/hr/burnout"          element={<HRBurnout />} />
        <Route path="/hr/leave"            element={<HRLeaveQueue />} />
        <Route path="/employee"            element={<EmployeeDashboard />} />
        <Route path="/employee/history"    element={<EmpHistory />} />
        <Route path="/employee/leave"      element={<EmpLeave />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;