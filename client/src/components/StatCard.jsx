import './StatCard.css';

function StatCard({ label, value, sub, subType, color }) {
  return (
    <div className="stat-card">
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value" style={{ color: color }}>
        {value}
      </div>
      <div className={`stat-card-sub ${subType}`}>{sub}</div>
    </div>
  );
}

export default StatCard;