// Sidebar — desktop fixed + mobile drawer
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, User, Droplet, History, Bell, PhoneCall, Info, LogOut } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../auth';
import { unreadCount } from '../store';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: '#38bdf8' },
  { to: '/profile', label: 'Profile', icon: User, color: '#34d399' },
  { to: '/donate', label: 'Donate', icon: Droplet, color: '#f87171' },
  { to: '/history', label: 'Donation History', icon: History, color: '#fbbf24' },
  { to: '/notifications', label: 'Notifications', icon: Bell, badge: true, color: '#c084fc' },
  { to: '/emergency', label: 'Emergency', icon: PhoneCall, color: '#ef4444' },
  { to: '/about', label: 'About System', icon: Info, color: '#60a5fa' },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const count = unreadCount();

  return (
    <>
      <div className={`sidebar-overlay ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <Link to="/about" className="sidebar-brand" onClick={onClose} style={{ textDecoration: 'none' }} title="About DonorKonnect System">
          <Logo size={40} />
          <div>
            <div className="brand-name">DonorKonnect</div>
            <div className="brand-sub">Connecting Donors. Saving Lives.</div>
          </div>
        </Link>
        <nav className="sidebar-nav">
          <div className="nav-label">Menu</div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  display: 'grid',
                  placeItems: 'center',
                  background: `${item.color}20`,
                  color: item.color,
                  border: `1px solid ${item.color}40`,
                  flexShrink: 0,
                  transition: 'all 200ms ease',
                }}
              >
                <item.icon size={17} />
              </div>
              <span>{item.label}</span>
              {item.badge && count > 0 && <span className="nav-badge">{count}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="nav-item" style={{ width: '100%' }} onClick={logout}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                display: 'grid',
                placeItems: 'center',
                background: 'rgba(239, 68, 68, 0.18)',
                color: '#f87171',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                flexShrink: 0,
              }}
            >
              <LogOut size={17} />
            </div>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
