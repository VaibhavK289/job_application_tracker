import { useState, useEffect } from 'react';
import axios from 'axios';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

const API_URL = 'http://localhost:5000/api/jobs';

const COLORS = {
  Pending: '#e5a92b',
  Interview: '#06b6d4',
  Offer: '#22c55e',
  Declined: '#71717a',
};

export default function Analytics() {
  const [stats, setStats] = useState({ total: 0, pending: 0, interview: 0, offer: 0, declined: 0 });

  useEffect(() => {
    axios.get(`${API_URL}/stats`).then(res => setStats(res.data)).catch(console.error);
  }, []);

  const barData = [
    { name: 'Applied', count: stats.pending, fill: COLORS.Pending },
    { name: 'Interview', count: stats.interview, fill: COLORS.Interview },
    { name: 'Offer', count: stats.offer, fill: COLORS.Offer },
    { name: 'Declined', count: stats.declined, fill: COLORS.Declined },
  ];

  const pieData = barData.filter(d => d.count > 0);
  const conversionRate = stats.total > 0 ? ((stats.interview + stats.offer) / stats.total * 100).toFixed(1) : 0;

  return (
    <div
      className="main-content"
    >
      <div className="main-header">
        <div className="main-title">Analytics</div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Applications</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: COLORS.Interview }}>{stats.interview}</div>
          <div className="stat-label">Interviews</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: COLORS.Offer }}>{stats.offer}</div>
          <div className="stat-label">Offers</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: COLORS.Interview }}>{conversionRate}%</div>
          <div className="stat-label">Response Rate</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-card-title">Application Funnel</div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="name" stroke="#56565c" tick={{ fill: '#8b8b92', fontSize: 12 }} />
                <YAxis stroke="#56565c" tick={{ fill: '#8b8b92', fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{ background: '#1c1c1f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#ececef', fontSize: '13px' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card-title">Status Distribution</div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1c1c1f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#ececef', fontSize: '13px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
