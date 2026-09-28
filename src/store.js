// ============================================================
// DonorKonnect — localStorage data helpers + mock seed data
// ============================================================

const KEYS = {
  USER: 'dk_current_user',
  USERS: 'dk_users',
  DONATIONS: 'dk_donations',
  NOTIFICATIONS: 'dk_notifications',
  EMERGENCIES: 'dk_emergencies',
};

// ---- Generic helpers ----
export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ---- Seed data ----
const SEED_USER = {
  id: 'DK-000001',
  fullName: 'Joy',
  email: 'donor@example.com',
  password: 'password123',
  bloodGroup: 'O+',
  gender: 'Female',
  phone: '0715959592',
  location: 'Nairobi',
  lastDonation: '2026-08-15',
  available: true,
  createdAt: '2025-01-10',
  avatar: '/images/donor-avatar.jpg',
};

const SEED_DONATIONS = [
  { id: 1, hospital: 'Kenyatta National Hospital', date: '2026-08-15', time: '10:30', bloodGroup: 'O+', units: 1, location: 'Nairobi', status: 'Completed' },
  { id: 2, hospital: 'Aga Khan University Hospital', date: '2026-05-20', time: '14:00', bloodGroup: 'O+', units: 1, location: 'Nairobi', status: 'Completed' },
  { id: 3, hospital: 'Mater Hospital', date: '2026-02-11', time: '09:15', bloodGroup: 'O+', units: 1, location: 'Nairobi', status: 'Completed' },
  { id: 4, hospital: 'Nairobi Hospital', date: '2025-11-03', time: '11:45', bloodGroup: 'O+', units: 1, location: 'Nairobi', status: 'Completed' },
  { id: 5, hospital: 'Mama Lucy Kibaki Hospital', date: '2025-08-22', time: '08:30', bloodGroup: 'O+', units: 1, location: 'Nairobi', status: 'Completed' },
];

const SEED_NOTIFICATIONS = [
  { id: 1, title: 'Emergency Blood Request', message: 'A hospital near your location is urgently requesting O+ blood.', date: '2026-09-22', time: '14:30', type: 'emergency', read: false },
  { id: 2, title: 'Donation Reminder', message: 'You are now eligible to donate blood again. Schedule your next donation.', date: '2026-09-20', time: '09:00', type: 'reminder', read: false },
  { id: 3, title: 'Successful Donation', message: 'Your donation at Kenyatta National Hospital has been confirmed. Thank you for saving lives!', date: '2026-08-15', time: '11:00', type: 'success', read: true },
  { id: 4, title: 'Availability Reminder', message: 'Please confirm your current donation availability status.', date: '2026-09-18', time: '16:00', type: 'reminder', read: true },
  { id: 5, title: 'Eligibility Reminder', message: 'You will be eligible to donate again on 15 November 2026.', date: '2026-09-15', time: '10:00', type: 'eligibility', read: true },
];

const SEED_EMERGENCIES = [
  { id: 1, bloodGroup: 'O+', hospital: 'Kenyatta National Hospital', location: 'Nairobi', units: 3, urgency: 'Critical', contact: '0711000001', info: 'Urgent need for trauma surgery patient. Please respond immediately.', date: '2026-09-22' },
  { id: 2, bloodGroup: 'A-', hospital: 'Aga Khan University Hospital', location: 'Nairobi', units: 2, urgency: 'Urgent', contact: '0711000002', info: 'Needed for a scheduled surgery. Rare blood type.', date: '2026-09-21' },
  { id: 3, bloodGroup: 'B+', hospital: 'Mater Hospital', location: 'Nairobi', units: 1, urgency: 'Normal', contact: '0711000003', info: 'General ward replenishment request.', date: '2026-09-20' },
  { id: 4, bloodGroup: 'AB+', hospital: 'Nairobi Hospital', location: 'Nairobi', units: 2, urgency: 'Urgent', contact: '0711000004', info: ' Needed for a pediatric patient.', date: '2026-09-19' },
];

// ---- Initialization ----
export function initStore() {
  if (!localStorage.getItem(KEYS.USERS)) save(KEYS.USERS, [SEED_USER]);
  if (!localStorage.getItem(KEYS.DONATIONS)) save(KEYS.DONATIONS, SEED_DONATIONS);
  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) save(KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
  if (!localStorage.getItem(KEYS.EMERGENCIES)) save(KEYS.EMERGENCIES, SEED_EMERGENCIES);

  const cur = getCurrentUser();
  if (cur && (!cur.avatar || cur.avatar.includes('unsplash.com'))) {
    cur.avatar = SEED_USER.avatar;
    save(KEYS.USER, cur);
  }

  initBackground();
}

// ---- User helpers ----
export const getUsers = () => load(KEYS.USERS, []);
export const setUsers = (u) => save(KEYS.USERS, u);

export const getCurrentUser = () => load(KEYS.USER, null);
export const setCurrentUser = (u) => save(KEYS.USER, u);
export const clearCurrentUser = () => localStorage.removeItem(KEYS.USER);

export function updateUser(updated) {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === updated.id);
  if (idx >= 0) users[idx] = updated;
  setUsers(users);
  setCurrentUser(updated);
  return updated;
}

// ---- Donation helpers ----
export const getDonations = () => load(KEYS.DONATIONS, []);
export const setDonations = (d) => save(KEYS.DONATIONS, d);

export function addDonation(donation) {
  const donations = getDonations();
  const id = donations.length ? Math.max(...donations.map((d) => d.id)) + 1 : 1;
  const record = { ...donation, id, status: 'Completed' };
  setDonations([record, ...donations]);
  return record;
}

