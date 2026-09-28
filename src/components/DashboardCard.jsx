// DashboardCard — compact, tinted stat tile with colorful icon badge, label, value, sub-text
export default function DashboardCard({ icon: Icon, iconBg, iconColor, label, value, sub, cardBg, borderColor }) {
  return (
    <div
      className="dash-card"
      style={{
        background: cardBg || undefined,
        borderColor: borderColor || undefined,
      }}
    >
      <div
        className="dc-icon"
        style={{
          background: iconBg,
          color: iconColor,
        }}
      >
        {Icon && <Icon size={18} />}
      </div>
      <div className="dc-body">
        <div className="dc-label">{label}</div>
        <div className="dc-value">{value}</div>
        {sub && <div className="dc-sub">{sub}</div>}
      </div>
    </div>
  );
}
