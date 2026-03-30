import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiBriefcase } from 'react-icons/fi';
import PipelineBar from '../components/PipelineBar';
import DetailPanel from '../components/DetailPanel';

const API_URL = 'http://localhost:5000/api/jobs';
const STATUSES = ['Pending', 'Interview', 'Offer', 'Declined'];

export default function Dashboard({ stats, refreshStats }) {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const initialForm = { company: '', position: '', status: 'Pending', location: '', notes: '', jobUrl: '', salary: '', contact: '' };
  const [formData, setFormData] = useState(initialForm);

  async function fetchJobs() {
    try {
      const res = await axios.get(API_URL);
      setJobs(res.data);
    } catch (err) { console.error(err); }
  }

  useEffect(() => { fetchJobs(); }, []);

  function refresh() { fetchJobs(); refreshStats(); }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData);
      setIsModalOpen(false);
      setFormData(initialForm);
      refresh();
    } catch (err) { console.error(err); }
  };

  const deleteJob = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      if (selectedJob?._id === id) setSelectedJob(null);
      refresh();
    } catch (err) { console.error(err); }
  };

  return (
    <div
      className="main-content"
    >
      {/* Header */}
      <div className="main-header">
        <div className="main-title">Pipeline</div>
        <button className="btn btn-primary btn-sm" onClick={() => setIsModalOpen(true)}>
          <FiPlus size={14} /> Add Application
        </button>
      </div>

      {/* Pipeline Summary */}
      <PipelineBar stats={stats} />

      {/* Body: Table + Detail Panel */}
      <div className="main-body">
        {/* Table */}
        <div className="table-container">
          {jobs.length === 0 ? (
            <div className="empty-state">
              <FiBriefcase size={40} />
              <p>No applications yet.<br />Click "Add Application" to start tracking your job search.</p>
            </div>
          ) : (
            <table className="app-table">
              <thead>
                <tr>
                  <th style={{ width: '22%' }}>Company</th>
                  <th style={{ width: '22%' }}>Position</th>
                  <th style={{ width: '12%' }}>Status</th>
                  <th style={{ width: '14%' }}>Location</th>
                  <th style={{ width: '12%' }}>Salary</th>
                  <th style={{ width: '10%' }}>Applied</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr
                    key={job._id}
                    className={`table-row ${selectedJob?._id === job._id ? 'selected' : ''}`}
                    onClick={() => setSelectedJob(job)}
                  >
                    <td className="company-cell">{job.company}</td>
                    <td className="position-cell">{job.position}</td>
                    <td>
                      <span className={`status-pill status-${job.status.toLowerCase()}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="location-cell">{job.location || '—'}</td>
                    <td className="salary-cell">{job.salary || '—'}</td>
                    <td className="date-cell">
                      {new Date(job.dateApplied).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail Slide-In */}
        {selectedJob && (
          <DetailPanel
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
            onUpdate={() => { refresh(); /* re-select updated job */ fetchJobs().then(() => { setSelectedJob(prev => jobs.find(j => j._id === prev?._id) || null); }); }}
            onDelete={deleteJob}
          />
        )}
      </div>

      {/* Add New Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onPointerDown={() => setIsModalOpen(false)}>
          <div
            className="modal-content"
            onPointerDown={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>New Application</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Company</label>
                  <input type="text" className="input-field" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required placeholder="Google, Meta, etc." />
                </div>
                <div className="form-group">
                  <label>Position</label>
                  <input type="text" className="input-field" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} required placeholder="Software Engineer" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select className="input-field" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input type="text" className="input-field" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Remote, NYC" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Salary</label>
                  <input type="text" className="input-field" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} placeholder="$120k – $150k" />
                </div>
                <div className="form-group">
                  <label>Job URL</label>
                  <input type="url" className="input-field" value={formData.jobUrl} onChange={e => setFormData({...formData, jobUrl: e.target.value})} placeholder="https://..." />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Application</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
