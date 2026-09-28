// Dashboard — rich visual donor overview with clinic hero scene, ECG pulse, stat cards, quick actions & blood compatibility
import { useNavigate } from 'react-router-dom';
import { Droplet, Heart, Calendar, CalendarClock, Activity, PhoneCall, History, ToggleRight, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../auth';
import { useToast } from '../toast';
import DashboardCard from '../components/DashboardCard';
import StatusBadge from '../components/StatusBadge';
import { getDonations, formatDate, eligibleDate } from '../store';
import { HeartbeatWave, BloodCompatibilityMatrix } from '../assets/illustrations';

export default function Dashboard() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!user) return null;

  const donations = getDonations();
  const total = donations.length;
  const lastDate = user.lastDonation || (donations[0]?.date ?? null);
  const nextEligible = eligibleDate(lastDate);
  const estimatedLivesSaved = total * 3;

  const toggleAvailability = () => {
    const updated = { ...user, available: !user.available };
    updateProfile(updated);
    toast(
      `Your donation status is now ${updated.available ? 'Available' : 'Unavailable'}.`,
      updated.available ? 'success' : 'info'
    );
  };

  const quickActions = [
    { title: 'Donate Blood', sub: 'Record a new donation', icon: Droplet, bg: 'var(--primary-50)', color: 'var(--primary-500)', to: '/donate' },
    { title: 'Emergency Requests', sub: 'Urgent calls near you', icon: PhoneCall, bg: 'var(--error-50)', color: 'var(--error-500)', to: '/emergency' },
    { title: 'Donation History', sub: `${total} records registered`, icon: History, bg: 'var(--warning-50)', color: 'var(--warning-500)', to: '/history' },
    { title: 'Digital Donor Card', sub: 'View & download badge', icon: ShieldCheck, bg: 'var(--primary-50)', color: 'var(--primary-600)', to: '/profile' },
  ];

  return (
    <div>
      {/* Compact Visual Hero Banner */}
      <div className="blood-hero-rich">
        <div className="bhr-container">
          <div className="bhr-content">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <div className="bhr-kicker">
                <Sparkles size={13} />
                <span>Lifesaver Network · Active Donor</span>
              </div>
              <div className="bhr-meta-bar" style={{ marginTop: 0 }}>
                <div className="bhr-group-badge">
                  <span className="bhr-group-lbl">Group</span>
                  <span className="bhr-group-val">{user.bloodGroup}</span>
                </div>
                <button
                  onClick={toggleAvailability}
                  style={{
                    background: user.available ? '#10b981' : 'rgba(255, 255, 255, 0.25)',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: 999,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    border: '1px solid rgba(255,255,255,0.4)',
                    transition: 'all 200ms ease',
                  }}
                  title="Click to toggle availability"
                >
                  <span className={user.available ? 'bhr-pulse-dot' : ''} style={{ background: user.available ? '#fff' : '#cbd5e1' }} />
                  {user.available ? 'Available' : 'Resting'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
              <h1 className="bhr-title" style={{ fontSize: '1.25rem', marginBottom: 0 }}>
                Welcome back, {user.fullName.split(' ')[0]}!
              </h1>
              <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.8rem' }}>
                <strong>{total} donations</strong> · ~<strong>{estimatedLivesSaved} lives protected</strong>
              </span>
            </div>

            {/* Pulsing ECG Rhythm Wave (ultra compact) */}
            <div className="bhr-ecg-track" style={{ marginTop: 1 }}>
              <HeartbeatWave height={14} stroke="#ffffff" strokeWidth={1.8} animated={true} />
            </div>
          </div>

          {/* Visual Scene Photo Spotlight */}
          <div className="bhr-art" style={{ maxHeight: 90, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <div
              style={{
                position: 'relative',
                width: 120,
                height: 75,
                borderRadius: 10,
                overflow: 'hidden',
                border: '1.5px solid rgba(255, 255, 255, 0.35)',
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.35)',
                flexShrink: 0,
              }}
            >
              <img
                src="/images/doctor-donor-care.jpg"
                alt="Medical professional care"
                referrerPolicy="no-referrer"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: 3,
                  right: 4,
                  fontSize: '0.58rem',
                  background: 'rgba(15, 23, 42, 0.85)',
                  color: '#4ade80',
                  padding: '1px 5px',
                  borderRadius: 4,
                  fontWeight: 800,
                  backdropFilter: 'blur(4px)',
                }}
              >
                ● Clinical Partner
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Compact Vibrant Stat Cards */}
      <div className="cards-grid-5 section-gap">
        <DashboardCard
          icon={Droplet}
          iconBg="linear-gradient(135deg, #ef4444, #b91c1c)"
          iconColor="#ffffff"
          cardBg="linear-gradient(135deg, rgba(254, 242, 242, 0.98) 0%, rgba(254, 226, 226, 0.95) 100%)"
          borderColor="rgba(248, 113, 113, 0.45)"
          label="Blood Group"
          value={user.bloodGroup}
          sub="Registered Type"
        />
        <DashboardCard
          icon={Activity}
          iconBg={user.available ? 'linear-gradient(135deg, #10b981, #047857)' : 'linear-gradient(135deg, #64748b, #475569)'}
          iconColor="#ffffff"
          cardBg={user.available ? 'linear-gradient(135deg, rgba(240, 253, 244, 0.98) 0%, rgba(220, 252, 231, 0.95) 100%)' : 'linear-gradient(135deg, rgba(241, 245, 249, 0.98) 0%, rgba(226, 232, 240, 0.95) 100%)'}
          borderColor={user.available ? 'rgba(74, 222, 128, 0.45)' : 'rgba(148, 163, 184, 0.4)'}
          label="Status"
          value={user.available ? 'Available' : 'Resting'}
          sub="Visible to ICUs"
        />
        <DashboardCard
          icon={Heart}
          iconBg="linear-gradient(135deg, #f43f5e, #be123c)"
          iconColor="#ffffff"
          cardBg="linear-gradient(135deg, rgba(255, 241, 242, 0.98) 0%, rgba(254, 205, 211, 0.95) 100%)"
          borderColor="rgba(251, 113, 133, 0.45)"
          label="Donations"
          value={total}
          sub={`~${estimatedLivesSaved} lives saved`}
        />
        <DashboardCard
          icon={Calendar}
          iconBg="linear-gradient(135deg, #f59e0b, #b45309)"
          iconColor="#ffffff"
          cardBg="linear-gradient(135deg, rgba(254, 252, 232, 0.98) 0%, rgba(254, 240, 138, 0.88) 100%)"
          borderColor="rgba(250, 204, 21, 0.5)"
          label="Last Donation"
          value={formatDate(lastDate)}
          sub={lastDate ? 'Verified donor' : 'No records yet'}
        />
        <DashboardCard
          icon={CalendarClock}
          iconBg="linear-gradient(135deg, #0284c7, #0369a1)"
          iconColor="#ffffff"
          cardBg="linear-gradient(135deg, rgba(240, 249, 255, 0.98) 0%, rgba(224, 242, 254, 0.95) 100%)"
          borderColor="rgba(56, 189, 248, 0.45)"
          label="Next Eligible"
          value={formatDate(nextEligible)}
          sub="Safe 3-mo interval"
        />
      </div>

      {/* Two-Column Lower Hub: Quick Actions & Emergency Urgency on Left, Compatibility Matcher on Right */}
      <div className="dash-columns section-gap">
        {/* Left Column: Urgent Alert + Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Emergency Urgent Banner (compact) */}
          <div
            className="card card-pad"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 241, 242, 0.95) 0%, rgba(254, 226, 226, 0.95) 100%)',
              borderColor: '#fca5a5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              padding: '10px 14px',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.12)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                className="dc-icon"
                style={{
                  background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                  color: '#fff',
                  margin: 0,
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  flexShrink: 0,
                }}
              >
                <PhoneCall size={18} />
              </div>
              <div>
                <h4 style={{ margin: 0, color: '#991b1b', fontSize: '0.88rem', fontWeight: 800 }}>
                  Urgent Blood Requests Active
                </h4>
                <p className="text-muted" style={{ margin: 0, fontSize: '0.74rem' }}>
                  Emergency surgeries in Nairobi need matching donors.
                </p>
              </div>
            </div>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => navigate('/emergency')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 12px', fontSize: '0.78rem' }}
            >
              <span>Respond</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Quick Actions (compact 2x2 grid) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {quickActions.map((qa) => (
              <button key={qa.title} className="quick-action" onClick={() => navigate(qa.to)} style={{ padding: '10px 12px', gap: 10 }}>
                <div className="qa-icon" style={{ background: qa.bg, color: qa.color, width: 34, height: 34, borderRadius: 8, margin: 0, flexShrink: 0 }}>
                  <qa.icon size={18} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div className="qa-title" style={{ fontSize: '0.82rem', fontWeight: 700 }}>{qa.title}</div>
                  <div className="qa-sub" style={{ fontSize: '0.7rem' }}>{qa.sub}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive Blood Compatibility Matcher */}
        <div>
          <BloodCompatibilityMatrix defaultType={user.bloodGroup} />
        </div>
      </div>

      {/* Prominent Lifesaver Community Spotlight Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
          borderRadius: 12,
          padding: '8px 12px',
          border: '1px solid var(--neutral-200)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          marginBottom: 0,
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 12, alignItems: 'center' }} className="dash-spotlight-grid">
          <div
            className="ds-image-wrap"
            style={{
              height: 60,
              borderRadius: 8,
              overflow: 'hidden',
              border: '1px solid var(--neutral-200)',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)',
              flexShrink: 0,
            }}
          >
            <img
              src="/images/lifesaver-care.jpg"
              alt="Compassionate healthcare hands holding patient with care"
              referrerPolicy="no-referrer"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 1 }}>
              <span
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  background: 'var(--primary-50)',
                  color: 'var(--primary-700)',
                  border: '1px solid var(--primary-200)',
                  padding: '1px 6px',
                  borderRadius: 999,
                }}
              >
                Community Impact
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--neutral-500)' }}>
                Certified Blood Transfusion Service
              </span>
            </div>
            <h4 style={{ margin: '0 0 1px', fontSize: '0.84rem', fontWeight: 800, color: 'var(--neutral-900)' }}>
              Your Continued Commitment Saves Lives Every Single Day
            </h4>
            <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--neutral-600)', lineHeight: 1.4 }}>
              Thanks to registered donors like you, over 48 partner medical centers receive rapid blood units during pediatric emergencies, oncology treatments, and surgical trauma.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
