import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export default function ScheduleFlight() {
  const [formData, setFormData] = useState({
    flightId: '',
    source: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    priority: 1
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/flights`, formData);
      setMessage('Flight scheduled successfully!');
      setFormData({
        flightId: '',
        source: '',
        destination: '',
        departureTime: '',
        arrivalTime: '',
        priority: 1
      });
    } catch (err) {
      console.error(err);
      setMessage('Error scheduling flight.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Schedule Flight</h2>
      </div>

      <div className="premium-card" style={{ maxWidth: '600px' }}>
        {message && (
          <div style={{ padding: '1rem', marginBottom: '1.5rem', backgroundColor: message.includes('success') ? 'rgba(56, 102, 65, 0.2)' : 'rgba(158, 42, 43, 0.2)', color: message.includes('success') ? '#6edb8c' : '#ff6b6b', borderRadius: '8px', border: message.includes('success') ? '1px solid rgba(56, 102, 65, 0.5)' : '1px solid rgba(158, 42, 43, 0.5)' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <label className="premium-label">Flight ID</label>
            <input type="text" name="flightId" value={formData.flightId} onChange={handleChange} className="premium-input" placeholder="e.g. AA101" required />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label className="premium-label">Source Airport</label>
              <input type="text" name="source" value={formData.source} onChange={handleChange} className="premium-input" placeholder="e.g. DEL" required />
            </div>
            <div>
              <label className="premium-label">Destination Airport</label>
              <input type="text" name="destination" value={formData.destination} onChange={handleChange} className="premium-input" placeholder="e.g. BOM" required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label className="premium-label">Departure Time</label>
              <input type="datetime-local" name="departureTime" value={formData.departureTime} onChange={handleChange} className="premium-input" required />
            </div>
            <div>
              <label className="premium-label">Arrival Time</label>
              <input type="datetime-local" name="arrivalTime" value={formData.arrivalTime} onChange={handleChange} className="premium-input" required />
            </div>
          </div>

          <div>
            <label className="premium-label">Priority (1 = Highest, 10 = Lowest)</label>
            <input type="number" name="priority" value={formData.priority} onChange={handleChange} min="1" max="10" className="premium-input" required />
          </div>

          <button type="submit" className="premium-btn" style={{ marginTop: '1rem' }}>
            Schedule Flight
          </button>
        </form>
      </div>
    </div>
  );
}
