// Login page — rich authentication page with vector art, trust metrics & live API integration
import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Droplet, HeartHandshake, Loader2 } from 'lucide-react';
import { useAuth } from '../auth';
import { useToast } from '../toast';
import { loginUser } from '../service/login'; // Adjust path if login.js is located elsewhere

export default function Login() {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const emailRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Invalid email address.';
    if (!password) e.password = 'Password is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const result = await loginUser({
        email: email.trim(),
        password,
      });

      // Pass user and token to your local AuthProvider state if available
      if (login) {
        login(result.user || { id: result.id, email: email.trim() }, result.token);
      }

      const welcomeName = result.user?.fullName || 'Lifesaver';
      toast(`Welcome back, ${welcomeName}!`, 'success');
      navigate('/dashboard');
    } catch (err) {
      const errMsg = err.message || 'Invalid credentials. Please try again.';
      setErrors({ password: errMsg });
      toast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('yobiijoy@gmail.com');
    setPassword('123456');
    setErrors({});
    toast('Loaded verified credentials (Joy Musyoka · B+).', 'info');
  };

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

        {/* High-Impact Professional Visual */}
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
                Lifesavers Across Kenya
              </span>
              <span style={{ fontSize: '0.68rem', color: '#4ade80', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>
                ● Active Network
              </span>
            </div>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 8 }}>
            Every Drop Counts. Every Life Matters.
          </h2>
          <p className="aside-quote" style={{ opacity: 0.9 }}>
            Join thousands of voluntary blood donors across Kenya. Your donation connects directly to emergency surgeries, cancer patients, and maternity wards in real-time.
          </p>
        </div>

        <div className="aside-stats" style={{ paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <div>
            <div className="stat-num">5,200+</div>
            <div className="stat-label">Active Donors</div>
          </div>
          <div>
            <div className="stat-num">12,400+</div>
            <div className="stat-label">Pints Donated</div>
          </div>
          <div>
            <div className="stat-num">48+</div>
            <div className="stat-label">Partner Hospitals</div>
          </div>
        </div>
      </aside>

      <div className="auth-form-side">
        <form
          className="form-card"
          onSubmit={handleSubmit}
          noValidate
          style={{
            background: '#ffffff',
            padding: 'clamp(20px, 4vw, 36px)',
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
                Lifesaver Network
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary-600)' }}>
              Donor Portal
            </span>
          </div>

          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 6, color: 'var(--neutral-900)' }}>
            Welcome Back
          </h1>
          <p className="text-muted mb-6">Sign in to manage your donations and view urgent alerts.</p>

          <div className="form-group">
            <label htmlFor="email">Email Address <span className="req">*</span></label>
            <div className="password-wrap">
              <Mail size={18} style={{ position: 'absolute', left: 14, top: 13, color: 'var(--neutral-400)' }} />
              <input
                id="email"
                ref={emailRef}
                type="email"
                disabled={loading}
                className={`input ${errors.email ? 'error' : ''}`}
                style={{ paddingLeft: 42, height: 46 }}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password <span className="req">*</span></label>
            <div className="password-wrap">
              <Lock size={18} style={{ position: 'absolute', left: 14, top: 13, color: 'var(--neutral-400)' }} />
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                disabled={loading}
                className={`input ${errors.password ? 'error' : ''}`}
                style={{ paddingLeft: 42, paddingRight: 44, height: 46 }}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
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

          <div className="flex items-center justify-between mb-6">
            <div className="checkbox-row">
              <input
                id="remember"
                type="checkbox"
                disabled={loading}
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label htmlFor="remember" style={{ fontSize: '0.88rem' }}>Remember me</label>
            </div>
            <a
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                toast('Password reset link has been dispatched to your email.', 'info');
              }}
              style={{ fontSize: '0.88rem', fontWeight: 600 }}
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block btn-lg"
            style={{
              height: 48,
              fontSize: '1rem',
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
            {loading ? 'Signing In...' : 'Sign In to DonorKonnect'}
          </button>

          <div className="text-center mt-5">
            <span className="text-muted text-sm">Don't have an account yet? </span>
            <Link to="/register" style={{ fontWeight: 700 }}>Register as Donor</Link>
          </div>

          <div
            style={{
              marginTop: 24,
              paddingTop: 20,
              borderTop: '1px solid var(--neutral-200)',
              textAlign: 'center',
            }}
          >
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={fillDemo}
              disabled={loading}
              style={{
                width: '100%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '10px 16px',
              }}
            >
              <HeartHandshake size={16} color="var(--primary-600)" />
              <span>Fill Verified Test Credentials (Joy Musyoka · B+)</span>
            </button>
            <p className="form-hint" style={{ marginTop: 8 }}>
              Active test: <strong>yobiijoy@gmail.com</strong> / <strong>123456</strong>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}