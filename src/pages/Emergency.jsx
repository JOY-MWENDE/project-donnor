// Emergency — live emergency requests list + create requests & GPS routing
import { useState, useEffect } from 'react';
import {
  PhoneCall,
  Droplet,
  Building2,
  MapPin,
  Package,
  AlertTriangle,
  Navigation,
  Compass,
  Loader2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../auth';
import { useToast } from '../toast';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import HospitalGpsModal from '../components/HospitalGpsModal';
import { addNotification } from '../store';
import { getHospitalLocation, getNavigationUrls } from '../data/hospitals';
import { getEmergencies, createEmergency } from '../service/emergencyService'; // Adjust to ../services/emergencyService if using plural

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const URGENCIES = ['Critical', 'Urgent', 'Normal'];

export default function Emergency() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'post'
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    bloodGroup: '',
    hospital: '',
    location: '',
    units: '',
    urgency: 'Urgent',
    contact: '',
    info: '',
  });
  const [errors, setErrors] = useState({});
  const [detail, setDetail] = useState(null);
  const [respond, setRespond] = useState(null);
  const [gpsTarget, setGpsTarget] = useState(null);

  const fetchLiveEmergencies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEmergencies(true);

      // Normalize live backend emergency model to match UI requirements
      const normalized = (Array.isArray(data) ? data : []).map((em) => ({
        id: em.id,
        hospital: em.hospitalName || em.hospital || 'Hospital Facility',
        bloodGroup: em.bloodGroup || '—',
        units: em.unitsRequired || em.units || 1,
        urgency: em.urgencyLevel || em.urgency || 'URGENT',
        location: em.location || '—',
        contact: em.contactNumber || em.contact || '—',
        status: em.status || 'ACTIVE',
        date: em.createdAt ? new Date(em.createdAt).toISOString().slice(0, 10) : 'Active',
        info: em.info || '',
      }));

      setEmergencies(normalized);
    } catch (err) {
      const msg = err.message || 'Unable to retrieve live emergency blood requests.';
      setError(msg);
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveEmergencies();
  }, []);

  if (!user) return null;

  const openGps = (hospital, location, request = null) => {
    setGpsTarget({ hospital, location, request });
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.bloodGroup) e.bloodGroup = 'Blood group is required.';
    if (!form.hospital.trim()) e.hospital = 'Hospital is required.';
    if (!form.location.trim()) e.location = 'Location is required.';
    if (!form.units || Number(form.units) < 1) e.units = 'Units needed is required.';
    if (!form.urgency) e.urgency = 'Urgency level is required.';
    if (!form.contact.trim()) e.contact = 'Contact number is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) {
      toast('Please fill in all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        hospitalUserId: user.id,
        hospitalName: form.hospital.trim(),
        bloodGroup: form.bloodGroup,
        unitsRequired: parseInt(form.units, 10),
        location: form.location.trim(),
        contactNumber: form.contact.trim(),
        urgencyLevel: form.urgency.toUpperCase(),
      };

      const res = await createEmergency(payload);

      addNotification({
        title: 'Emergency Blood Request Posted',
        message: `Your ${form.urgency.toLowerCase()} request for ${form.bloodGroup} blood at ${form.hospital} has been broadcasted.`,
        type: 'emergency',
      });

      toast(res?.message || 'Emergency blood request broadcasted successfully.', 'success');
      setForm({ bloodGroup: '', hospital: '', location: '', units: '', urgency: 'Urgent', contact: '', info: '' });
      setActiveTab('list');
      await fetchLiveEmergencies();
    } catch (err) {
      toast(err.message || 'Failed to post emergency blood request.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRespond = () => {
    if (!user.available) {
      toast('You must be marked as available to respond. Go to Donate to update your status.', 'error');
      return;
    }

    // Normalized matching for relaxed blood group checks
    const userBg = String(user.bloodGroup || '').toUpperCase();
    const reqBg = String(respond.bloodGroup || '').toUpperCase();

    if (userBg !== reqBg && !userBg.startsWith(reqBg)) {
      toast(`Your blood group (${user.bloodGroup}) does not match the request (${respond.bloodGroup}).`, 'error');
      return;
    }

    const currentRespond = respond;
    addNotification({
      title: 'Emergency Response Confirmed',
      message: `You have responded to the ${currentRespond.urgency.toLowerCase()} request for ${currentRespond.bloodGroup} blood at ${currentRespond.hospital}. Please contact ${currentRespond.contact}.`,
      type: 'success',
    });

    toast(`Response confirmed! Opening GPS navigation to ${currentRespond.hospital}...`, 'success');
    setRespond(null);

    setGpsTarget({
      hospital: currentRespond.hospital,
      location: currentRespond.location,
      request: currentRespond,
    });
  };

  return (
    <div>
      {/* Visual Emergency Trauma Dispatch Banner */}
      <div
        className="card section-gap"
        style={{
          background: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 60%, #31101e 100%)',
          color: '#fff',
          borderRadius: 12,
          overflow: 'hidden',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          boxShadow: '0 4px 16px rgba(220, 38, 38, 0.18)',
          padding: '8px 14px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'center' }} className="emergency-banner-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} className="bhr-pulse-dot" />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <h2 style={{ color: '#fff', fontSize: '1rem', fontWeight: 800, margin: 0 }}>
                  24/7 Trauma &amp; Emergency Blood Dispatch
                </h2>
                <span style={{ fontSize: '0.62rem', fontWeight: 700, background: 'rgba(239,68,68,0.25)', border: '1px solid #ef4444', color: '#fca5a5', padding: '1px 6px', borderRadius: 999 }}>
                  LIVE
                </span>
              </div>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.74rem', margin: '0 0 6px' }}>
              Urgent blood requests connected directly to registered local donors across verified partner hospitals.
            </p>

            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center', padding: '1px 6px', background: 'rgba(255,255,255,0.06)', borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f87171' }}>&lt; 15 min</span>
                <span style={{ display: 'block', fontSize: '0.58rem', color: '#94a3b8' }}>Avg. Response</span>
              </div>
              <div style={{ textAlign: 'center', padding: '1px 6px', background: 'rgba(255,255,255,0.06)', borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#4ade80' }}>100% Free</span>
                <span style={{ display: 'block', fontSize: '0.58rem', color: '#94a3b8' }}>Verified ICUs</span>
              </div>
              <div style={{ textAlign: 'center', padding: '1px 6px', background: 'rgba(255,255,255,0.06)', borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8' }}>48+</span>
                <span style={{ display: 'block', fontSize: '0.58rem', color: '#94a3b8' }}>Hospitals</span>
              </div>
            </div>
          </div>

          <div
            className="eb-image-wrap"
            style={{
              width: 110,
              height: 72,
              borderRadius: 8,
              overflow: 'hidden',
              position: 'relative',
              border: '1.5px solid rgba(239, 68, 68, 0.45)',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
              flexShrink: 0,
            }}
          >
            <img
              src="/images/emergency-dispatch.jpg"
              alt="Emergency trauma dispatch"
              referrerPolicy="no-referrer"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(15, 23, 42, 0.8) 0%, transparent 60%)',
              }}
            />
            <span
              style={{
                position: 'absolute',
                bottom: 3,
                left: 4,
                fontSize: '0.55rem',
                color: '#fca5a5',
                fontWeight: 800,
                letterSpacing: '0.04em',
              }}
            >
              AMBULANCE
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'inline-flex', background: 'rgba(15, 23, 42, 0.6)', padding: 3, borderRadius: 10, backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('list')}
            style={{
              padding: '6px 16px',
              borderRadius: 8,
              fontSize: '0.82rem',
              fontWeight: 700,
              color: activeTab === 'list' ? '#ffffff' : '#94a3b8',
              background: activeTab === 'list' ? 'var(--primary-600)' : 'transparent',
              transition: 'all 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>Active Requests</span>
            <span style={{ background: activeTab === 'list' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)', padding: '1px 6px', borderRadius: 999, fontSize: '0.7rem' }}>
              {emergencies.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('post')}
            style={{
              padding: '6px 16px',
              borderRadius: 8,
              fontSize: '0.82rem',
              fontWeight: 700,
              color: activeTab === 'post' ? '#ffffff' : '#94a3b8',
              background: activeTab === 'post' ? 'var(--primary-600)' : 'transparent',
              transition: 'all 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <AlertTriangle size={14} />
            <span>+ Post Emergency Request</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            className="btn btn-outline btn-sm"
            onClick={fetchLiveEmergencies}
            disabled={loading}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px' }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          {activeTab === 'list' && (
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => setActiveTab('post')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', fontSize: '0.8rem' }}
            >
              <PhoneCall size={14} />
              <span>Create New Request</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Active Requests List */}
      {activeTab === 'list' && (
        <div>
          {loading ? (
            <div
              className="card card-pad"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px 16px',
                gap: 12,
              }}
            >
              <Loader2 size={32} className="animate-spin" color="var(--primary-600)" />
              <span style={{ fontSize: '0.86rem', color: 'var(--neutral-500)' }}>
                Retrieving active emergency blood requests...
              </span>
            </div>
          ) : error ? (
            <div
              className="card card-pad"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '36px 16px',
                gap: 10,
                textAlign: 'center',
              }}
            >
              <AlertCircle size={36} color="var(--danger-500, #ef4444)" />
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--neutral-800)' }}>{error}</p>
              <button className="btn btn-outline btn-sm" onClick={fetchLiveEmergencies}>
                Try Again
              </button>
            </div>
          ) : emergencies.length === 0 ? (
            <div className="card card-pad empty-state">
              <Droplet size={38} className="es-icon" color="var(--neutral-400)" />
              <p style={{ margin: 0 }}>No active emergency requests right now.</p>
            </div>
          ) : (
            <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 10 }}>
              {emergencies.map((em) => (
                <div key={em.id} className="emergency-card" style={{ padding: '12px 14px' }}>
                  <div className="ec-top" style={{ marginBottom: 8 }}>
                    <div className="ec-blood" style={{ width: 36, height: 36, fontSize: '0.9rem' }}>
                      {em.bloodGroup}
                    </div>
                    <StatusBadge status={em.urgency} label={em.urgency.toUpperCase()} />
                  </div>
                  <div className="ec-info" style={{ gap: 4, fontSize: '0.8rem' }}>
                    <div className="ec-row">
                      <span className="ec-key">
                        <Building2 size={13} /> Hospital
                      </span>
                      <span
                        className="ec-val"
                        onClick={() => openGps(em.hospital, em.location, em)}
                        style={{ cursor: 'pointer', color: 'var(--primary-700)', display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 600 }}
                        title="Click to view hospital GPS location"
                      >
                        <span>{em.hospital}</span>
                        <Navigation size={11} color="var(--primary-600)" />
                      </span>
                    </div>
                    <div className="ec-row">
                      <span className="ec-key">
                        <MapPin size={13} /> Location
                      </span>
                      <span className="ec-val">{em.location}</span>
                    </div>
                    <div className="ec-row">
                      <span className="ec-key">
                        <Package size={13} /> Units
                      </span>
                      <span className="ec-val">{em.units} Unit(s)</span>
                    </div>
                    <div className="ec-row">
                      <span className="ec-key">
                        <PhoneCall size={13} /> Contact
                      </span>
                      <span className="ec-val">{em.contact}</span>
                    </div>
                  </div>
                  <div className="ec-actions" style={{ marginTop: 10, paddingTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button className="btn btn-primary btn-sm" onClick={() => setRespond(em)} style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                      Respond
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => openGps(em.hospital, em.location, em)}
                      style={{ padding: '4px 8px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: 4, color: '#0369a1', borderColor: '#7dd3fc' }}
                      title="Hospital GPS & Turn-by-Turn Route"
                    >
                      <Navigation size={12} /> GPS Route
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setDetail(em)} style={{ padding: '4px 8px', fontSize: '0.78rem' }}>
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Post Request Form */}
      {activeTab === 'post' && (
        <div className="card card-pad">
          <div className="flex items-center gap-3 mb-4">
            <div className="dc-icon" style={{ background: 'var(--error-50)', color: 'var(--error-500)', margin: 0, width: 36, height: 36, borderRadius: 8 }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 style={{ marginBottom: 0, fontSize: '1rem' }}>Post a Blood Request</h3>
              <p className="text-muted" style={{ margin: 0, fontSize: '0.78rem' }}>
                Fill in details to alert matching donors immediately.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
              <div className="form-group" style={{ marginBottom: 10 }}>
                <label htmlFor="bg" style={{ fontSize: '0.78rem' }}>Blood Group Needed <span className="req">*</span></label>
                <select id="bg" disabled={submitting} className={`select ${errors.bloodGroup ? 'error' : ''}`} value={form.bloodGroup} onChange={set('bloodGroup')}>
                  <option value="">Select blood group</option>
                  {BLOOD_GROUPS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                {errors.bloodGroup && <div className="form-error">{errors.bloodGroup}</div>}
              </div>

              <div className="form-group" style={{ marginBottom: 10 }}>
                <label htmlFor="hosp" style={{ fontSize: '0.78rem' }}>Hospital <span className="req">*</span></label>
                <input id="hosp" disabled={submitting} className={`input ${errors.hospital ? 'error' : ''}`} placeholder="Hospital name" value={form.hospital} onChange={set('hospital')} />
                {errors.hospital && <div className="form-error">{errors.hospital}</div>}
              </div>

              <div className="form-group" style={{ marginBottom: 10 }}>
                <label htmlFor="loc" style={{ fontSize: '0.78rem' }}>Location <span className="req">*</span></label>
                <input id="loc" disabled={submitting} className={`input ${errors.location ? 'error' : ''}`} placeholder="City / Area" value={form.location} onChange={set('location')} />
                {errors.location && <div className="form-error">{errors.location}</div>}
              </div>

              <div className="form-group" style={{ marginBottom: 10 }}>
                <label htmlFor="units" style={{ fontSize: '0.78rem' }}>Units Needed <span className="req">*</span></label>
                <input id="units" disabled={submitting} type="number" min="1" className={`input ${errors.units ? 'error' : ''}`} placeholder="e.g. 3" value={form.units} onChange={set('units')} />
                {errors.units && <div className="form-error">{errors.units}</div>}
              </div>

              <div className="form-group" style={{ marginBottom: 10 }}>
                <label htmlFor="urgency" style={{ fontSize: '0.78rem' }}>Urgency <span className="req">*</span></label>
                <select id="urgency" disabled={submitting} className={`select ${errors.urgency ? 'error' : ''}`} value={form.urgency} onChange={set('urgency')}>
                  {URGENCIES.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
                {errors.urgency && <div className="form-error">{errors.urgency}</div>}
              </div>

              <div className="form-group" style={{ marginBottom: 10 }}>
                <label htmlFor="contact" style={{ fontSize: '0.78rem' }}>Contact Number <span className="req">*</span></label>
                <input id="contact" disabled={submitting} className={`input ${errors.contact ? 'error' : ''}`} placeholder="07XXXXXXXX" value={form.contact} onChange={set('contact')} />
                {errors.contact && <div className="form-error">{errors.contact}</div>}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 12 }}>
              <label htmlFor="info" style={{ fontSize: '0.78rem' }}>Additional Patient Notes</label>
              <textarea id="info" disabled={submitting} className="textarea" rows={2} placeholder="Any specific requirements or emergency notes..." value={form.info} onChange={set('info')} />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-danger"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  opacity: submitting ? 0.75 : 1,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                }}
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <PhoneCall size={16} />}
                <span>{submitting ? 'Broadcasting Request...' : 'Broadcast Emergency Blood Request'}</span>
              </button>
              <button
                type="button"
                disabled={submitting}
                className="btn btn-ghost"
                onClick={() => setActiveTab('list')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Detail Modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title="Emergency Request Details" footer={<button className="btn btn-primary" onClick={() => setDetail(null)}>Close</button>}>
        {detail && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="ec-blood" style={{ width: 56, height: 56, fontSize: '1.1rem' }}>
                {detail.bloodGroup}
              </div>
              <StatusBadge status={detail.urgency} label={detail.urgency.toUpperCase()} />
            </div>
            <div className="profile-info-list">
              <div className="profile-info-row"><span className="pi-key">Hospital</span><span className="pi-val">{detail.hospital}</span></div>
              <div className="profile-info-row"><span className="pi-key">Location</span><span className="pi-val">{detail.location}</span></div>
              <div className="profile-info-row"><span className="pi-key">Units Needed</span><span className="pi-val">{detail.units}</span></div>
              <div className="profile-info-row"><span className="pi-key">Contact</span><span className="pi-val">{detail.contact}</span></div>
              <div className="profile-info-row"><span className="pi-key">Urgency</span><span className="pi-val">{detail.urgency}</span></div>
              <div className="profile-info-row"><span className="pi-key">Date Posted</span><span className="pi-val">{detail.date}</span></div>
            </div>
            {detail.info && <p className="text-muted mt-4" style={{ lineHeight: 1.6 }}>{detail.info}</p>}

            <div
              style={{
                marginTop: 16,
                padding: '12px 14px',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                borderRadius: 8,
                border: '1px solid #bbf7d0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: '#dcfce7', display: 'grid', placeItems: 'center', color: '#15803d' }}>
                  <Navigation size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#14532d' }}>
                    Hospital GPS Location & Trauma Gate
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#166534' }}>
                    Interactive map, turn-by-turn navigation & blood bank wing.
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  const h = detail;
                  setDetail(null);
                  openGps(h.hospital, h.location, h);
                }}
                style={{
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#15803d',
                  borderColor: '#15803d',
                }}
              >
                <Navigation size={13} /> View GPS Route & Map
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Respond Modal */}
      <Modal
        open={!!respond}
        onClose={() => setRespond(null)}
        title="Respond to Emergency Request"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setRespond(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleRespond}>Confirm Response & Route</button>
          </>
        }
      >
        {respond && (() => {
          const hospData = getHospitalLocation(respond.hospital, respond.location);
          const navUrls = getNavigationUrls(hospData);
          return (
            <div>
              <p className="mb-3" style={{ fontSize: '0.88rem' }}>
                You are about to respond to a <strong>{respond.urgency.toLowerCase()}</strong> blood request:
              </p>
              <div className="profile-info-list">
                <div className="profile-info-row"><span className="pi-key">Blood Group</span><span className="pi-val">{respond.bloodGroup}</span></div>
                <div className="profile-info-row"><span className="pi-key">Hospital</span><span className="pi-val">{respond.hospital}</span></div>
                <div className="profile-info-row"><span className="pi-key">Location</span><span className="pi-val">{respond.location}</span></div>
                <div className="profile-info-row"><span className="pi-key">Contact</span><span className="pi-val">{respond.contact}</span></div>
              </div>

              <div
                style={{
                  marginTop: 14,
                  padding: '12px 14px',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  borderRadius: 10,
                  border: '1.5px solid #cbd5e1',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: '0.84rem', color: 'var(--neutral-900)' }}>
                    <Navigation size={15} color="#dc2626" />
                    <span>Hospital Destination & GPS Location</span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      color: '#15803d',
                      background: '#dcfce7',
                      border: '1px solid #86efac',
                      padding: '2px 8px',
                      borderRadius: 999,
                      fontWeight: 700,
                    }}
                  >
                    GPS VERIFIED
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--neutral-800)', marginBottom: 4 }}>
                  <strong>Address:</strong> {hospData.address}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--neutral-600)', marginBottom: 8 }}>
                  <strong>Unit:</strong> {hospData.bloodBankUnit} · <strong>Gate:</strong> {hospData.gate}
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => openGps(respond.hospital, respond.location, respond)}
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.76rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      background: '#fff',
                      borderColor: '#0284c7',
                      color: '#0369a1',
                    }}
                  >
                    <Compass size={13} /> View Interactive Map & Directions
                  </button>
                  <a
                    href={navUrls.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-primary"
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.76rem',
                      background: '#15803d',
                      borderColor: '#15803d',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Navigation size={13} /> Google Maps (Drive)
                  </a>
                </div>
              </div>

              <div className="card" style={{ background: 'var(--neutral-50)', padding: 12, marginTop: 12, borderColor: 'var(--neutral-200)' }}>
                <div className="text-sm text-muted">
                  Your blood group: <strong style={{ color: 'var(--primary-600)' }}>{user.bloodGroup}</strong> · Status: <strong>{user.available ? 'Available' : 'Unavailable'}</strong>
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Hospital GPS Location & Turn-by-Turn Navigation Modal */}
      <HospitalGpsModal
        open={!!gpsTarget}
        onClose={() => setGpsTarget(null)}
        hospitalName={gpsTarget?.hospital}
        locationName={gpsTarget?.location}
        emergencyRequest={gpsTarget?.request}
        user={user}
      />
    </div>
  );
}