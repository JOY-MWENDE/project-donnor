import React, { useState } from 'react';

/**
 * Modern, rich vector illustrations and graphics for DonorKonnect
 * Provides visual depth, warmth, and professional medical quality.
 */

// Heartbeat ECG Pulse wave SVG
export function HeartbeatWave({ width = '100%', height = 48, stroke = '#ff4d5a', strokeWidth = 2.5, animated = true }) {
  return (
    <svg
      viewBox="0 0 600 60"
      preserveAspectRatio="none"
      style={{ width, height, overflow: 'visible' }}
      className={animated ? 'ecg-pulse-anim' : ''}
    >
      <defs>
        <linearGradient id="ecgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.1" />
          <stop offset="25%" stopColor={stroke} stopOpacity="0.4" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="75%" stopColor={stroke} stopOpacity="0.5" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <path
        d="M0,30 L140,30 L160,30 L170,12 L180,48 L190,4 L202,54 L212,24 L220,30 L340,30 L355,30 L365,12 L375,48 L385,4 L397,54 L407,24 L415,30 L600,30"
        fill="none"
        stroke="url(#ecgGrad)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Hero Scene: Modern Blood Donation Clinic with Donor and Clinician
export function HeroClinicIllustration({ className = '' }) {
  return (
    <svg
      viewBox="0 0 520 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: 'auto', maxHeight: 320 }}
    >
      <defs>
        {/* Soft radial glow */}
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffc8cc" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#fff1f2" stopOpacity="0" />
        </radialGradient>
        {/* Blood drop gradient */}
        <linearGradient id="bloodGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff4d5a" />
          <stop offset="50%" stopColor="#e11d2a" />
          <stop offset="100%" stopColor="#990b16" />
        </linearGradient>
        {/* Chair gradient */}
        <linearGradient id="chairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        {/* Nurse scrubs gradient */}
        <linearGradient id="scrubsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        {/* Donor shirt gradient */}
        <linearGradient id="donorShirt" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      {/* Atmospheric backdrop circles */}
      <circle cx="260" cy="170" r="160" fill="url(#sunGlow)" />
      <circle cx="440" cy="80" r="70" fill="rgba(225, 29, 42, 0.08)" />
      <circle cx="90" cy="190" r="85" fill="rgba(14, 165, 233, 0.06)" />

      {/* Modern clinic window frame */}
      <rect x="30" y="20" width="460" height="240" rx="20" fill="rgba(255, 255, 255, 0.45)" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="2" />
      <line x1="30" y1="140" x2="490" y2="140" stroke="rgba(226, 232, 240, 0.6)" strokeWidth="1.5" />
      <line x1="260" y1="20" x2="260" y2="260" stroke="rgba(226, 232, 240, 0.6)" strokeWidth="1.5" />

      {/* Indoor Potted Palm Plant (Calming clinic vibe) */}
      <ellipse cx="60" cy="275" rx="26" ry="12" fill="#cbd5e1" />
      <path d="M45,275 L50,230 L70,230 L75,275 Z" fill="#64748b" />
      <path d="M60,230 Q30,170 15,185 Q35,195 58,225" fill="#10b981" opacity="0.9" />
      <path d="M60,230 Q60,150 50,140 Q70,165 62,225" fill="#059669" />
      <path d="M60,230 Q90,165 105,180 Q85,195 62,225" fill="#34d399" />

      {/* Ergonomic Clinic Donation Recliner Lounge */}
      <path
        d="M130,240 Q160,240 195,220 L275,180 Q290,175 305,185 L335,215 Q345,225 360,225 L380,225"
        stroke="url(#chairGrad)"
        strokeWidth="28"
        strokeLinecap="round"
      />
      {/* Lounger stand & armrest */}
      <rect x="235" y="205" width="18" height="65" rx="8" fill="#475569" />
      <ellipse cx="244" cy="270" rx="45" ry="10" fill="#334155" />
      {/* Padded arm cushion */}
      <rect x="200" y="175" width="75" height="14" rx="7" fill="#64748b" />

      {/* Relaxed Donor (Joy) */}
      {/* Torso & Head */}
      <ellipse cx="175" cy="180" rx="34" ry="24" transform="rotate(-25 175 180)" fill="url(#donorShirt)" />
      {/* Donor Legs extending */}
      <path d="M205,195 L280,205 L345,215" stroke="#1e293b" strokeWidth="22" strokeLinecap="round" />
      {/* Donor Head */}
      <circle cx="140" cy="140" r="18" fill="#8d5b4c" />
      {/* Hair (Braided bun) */}
      <path d="M124,138 C124,120 156,120 156,138 C156,126 148,118 138,118 C128,118 124,128 124,138 Z" fill="#18181b" />
      <circle cx="132" cy="116" r="10" fill="#18181b" />
      {/* Peaceful smile */}
      <path d="M142,143 Q147,148 152,143" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Arm resting on cushion giving blood */}
      <path d="M165,170 Q195,175 240,175" stroke="#8d5b4c" strokeWidth="12" strokeLinecap="round" />
      {/* Soft medical sterile bandage */}
      <rect x="215" y="170" width="14" height="10" rx="3" fill="#fff" />
      <circle cx="222" cy="175" r="2.5" fill="#e11d2a" />

      {/* Transfusion / Blood collection IV Line */}
      <path
        d="M222,178 C222,210 280,225 285,150"
        stroke="#e11d2a"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* IV Infusion Pole & Blood Collection Pack */}
      <line x1="285" y1="40" x2="285" y2="270" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
      <line x1="265" y1="50" x2="305" y2="50" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="285" cy="270" rx="30" ry="7" fill="#64748b" />

      {/* Blood Pack with glowing ruby fluid */}
      <rect x="270" y="65" width="30" height="48" rx="8" fill="rgba(255,255,255,0.9)" stroke="#cbd5e1" strokeWidth="2" />
      <path d="M272,82 Q285,85 298,82 L298,105 Q298,111 292,111 L278,111 Q272,111 272,105 Z" fill="url(#bloodGlow)" />
      {/* Blood label */}
      <rect x="275" y="70" width="20" height="9" rx="2" fill="#e2e8f0" />
      <text x="285" y="77" fontSize="7" fontWeight="bold" textAnchor="middle" fill="#e11d2a">O+</text>

      {/* Healthcare Professional (Doctor/Nurse) */}
      <ellipse cx="370" cy="265" rx="22" ry="7" fill="#cbd5e1" />
      {/* Nurse lower body */}
      <path d="M358,265 L360,200 L380,200 L382,265" fill="#0369a1" />
      {/* Nurse torso (scrubs) */}
      <path d="M346,155 Q370,145 394,155 L388,205 L352,205 Z" fill="url(#scrubsGrad)" />
      {/* Stethoscope */}
      <path d="M362,155 Q370,175 378,155" stroke="#f1f5f9" strokeWidth="2.5" fill="none" />
      <circle cx="370" cy="180" r="4" fill="#94a3b8" />
      {/* Nurse Head & Mask */}
      <circle cx="370" cy="132" r="16" fill="#c6866a" />
      <path d="M355,130 C355,116 385,116 385,130 C385,120 378,114 370,114 C362,114 355,120 355,130 Z" fill="#27272a" />
      <rect x="362" y="133" width="16" height="11" rx="4" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1" />
      {/* Gentle caring eyes */}
      <ellipse cx="365" cy="128" rx="2" ry="1.5" fill="#1e293b" />
      <ellipse cx="375" cy="128" rx="2" ry="1.5" fill="#1e293b" />
      {/* Nurse hand holding clinical tablet */}
      <path d="M348,170 L330,175 L335,188 L355,180 Z" fill="url(#scrubsGrad)" />
      <rect x="320" y="165" width="22" height="30" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
      <rect x="323" y="169" width="16" height="2" rx="1" fill="#38bdf8" />
      <rect x="323" y="174" width="11" height="2" rx="1" fill="#10b981" />
      <rect x="323" y="179" width="14" height="2" rx="1" fill="#f59e0b" />

      {/* Floating Life-saving Droplet Emblem with Heart */}
      <g transform="translate(425, 45)">
        <circle cx="35" cy="35" r="38" fill="url(#bloodGlow)" filter="drop-shadow(0 10px 20px rgba(225,29,42,0.4))" />
        <path
          d="M35,18 C35,18 20,34 20,44 C20,53 26.7,60 35,60 C43.3,60 50,53 50,44 C50,34 35,18 35,18 Z"
          fill="#fff"
        />
        <path
          d="M35,32 C33,30 30,30 28,32 C26,34 26,37 28,39 L35,46 L42,39 C44,37 44,34 42,32 C40,30 37,30 35,32 Z"
          fill="#e11d2a"
        />
      </g>

      {/* Vital Heart Rate Monitor badge */}
      <g transform="translate(40, 40)">
        <rect x="0" y="0" width="130" height="48" rx="12" fill="rgba(15, 23, 42, 0.85)" />
        <circle cx="20" cy="24" r="6" fill="#10b981" className="heart-dot-pulse" />
        <text x="34" y="22" fill="#94a3b8" fontSize="9" fontWeight="600">DONOR VITALS</text>
        <text x="34" y="37" fill="#fff" fontSize="13" fontWeight="bold">72 BPM · OPTIMAL</text>
      </g>

      {/* Floor reflection gradient */}
      <rect x="0" y="275" width="520" height="65" fill="rgba(241, 245, 249, 0.7)" />
      <line x1="0" y1="275" x2="520" y2="275" stroke="#e2e8f0" strokeWidth="1.5" />
    </svg>
  );
}

