import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plane, ArrowRight, Clock } from 'lucide-react';
import RouteMap from '../components/RouteMap';

const API_URL = 'http://localhost:8080/api';

export default function CustomerPortal() {
  const [flights, setFlights] = useState([]);
  const [isLoadingFlights, setIsLoadingFlights] = useState(true);
  const [source, setSource] = useState('');
  const [dest, setDest] = useState('');
  const [routeData, setRouteData] = useState(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', seatType: 'Economy' });
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  const fetchFlights = async () => {
    try {
      const res = await axios.get(`${API_URL}/flights`);
      // Filter out completed and cancelled for the public board
      const activeFlights = res.data.filter(f => f.status !== 'COMPLETED' && f.status !== 'CANCELLED');
      setFlights(activeFlights);
    } catch (err) {
      console.error("Error fetching flights:", err);
    } finally {
      setIsLoadingFlights(false);
    }
  };

  useEffect(() => {
    fetchFlights();
    const interval = setInterval(fetchFlights, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRouteSearch = async (e) => {
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
      setError('Error fetching route. Ensure backend is running.');
      setRouteData(null);
    }
  };

  const handleBookClick = (flightId) => {
    setSelectedFlight(flightId);
    setShowModal(true);
    setBookingSuccess('');
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsBooking(true);
    try {
      const payload = { ...bookingForm, flightId: selectedFlight };
      const res = await axios.post(`${API_URL}/bookings`, payload);
      setBookingSuccess(`Success! Your Booking ID is ${res.data.bookingId}`);
      setTimeout(() => setShowModal(false), 3000);
    } catch (err) {
      setBookingSuccess('Error making booking.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Background Orbs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none', zIndex: 0 }}></div>

      {/* Header */}
      <header className="animate-fade-in" style={{ padding: '1.5rem 4rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10, backdropFilter: 'blur(20px)' }}>
        <h1 style={{ color: '#FFFFFF', fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0, letterSpacing: '-0.03em' }}>
          <div style={{ backgroundColor: 'var(--color-primary)', padding: '0.6rem', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)' }}>
            <Plane size={24} color="#FFF" />
          </div>
          Aero<span style={{ color: 'var(--color-primary)' }}>Travel</span>
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 500, fontSize: '0.9rem', backgroundColor: 'rgba(255,255,255,0.03)', padding: '0.5rem 1.25rem', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-success)', boxShadow: '0 0 10px var(--color-success)' }} />
            Live Network Status
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '0 4rem 4rem 4rem', display: 'flex', flexDirection: 'column', gap: '4rem', maxWidth: '1300px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 2 }}>
        
        {/* Hero Section */}
        <section style={{ textAlign: 'center', padding: '7rem 2rem 5rem 2rem' }}>
          <div className="animate-fade-in-up">
            <span style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-primary)', padding: '0.6rem 1.2rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', border: '1px solid rgba(59, 130, 246, 0.2)', marginBottom: '2rem', display: 'inline-block' }}>
              The Future of Air Travel
            </span>
            <h2 style={{ fontSize: '5rem', lineHeight: 1.1, fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '1.5rem', background: 'linear-gradient(to bottom, #FFFFFF 40%, rgba(255,255,255,0.6))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Redefining the <br /> modern journey.
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', maxWidth: '650px', margin: '0 auto 3.5rem auto', lineHeight: 1.6, fontWeight: 400 }}>
              Experience elite-level flight scheduling and management. Real-time insights, intelligent routing, and premium bookings at your fingertips.
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '5rem', flexWrap: 'wrap' }}>
              <div className="animate-fade-in delay-100">
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#FFF', marginBottom: '0.25rem' }}>24/7</div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>Active Nodes</div>
              </div>
              <div className="animate-fade-in delay-200">
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#FFF', marginBottom: '0.25rem' }}>100%</div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>Uptime SLA</div>
              </div>
              <div className="animate-fade-in delay-300">
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#FFF', marginBottom: '0.25rem' }}>Dijkstra</div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>Routing Engine</div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Explorer */}
        <section className="animate-fade-in-up delay-200" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2.5rem' }}>
          <div className="premium-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                <Plane size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Intelligent Planner</h3>
            </div>
            <form onSubmit={handleRouteSearch} style={{ display: 'grid', gap: '1.5rem' }}>
              <div>
                <label className="premium-label">Origin Airport</label>
                <input type="text" className="premium-input" value={source} onChange={e => setSource(e.target.value)} placeholder="e.g. JFK" required />
              </div>
              <div>
                <label className="premium-label">Destination</label>
                <input type="text" className="premium-input" value={dest} onChange={e => setDest(e.target.value)} placeholder="e.g. LAX" required />
              </div>
              <button type="submit" className="premium-btn" style={{ marginTop: '0.5rem' }}>Calculate Optimized Path</button>
            </form>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {error && (
              <div className="animate-fade-in" style={{ padding: '1.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', borderRadius: '20px', border: '1px solid rgba(239, 68, 68, 0.2)', backdropFilter: 'blur(10px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--color-danger)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>!</div>
                  {error}
                </div>
              </div>
            )}

            {!routeData && !error && (
              <div className="premium-card" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'rgba(255,255,255,0.01)' }}>
                <div>
                  <div className="animate-float" style={{ fontSize: '3rem', marginBottom: '1.5rem', opacity: 0.5 }}>🌍</div>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Enter origins to visualize the global network.</p>
                </div>
              </div>
            )}

            {routeData && (
              <div className="premium-card animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                  <div>
                    <h3 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Optimal Route Optimized</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Computed via Dijkstra's Shortest Path Algorithm</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FFF' }}>{routeData.totalWeight} min</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Travel Duration</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
                  {routeData.path.map((node, index) => (
                    <div key={node} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#FFF' }}>{node}</span>
                      {index < routeData.path.length - 1 && (
                        <div style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center' }}>
                          <ArrowRight size={20} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ flex: 1, minHeight: '350px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <RouteMap routePath={routeData.path} />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Global Schedule Board */}
        <section className="animate-fade-in-up delay-300">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success)' }}>
                <Clock size={20} />
              </div>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Global Flight Board</h2>
            </div>
          </div>

          <div className="premium-card" style={{ padding: 0, overflow: 'hidden' }}>
            {isLoadingFlights ? (
              <div style={{ padding: '3rem' }}>
                <div className="skeleton" style={{ width: '100%', height: '4rem', marginBottom: '1.5rem', borderRadius: '16px' }}></div>
                <div className="skeleton" style={{ width: '100%', height: '4rem', marginBottom: '1.5rem', borderRadius: '16px' }}></div>
                <div className="skeleton" style={{ width: '100%', height: '4rem', borderRadius: '16px' }}></div>
              </div>
            ) : flights.length === 0 ? (
              <div style={{ padding: '5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>📭</div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>No active flights detected in the system.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="premium-table" style={{ width: '100%', margin: 0, minWidth: '800px' }}>
                  <thead style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                    <tr>
                      <th style={{ padding: '1.5rem 2rem' }}>FLIGHT IDENTITY</th>
                      <th style={{ padding: '1.5rem 2rem' }}>NETWORK ROUTE</th>
                      <th style={{ padding: '1.5rem 2rem' }}>DEPARTURE</th>
                      <th style={{ padding: '1.5rem 2rem' }}>STATUS</th>
                      <th style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>AVAILABILITY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flights.map(flight => (
                      <tr key={flight.flightId} style={{ transition: 'all 0.3s ease' }}>
                        <td style={{ padding: '1.75rem 2rem' }}>
                          <span style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '1.25rem', letterSpacing: '-0.02em' }}>{flight.flightId}</span>
                        </td>
                        <td style={{ padding: '1.75rem 2rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', fontWeight: 500 }}>
                            {flight.source} <ArrowRight size={14} color="var(--color-text-muted)" /> {flight.destination}
                          </div>
                        </td>
                        <td style={{ padding: '1.75rem 2rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{new Date(flight.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Scheduled</span>
                          </div>
                        </td>
                        <td style={{ padding: '1.75rem 2rem' }}>
                          {flight.status === 'DELAYED' ? (
                            <span style={{ color: 'var(--color-danger)', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '100px', width: 'fit-content' }}>
                              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-danger)', boxShadow: '0 0 8px var(--color-danger)' }} />
                              DELAYED
                            </span>
                          ) : (
                            <span style={{ color: 'var(--color-success)', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '100px', width: 'fit-content' }}>
                              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-success)', boxShadow: '0 0 8px var(--color-success)' }} />
                              ON TIME
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '1.75rem 2rem', textAlign: 'right' }}>
                          <button className="premium-btn" onClick={() => handleBookClick(flight.flightId)} style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem' }}>
                            Secure Seat
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer style={{ padding: '4rem', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.05)', color: 'var(--color-text-muted)', fontSize: '0.9rem', position: 'relative', zIndex: 10, backdropFilter: 'blur(20px)' }}>
        <p style={{ marginBottom: '1rem' }}>&copy; 2026 AeroTravel Systems. All rights reserved.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
          <Link to="/admin" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600, opacity: 0.8, transition: 'all 0.3s ease' }} onMouseEnter={e => e.target.style.opacity=1} onMouseLeave={e => e.target.style.opacity=0.8}>Console Login</Link>
          <a href="#" style={{ color: 'var(--color-text-muted)' }}>Network Topology</a>
          <a href="#" style={{ color: 'var(--color-text-muted)' }}>Documentation</a>
        </div>
      </footer>

      {/* Booking Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => !bookingSuccess && setShowModal(false)}>
          <div className="modal-content" style={{ maxWidth: '500px', padding: '3rem', borderRadius: '32px' }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '20px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', margin: '0 auto 1.5rem auto' }}>
                <Plane size={30} />
              </div>
              <h3 style={{ color: '#FFF', fontSize: '1.75rem', marginBottom: '0.5rem' }}>Confirm Reservation</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>Flight Identity: <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{selectedFlight}</span></p>
            </div>

            {bookingSuccess ? (
              <div className="animate-fade-in" style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '24px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                <h4 style={{ color: 'var(--color-success)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Reservation Confirmed</h4>
                <p style={{ color: '#FFF', fontWeight: 600 }}>{bookingSuccess}</p>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '1rem' }}>Closing in 3 seconds...</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} style={{ display: 'grid', gap: '2rem' }}>
                <div>
                  <label className="premium-label">Passenger Name</label>
                  <input type="text" className="premium-input" value={bookingForm.name} onChange={e => setBookingForm({...bookingForm, name: e.target.value})} placeholder="Enter full legal name" required />
                </div>
                <div>
                  <label className="premium-label">Email Context</label>
                  <input type="email" className="premium-input" value={bookingForm.email} onChange={e => setBookingForm({...bookingForm, email: e.target.value})} placeholder="Enter contact email" required />
                </div>
                <div>
                  <label className="premium-label">Cabin Configuration</label>
                  <select className="premium-input" value={bookingForm.seatType} onChange={e => setBookingForm({...bookingForm, seatType: e.target.value})} style={{ appearance: 'none', backgroundColor: 'rgba(255,255,255,0.03)', color: '#FFF' }}>
                    <option value="Economy">Economy Executive</option>
                    <option value="Business">Business Elite</option>
                    <option value="First Class">Royal First</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" className="premium-btn-outline" onClick={() => setShowModal(false)} style={{ flex: 1, borderRadius: '16px' }}>Discard</button>
                  <button type="submit" className="premium-btn" style={{ flex: 1.5, borderRadius: '16px', opacity: isBooking ? 0.7 : 1, cursor: isBooking ? 'not-allowed' : 'pointer' }} disabled={isBooking}>
                    {isBooking ? 'Processing...' : 'Complete Reservation'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );

}
