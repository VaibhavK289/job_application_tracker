import { FiExternalLink, FiTrash2, FiZap, FiUploadCloud, FiCheckCircle } from 'react-icons/fi';
import { useState, useMemo, useRef } from 'react';
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
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeResult, setResumeResult] = useState(null);
  const fileInputRef = useRef(null);

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

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setResumeLoading(true);
    setResumeResult(null);

    const formData = new FormData();
    formData.append('resumeFile', file);
    formData.append('position', job.position);
    formData.append('company', job.company);
    formData.append('notes', job.notes || '');

    try {
      const res = await axios.post(`${AI_URL}/resume-score`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResumeResult(res.data);
    } catch (err) {
      setResumeResult({ suggestion: err.response?.data?.message || 'Failed to check resume. Ensure HUGGINGFACE_API_KEY is set.' });
    } finally {
      setResumeLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
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

          {/* AI Cover Letter AI Assistant */}
          <div className="ai-section">
            <div className="ai-section-title"><FiZap size={12} /> AI Assistant</div>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <button className="btn btn-ghost btn-sm" onClick={generateCoverLetter} disabled={aiLoading}>
                {aiLoading ? 'Generating...' : 'Generate Cover Letter'}
              </button>

              <button className="btn btn-ghost btn-sm" onClick={() => fileInputRef.current?.click()} disabled={resumeLoading}>
                <FiUploadCloud size={13} style={{ marginRight: '4px' }} />
                {resumeLoading ? 'Checking...' : 'Check Resume (PDF)'}
              </button>
              <input 
                type="file" 
                accept="application/pdf" 
                style={{ display: 'none' }} 
                ref={fileInputRef}
                onChange={handleResumeUpload}
              />
            </div>

            {coverLetter && <div className="ai-output" style={{ marginBottom: '0.75rem' }}>{coverLetter}</div>}
            
            {resumeResult && (
              <div className="ai-output" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <strong style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiCheckCircle size={14} style={{ color: 'var(--success)' }} /> Resume Match
                  </strong>
                  <span style={{ 
                    background: resumeResult.score > 70 ? 'var(--success)' : resumeResult.score > 40 ? 'var(--warning)' : 'var(--danger)',
                    color: '#fff',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    {resumeResult.score || 0}%
                  </span>
                </div>
                
                {resumeResult.missing_keywords?.length > 0 && (
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', marginBottom: '4px' }}>Missing Keywords:</span>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {resumeResult.missing_keywords.map(kw => (
                        <span key={kw} style={{ 
                          background: 'rgba(255,255,255,0.05)', 
                          border: '1px solid var(--border)', 
                          padding: '1px 6px', 
                          borderRadius: '4px', 
                          fontSize: '0.7rem' 
                        }}>{kw}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {resumeResult.suggestion && (
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {resumeResult.suggestion}
                  </p>
                )}
              </div>
            )}
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