// ---- Notification helpers ----
export const getNotifications = () => load(KEYS.NOTIFICATIONS, []);
export const setNotifications = (n) => save(KEYS.NOTIFICATIONS, n);

export function addNotification(notif) {
  const notifs = getNotifications();
  const id = notifs.length ? Math.max(...notifs.map((n) => n.id)) + 1 : 1;
  const record = { id, read: false, date: new Date().toISOString().slice(0, 10), time: new Date().toTimeString().slice(0, 5), ...notif };
  setNotifications([record, ...notifs]);
  return record;
}

export function markNotificationRead(id) {
  const notifs = getNotifications().map((n) => (n.id === id ? { ...n, read: true } : n));
  setNotifications(notifs);
}

export function markAllNotificationsRead() {
  setNotifications(getNotifications().map((n) => ({ ...n, read: true })));
}

export function unreadCount() {
  return getNotifications().filter((n) => !n.read).length;
}

// ---- Emergency helpers ----
export const getEmergencies = () => load(KEYS.EMERGENCIES, []);
export const setEmergencies = (e) => save(KEYS.EMERGENCIES, e);

export function addEmergency(em) {
  const all = getEmergencies();
  const id = all.length ? Math.max(...all.map((e) => e.id)) + 1 : 1;
  const record = { id, date: new Date().toISOString().slice(0, 10), ...em };
  setEmergencies([record, ...all]);
  return record;
}

// ---- Config ----
export const EMERGENCY_NUMBER = '0712345678';

// ---- Date helpers ----
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function eligibleDate(lastDonation) {
  if (!lastDonation) return 'Available now';
  const d = new Date(lastDonation);
  d.setMonth(d.getMonth() + 3);
  return d.toISOString().slice(0, 10);
}

export function isEligible(lastDonation) {
  if (!lastDonation) return true;
  return new Date(eligibleDate(lastDonation)) <= new Date();
}

export function generateDonorId() {
  const users = getUsers();
  const next = users.length + 1;
  return `DK-${String(next).padStart(6, '0')}`;
}

// ---- Background Image Presets ----
export const BACKGROUND_PRESETS = [
  {
    id: 'clinic-lab',
    name: 'Modern Clinic & Laboratory',
    tagline: 'Warm healthcare lighting with life-saving clinical ambiance',
    url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=2000&q=80',
    overlay: 'linear-gradient(135deg, rgba(15, 23, 42, 0.72) 0%, rgba(136, 19, 55, 0.62) 50%, rgba(15, 23, 42, 0.76) 100%)',
    thumb: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'blood-cells',
    name: 'Crimson Vitality & Blood Cells',
    tagline: 'Luminous red blood cells & molecular lifesaver motif',
    url: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=2000&q=80',
    overlay: 'linear-gradient(135deg, rgba(15, 23, 42, 0.76) 0%, rgba(159, 18, 57, 0.68) 50%, rgba(15, 23, 42, 0.8) 100%)',
    thumb: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'hospital-bay',
    name: 'Hospital Medical Bay',
    tagline: '24/7 emergency medical care and hospital suite',
    url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=2000&q=80',
    overlay: 'linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(30, 41, 59, 0.72) 50%, rgba(136, 19, 55, 0.65) 100%)',
    thumb: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'caring-hands',
    name: 'Compassionate Care & Stethoscope',
    tagline: 'Gentle clinical touch and medical dedication',
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=2000&q=80',
    overlay: 'linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(88, 28, 135, 0.55) 40%, rgba(159, 18, 57, 0.65) 100%)',
    thumb: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80',
  },
];

export function getSelectedBackground() {
  const custom = localStorage.getItem('dk_custom_bg');
  if (custom) {
    return {
      id: 'custom',
      name: 'Custom Wallpaper',
      tagline: 'Custom image URL',
      url: custom,
      overlay: 'linear-gradient(135deg, rgba(15, 23, 42, 0.72) 0%, rgba(136, 19, 55, 0.62) 50%, rgba(15, 23, 42, 0.76) 100%)',
      thumb: custom,
    };
  }
  const savedId = localStorage.getItem('dk_bg_id') || 'clinic-lab';
  return BACKGROUND_PRESETS.find((p) => p.id === savedId) || BACKGROUND_PRESETS[0];
}

export function applyBackground(presetOrUrl) {
  let url = '';
  let overlay = 'linear-gradient(135deg, rgba(15, 23, 42, 0.72) 0%, rgba(136, 19, 55, 0.62) 50%, rgba(15, 23, 42, 0.76) 100%)';

  if (typeof presetOrUrl === 'string') {
    const found = BACKGROUND_PRESETS.find((p) => p.id === presetOrUrl);
    if (found) {
      url = found.url;
      overlay = found.overlay;
      localStorage.setItem('dk_bg_id', found.id);
      localStorage.removeItem('dk_custom_bg');
    } else {
      url = presetOrUrl;
      localStorage.setItem('dk_bg_id', 'custom');
      localStorage.setItem('dk_custom_bg', presetOrUrl);
    }
  } else if (presetOrUrl?.url) {
    url = presetOrUrl.url;
    overlay = presetOrUrl.overlay || overlay;
    localStorage.setItem('dk_bg_id', presetOrUrl.id || 'custom');
    if (presetOrUrl.id === 'custom') {
      localStorage.setItem('dk_custom_bg', presetOrUrl.url);
    } else {
      localStorage.removeItem('dk_custom_bg');
    }
  }

  if (url) {
    document.documentElement.style.setProperty('--bg-image-url', `url('${url}')`);
    document.documentElement.style.setProperty('--bg-overlay', overlay);
  }
}

export function initBackground() {
  const current = getSelectedBackground();
  applyBackground(current);
}
