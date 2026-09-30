// Notifications — list with read/unread, mark all, view details modal with live API
import { useState, useEffect } from 'react';
import { BellOff, CheckCheck, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import NotificationCard from '../components/NotificationCard';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../auth';
import { useToast } from '../toast';
import { getUserNotifications, markNotificationAsRead } from '../service/notificationService'; // Adjust path if needed

export default function Notifications() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [notifs, setNotifs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLiveNotifications = async () => {
    const activeUserId = user?.id || localStorage.getItem('userId');
    if (!activeUserId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getUserNotifications(activeUserId);

      const normalized = (Array.isArray(data) ? data : []).map((item) => {
        const createdDate = item.createdAt ? new Date(item.createdAt) : new Date();
        const dateStr = createdDate.toISOString().slice(0, 10);
        const timeStr = createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return {
          id: item.id,
          title: item.title || 'Notification',
          message: item.message || '',
          type: (item.type || 'info').toLowerCase(),
          read: Boolean(item.read),
          date: dateStr,
          time: timeStr,
          createdAt: item.createdAt,
          postedByName: item.postedByName || 'System',
        };
      });

      normalized.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifs(normalized);
    } catch (err) {
      const msg = err.message || 'Failed to retrieve notifications.';
      setError(msg);
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveNotifications();
  }, [user?.id]);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const handleMarkRead = async (id) => {
    // Optimistic UI update
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    try {
      await markNotificationAsRead(id);
      toast('Notification marked as read.', 'success');
    } catch (err) {
      // Revert if API fails
      setNotifs((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: false } : n))
      );
      toast(err.message || 'Failed to mark as read.', 'error');
    }
  };

  const handleMarkAll = async () => {
    const unread = notifs.filter((n) => !n.read);
    if (!unread.length) return;

    // Optimistically mark all as read
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

    try {
      await Promise.all(unread.map((n) => markNotificationAsRead(n.id)));
      toast('All notifications marked as read.', 'success');
    } catch (err) {
      fetchLiveNotifications(); // Re-sync on failure
      toast('Failed to mark all as read.', 'error');
    }
  };

  const handleView = async (n) => {
    if (!n.read) {
      await handleMarkRead(n.id);
    }
    setSelected(n);
  };

  return (
    <div>
      <div className="page-header">
        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1>Notifications</h1>
            <p>
              {loading
                ? 'Checking for alerts...'
                : unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}.`
                : 'You are all caught up.'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              className="btn btn-outline btn-sm"
              onClick={fetchLiveNotifications}
              disabled={loading}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px' }}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            {unreadCount > 0 && (
              <button className="btn btn-outline btn-sm" onClick={handleMarkAll}>
                <CheckCheck size={16} /> Mark all as read
              </button>
            )}
          </div>
        </div>
      </div>

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
            Retrieving notifications...
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
          <button className="btn btn-outline btn-sm" onClick={fetchLiveNotifications}>
            Try Again
          </button>
        </div>
      ) : notifs.length === 0 ? (
        <div className="empty-state">
          <BellOff size={48} className="es-icon" color="var(--neutral-300)" />
          <p>No notifications yet.</p>
        </div>
      ) : (
        <div>
          {notifs.map((n) => (
            <NotificationCard
              key={n.id}
              notification={n}
              onMarkRead={() => handleMarkRead(n.id)}
              onView={() => handleView(n)}
            />
          ))}
        </div>
      )}

      {/* Details Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title || 'Notification'}
        footer={
          <button className="btn btn-primary" onClick={() => setSelected(null)}>
            Close
          </button>
        }
      >
        {selected && (
          <div>
            <div className="mb-4" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <StatusBadge
                status={
                  selected.type === 'emergency'
                    ? 'Critical'
                    : selected.type === 'reminder'
                    ? 'Urgent'
                    : 'Normal'
                }
                label={selected.type.toUpperCase()}
              />
              {selected.postedByName && (
                <span style={{ fontSize: '0.8rem', color: 'var(--neutral-500)' }}>
                  From: <strong>{selected.postedByName}</strong>
                </span>
              )}
            </div>
            <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--neutral-700)' }}>
              {selected.message}
            </p>
            <div className="text-muted text-sm mt-4">
              Received on {selected.date} at {selected.time}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}