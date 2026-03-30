import { NavLink } from 'react-router-dom';
import { FiBriefcase, FiBarChart2, FiSettings, FiLayers, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ stats }) {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <FiBriefcase size={18} />
        <span>JobTracker</span>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="qs-row">
          <span className="qs-label"><span className="qs-dot" style={{background:'var(--status-applied)'}} /> Applied</span>
          <span className="qs-value">{stats.pending}</span>
        </div>
        <div className="qs-row">
          <span className="qs-label"><span className="qs-dot" style={{background:'var(--status-interview)'}} /> Interview</span>
          <span className="qs-value">{stats.interview}</span>
        </div>
        <div className="qs-row">
          <span className="qs-label"><span className="qs-dot" style={{background:'var(--status-offer)'}} /> Offers</span>
          <span className="qs-value">{stats.offer}</span>
        </div>
        <div className="qs-row">
          <span className="qs-label"><span className="qs-dot" style={{background:'var(--status-declined)'}} /> Declined</span>
          <span className="qs-value">{stats.declined}</span>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">Navigation</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
          <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FiLayers size={16} />
            Pipeline
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FiBarChart2 size={16} />
            Analytics
          </NavLink>
        </nav>
      </div>

      <div style={{ flex: 1 }} />

      {/* User Info + Logout */}
      <div className="sidebar-section">
        {user && (
          <div style={{ padding: '0 0.5rem', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{user.email}</div>
          </div>
        )}
        <button className="nav-item" onClick={logout} style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}>
          <FiLogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
