import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, PlaneTakeoff, Clock, Map, Users, ExternalLink } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="sidebar" style={{ background: '#080808', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="sidebar-brand" style={{ padding: '2.5rem 2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#FFF' }}>
          <div style={{ backgroundColor: 'var(--color-primary)', padding: '0.4rem', borderRadius: '10px' }}>
            <PlaneTakeoff size={18} color="#FFF" />
          </div>
          <span style={{ color: 'var(--color-primary)' }}>Aero</span>Admin
        </h1>
      </div>
      <nav style={{ flex: 1, padding: '0 1rem' }}>
        <NavLink to="/admin" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} end style={{ borderRadius: '12px', marginBottom: '0.5rem' }}>
          <LayoutDashboard size={18} />
          <span>General Overview</span>
        </NavLink>
        <NavLink to="/admin/schedule" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} style={{ borderRadius: '12px', marginBottom: '0.5rem' }}>
          <PlaneTakeoff size={18} />
          <span>Flight Scheduler</span>
        </NavLink>
        <NavLink to="/admin/delays" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} style={{ borderRadius: '12px', marginBottom: '0.5rem' }}>
          <Clock size={18} />
          <span>Disruption Control</span>
        </NavLink>
        <NavLink to="/admin/route" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} style={{ borderRadius: '12px', marginBottom: '0.5rem' }}>
          <Map size={18} />
          <span>Network Explorer</span>
        </NavLink>
        <NavLink to="/admin/bookings" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} style={{ borderRadius: '12px', marginBottom: '0.5rem' }}>
          <Users size={18} />
          <span>Passenger Manifest</span>
        </NavLink>
      </nav>
      
      <div style={{ padding: '2rem 1.5rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-primary)', fontSize: '0.85rem', textDecoration: 'none', transition: 'all 0.3s ease', background: 'rgba(59, 130, 246, 0.1)', padding: '0.75rem 1.25rem', borderRadius: '12px', fontWeight: 600 }}>
          <ExternalLink size={16} />
          <span>Exit to Portal</span>
        </Link>
      </div>
    </aside>
  );
}

