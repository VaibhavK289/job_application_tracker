import { NavLink } from 'react-router-dom';
import { FiBriefcase, FiBarChart2, FiSettings, FiLayers } from 'react-icons/fi';

export default function Sidebar({ stats }) {
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

      <div className="sidebar-section">
        <a href="#" className="nav-item" onClick={e => e.preventDefault()}>
          <FiSettings size={16} />
          Settings
        </a>
      </div>
    </aside>
  );
}