// Auth Visual: Humanitarian Caring Hands & Glowing Heart Droplet
export function AuthHeroIllustration({ className = '' }) {
  return (
    <svg
      viewBox="0 0 460 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: 'auto', maxWidth: 420 }}
    >
      <defs>
        <radialGradient id="authHeartGlow" cx="50%" cy="45%" r="48%">
          <stop offset="0%" stopColor="#ff4d5a" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#c41420" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#6b0e14" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="handGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fed7aa" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>

      {/* Ambient background particles & rings */}
      <circle cx="230" cy="190" r="160" fill="url(#authHeartGlow)" opacity="0.3" />
      <circle cx="230" cy="190" r="130" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" strokeDasharray="6 6" />
      <circle cx="230" cy="190" r="180" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.5" />

      {/* Floating Sparkles & Lifelines */}
      <circle cx="100" cy="110" r="3" fill="#fff" opacity="0.8" />
      <circle cx="360" cy="120" r="4" fill="#fff" opacity="0.9" />
      <circle cx="90" cy="270" r="3.5" fill="#fecdd3" opacity="0.6" />
      <circle cx="370" cy="280" r="3" fill="#fecdd3" opacity="0.7" />

      {/* Central Magnificent Glowing Blood Droplet */}
      <path
        d="M230,80 C230,80 145,185 145,245 C145,292 183,330 230,330 C277,330 315,292 315,245 C315,185 230,80 230,80 Z"
        fill="url(#authHeartGlow)"
        filter="drop-shadow(0 20px 35px rgba(225,29,42,0.65))"
      />

      {/* Internal Luminous Heart */}
      <path
        d="M230,195 C222,185 208,185 198,195 C186,207 186,227 198,239 L230,270 L262,239 C274,227 274,207 262,195 C252,185 238,185 230,195 Z"
        fill="#ffffff"
        opacity="0.95"
      />

      {/* ECG Line inside droplet */}
      <path
        d="M175,245 L200,245 L210,230 L220,260 L230,220 L240,265 L250,240 L260,245 L285,245"
        stroke="#e11d2a"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Loving Supporting Cupped Hands Silhouette */}
      {/* Left hand */}
      <path
        d="M70,360 C110,340 160,335 200,325 C215,320 225,310 220,335 C200,365 150,380 90,400 Z"
        fill="rgba(255, 255, 255, 0.25)"
      />
      {/* Right hand */}
      <path
        d="M390,360 C350,340 300,335 260,325 C245,320 235,310 240,335 C260,365 310,380 370,400 Z"
        fill="rgba(255, 255, 255, 0.35)"
      />

      {/* Trust Badge Tag */}
      <g transform="translate(145, 345)">
        <rect x="0" y="0" width="170" height="34" rx="17" fill="rgba(0, 0, 0, 0.45)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <circle cx="20" cy="17" r="8" fill="#10b981" />
        <path d="M16,17 L19,20 L24,14" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <text x="36" y="22" fill="#ffffff" fontSize="11" fontWeight="700" letterSpacing="0.5">VERIFIED DONOR NETWORK</text>
      </g>
    </svg>
  );
}

