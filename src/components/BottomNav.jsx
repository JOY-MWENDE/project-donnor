// BottomNav — mobile bottom navigation bar
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Droplet, Bell, PhoneCall } from 'lucide-react';
import { unreadCount } from '../store';

const items = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard, color: '#38bdf8' },
  { to: '/donate', label: 'Donate', icon: Droplet, color: '#f87171' },
  { to: '/notifications', label: 'Alerts', icon: Bell, badge: true, color: '#fbbf24' },
  { to: '/emergency', label: 'Emergency', icon: PhoneCall, color: '#ef4444' },
];

export default function BottomNav() {
  const count = unreadCount();
  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <NavLink key={item.to} to={item.to} className={({ isActive }) => `bn-item ${isActive ? 'active' : ''}`} style={{ position: 'relative' }}>
          {({ isActive }) => (
            <>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  display: 'grid',
                  placeItems: 'center',
                  background: isActive ? `${item.color}30` : 'rgba(255, 255, 255, 0.08)',
                  color: isActive ? item.color : `${item.color}cc`,
                  border: isActive ? `1.5px solid ${item.color}` : '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: isActive ? `0 2px 10px ${item.color}40` : 'none',
                  transition: 'all 200ms ease',
                }}
              >
                <item.icon size={16} />
              </div>
              <span style={{ color: isActive ? '#fff' : '#94a3b8', fontWeight: isActive ? 700 : 500, fontSize: '0.64rem' }}>
                {item.label}
              </span>
              {item.badge && count > 0 && <span className="bn-badge">{count}</span>}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
