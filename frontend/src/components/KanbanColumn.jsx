import { useDroppable } from '@dnd-kit/core';

export default function KanbanColumn({ status, jobs, children }) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const getBorderColor = () => {
    switch (status) {
      case 'Pending': return 'rgba(251, 133, 0, 0.5)';
      case 'Interview': return 'rgba(0, 240, 255, 0.5)';
      case 'Offer': return 'rgba(0, 255, 170, 0.5)';
      case 'Declined': return 'rgba(255, 0, 85, 0.5)';
      default: return 'var(--border-glass)';
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      className="kanban-column"
      style={{
        boxShadow: isOver ? `0 0 20px ${getBorderColor()} inset` : 'none',
        borderColor: isOver ? getBorderColor() : 'var(--border-glass)'
      }}
    >
      <div className="column-header">
        <h3 className="column-title">
          <span className={`badge status-${status.toLowerCase()}`}>{status}</span>
        </h3>
        <span className="column-count">{jobs.length}</span>
      </div>
      <div className="kanban-cards-container">
        {children}
      </div>
    </div>
  );
}