// Emergency Hospital Trauma Scene Art
export function EmergencyHospitalIllustration({ className = '' }) {
  return (
    <svg
      viewBox="0 0 540 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: 'auto', maxHeight: 220 }}
    >
      <defs>
        <linearGradient id="skyNight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#090d16" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <radialGradient id="beaconRed" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Night Sky Backdrop with subtle Stars */}
      <rect width="540" height="220" rx="18" fill="url(#skyNight)" />
      <circle cx="80" cy="30" r="1.5" fill="#fff" opacity="0.6" />
      <circle cx="210" cy="20" r="2" fill="#fff" opacity="0.8" />
      <circle cx="480" cy="35" r="1.5" fill="#fff" opacity="0.5" />

      {/* Modern Hospital Building Center */}
      <rect x="60" y="50" width="220" height="150" fill="#1e293b" stroke="#334155" strokeWidth="2" />
      <rect x="280" y="30" width="180" height="170" fill="#0f172a" stroke="#334155" strokeWidth="2" />

      {/* Lit Hospital Windows */}
      {[75, 115, 155, 195, 235].map((x) =>
        [70, 105, 140].map((y) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="22" height="18" rx="2" fill={Math.random() > 0.3 ? '#fef08a' : '#334155'} opacity="0.75" />
        ))
      )}
      {[300, 340, 380, 420].map((x) =>
        [50, 85, 120, 155].map((y) => (
          <rect key={`r-${x}-${y}`} x={x} y={y} width="24" height="20" rx="2" fill={Math.random() > 0.4 ? '#bae6fd' : '#1e293b'} opacity="0.8" />
        ))
      )}

      {/* Glowing Red Cross on Roof */}
      <rect x="355" y="10" width="30" height="10" rx="2" fill="#ef4444" />
      <rect x="365" y="0" width="10" height="30" rx="2" fill="#ef4444" />
      <circle cx="370" cy="15" r="28" fill="url(#beaconRed)" opacity="0.4" />

      {/* Emergency Entrance Bay Sign */}
      <rect x="180" y="150" width="110" height="22" rx="4" fill="#dc2626" />
      <text x="235" y="165" fill="#fff" fontSize="10" fontWeight="900" textAnchor="middle" letterSpacing="1">EMERGENCY / TRAUMA</text>

      {/* Ambulance */}
      <g transform="translate(190, 155)">
        <rect x="0" y="15" width="85" height="34" rx="6" fill="#f8fafc" />
        <path d="M60,15 L78,28 L78,49 L60,49 Z" fill="#f8fafc" />
        {/* Windshield */}
        <polygon points="62,18 74,27 62,27" fill="#38bdf8" />
        {/* Red emergency stripe */}
        <rect x="0" y="30" width="85" height="7" fill="#dc2626" />
        {/* Wheels */}
        <circle cx="20" cy="49" r="8" fill="#0f172a" />
        <circle cx="20" cy="49" r="4" fill="#94a3b8" />
        <circle cx="68" cy="49" r="8" fill="#0f172a" />
        <circle cx="68" cy="49" r="4" fill="#94a3b8" />
        {/* Flashing Red Beacon */}
        <circle cx="35" cy="10" r="16" fill="url(#beaconRed)" className="beacon-flash" />
        <rect x="32" y="11" width="6" height="4" rx="2" fill="#ef4444" />
      </g>

      {/* Road / asphalt */}
      <rect x="0" y="200" width="540" height="20" fill="#090d16" />
      <line x1="0" y1="210" x2="540" y2="210" stroke="#fef08a" strokeWidth="2" strokeDasharray="16 16" />
    </svg>
  );
}

