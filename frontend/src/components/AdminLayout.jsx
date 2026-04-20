import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import NotificationCenter from './NotificationCenter';

export default function AdminLayout() {
  return (
    <div className="app-container">
      <Sidebar />
      <NotificationCenter />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
