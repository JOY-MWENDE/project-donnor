// ProfileCard — sidebar/profile summary card with avatar photo + key info
import { useState } from 'react';
import StatusBadge from './StatusBadge';
import { ShieldCheck } from 'lucide-react';

export default function ProfileCard({ user, showStatus = true }) {
  const [imgError, setImgError] = useState(false);
  const initials = (user.fullName || '?').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="card card-pad profile-card-wrap" style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: 92, height: 92, margin: '0 auto 16px' }}>
        {user.avatar && !imgError ? (
          <img
            src={user.avatar}
            alt={user.fullName}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #e11d2a',
              boxShadow: '0 8px 20px rgba(225, 29, 42, 0.25)',
            }}
          />
        ) : (
          <div className="profile-avatar-lg" style={{ width: '100%', height: '100%', margin: 0 }}>
            {initials}
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff',
            borderRadius: '50%',
            width: 26,
            height: 26,
            display: 'grid',
            placeItems: 'center',
            border: '2px solid #fff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }}
          title="Verified Voluntary Donor"
        >
          <ShieldCheck size={14} />
        </div>
      </div>

      <h3 style={{ marginBottom: 4, fontSize: '1.25rem' }}>{user.fullName}</h3>
      <div className="text-muted text-sm" style={{ marginBottom: 14 }}>{user.email}</div>

      <div
        className="dc-bgroup"
        style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, var(--primary-50), #fee2e2)',
          color: 'var(--primary-600)',
          padding: '8px 22px',
          borderRadius: 14,
          fontWeight: 900,
          fontSize: '1.35rem',
          border: '1px solid var(--primary-200)',
          marginBottom: 14,
        }}
      >
        {user.bloodGroup}
      </div>

      {showStatus && (
        <div style={{ marginTop: 4 }}>
          <StatusBadge
            status={user.available ? 'available' : 'unavailable'}
            label={user.available ? 'Available to Donate' : 'Currently Resting'}
          />
        </div>
      )}
    </div>
  );
}
