import React, { useState, useEffect } from 'react';
import BookingForm from '../components/BookingForm';

/**
 * Booking Page Component
 * Allows booking vehicles and viewing/managing existing reservations
 */
export default function Booking({
  vehicles,
  preselectedVehicle,
  onBookingCreated,
}) {
  const [subTab, setSubTab] = useState('new');
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState('');
  const [deleteMsg, setDeleteMsg] = useState('');

  // Fetch all bookings from Express API
  const fetchBookings = async () => {
    setLoadingBookings(true);
    setBookingsError('');
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch bookings');
      }
      setBookings(data.data || []);
    } catch (err) {
      setBookingsError(err.message);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (subTab === 'history') {
      fetchBookings();
    }
  }, [subTab]);

  // Cancel / Delete a booking
  const handleDeleteBooking = async (id) => {
    if (window.confirm(`Are you sure you want to cancel reservation #${id}?`)) {
      try {
        const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Error deleting booking');
        }
        setDeleteMsg(`Booking #${id} has been canceled successfully.`);
        setTimeout(() => setDeleteMsg(''), 3000);
        fetchBookings();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleSuccessfulBooking = (newBooking) => {
    if (onBookingCreated) {
      onBookingCreated(newBooking);
    }
    // Optionally refresh bookings
    fetchBookings();
  };

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '2.2rem' }}>Vehicle Reservation Portal</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Book your desired vehicle or view and manage your existing rental reservations.
          </p>
        </div>

        {/* Sub Navigation */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn ${subTab === 'new' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setSubTab('new')}
          >
            ➕ New Booking
          </button>
          <button
            className={`btn ${subTab === 'history' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setSubTab('history')}
          >
            📋 All Bookings ({bookings.length})
          </button>
        </div>
      </div>

      {deleteMsg && (
        <div className="alert alert-success">
          <span>✅</span>
          <span>{deleteMsg}</span>
        </div>
      )}

      {subTab === 'new' ? (
        <BookingForm
          vehicles={vehicles}
          preselectedVehicle={preselectedVehicle}
          onBookingSuccess={handleSuccessfulBooking}
        />
      ) : (
        <div>
          {bookingsError && (
            <div className="alert alert-danger">
              <span>⚠️</span>
              <span>{bookingsError}</span>
              <button
                className="btn btn-secondary btn-sm"
                style={{ marginLeft: 'auto' }}
                onClick={fetchBookings}
              >
                Retry
              </button>
            </div>
          )}

          {loadingBookings ? (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <div className="spinner" style={{ width: '36px', height: '36px', marginBottom: '12px' }}></div>
              <p style={{ color: 'var(--text-muted)' }}>Fetching reservations from MySQL database...</p>
            </div>
          ) : bookings.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ref #</th>
                    <th>Customer Name</th>
                    <th>Contact</th>
                    <th>Vehicle</th>
                    <th>Rental Dates</th>
                    <th>Total Rent</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td><strong>#{b.id}</strong></td>
                      <td>{b.customer_name}</td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>{b.email}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.phone}</div>
                      </td>
                      <td>
                        <strong>{b.vehicle_name || `Vehicle #${b.vehicle_id}`}</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.vehicle_type}</div>
                      </td>
                      <td style={{ fontSize: '0.88rem' }}>
                        <div>From: <strong>{b.start_date}</strong></div>
                        <div>To: <strong>{b.end_date}</strong></div>
                      </td>
                      <td style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1rem' }}>
                        ₹{Number(b.total_amount).toLocaleString('en-IN')}
                      </td>
                      <td>
                        <span className="badge-available" style={{ background: '#e0f2fe', color: '#0369a1', borderColor: '#bae6fd' }}>
                          {b.booking_status || 'Confirmed'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteBooking(b.id)}
                          title="Cancel Booking"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px dashed var(--border)',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📋</div>
              <h3>No Bookings Found</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>
                There are no active vehicle reservations in the database right now.
              </p>
              <button
                className="btn btn-primary btn-sm"
                style={{ marginTop: '16px' }}
                onClick={() => setSubTab('new')}
              >
                Create First Booking
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
