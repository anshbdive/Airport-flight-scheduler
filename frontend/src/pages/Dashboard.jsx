import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plane, AlertCircle, CheckCircle2 } from 'lucide-react';

const API_URL = 'http://localhost:8080/api';

export default function Dashboard() {
  const [flights, setFlights] = useState([]);
  
  const fetchFlights = async () => {
    try {
      const res = await axios.get(`${API_URL}/flights`);
      setFlights(res.data);
    } catch (err) {
      console.error("Error fetching flights:", err);
    }
  };

  useEffect(() => {
    fetchFlights();
    const interval = setInterval(fetchFlights, 5000);
    return () => clearInterval(interval);
  }, []);

  const total = flights.length;
  const delayed = flights.filter(f => f.status === 'DELAYED').length;
  const onTime = flights.filter(f => f.status === 'ON_TIME' || !f.status).length;
  const completed = flights.filter(f => f.status === 'COMPLETED').length;

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>General <span style={{ color: 'var(--color-primary)' }}>Overview</span></h2>
        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>System Health: <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>EXCELLENT</span></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        <div className="premium-card animate-fade-in-up delay-100" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1.25rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '16px', color: 'var(--color-primary)', boxShadow: '0 8px 16px rgba(59, 130, 246, 0.1)' }}>
            <Plane size={28} />
          </div>
          <div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Active Fleet</p>
            <p style={{ fontSize: '2rem', fontWeight: '800', color: '#FFF', margin: 0 }}>{total}</p>
          </div>
        </div>
        
        <div className="premium-card animate-fade-in-up delay-200" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1.25rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '16px', color: 'var(--color-success)', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.1)' }}>
            <CheckCircle2 size={28} />
          </div>
          <div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Peak Performance</p>
            <p style={{ fontSize: '2rem', fontWeight: '800', color: '#FFF', margin: 0 }}>{onTime}</p>
          </div>
        </div>

        <div className="premium-card animate-fade-in-up delay-300" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1.25rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '16px', color: 'var(--color-danger)', boxShadow: '0 8px 16px rgba(239, 68, 68, 0.1)' }}>
            <AlertCircle size={28} />
          </div>
          <div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Disrupted Nodes</p>
            <p style={{ fontSize: '2rem', fontWeight: '800', color: '#FFF', margin: 0 }}>{delayed}</p>
          </div>
        </div>

        <div className="premium-card animate-fade-in-up delay-300" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1.25rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '16px', color: 'var(--color-primary)', boxShadow: '0 8px 16px rgba(59, 130, 246, 0.1)' }}>
            <Plane size={28} style={{transform: 'rotate(90deg)'}} />
          </div>
          <div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Historical Paths</p>
            <p style={{ fontSize: '2rem', fontWeight: '800', color: '#FFF', margin: 0 }}>{completed}</p>
          </div>
        </div>
      </div>

      <div className="premium-card animate-fade-in-up delay-300">
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Live Operational Stream</h3>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', backgroundColor: 'rgba(255,255,255,0.03)', padding: '0.4rem 1rem', borderRadius: '100px' }}>Refreshes every 5s</div>
        </div>
        {flights.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>No active operational data detected.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="premium-table" style={{ minWidth: '900px' }}>
              <thead style={{ background: 'rgba(255,255,255,0.01)' }}>
                <tr>
                  <th style={{ padding: '1.25rem' }}>IDENT</th>
                  <th style={{ padding: '1.25rem' }}>NETWORK ARCH</th>
                  <th style={{ padding: '1.25rem' }}>TS_START</th>
                  <th style={{ padding: '1.25rem' }}>TS_END</th>
                  <th style={{ padding: '1.25rem' }}>INDEX_PRIO</th>
                  <th style={{ padding: '1.25rem' }}>NODE_STATE</th>
                </tr>
              </thead>
              <tbody>
                {flights.map(flight => (
                  <tr key={flight.flightId} style={{ transition: 'all 0.3s ease' }}>
                    <td style={{ padding: '1.5rem 1.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>{flight.flightId}</td>
                    <td style={{ padding: '1.5rem 1.25rem', fontWeight: 600 }}>{flight.source} &rarr; {flight.destination}</td>
                    <td style={{ padding: '1.5rem 1.25rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{new Date(flight.departureTime).toLocaleString()}</td>
                    <td style={{ padding: '1.5rem 1.25rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{new Date(flight.arrivalTime).toLocaleString()}</td>
                    <td style={{ padding: '1.5rem 1.25rem', textAlign: 'center' }}>
                      <span style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>{flight.priority}</span>
                    </td>
                    <td style={{ padding: '1.5rem 1.25rem' }}>
                      {flight.status === 'DELAYED' ? (
                        <span style={{ color: 'var(--color-danger)', fontWeight: 700, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.3rem 0.8rem', borderRadius: '100px', width: 'fit-content' }}>
                          CRITICAL_DISRUPTION
                        </span>
                      ) : flight.status === 'COMPLETED' ? (
                        <span style={{ color: 'var(--color-text-muted)', fontWeight: 700, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.1)', padding: '0.3rem 0.8rem', borderRadius: '100px', width: 'fit-content' }}>
                          ARCHIVED_PATH
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-success)', fontWeight: 700, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.3rem 0.8rem', borderRadius: '100px', width: 'fit-content' }}>
                          STABLE_FLOW
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

}
