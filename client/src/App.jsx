import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import HRDashboard from './pages/HRDashboard';
import HREmployeeDetail from './pages/HREmployeeDetail';
import EmployeeDashboard from './pages/EmployeeDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/hr" element={<HRDashboard />} />
        <Route path="/hr/employee/:id" element={<HREmployeeDetail />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;