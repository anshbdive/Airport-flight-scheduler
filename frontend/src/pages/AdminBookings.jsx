import { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const API_URL = 'http://localhost:8080/api';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API_URL}/bookings`);
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Passenger Manifest', 14, 15);
    
    const tableColumn = ["Booking ID", "Flight", "Name", "Email", "Seat", "Date"];
    const tableRows = [];

    bookings.forEach(b => {
      const row = [
        b.bookingId,
        b.flightId,
        b.name,
        b.email,
        b.seatType,
        new Date(b.bookingTime).toLocaleString()
      ];
      tableRows.push(row);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save('passenger-manifest.pdf');
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(bookings.map(b => ({
      'Booking ID': b.bookingId,
      'Flight ID': b.flightId,
      'Name': b.name,
      'Email': b.email,
      'Seat Class': b.seatType,
      'Booking Time': new Date(b.bookingTime).toLocaleString()
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
    XLSX.writeFile(workbook, "passenger-manifest.xlsx");
  };

  const exportCSV = () => {
    window.location.href = `${API_URL}/bookings/export`;
  };

  return (
    <div>
      <div className="page-header">
        <h2>Passenger Manifest</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="premium-btn-outline" onClick={exportPDF} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} /> PDF
          </button>
          <button className="premium-btn" onClick={exportExcel} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={18} /> Excel
          </button>
          <button className="premium-btn" onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#10b981' }}>
            <FileText size={18} /> CSV (Direct)
          </button>
        </div>
      </div>

      <div className="premium-card">
        {bookings.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>No bookings found.</p>
        ) : (
          <table className="premium-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Flight ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Seat Type</th>
                <th>Booking Time</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.bookingId}>
                  <td style={{ fontWeight: '600', color: 'var(--color-primary)' }}>{b.bookingId}</td>
                  <td>{b.flightId}</td>
                  <td>{b.name}</td>
                  <td>{b.email}</td>
                  <td>{b.seatType}</td>
                  <td>{new Date(b.bookingTime).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
