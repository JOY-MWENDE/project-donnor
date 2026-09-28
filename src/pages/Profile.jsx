// Profile — view, edit, donor card download/print, donation history CSV
import { useState, useRef, useEffect } from 'react';
import { Edit3, Download, Printer, FileText, Droplet, User, Phone, Mail, MapPin, Calendar, Heart, Loader2 } from 'lucide-react';
import { useAuth } from '../auth';
import { useToast } from '../toast';
import Modal from '../components/Modal';
import { getDonations, formatDate } from '../store';
import { getUserProfile } from '../service/profile.js'; // Adjust path if profileService.js is in another folder

export default function Profile() {
  const { user: authUser, updateProfile } = useAuth();
  const { toast } = useToast();
  const printRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch verified profile directly from the backend on mount
  useEffect(() => {
    const fetchLiveProfile = async () => {
      const activeId = authUser?.id || localStorage.getItem('userId');
      if (!activeId) {
        setLoading(false);
        return;
      }

      try {
        const data = await getUserProfile(activeId);
        // Normalize backend fields to UI keys
        const normalized = {
          ...data,
          phone: data.phoneNumber || data.phone || '',
          location: data.cityLocation || data.location || '',
        };
        setProfile(normalized);
        if (updateProfile) updateProfile(normalized);
      } catch (err) {
        // Fallback to authUser if network/API fails
        if (authUser) {
          setProfile({
            ...authUser,
            phone: authUser.phoneNumber || authUser.phone || '',
            location: authUser.cityLocation || authUser.location || '',
          });
        }
        toast(err.message || 'Could not fetch live profile details.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchLiveProfile();
  }, [authUser?.id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 12 }}>
        <Loader2 className="animate-spin" size={32} color="var(--primary-600)" />
        <span style={{ fontSize: '0.9rem', color: 'var(--neutral-500)' }}>Loading profile data...</span>
      </div>
    );
  }

  // Use loaded profile or fallback to auth context user
  const currentUser = profile || authUser;
  if (!currentUser) return null;

  const donations = getDonations();

  const startEdit = () => {
    setForm({
      ...currentUser,
      phone: currentUser.phoneNumber || currentUser.phone || '',
      location: currentUser.cityLocation || currentUser.location || '',
    });
    setEditing(true);
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const saveEdit = async (ev) => {
    ev.preventDefault();
    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim() || !form.location.trim()) {
      toast('Please fill in all required fields.', 'error');
      return;
    }

    setSaving(true);
    try {
      const updatedData = {
        ...form,
        phoneNumber: form.phone,
        cityLocation: form.location,
      };

      if (updateProfile) {
        updateProfile(updatedData);
      }
      setProfile(updatedData);
      toast('Profile updated successfully.', 'success');
      setEditing(false);
    } catch (err) {
      toast(err.message || 'Failed to save changes.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const downloadCSV = () => {
    if (donations.length === 0) {
      toast('No donation history to download.', 'info');
      return;
    }
    const headers = ['Hospital', 'Date', 'Time', 'Blood Group', 'Units', 'Location', 'Status'];
    const rows = donations.map((d) => [d.hospital, d.date, d.time, d.bloodGroup, d.units, d.location, d.status]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donorkonnect-history-${currentUser.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Donation history downloaded as CSV.', 'success');
  };

  const downloadCard = () => {
    const cardHTML = printRef.current?.outerHTML || '';
    const html = `<!doctype html><html><head><title>DonorKonnect Card - ${currentUser.fullName}</title>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap">
      <style>${getCardStyles()}</style></head>
      <body style="display:grid;place-items:center;min-height:100vh;background:#f8fafc;margin:0">${cardHTML}</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donorkonnect-card-${currentUser.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Donor card downloaded.', 'success');
  };

  const printCard = () => {
    window.print();
  };

  const initials = (currentUser.fullName || 'DK')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const profileRows = [
    { icon: User, color: '#0ea5e9', key: 'Full Name', val: currentUser.fullName },
    { icon: Droplet, color: '#ef4444', key: 'Blood Group', val: currentUser.bloodGroup },
    { icon: Heart, color: '#ec4899', key: 'Gender', val: currentUser.gender },
    { icon: Phone, color: '#10b981', key: 'Phone Number', val: currentUser.phoneNumber || currentUser.phone },
    { icon: Mail, color: '#f59e0b', key: 'Email', val: currentUser.email },
    { icon: MapPin, color: '#8b5cf6', key: 'Location', val: currentUser.cityLocation || currentUser.location },
    { icon: Calendar, color: '#6366f1', key: 'Last Blood Donation', val: formatDate(currentUser.lastDonation) },
  ];

  return (
    <div>
      <div className="dash-columns">
        {/* Left column: Profile info + actions */}
        <div className="card card-pad" style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--neutral-200)', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: '1 1 200px' }}>
              <div style={{ position: 'relative', width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary-500)', background: 'var(--primary-100)', display: 'grid', placeItems: 'center', fontWeight: 800, color: 'var(--primary-700)', fontSize: '1rem', flexShrink: 0 }}>
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.fullName} referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <div style={{ minWidth: 0 }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, wordBreak: 'break-word' }}>{currentUser.fullName}</h3>
                <span style={{ fontSize: '0.74rem', color: 'var(--neutral-500)', wordBreak: 'break-word' }}>
                  ID: <span style={{ fontFamily: 'var(--font-mono)' }}>{currentUser.id}</span> · Blood Group: <strong style={{ color: 'var(--primary-600)' }}>{currentUser.bloodGroup}</strong>
                </span>
              </div>
            </div>

            <button className="btn btn-outline btn-sm" onClick={startEdit} style={{ padding: '5px 12px', fontSize: '0.78rem', flexShrink: 0 }}>
              <Edit3 size={14} /> Edit Profile
            </button>
          </div>

          {/* Profile fields grid */}
          <div className="profile-info-list" style={{ marginBottom: 14 }}>
            {profileRows.map((r) => (
              <div key={r.key} className="profile-info-row" style={{ padding: '8px 0', fontSize: '0.82rem' }}>
                <span className="pi-key" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 6,
                      display: 'grid',
                      placeItems: 'center',
                      background: `${r.color}15`,
                      color: r.color,
                      border: `1px solid ${r.color}35`,
                      flexShrink: 0,
                    }}
                  >
                    <r.icon size={13} />
                  </span>
                  <span>{r.key}</span>
                </span>
                <span className="pi-val" style={{ fontSize: '0.82rem' }}>{r.val || '—'}</span>
              </div>
            ))}
          </div>

          {/* Document export bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--neutral-200)', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--neutral-500)' }}>
              Complete record: {donations.length} logged donation(s)
            </div>
            <button className="btn btn-ghost btn-sm" onClick={downloadCSV} style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
              <FileText size={14} /> Download CSV Report
            </button>
          </div>
        </div>

        {/* Right column: Digital Donor ID Card */}
        <div className="card card-pad" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0, boxSizing: 'border-box' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 6 }}>
            <h3 style={{ margin: 0, fontSize: '0.94rem' }}>Official Digital Donor Card</h3>
            <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>
              VERIFIED
            </span>
          </div>

          <div className="print-area" ref={printRef} style={{ width: '100%', maxWidth: 440, display: 'flex', justifyContent: 'center' }}>
            <DonorCardHTML user={currentUser} initials={initials} />
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 12, width: '100%', maxWidth: 440, flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-sm" onClick={downloadCard} style={{ flex: '1 1 140px', padding: '8px 12px', fontSize: '0.8rem', justifyContent: 'center' }}>
              <Download size={15} /> Download Card
            </button>
            <button className="btn btn-outline btn-sm" onClick={printCard} style={{ flex: '1 1 140px', padding: '8px 12px', fontSize: '0.8rem', justifyContent: 'center' }}>
              <Printer size={15} /> Print Card
            </button>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      <Modal
        open={editing}
        onClose={() => !saving && setEditing(false)}
        title="Edit Profile"
        footer={
          <>
            <button className="btn btn-ghost" disabled={saving} onClick={() => setEditing(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" disabled={saving} onClick={saveEdit}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        }
      >
        {form && (
          <form onSubmit={saveEdit} noValidate>
            <div className="form-group">
              <label htmlFor="efull">Full Name <span className="req">*</span></label>
              <input id="efull" className="input" value={form.fullName} onChange={set('fullName')} />
            </div>
            <div className="form-group">
              <label htmlFor="eemail">Email <span className="req">*</span></label>
              <input id="eemail" type="email" className="input" value={form.email} onChange={set('email')} />
            </div>
            <div className="form-group">
              <label htmlFor="ephone">Phone Number <span className="req">*</span></label>
              <input id="ephone" className="input" value={form.phone} onChange={set('phone')} />
            </div>
            <div className="form-group">
              <label htmlFor="eloc">Location <span className="req">*</span></label>
              <input id="eloc" className="input" value={form.location} onChange={set('location')} />
            </div>
            <div className="form-group">
              <label htmlFor="ebg">Blood Group</label>
              <select id="ebg" className="select" value={form.bloodGroup} onChange={set('bloodGroup')}>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="egen">Gender</label>
              <select id="egen" className="select" value={form.gender} onChange={set('gender')}>
                {['Male', 'Female', 'Other'].map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

// Donor card visual component (also used for print)
function DonorCardHTML({ user, initials }) {
  const bars = [4, 2, 5, 2, 3, 6, 2, 4, 3, 5, 2, 6, 4, 2, 5, 3, 4, 2, 6, 3, 5, 2, 4];
  const phone = user.phoneNumber || user.phone || '—';
  const location = user.cityLocation || user.location || '—';

  return (
    <div className="donor-card-premium">
      <div className="dcp-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 900, fontSize: 'clamp(1rem, 3.8vw, 1.25rem)' }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 4, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <Droplet size={18} fill="#e11d2a" color="#e11d2a" />
          </div>
          <span>DonorKonnect</span>
        </div>
        <div className="dcp-chip" style={{ flexShrink: 0 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
          <span>Verified ID</span>
        </div>
      </div>

      <div className="dcp-body">
        <div className="dcp-avatar-wrap" style={{ flexShrink: 0 }}>
          <div className="dcp-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={user.fullName} referrerPolicy="no-referrer" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div className="dcp-gold-seal" title="Gold Life-Saver Member">
            ★
          </div>
        </div>

        <div className="dcp-user-info" style={{ minWidth: 0 }}>
          <div className="dcp-name" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{user.fullName}</div>
          <div className="dcp-id-tag">ID: {user.id}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255,255,255,0.25)', padding: '2px 8px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 800 }}>
              Group: {user.bloodGroup}
            </span>
          </div>
        </div>
      </div>

      <div className="dcp-fields-grid">
        <div>
          <div className="dcp-field-label">Blood Type</div>
          <div className="dcp-field-val" style={{ fontSize: '1.15rem', color: '#fef08a' }}>{user.bloodGroup}</div>
        </div>
        <div>
          <div className="dcp-field-label">Gender</div>
          <div className="dcp-field-val">{user.gender || 'Female'}</div>
        </div>
        <div>
          <div className="dcp-field-label">Phone Contact</div>
          <div className="dcp-field-val" style={{ fontSize: '0.82rem', wordBreak: 'break-all' }}>{phone}</div>
        </div>
        <div>
          <div className="dcp-field-label">Metro Region</div>
          <div className="dcp-field-val" style={{ fontSize: '0.82rem' }}>{location}</div>
        </div>
      </div>

      <div className="dcp-barcode-strip">
        <div className="dcp-barcode" aria-hidden="true" style={{ overflow: 'hidden', maxWidth: '100%', flexShrink: 0 }}>
          {bars.map((b, idx) => (
            <div key={idx} className="dcp-bar" style={{ width: b, height: idx % 2 === 0 ? 22 : 18 }} />
          ))}
        </div>
        <div style={{ fontSize: '0.64rem', opacity: 0.85, textAlign: 'right', fontFamily: 'var(--font-mono)', lineHeight: 1.25 }}>
          <div>NATIONAL BLOOD TRANSFUSION</div>
          <div>EMERGENCY REGISTRY</div>
        </div>
      </div>
    </div>
  );
}

// Inline styles for downloaded card HTML
function getCardStyles() {
  return `
    :root{--primary-500:#e11d2a;--primary-700:#a01019;--primary-800:#841218}
    body{font-family:Inter,system-ui,sans-serif;margin:0;padding:24px}
    .donor-card-premium{width:440px;max-width:100%;border-radius:20px;background:linear-gradient(135deg,#841218 0%,#b91c1c 45%,#dc2626 80%,#ef4444 100%);color:#fff;padding:28px;position:relative;overflow:hidden;box-shadow:0 16px 36px rgba(132,18,24,0.35);border:1px solid rgba(255,255,255,0.3)}
    .donor-card-premium::before{content:'';position:absolute;top:-100px;right:-100px;width:260px;height:260px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,0.2) 0%,transparent 70%)}
    .dcp-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;position:relative;z-index:2}
    .dcp-chip{display:flex;align-items:center;gap:6px;font-size:0.75rem;letter-spacing:0.08em;text-transform:uppercase;background:rgba(255,255,255,0.15);padding:4px 10px;border-radius:6px;border:1px solid rgba(255,255,255,0.25)}
    .dcp-body{display:grid;grid-template-columns:84px 1fr;gap:20px;align-items:center;margin-bottom:20px;position:relative;z-index:2}
    .dcp-avatar-wrap{position:relative}
    .dcp-avatar{width:84px;height:84px;border-radius:50%;border:3px solid rgba(255,255,255,0.9);box-shadow:0 4px 14px rgba(0,0,0,0.2);display:grid;place-items:center;font-size:1.8rem;font-weight:800;background:rgba(255,255,255,0.2);color:#fff;overflow:hidden}
    .dcp-avatar img{width:100%;height:100%;object-fit:cover}
    .dcp-gold-seal{position:absolute;bottom:-4px;right:-4px;width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#fef08a,#f59e0b,#d97706);border:2px solid #fff;display:grid;place-items:center;color:#78350f;font-size:12px;box-shadow:0 2px 6px rgba(0,0,0,0.25)}
    .dcp-user-info{display:flex;flex-direction:column}
    .dcp-name{font-size:1.35rem;font-weight:800;letter-spacing:-0.01em;margin-bottom:2px}
    .dcp-id-tag{font-size:0.78rem;opacity:0.85;font-family:monospace;margin-bottom:8px}
    .dcp-fields-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;background:rgba(0,0,0,0.18);padding:12px 14px;border-radius:12px;border:1px solid rgba(255,255,255,0.15);position:relative;z-index:2;margin-bottom:16px}
    .dcp-field-label{font-size:0.65rem;text-transform:uppercase;letter-spacing:0.05em;opacity:0.75}
    .dcp-field-val{font-size:0.95rem;font-weight:700}
    .dcp-barcode-strip{display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px dashed rgba(255,255,255,0.3);position:relative;z-index:2}
    .dcp-barcode{display:flex;gap:2px;height:24px;align-items:flex-end}
    .dcp-bar{background:rgba(255,255,255,0.85);height:100%}
  `;
}