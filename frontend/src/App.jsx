import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';

const API_URL = 'http://localhost:5000/api/jobs';

function App() {
  const location = useLocation();
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
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Dashboard stats={stats} refreshStats={fetchStats} />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
