import { useDraggable } from '@dnd-kit/core';
import { FiClock, FiMapPin, FiLink, FiUser, FiDollarSign, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function KanbanCard({ job, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: job._id,
    data: { job }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 999,
    position: 'relative'
  } : undefined;

  return (
    <div 
      ref={setNodeRef} 
      {...listeners} 
      {...attributes}
      className="kanban-card"
      style={{ ...style, opacity: isDragging ? 0.4 : 1 }}
    >
      <div className="card-company">{job.company}</div>
      <div className="card-position">{job.position}</div>
      
      <div className="card-meta">
        <div className="meta-row">
          <FiMapPin size={12} /> {job.location || 'Remote'}
        </div>
        <div className="meta-row">
          <FiClock size={12} /> {new Date(job.dateApplied).toLocaleDateString()}
        </div>
        {job.salary && (
          <div className="meta-row"><FiDollarSign size={12} /> {job.salary}</div>
        )}
        {job.contact && (
          <div className="meta-row"><FiUser size={12} /> {job.contact}</div>
        )}
        {job.jobUrl && (
          <div className="meta-row">
            <FiLink size={12} />
            <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-neon)', textDecoration: 'none' }} onPointerDown={e => e.stopPropagation()}>
              Job Link
            </a>
          </div>
        )}
      </div>

      <div className="card-footer">
        <button className="icon-btn edit" onClick={(e) => { e.stopPropagation(); onEdit(job); }} onPointerDown={e => e.stopPropagation()}>
          <FiEdit2 size={14} />
        </button>
        <button className="icon-btn delete" onClick={(e) => { e.stopPropagation(); onDelete(job._id); }} onPointerDown={e => e.stopPropagation()}>
          <FiTrash2 size={14} />
        </button>
      </div>
    </div>
  );
}
