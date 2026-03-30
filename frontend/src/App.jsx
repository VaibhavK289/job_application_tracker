import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Signup from './pages/Signup';

const API_URL = 'http://localhost:5000/api/jobs';

function ProtectedLayout() {
  const [stats, setStats] = useState({ total: 0, pending: 0, interview: 0, offer: 0, declined: 0 });

  async function fetchStats() {
    try {
      const res = await axios.get(`${API_URL}/stats`);
      setStats(res.data);
    } catch (err) { console.error(err); }
  }

  useEffect(() => { fetchStats(); }, []);

  return (
    <div className="app-layout">
      <Sidebar stats={stats} />
      <Routes>
        <Route path="/" element={<Dashboard stats={stats} refreshStats={fetchStats} />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </div>
  );
}

function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/signup" element={<Navigate to="/" replace />} />
      <Route path="/*" element={<ProtectedLayout />} />
    </Routes>
  );
}

export default App;
