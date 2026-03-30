export default function PipelineBar({ stats }) {
  const total = stats.total || 1;
  const segments = [
    { key: 'pending', count: stats.pending, color: 'var(--status-applied)', label: 'Applied' },
    { key: 'interview', count: stats.interview, color: 'var(--status-interview)', label: 'Interview' },
    { key: 'offer', count: stats.offer, color: 'var(--status-offer)', label: 'Offers' },
    { key: 'declined', count: stats.declined, color: 'var(--status-declined)', label: 'Declined' },
  ];

  return (
    <div className="pipeline-bar-container">
      <div className="pipeline-bar">
        {segments.map(seg => (
          seg.count > 0 && (
            <div
              key={seg.key}
              className="pipeline-segment"
              style={{
                width: `${(seg.count / total) * 100}%`,
                background: seg.color,
              }}
            />
          )
        ))}
      </div>
      <div className="pipeline-labels">
        {segments.map(seg => (
          <div key={seg.key} className="pipeline-label">
            <span className="qs-dot" style={{ background: seg.color }} />
            {seg.label} <span>{seg.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
