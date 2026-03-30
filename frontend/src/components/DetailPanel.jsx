import { FiExternalLink, FiTrash2, FiZap } from 'react-icons/fi';
import { useState, useMemo } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/jobs';
const AI_URL = 'http://localhost:5000/api/ai';

export default function DetailPanel({ job, onClose, onUpdate, onDelete }) {
  const initialForm = useMemo(() => ({
    status: job?.status || 'Pending',
    location: job?.location || '',
    salary: job?.salary || '',
    contact: job?.contact || '',
    jobUrl: job?.jobUrl || '',
    notes: job?.notes || '',
  }), [job?._id]);

  const [form, setForm] = useState(initialForm);
  const [coverLetter, setCoverLetter] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  if (!job) return null;

  const handleFieldChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFieldBlur = async (field) => {
    if (form[field] !== (job[field] || '')) {
      try {
        await axios.put(`${API_URL}/${job._id}`, { ...job, [field]: form[field] });
        onUpdate();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setForm(prev => ({ ...prev, status: newStatus }));
    try {
      await axios.put(`${API_URL}/${job._id}`, { ...job, status: newStatus });
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const generateCoverLetter = async () => {
    setAiLoading(true);
    setCoverLetter('');
    try {
      const res = await axios.post(`${AI_URL}/cover-letter`, {
        company: job.company,
        position: job.position,
        notes: job.notes,
      });
      setCoverLetter(res.data.coverLetter);
    } catch (err) {
      setCoverLetter(err.response?.data?.message || 'Failed to generate. Check your GEMINI_API_KEY in backend/.env');
    } finally {
      setAiLoading(false);
    }
  };

  return (
      <div className="detail-panel">
        <div className="panel-header">
          <div>
            <div className="panel-company">{job.company}</div>
            <div className="panel-position">{job.position}</div>
          </div>
          <button className="panel-close" onClick={onClose}>✕</button>
        </div>

        <div className="panel-body">
          <div className="panel-field">
            <div className="panel-field-label">Status</div>
            <select className="inline-edit" value={form.status} onChange={handleStatusChange}>
              <option value="Pending">Pending</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Declined">Declined</option>
            </select>
          </div>

          <div className="panel-row">
            <div className="panel-field">
              <div className="panel-field-label">Location</div>
              <input className="inline-edit" value={form.location} onChange={e => handleFieldChange('location', e.target.value)} onBlur={() => handleFieldBlur('location')} placeholder="—" />
            </div>
            <div className="panel-field">
              <div className="panel-field-label">Date Applied</div>
              <div className="panel-field-value" style={{ padding: '0.35rem 0.5rem' }}>
                {new Date(job.dateApplied).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>

          <div className="panel-row">
            <div className="panel-field">
              <div className="panel-field-label">Salary</div>
              <input className="inline-edit" value={form.salary} onChange={e => handleFieldChange('salary', e.target.value)} onBlur={() => handleFieldBlur('salary')} placeholder="—" />
            </div>
            <div className="panel-field">
              <div className="panel-field-label">Contact</div>
              <input className="inline-edit" value={form.contact} onChange={e => handleFieldChange('contact', e.target.value)} onBlur={() => handleFieldBlur('contact')} placeholder="—" />
            </div>
          </div>

          <div className="panel-field">
            <div className="panel-field-label">Job URL</div>
            {job.jobUrl ? (
              <div className="panel-field-value">
                <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <FiExternalLink size={13} /> Open Posting
                </a>
              </div>
            ) : (
              <input className="inline-edit" value={form.jobUrl} onChange={e => handleFieldChange('jobUrl', e.target.value)} onBlur={() => handleFieldBlur('jobUrl')} placeholder="Paste URL..." />
            )}
          </div>

          <div className="panel-field">
            <div className="panel-field-label">Notes</div>
            <textarea className="inline-edit" rows={3} value={form.notes} onChange={e => handleFieldChange('notes', e.target.value)} onBlur={() => handleFieldBlur('notes')} placeholder="Add notes about this application..." style={{ resize: 'vertical', minHeight: '60px' }} />
          </div>

          {/* AI Cover Letter */}
          <div className="ai-section">
            <div className="ai-section-title"><FiZap size={12} /> AI Assistant</div>
            <button className="btn btn-ghost btn-sm" onClick={generateCoverLetter} disabled={aiLoading} style={{ marginBottom: '0.75rem' }}>
              {aiLoading ? 'Generating...' : 'Generate Cover Letter'}
            </button>
            {coverLetter && <div className="ai-output">{coverLetter}</div>}
          </div>
        </div>

        <div className="panel-actions">
          <button className="btn btn-danger btn-sm" onClick={() => { onDelete(job._id); onClose(); }}>
            <FiTrash2 size={13} /> Remove Application
          </button>
        </div>
      </div>
  );
}
