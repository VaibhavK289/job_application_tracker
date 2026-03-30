import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiBriefcase, FiPlus, FiTrash2, FiClock, FiMapPin, FiEdit2, FiLink, FiDollarSign, FiUser } from 'react-icons/fi';
import './index.css';

const API_URL = 'http://localhost:5000/api/jobs';

function App() {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, interview: 0, offer: 0, declined: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const initialForm = { company: '', position: '', status: 'Pending', location: '', notes: '', jobUrl: '', salary: '', contact: '' };
  const [formData, setFormData] = useState(initialForm);

  async function fetchJobs() {
    try {
      const res = await axios.get(API_URL);
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchStats() {
    try {
      const res = await axios.get(`${API_URL}/stats`);
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialForm);
  }

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      closeModal();
      fetchJobs();
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (job) => {
    setEditingId(job._id);
    setFormData({
      company: job.company || '',
      position: job.position || '',
      status: job.status || 'Pending',
      location: job.location || '',
      notes: job.notes || '',
      jobUrl: job.jobUrl || '',
      salary: job.salary || '',
      contact: job.contact || ''
    });
    setIsModalOpen(true);
  };

  const deleteJob = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchJobs();
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <nav className="brand">
        <FiBriefcase size={28} />
        JobTracker
      </nav>

      {/* Dashboard Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Applications</div>
          <div className="stat-value text-primary">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <div className="stat-value" style={{color: 'var(--status-pending)'}}>{stats.pending}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Interviews</div>
          <div className="stat-value" style={{color: 'var(--status-interview)'}}>{stats.interview}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Offers</div>
          <div className="stat-value" style={{color: 'var(--status-offer)'}}>{stats.offer}</div>
        </div>
         <div className="stat-card">
          <div className="stat-label">Declined</div>
          <div className="stat-value" style={{color: 'var(--status-declined)'}}>{stats.declined}</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>My Applications</h2>
        <button className="btn btn-primary" onClick={() => { setEditingId(null); setFormData(initialForm); setIsModalOpen(true); }}>
          <FiPlus /> New Application
        </button>
      </div>

      {/* Jobs Listing */}
      <div className="jobs-list">
        {jobs.length === 0 ? <p style={{color: 'var(--text-muted)'}}>No applications found. Add one to get started!</p> : null}
        {jobs.map(job => (
          <div key={job._id} className="job-card">
            <div className="job-header">
              <div>
                <div className="job-company">{job.company}</div>
                <div className="job-position">{job.position}</div>
              </div>
              <span className={`badge status-${job.status.toLowerCase()}`}>{job.status}</span>
            </div>
            <div className="job-footer">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <span className="data-row">
                    <FiMapPin /> {job.location || 'Remote'}
                  </span>
                  <span className="data-row">
                    <FiClock /> {new Date(job.dateApplied).toLocaleDateString()}
                  </span>
                </div>
                
                { (job.salary || job.contact || job.jobUrl) && (
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {job.salary && (
                      <span className="data-row"><FiDollarSign /> {job.salary}</span>
                    )}
                    {job.contact && (
                      <span className="data-row"><FiUser /> {job.contact}</span>
                    )}
                    {job.jobUrl && (
                      <span className="data-row">
                        <FiLink /> 
                        <a href={job.jobUrl} className="link-row" target="_blank" rel="noopener noreferrer">Link</a>
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="action-btns">
                <button className="icon-btn edit" onClick={() => openEditModal(job)} title="Edit">
                  <FiEdit2 size={16} />
                </button>
                <button className="icon-btn delete" onClick={() => deleteJob(job._id)} title="Delete">
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Job Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{editingId ? 'Edit Application' : 'New Application'}</div>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Company</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.company} 
                  onChange={e => setFormData({...formData, company: e.target.value})} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Position</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.position} 
                  onChange={e => setFormData({...formData, position: e.target.value})} 
                  required 
                />
              </div>

              <div style={{display: 'flex', gap: '1rem'}}>
                <div className="form-group" style={{flex: 1}}>
                  <label>Status</label>
                  <select 
                    className="input-field" 
                    value={formData.status} 
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>

                <div className="form-group" style={{flex: 1}}>
                  <label>Location</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. Remote, NYC"
                    value={formData.location} 
                    onChange={e => setFormData({...formData, location: e.target.value})} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Job Posting URL</label>
                <input 
                  type="url" 
                  className="input-field" 
                  placeholder="https://..."
                  value={formData.jobUrl} 
                  onChange={e => setFormData({...formData, jobUrl: e.target.value})} 
                />
              </div>

              <div style={{display: 'flex', gap: '1rem'}}>
                <div className="form-group" style={{flex: 1}}>
                  <label>Salary/Compensation</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. $120k - $150k"
                    value={formData.salary} 
                    onChange={e => setFormData({...formData, salary: e.target.value})} 
                  />
                </div>
                <div className="form-group" style={{flex: 1}}>
                  <label>Recruiter/Contact</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. Jane Doe"
                    value={formData.contact} 
                    onChange={e => setFormData({...formData, contact: e.target.value})} 
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Update Application' : 'Save Application'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
