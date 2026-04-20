import { useState } from 'react';
import axios from 'axios';
import { MapPin, ArrowRight } from 'lucide-react';
import RouteMap from '../components/RouteMap';

const API_URL = 'http://localhost:8080/api';

export default function FindRoute() {
  const [source, setSource] = useState('');
  const [dest, setDest] = useState('');
  const [routeData, setRouteData] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`${API_URL}/routes?source=${source.toUpperCase()}&dest=${dest.toUpperCase()}`);
      if (res.data.totalWeight === -1) {
        setError('No route found between these airports.');
        setRouteData(null);
      } else {
        setRouteData(res.data);
        setError('');
      }
    } catch (err) {
      setError('Error fetching route.');
      setRouteData(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Find Optimal Route</h2>
      </div>

      <div className="premium-card" style={{ maxWidth: '800px', marginBottom: '2rem' }}>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
          Calculate the most efficient travel path across our global flight network.
        </p>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label className="premium-label">Source Airport</label>
            <input type="text" className="premium-input" value={source} onChange={e => setSource(e.target.value)} placeholder="e.g. DEL" required />
          </div>
          <div style={{ flex: 1 }}>
            <label className="premium-label">Destination Airport</label>
            <input type="text" className="premium-input" value={dest} onChange={e => setDest(e.target.value)} placeholder="e.g. BOM" required />
          </div>
          <button type="submit" className="premium-btn" style={{ height: '48px' }}>Find Route</button>
        </form>
      </div>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)', maxWidth: '800px', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      {routeData && (
        <div className="premium-card" style={{ maxWidth: '800px' }}>
          <h3 style={{ color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Optimal Route Details</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {routeData.path.map((node, index) => (
              <div key={node} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '60px', height: '60px', 
                  backgroundColor: 'rgba(59, 130, 246, 0.1)', 
                  border: '1px solid var(--color-primary)',
                  borderRadius: '50%',
                  color: 'var(--color-text-main)',
                  fontWeight: '600',
                  fontFamily: 'var(--font-sans)'
                }}>
                  {node}
                </div>
                {index < routeData.path.length - 1 && (
                  <ArrowRight color="var(--color-primary)" />
                )}
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.5rem', display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <p className="premium-label">Total Estimated Time</p>
              <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>{routeData.totalWeight} minutes</p>
            </div>
            <div>
              <p className="premium-label">Stops</p>
              <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>{routeData.path.length > 0 ? routeData.path.length - 2 : 0}</p>
            </div>
          </div>

          <RouteMap routePath={routeData.path} />
        </div>
      )}
    </div>
  );
}
