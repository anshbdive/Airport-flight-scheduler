import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, X, Info, AlertTriangle, AlertCircle } from 'lucide-react';

const API_URL = 'http://localhost:8080/api';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_URL}/notifications`);
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const clearNotifications = async () => {
    try {
      await axios.delete(`${API_URL}/notifications`);
      setNotifications([]);
    } catch (err) {
      console.error('Error clearing notifications:', err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'URGENT': return <AlertCircle size={18} color="#ef4444" />;
      case 'WARNING': return <AlertTriangle size={18} color="#f59e0b" />;
      default: return <Info size={18} color="#3b82f6" />;
    }
  };

  return (
    <div style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 1000 }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          position: 'relative',
          padding: '0.75rem',
          borderRadius: '50%',
          backgroundColor: 'var(--color-surface-light)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'var(--color-primary)',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}
      >
        <Bell size={20} />
        {notifications.length > 0 && (
          <span style={{ 
            position: 'absolute', top: 0, right: 0,
            width: '18px', height: '18px', 
            backgroundColor: 'var(--color-danger)', color: 'white',
            borderRadius: '50%', fontSize: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid var(--color-surface-main)'
          }}>
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{ 
          position: 'absolute', top: '3.5rem', right: 0,
          width: '320px', maxHeight: '450px',
          backgroundColor: 'var(--color-surface-light)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>Alert Center</h4>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={clearNotifications}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Clear All
              </button>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><X size={16} /></button>
            </div>
          </div>

          <div style={{ overflowY: 'auto', flex: 1 }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                No active notifications
              </div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} style={{ 
                  padding: '1rem', 
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex', gap: '0.75rem',
                  backgroundColor: n.type === 'URGENT' ? 'rgba(239, 68, 68, 0.05)' : 'transparent'
                }}>
                  <div style={{ marginTop: '2px' }}>{getIcon(n.type)}</div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-main)', lineHeight: 1.4 }}>{n.message}</p>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                      {new Date(n.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
