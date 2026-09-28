// Landing Page — Simple, clean overview of DonorKonnect
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Heart,
} from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../auth';
import { HeartbeatWave } from '../assets/illustrations';

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#fff' }}>
      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '12px 24px',
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <Logo size={34} />
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', lineHeight: 1 }}>
                DonorKonnect
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.68rem' }}>
                Blood Donation & Emergency
              </div>
            </div>
          </Link>

          {/* Quick Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {user ? (
              <button
                className="btn btn-primary"
                onClick={() => navigate('/dashboard')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 16px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                }}
              >
                <span>Dashboard ({user.bloodGroup})</span>
                <ArrowRight size={15} />
              </button>
            ) : (
              <>
                <button
                  className="btn btn-ghost"
                  onClick={() => navigate('/login')}
                  style={{ color: '#fff', fontSize: '0.84rem', padding: '7px 14px' }}
                >
                  Sign In
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/register')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '7px 16px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                  }}
                >
                  <span>Become a Donor</span>
                  <ArrowRight size={15} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, maxWidth: 1040, width: '100%', margin: '0 auto', padding: '16px 16px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Simple Hero Section */}
        <section
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 18,
            padding: 'clamp(18px, 3vw, 28px)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 24, alignItems: 'center' }} className="landing-hero-grid">
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.74rem',
                  color: '#f87171',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  padding: '3px 10px',
                  borderRadius: 999,
                  fontWeight: 600,
                  marginBottom: 10,
                }}
              >
                <Sparkles size={12} />
                <span>Real-Time Blood Donor Lifeline</span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(1.45rem, 2.8vw, 2.2rem)',
                  lineHeight: 1.2,
                  fontWeight: 800,
                  color: '#fff',
                  marginBottom: 10,
                  letterSpacing: '-0.02em',
                }}
              >
                A Simple Way to Donate Blood &amp; Save Lives.
              </h1>

              <p
                style={{
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                  color: 'rgba(255, 255, 255, 0.85)',
                  marginBottom: 16,
                  maxWidth: 500,
                }}
              >
                DonorKonnect connects voluntary blood donors directly with hospitals in urgent need. Register in seconds, get notified during emergencies, and help save lives when it matters most.
              </p>

              {/* Actions */}
              <div className="landing-hero-actions" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
                {user ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate('/dashboard')}
                    style={{ padding: '8px 18px', fontSize: '0.86rem', fontWeight: 700 }}
                  >
                    Go to Your Dashboard
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate('/register')}
                    style={{ padding: '8px 18px', fontSize: '0.86rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <Heart size={15} />
                    <span>Join as a Donor</span>
                  </button>
                )}

                <button
                  className="btn btn-outline"
                  onClick={() => navigate(user ? '/emergency' : '/login')}
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.86rem',
                    color: '#fff',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.08)',
                  }}
                >
                  View Emergency Requests
                </button>
              </div>

              <div style={{ maxWidth: 300, opacity: 0.85 }}>
                <HeartbeatWave height={18} stroke="#ffffff" strokeWidth={2} animated={true} />
              </div>
            </div>

            {/* High-Impact Professional Photo Showcase */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: 420,
                  borderRadius: 16,
                  overflow: 'hidden',
                  border: '1.5px solid rgba(255, 255, 255, 0.25)',
                  boxShadow: '0 14px 32px rgba(0, 0, 0, 0.4)',
                  background: 'rgba(15, 23, 42, 0.6)',
                }}
              >
                <img
                  src="/images/hero-blood-donation.jpg"
                  alt="Voluntary blood donor giving life-saving blood at modern clinic"
                  referrerPolicy="no-referrer"
                  style={{
                    width: '100%',
                    height: 220,
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 300ms ease',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    background: 'rgba(15, 23, 42, 0.88)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    padding: '4px 10px',
                    borderRadius: 999,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: '0.7rem',
                    color: '#fff',
                    fontWeight: 700,
                  }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                  <span>Verified Clinical Standards</span>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    background: 'rgba(220, 38, 38, 0.95)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    padding: '5px 12px',
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    color: '#fff',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.45)',
                  }}
                >
                  <Heart size={13} fill="#fff" />
                  <span>1 Pint Saves 3 Lives</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Pillar Cards with Professional Photography (Compact) */}
        <section style={{ marginTop: 16 }}>
          <div
            className="landing-pillars-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 14,
            }}
          >
            {/* Card 1: Safe Donation */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 14,
                overflow: 'hidden',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.18)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ height: 110, overflow: 'hidden', position: 'relative' }}>
                <img
                  src="/images/donation-process.jpg"
                  alt="Safe and sterile blood donation procedure"
                  referrerPolicy="no-referrer"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    left: 8,
                    background: 'rgba(15, 23, 42, 0.88)',
                    padding: '2px 8px',
                    borderRadius: 5,
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: '#38bdf8',
                  }}
                >
                  Safe &amp; Sterile
                </span>
              </div>
              <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', marginBottom: 4 }}>
                    Voluntary Blood Donation
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.45, margin: 0 }}>
                    Comfortable, sterile collection in under 15 minutes. Support emergency surgeries and cancer care.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Emergency Trauma Dispatch */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 14,
                overflow: 'hidden',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.18)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ height: 110, overflow: 'hidden', position: 'relative' }}>
                <img
                  src="/images/emergency-dispatch.jpg"
                  alt="Emergency trauma blood dispatch and ambulance response"
                  referrerPolicy="no-referrer"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    left: 8,
                    background: 'rgba(185, 28, 28, 0.92)',
                    padding: '2px 8px',
                    borderRadius: 5,
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: '#fff',
                  }}
                >
                  24/7 Rapid Dispatch
                </span>
              </div>
              <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', marginBottom: 4 }}>
                    Trauma &amp; ICU Blood Dispatch
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.45, margin: 0 }}>
                    Direct urgent alerts connecting nearby matching donors with critical emergency patients within minutes.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Certified Medical Network */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 14,
                overflow: 'hidden',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.18)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ height: 110, overflow: 'hidden', position: 'relative' }}>
                <img
                  src="/images/doctor-donor-care.jpg"
                  alt="Certified medical doctor and healthcare professional"
                  referrerPolicy="no-referrer"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    left: 8,
                    background: 'rgba(15, 23, 42, 0.88)',
                    padding: '2px 8px',
                    borderRadius: 5,
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: '#4ade80',
                  }}
                >
                  Certified Network
                </span>
              </div>
              <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', marginBottom: 4 }}>
                    48+ Partner Hospitals
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.45, margin: 0 }}>
                    Partnered with certified hospitals including Kenyatta National, Aga Khan, Mater, and Nairobi Hospital.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(15, 23, 42, 0.95)',
          padding: '20px 24px',
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '0.78rem',
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Logo size={24} />
            <span style={{ color: '#fff', fontWeight: 700 }}>DonorKonnect</span>
            <span>· Blood Donation &amp; Emergency Dispatch</span>
          </div>
          <div>&copy; 2026 DonorKonnect. Voluntary Lifesaver Network.</div>
        </div>
      </footer>
    </div>
  );
}
