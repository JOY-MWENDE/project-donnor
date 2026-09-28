// Navbar — top bar with menu toggle, notification bell, user photo avatar
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, LogOut, Info } from 'lucide-react';
import { useAuth } from '../auth';
import { unreadCount } from '../store';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [imgErr, setImgErr] = useState(false);
  const navigate = useNavigate();
  const count = unreadCount();
  const initials = (user?.fullName || '?').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header className="navbar">
      <button className="icon-btn icon-btn-menu menu-toggle" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={22} />
      </button>

      <div className="navbar-spacer" />

      <button
        className="icon-btn icon-btn-info"
        onClick={() => navigate('/about')}
        aria-label="About DonorKonnect System"
        title="About DonorKonnect System"
      >
        <Info size={19} />
      </button>

      <button
        className="icon-btn icon-btn-bell"
        onClick={() => navigate('/notifications')}
        aria-label={`Notifications, ${count} unread`}
      >
        <Bell size={19} />
        {count > 0 && <span className="dot" />}
      </button>

      <div
        className="navbar-user"
        onClick={() => navigate('/profile')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && navigate('/profile')}
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 12px 4px 6px' }}
      >
        <div style={{ position: 'relative', width: 34, height: 34 }}>
          {user?.avatar && !imgErr ? (
            <img
              src={user.avatar}
              alt={user.fullName}
              referrerPolicy="no-referrer"
              onError={() => setImgErr(true)}
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--primary-500)',
              }}
            />
          ) : (
            <div
              className="avatar"
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 800,
                fontSize: '0.8rem',
              }}
            >
              {initials}
            </div>
          )}
          <span
            style={{
              position: 'absolute',
              bottom: -1,
              right: -1,
              width: 9,
              height: 9,
              borderRadius: '50%',
              background: user?.available ? '#10b981' : '#94a3b8',
              border: '2px solid #fff',
            }}
          />
        </div>

        <div className="user-meta">
          <span className="user-name">{user?.fullName}</span>
          <span className="user-role" style={{ color: 'var(--primary-600)', fontWeight: 600 }}>
            {user?.bloodGroup} · {user?.available ? 'Available' : 'Resting'}
          </span>
        </div>
      </div>

      <button className="icon-btn icon-btn-logout" onClick={logout} aria-label="Logout" title="Logout">
        <LogOut size={19} />
      </button>
    </header>
  );
}
