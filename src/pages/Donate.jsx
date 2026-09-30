// Donate page — availability toggle + donation recording form with live API
import { useState } from 'react';
import { Droplet, CheckCircle2, Navigation, Loader2 } from 'lucide-react';
import { useAuth } from '../auth';
import { useToast } from '../toast';
import StatusBadge from '../components/StatusBadge';
import HospitalGpsModal from '../components/HospitalGpsModal';
import { addDonation, addNotification, formatDate, eligibleDate } from '../store';
import { recordDonation } from '../service/donationService'; // Adjust path if located in ../donationService

const HOSPITALS = [
  'Kenyatta',
  'Kenyatta National Hospital',
  'Aga Khan University Hospital',
  'Mater Hospital',
  'Nairobi Hospital',
  'Mama Lucy Kibaki Hospital',
  'Karen Hospital',
  'Other',
];

export default function Donate() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState({
    hospital: '',
    date: '',
    time: '',
    bloodGroup: user?.bloodGroup || 'O+',
    units: 1,
    location: user?.cityLocation || user?.location || '',
  });
  const [errors, setErrors] = useState({});
  const [gpsModal, setGpsModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!user) return null;

  const toggleAvailability = () => {
    const updated = { ...user, available: !user.available };
    updateProfile(updated);
    toast(
      `Your donation availability has been updated to ${updated.available ? 'Available' : 'Unavailable'}.`,
      'success'
    );
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.hospital) e.hospital = 'Please select a hospital.';
    if (!form.date) e.date = 'Donation date is required.';
    if (!form.time) e.time = 'Donation time is required.';
    if (!form.bloodGroup) e.bloodGroup = 'Blood group is required.';
    if (!form.units || Number(form.units) < 1) e.units = 'Units must be at least 1.';
    if (!form.location.trim()) e.location = 'Location is required.';
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
      // 1. Submit to the live API
      const response = await recordDonation({
        userId: user.id,
        hospital: form.hospital,
        donationDate: form.date,
        donationTime: form.time,
        bloodGroup: form.bloodGroup,
        unitsDonated: form.units,
        location: form.location.trim(),
      });

      const serverData = response.data || {};
      const nextEligible = serverData.nextEligibleDate || form.date;

      // 2. Synchronize local store and user state
      addDonation({
        id: serverData.id || Date.now(),
        hospital: form.hospital,
        date: form.date,
        time: form.time,
        bloodGroup: form.bloodGroup,
        units: Number(form.units),
        location: form.location,
        status: serverData.status || 'CONFIRMED',
      });

      const updated = {
        ...user,
        lastDonation: form.date,
        nextEligibleDate: nextEligible,
        available: false,
      };
      updateProfile(updated);

      addNotification({
        title: 'Successful Donation',
        message: `Your donation of ${form.units} unit(s) of ${form.bloodGroup} blood at ${form.hospital} has been recorded. Next eligible donation: ${nextEligible}. Thank you!`,
        type: 'success',
      });

      toast(response.message || 'Your donation has been recorded successfully.', 'success');

      // Reset form
      setForm({
        hospital: '',
        date: '',
        time: '',
        bloodGroup: user.bloodGroup || 'O+',
        units: 1,
        location: user.cityLocation || user.location || '',
      });
      setErrors({});
    } catch (err) {
      toast(err.message || 'Failed to submit donation. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const nextEligible = user.nextEligibleDate || eligibleDate(user.lastDonation);

  return (
    <div>
      {/* Compact Availability & Eligibility Strip */}
      <div
        className="card section-gap"
        style={{
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--neutral-600)', fontWeight: 600 }}>Your Status:</span>
            <StatusBadge status={user.available ? 'available' : 'unavailable'} label={user.available ? 'AVAILABLE' : 'RESTING'} />
          </div>
          <button
            className={`btn btn-sm ${user.available ? 'btn-outline' : 'btn-success'}`}
            onClick={toggleAvailability}
            style={{ padding: '4px 10px', fontSize: '0.78rem' }}
          >
            <CheckCircle2 size={15} /> {user.available ? 'Set Unavailable' : 'Set Available'}
          </button>
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--neutral-600)', display: 'flex', gap: 16 }}>
          {user.lastDonation && (
            <span>Last: <strong style={{ color: 'var(--neutral-900)' }}>{formatDate(user.lastDonation)}</strong></span>
          )}
          <span>Next Eligible: <strong style={{ color: 'var(--primary-700)' }}>{formatDate(nextEligible)}</strong></span>
        </div>
      </div>

      {/* 2-Column Main Workspace */}
      <div className="dash-columns">
        {/* Left Column: Record a Donation Form */}
        <div className="card card-pad">
          <div className="flex items-center gap-3 mb-3">
            <div className="dc-icon" style={{ background: 'var(--primary-50)', color: 'var(--primary-500)', margin: 0, width: 34, height: 34, borderRadius: 8 }}>
              <Droplet size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '0.98rem' }}>Record a Donation</h3>
              <p className="text-muted" style={{ margin: 0, fontSize: '0.76rem' }}>Log blood units donated at verified hospital centers.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 10 }}>
              <div className="form-group" style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                  <label htmlFor="hospital" style={{ fontSize: '0.78rem' }}>Hospital <span className="req">*</span></label>
                  {form.hospital && (
                    <button
                      type="button"
                      onClick={() => setGpsModal(true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary-600)',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 3,
                        padding: 0,
                      }}
                      title="Open hospital GPS & directions"
                    >
                      <Navigation size={11} /> View GPS & Route
                    </button>
                  )}
                </div>
                <select
                  id="hospital"
                  disabled={submitting}
                  className={`select ${errors.hospital ? 'error' : ''}`}
                  value={form.hospital}
                  onChange={set('hospital')}
                >
                  <option value="">Select hospital</option>
                  {HOSPITALS.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
                {errors.hospital && <div className="form-error">{errors.hospital}</div>}
              </div>

              <div className="form-group" style={{ marginBottom: 8 }}>
                <label htmlFor="date" style={{ fontSize: '0.78rem' }}>Donation Date <span className="req">*</span></label>
                <input
                  id="date"
                  type="date"
                  disabled={submitting}
                  className={`input ${errors.date ? 'error' : ''}`}
                  value={form.date}
                  onChange={set('date')}
                  max={new Date().toISOString().slice(0, 10)}
                />
                {errors.date && <div className="form-error">{errors.date}</div>}
              </div>

              <div className="form-group" style={{ marginBottom: 8 }}>
                <label htmlFor="time" style={{ fontSize: '0.78rem' }}>Donation Time <span className="req">*</span></label>
                <input
                  id="time"
                  type="time"
                  disabled={submitting}
                  className={`input ${errors.time ? 'error' : ''}`}
                  value={form.time}
                  onChange={set('time')}
                />
                {errors.time && <div className="form-error">{errors.time}</div>}
              </div>

              <div className="form-group" style={{ marginBottom: 8 }}>
                <label htmlFor="bloodGroup" style={{ fontSize: '0.78rem' }}>Blood Group <span className="req">*</span></label>
                <select
                  id="bloodGroup"
                  disabled={submitting}
                  className={`select ${errors.bloodGroup ? 'error' : ''}`}
                  value={form.bloodGroup}
                  onChange={set('bloodGroup')}
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
                {errors.bloodGroup && <div className="form-error">{errors.bloodGroup}</div>}
              </div>

              <div className="form-group" style={{ marginBottom: 8 }}>
                <label htmlFor="units" style={{ fontSize: '0.78rem' }}>Units Donated <span className="req">*</span></label>
                <input
                  id="units"
                  type="number"
                  min="1"
                  max="5"
                  disabled={submitting}
                  className={`input ${errors.units ? 'error' : ''}`}
                  value={form.units}
                  onChange={set('units')}
                />
                {errors.units && <div className="form-error">{errors.units}</div>}
              </div>

              <div className="form-group" style={{ marginBottom: 8 }}>
                <label htmlFor="location" style={{ fontSize: '0.78rem' }}>Location <span className="req">*</span></label>
                <input
                  id="location"
                  disabled={submitting}
                  className={`input ${errors.location ? 'error' : ''}`}
                  placeholder="City or neighborhood"
                  value={form.location}
                  onChange={set('location')}
                />
                {errors.location && <div className="form-error">{errors.location}</div>}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{
                marginTop: 8,
                padding: '7px 18px',
                fontSize: '0.84rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Droplet size={16} />}
              {submitting ? 'Recording Donation...' : 'Submit Donation'}
            </button>
          </form>
        </div>

        {/* Right Column: Preparation & Safety Guide */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div
            className="card"
            style={{
              overflow: 'hidden',
              borderRadius: 12,
              border: '1px solid var(--neutral-200)',
              background: '#fff',
              boxShadow: '0 3px 12px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ height: 100, position: 'relative', overflow: 'hidden' }}>
              <img
                src="/images/donation-process.jpg"
                alt="Sterile blood collection process in clinical hospital"
                referrerPolicy="no-referrer"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(15, 23, 42, 0.75) 0%, transparent 60%)',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: 6,
                  left: 8,
                  color: '#fff',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <CheckCircle2 size={12} color="#4ade80" /> Certified Sterile Equipment
              </span>
            </div>
            <div style={{ padding: '8px 12px' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--neutral-700)', lineHeight: 1.4 }}>
                Single-use certified medical equipment handled by registered phlebotomists.
              </div>
            </div>
          </div>

          <div className="card card-pad" style={{ background: 'rgba(255,255,255,0.95)', padding: '10px 14px' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '0.88rem', color: 'var(--neutral-800)' }}>
              Donor Safety &amp; Prep Steps
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', background: 'var(--neutral-50)', borderRadius: 6, border: '1px solid var(--neutral-200)' }}>
                <span style={{ fontSize: '1rem', width: 22, textAlign: 'center' }}>💧</span>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-900)' }}>1. Hydrate (500ml Water)</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--neutral-500)' }}>Supports healthy blood volume during extraction.</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', background: 'var(--neutral-50)', borderRadius: 6, border: '1px solid var(--neutral-200)' }}>
                <span style={{ fontSize: '1rem', width: 22, textAlign: 'center' }}>🥗</span>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-900)' }}>2. Iron-Rich Nourishment</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--neutral-500)' }}>Eat wholesome meals 2–3 hours before donating.</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', background: 'var(--neutral-50)', borderRadius: 6, border: '1px solid var(--neutral-200)' }}>
                <span style={{ fontSize: '1rem', width: 22, textAlign: 'center' }}>🩸</span>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-900)' }}>3. Donation (~10–15 mins)</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--neutral-500)' }}>Relax under professional, sterile nursing care.</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', background: 'var(--neutral-50)', borderRadius: 6, border: '1px solid var(--neutral-200)' }}>
                <span style={{ fontSize: '1rem', width: 22, textAlign: 'center' }}>🍪</span>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-900)' }}>4. Snack & Rest (10 mins)</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--neutral-500)' }}>Enjoy juice and fruit cookies to recover vigor.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hospital GPS Location & Route Modal */}
      <HospitalGpsModal
        open={gpsModal}
        onClose={() => setGpsModal(false)}
        hospitalName={form.hospital || 'Kenyatta'}
        locationName={form.location || user.location}
        user={user}
      />
    </div>
  );
}