// Professional Blood Group Compatibility Matrix (Compact & Interactive)
export function BloodCompatibilityMatrix({ defaultType = 'O+', initialExpanded = false }) {
  const [selectedType, setSelectedType] = useState(defaultType);
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const bloodData = [
    { type: 'O-', giveTo: 'All Types (Universal Donor)', receiveFrom: 'O- only', tag: 'Universal Donor', tagColor: '#10b981' },
    { type: 'O+', giveTo: 'O+, A+, B+, AB+', receiveFrom: 'O+, O-', tag: 'High Demand', tagColor: '#ef4444' },
    { type: 'A-', giveTo: 'A-, A+, AB-, AB+', receiveFrom: 'A-, O-', tag: 'Rare', tagColor: '#f59e0b' },
    { type: 'A+', giveTo: 'A+, AB+', receiveFrom: 'A+, A-, O+, O-', tag: 'Common', tagColor: '#64748b' },
    { type: 'B-', giveTo: 'B-, B+, AB-, AB+', receiveFrom: 'B-, O-', tag: 'Rare', tagColor: '#f59e0b' },
    { type: 'B+', giveTo: 'B+, AB+', receiveFrom: 'B+, B-, O+, O-', tag: 'Common', tagColor: '#64748b' },
    { type: 'AB-', giveTo: 'AB-, AB+', receiveFrom: 'All Rh- Types', tag: 'Very Rare', tagColor: '#8b5cf6' },
    { type: 'AB+', giveTo: 'AB+ only', receiveFrom: 'All Types (Universal Recipient)', tag: 'Universal Recipient', tagColor: '#0ea5e9' },
  ];

  const currentMatch = bloodData.find((b) => b.type === selectedType) || bloodData[1];

  return (
    <div className="compatibility-matrix">
      <div className="cm-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
        <div>
          <h3 style={{ fontSize: '0.98rem', marginBottom: 2 }}>Blood Compatibility Matcher</h3>
          <p className="text-muted" style={{ fontSize: '0.78rem' }}>Check instant donor & recipient match</p>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="btn btn-ghost btn-sm"
          style={{ fontSize: '0.76rem', padding: '4px 10px', height: 'auto' }}
        >
          {isExpanded ? 'Collapse Matrix' : 'View All 8 Types'}
        </button>
      </div>

      {/* Interactive Blood Selector Pills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {bloodData.map((b) => {
          const isSelected = selectedType === b.type;
          return (
            <button
              key={b.type}
              type="button"
              onClick={() => setSelectedType(b.type)}
              style={{
                padding: '4px 10px',
                borderRadius: 999,
                fontSize: '0.8rem',
                fontWeight: 700,
                background: isSelected ? 'var(--primary-600)' : 'rgba(0,0,0,0.06)',
                color: isSelected ? '#ffffff' : 'var(--neutral-700)',
                border: isSelected ? '1px solid var(--primary-700)' : '1px solid transparent',
                transition: 'all 0.15s ease',
              }}
            >
              {b.type}
            </button>
          );
        })}
      </div>

      {/* Focused Match Readout Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(255, 241, 242, 0.8) 0%, rgba(254, 226, 226, 0.6) 100%)',
          border: '1px solid #fca5a5',
          borderRadius: 12,
          padding: '10px 14px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary-700)', lineHeight: 1 }}>{currentMatch.type}</span>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 999,
              background: `${currentMatch.tagColor}20`,
              color: currentMatch.tagColor,
              border: `1px solid ${currentMatch.tagColor}50`,
            }}
          >
            {currentMatch.tag}
          </span>
        </div>
        <div style={{ fontSize: '0.82rem' }}>
          <span style={{ color: 'var(--neutral-500)', fontSize: '0.72rem', textTransform: 'uppercase', display: 'block', fontWeight: 700 }}>
            Can Donate Blood To:
          </span>
          <span style={{ fontWeight: 700, color: 'var(--neutral-900)' }}>{currentMatch.giveTo}</span>
        </div>
        <div style={{ fontSize: '0.82rem' }}>
          <span style={{ color: 'var(--neutral-500)', fontSize: '0.72rem', textTransform: 'uppercase', display: 'block', fontWeight: 700 }}>
            Can Receive Blood From:
          </span>
          <span style={{ fontWeight: 700, color: 'var(--neutral-900)' }}>{currentMatch.receiveFrom}</span>
        </div>
      </div>

      {/* Expanded full grid if toggled */}
      {isExpanded && (
        <div className="cm-grid" style={{ marginTop: 12 }}>
          {bloodData.map((b) => (
            <div key={b.type} className="cm-card" onClick={() => setSelectedType(b.type)} style={{ cursor: 'pointer' }}>
              <div className="cm-top">
                <span className="cm-type">{b.type}</span>
                <span className="cm-tag" style={{ background: `${b.tagColor}18`, color: b.tagColor, borderColor: `${b.tagColor}40` }}>
                  {b.tag}
                </span>
              </div>
              <div className="cm-info">
                <div className="cm-row">
                  <span className="cm-label">Can Give To:</span>
                  <span className="cm-val">{b.giveTo}</span>
                </div>
                <div className="cm-row">
                  <span className="cm-label">Can Receive From:</span>
                  <span className="cm-val">{b.receiveFrom}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Authentic Preset Donor Avatars
export const DONOR_AVATARS = [
  { id: 'joy', name: 'Joy Mwende', role: 'Hero Donor', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80' },
  { id: 'david', name: 'David Kimani', role: 'O- Champion', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80' },
  { id: 'sarah', name: 'Dr. Sarah Omondi', role: 'Hematologist', avatarUrl: 'https://images.unsplash.com/photo-1594824813590-b89a81f332a6?auto=format&fit=crop&w=256&q=80' },
];
