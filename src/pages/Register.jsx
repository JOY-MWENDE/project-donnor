// Register page — rich registration with vector art & comprehensive donor profiling
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Droplet, User, Mail, Lock, Phone, MapPin, Loader2 } from 'lucide-react';
import { useAuth } from '../auth';
import { useToast } from '../toast';
import { registerUser } from '../service/registration'; // Adjust path if located in ../registration

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = ['Male', 'Female', 'Other'];

export default function Register() {
  const { login } = useAuth(); // Or local session setter if needed
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirm: '',
    bloodGroup: '',
    gender: '',
    phone: '',
    location: '',
  });
  const [showPwd, setShowPwd] = useState(false);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required.';
    if (!form.email) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address.';
    if (!form.password) e.password = 'Password is required.';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters.';
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match.';
    if (!form.bloodGroup) e.bloodGroup = 'Please select your blood group.';
    if (!form.gender) e.gender = 'Please select your gender.';
    if (!form.phone.trim()) e.phone = 'Phone number is required.';
    if (!form.location.trim()) e.location = 'Location is required.';
    if (!agree) e.agree = 'You must accept the terms and conditions.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) {
      toast('Please fill in all required fields.', 'error');
      return;
    }

    setLoading(true);

    try {
      // Map UI state keys to the exact backend payload parameters
      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        bloodGroup: form.bloodGroup,
        gender: form.gender,
        phoneNumber: form.phone.trim(),
        cityLocation: form.location.trim(),
      };

      const createdUser = await registerUser(payload);

      toast('Account created successfully! Welcome to DonorKonnect.', 'success');

      // If useAuth has login/session setup, you can seed it or direct to login
      if (login) {
        login(createdUser);
      }

      navigate('/dashboard');
    } catch (err) {
      toast(err.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputIcon = (Icon) => (
    <Icon size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--neutral-400)' }} />
  );

  return (
    <div className="auth-page">
      <aside className="auth-aside">
        <div className="aside-brand">
          <div className="brand-mark" style={{ boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}>
            <Droplet size={28} fill="#fff" color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em' }}>DonorKonnect</div>
            <div style={{ fontSize: '0.82rem', opacity: 0.85 }}>Connecting Blood Donors. Saving Lives.</div>
          </div>
        </div>

        <div style={{ margin: '18px 0' }}>
          <div
            style={{
              position: 'relative',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 16px 36px rgba(0, 0, 0, 0.35)',
              border: '1.5px solid rgba(255, 255, 255, 0.25)',
              height: 190,
            }}
          >
            <img
              src="/images/lifesaver-care.jpg"
              alt="Compassionate healthcare hands giving support"
              referrerPolicy="no-referrer"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(15, 23, 42, 0.8) 0%, transparent 50%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 10,
                left: 12,
                right: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '0.74rem', color: '#fff', fontWeight: 700 }}>
                Join the Lifesaver Community
              </span>
              <span style={{ fontSize: '0.68rem', color: '#4ade80', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>
                ● 100% Free
              </span>
            </div>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 8 }}>
            Become a Verified Lifesaver
          </h2>
          <p className="aside-quote" style={{ opacity: 0.9 }}>
            Join thousands of voluntary donors who stand ready to give blood when emergencies strike. Registering takes less than 2 minutes.
          </p>
        </div>

        <div className="aside-stats" style={{ paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <div>
            <div className="stat-num">8</div>
            <div className="stat-label">Blood Types</div>
          </div>
          <div>
            <div className="stat-num">24/7</div>
            <div className="stat-label">Support</div>
          </div>
          <div>
            <div className="stat-num">100%</div>
            <div className="stat-label">Free Service</div>
          </div>
        </div>
      </aside>

      <div className="auth-form-side">
        <form
          className="form-card"
          onSubmit={handleSubmit}
          noValidate
          style={{
            maxWidth: 520,
            background: '#ffffff',
            padding: 'clamp(20px, 4vw, 32px)',
            borderRadius: '20px',
            boxShadow: '0 20px 48px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
            border: '1px solid var(--neutral-200)',
          }}
        >
          <div className="auth-brand-mobile">
            <div className="brand-name" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Droplet size={24} fill="var(--primary-600)" color="var(--primary-600)" />
              <span>DonorKonnect</span>
            </div>
            <div className="text-muted text-sm" style={{ marginBottom: 10 }}>Connecting Blood Donors. Saving Lives.</div>
            <div style={{ borderRadius: 12, overflow: 'hidden', height: 100, marginBottom: 12, border: '1px solid var(--neutral-200)', position: 'relative' }}>
              <img src="/images/lifesaver-care.jpg" alt="Donor care" referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <span style={{ position: 'absolute', bottom: 5, left: 8, fontSize: '0.66rem', fontWeight: 800, background: 'rgba(15,23,42,0.85)', color: '#fff', padding: '1px 6px', borderRadius: 4 }}>
                Lifesaver Community
              </span>
            </div>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 4, color: 'var(--neutral-900)' }}>
            Create Donor Account
          </h1>
          <p className="text-muted mb-6">Join the donor network and help patients in need.</p>

          <div className="form-group">
            <label htmlFor="fullName">Full Name <span className="req">*</span></label>
            <div className="password-wrap">
              {inputIcon(User)}
              <input
                id="fullName"
                disabled={loading}
                className={`input ${errors.fullName ? 'error' : ''}`}
                style={{ paddingLeft: 42, height: 44 }}
                placeholder="Joy Mwende"
                value={form.fullName}
                onChange={set('fullName')}
              />
            </div>
            {errors.fullName && <div className="form-error">{errors.fullName}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address <span className="req">*</span></label>
            <div className="password-wrap">
              {inputIcon(Mail)}
              <input
                id="email"
                type="email"
                disabled={loading}
                className={`input ${errors.email ? 'error' : ''}`}
                style={{ paddingLeft: 42, height: 44 }}
                placeholder="you@example.com"
                value={form.email}
                onChange={set('email')}
              />
            </div>
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label htmlFor="password">Password <span className="req">*</span></label>
              <div className="password-wrap">
                {inputIcon(Lock)}
                <input
                  id="password"
                  disabled={loading}
                  type={showPwd ? 'text' : 'password'}
                  className={`input ${errors.password ? 'error' : ''}`}
                  style={{ paddingLeft: 42, paddingRight: 40, height: 44 }}
                  placeholder="Min. 6 chars"
                  value={form.password}
                  onChange={set('password')}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPwd(!showPwd)}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="confirm">Confirm Password <span className="req">*</span></label>
              <div className="password-wrap">
                {inputIcon(Lock)}
                <input
                  id="confirm"
                  disabled={loading}
                  type={showPwd ? 'text' : 'password'}
                  className={`input ${errors.confirm ? 'error' : ''}`}
                  style={{ paddingLeft: 42, height: 44 }}
                  placeholder="Re-enter"
                  value={form.confirm}
                  onChange={set('confirm')}
                />
              </div>
              {errors.confirm && <div className="form-error">{errors.confirm}</div>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label htmlFor="bloodGroup">Blood Group <span className="req">*</span></label>
              <select
                id="bloodGroup"
                disabled={loading}
                className={`select ${errors.bloodGroup ? 'error' : ''}`}
                style={{ height: 44, fontWeight: 700 }}
                value={form.bloodGroup}
                onChange={set('bloodGroup')}
              >
                <option value="">Select</option>
                {BLOOD_GROUPS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              {errors.bloodGroup && <div className="form-error">{errors.bloodGroup}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender <span className="req">*</span></label>
              <select
                id="gender"
                disabled={loading}
                className={`select ${errors.gender ? 'error' : ''}`}
                style={{ height: 44 }}
                value={form.gender}
                onChange={set('gender')}
              >
                <option value="">Select</option>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              {errors.gender && <div className="form-error">{errors.gender}</div>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label htmlFor="phone">Phone Number <span className="req">*</span></label>
              <div className="password-wrap">
                {inputIcon(Phone)}
                <input
                  id="phone"
                  disabled={loading}
                  className={`input ${errors.phone ? 'error' : ''}`}
                  style={{ paddingLeft: 42, height: 44 }}
                  placeholder="+254 700 000 000"
                  value={form.phone}
                  onChange={set('phone')}
                />
              </div>
              {errors.phone && <div className="form-error">{errors.phone}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="location">City / Location <span className="req">*</span></label>
              <div className="password-wrap">
                {inputIcon(MapPin)}
                <input
                  id="location"
                  disabled={loading}
                  className={`input ${errors.location ? 'error' : ''}`}
                  style={{ paddingLeft: 42, height: 44 }}
                  placeholder="Nairobi, Kenya"
                  value={form.location}
                  onChange={set('location')}
                />
              </div>
              {errors.location && <div className="form-error">{errors.location}</div>}
            </div>
          </div>

          <div className="checkbox-row mb-6 mt-2">
            <input
              id="agree"
              type="checkbox"
              disabled={loading}
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <label htmlFor="agree" style={{ fontSize: '0.85rem' }}>
              I agree to the{' '}
              <a
                href="#terms"
                onClick={(e) => {
                  e.preventDefault();
                  toast('Terms: voluntary donor terms & emergency contact rights apply.', 'info');
                }}
              >
                Terms & Conditions
              </a>{' '}
              and consent to be contacted for urgent blood needs.
            </label>
          </div>
          {errors.agree && <div className="form-error mb-4">{errors.agree}</div>}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block btn-lg"
            style={{
              height: 48,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              opacity: loading ? 0.75 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? 'Creating Account...' : 'Create Donor Account'}
          </button>

          <div className="text-center mt-5">
            <span className="text-muted text-sm">Already have an account? </span>
            <Link to="/login" style={{ fontWeight: 700 }}>
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}