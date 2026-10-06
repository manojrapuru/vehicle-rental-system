import React, { useState, useEffect } from 'react';
import BookingForm from '../components/BookingForm';

/**
 * Booking Page Component
 * Allows booking vehicles and viewing/managing existing reservations
 */
export default function Booking({
  vehicles,
  preselectedVehicle,
  initialSubTab = 'new',
  onBookingCreated,
}) {
  const [subTab, setSubTab] = useState(initialSubTab || 'new');
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState('');
  const [actionMsg, setActionMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeInvoice, setActiveInvoice] = useState(null);

  // Sync subTab if initialSubTab prop changes
  useEffect(() => {
    if (initialSubTab) {
      setSubTab(initialSubTab);
    }
  }, [initialSubTab]);

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

  // Update booking status (e.g. Completed, Cancelled, Active)
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Error updating status');
      }
      setActionMsg(`Booking #${id} marked as ${newStatus}.`);
      setTimeout(() => setActionMsg(''), 3500);
      fetchBookings();
      if (onBookingCreated) onBookingCreated();
    } catch (err) {
      alert(err.message);
    }
  };

  // Cancel / Delete a booking
  const handleDeleteBooking = async (id) => {
    if (window.confirm(`Are you sure you want to cancel and delete reservation #${id}?`)) {
      try {
        const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Error deleting booking');
        }
        setActionMsg(`Booking #${id} has been canceled & deleted.`);
        setTimeout(() => setActionMsg(''), 3500);
        fetchBookings();
        if (onBookingCreated) onBookingCreated();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleSuccessfulBooking = (newBooking) => {
    if (onBookingCreated) {
      onBookingCreated(newBooking);
    }
    fetchBookings();
  };

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus =
      statusFilter === 'All' ||
      (b.booking_status || 'Confirmed').toLowerCase() === statusFilter.toLowerCase();
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      b.customer_name.toLowerCase().includes(search) ||
      (b.email && b.email.toLowerCase().includes(search)) ||
      (b.phone && b.phone.includes(search)) ||
      (b.vehicle_name && b.vehicle_name.toLowerCase().includes(search)) ||
      String(b.id).includes(search);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '2.2rem' }}>Vehicle Reservation Portal</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Book your desired vehicle or view, search, and manage existing reservations.
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
            📋 Manage Bookings ({bookings.length})
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="alert alert-success" style={{ marginBottom: '20px' }}>
          <span>✅</span>
          <span>{actionMsg}</span>
        </div>
      )}

      {subTab === 'new' ? (
        <BookingForm
          vehicles={vehicles}
          preselectedVehicle={preselectedVehicle}
          onBookingSuccess={handleSuccessfulBooking}
          onViewAllBookings={() => setSubTab('history')}
        />
      ) : (
        <div>
          {/* Filter & Search Bar for Bookings */}
          <div className="filter-bar" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ flex: '1 1 240px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="🔍 Search by customer, phone, vehicle, or ref #..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ minWidth: '150px' }}>
              <select
                className="form-control"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Active">Active / On Trip</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <button className="btn btn-secondary btn-sm" onClick={fetchBookings}>
              🔄 Refresh List
            </button>
          </div>

          {bookingsError && (
            <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
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
              <p style={{ color: 'var(--text-muted)' }}>Fetching reservations from database...</p>
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ref #</th>
                    <th>Customer Name</th>
                    <th>Contact Info</th>
                    <th>Vehicle</th>
                    <th>Rental Dates</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Manage / Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => (
                    <tr key={b.id}>
                      <td><strong>#{b.id}</strong></td>
                      <td>
                        <strong>{b.customer_name}</strong>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>📧 {b.email}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📞 {b.phone}</div>
                      </td>
                      <td>
                        <strong>{b.vehicle_name || `Vehicle #${b.vehicle_id}`}</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.vehicle_type}</div>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>
                        <div>From: <strong>{b.start_date}</strong></div>
                        <div>To: <strong>{b.end_date}</strong></div>
                      </td>
                      <td style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1rem' }}>
                        ₹{Number(b.total_amount).toLocaleString('en-IN')}
                      </td>
                      <td>
                        <select
                          className="form-control"
                          style={{
                            padding: '4px 8px',
                            fontSize: '0.82rem',
                            fontWeight: '600',
                            borderRadius: '4px',
                            background:
                              b.booking_status === 'Completed'
                                ? '#dcfce7'
                                : b.booking_status === 'Cancelled'
                                ? '#fee2e2'
                                : '#e0f2fe',
                            color:
                              b.booking_status === 'Completed'
                                ? '#166534'
                                : b.booking_status === 'Cancelled'
                                ? '#991b1b'
                                : '#075985',
                          }}
                          value={b.booking_status || 'Confirmed'}
                          onChange={(e) => handleUpdateStatus(b.id, e.target.value)}
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Active">Active</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                            onClick={() => setActiveInvoice(b)}
                            title="View Invoice"
                          >
                            📄 Invoice
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                            onClick={() => handleDeleteBooking(b.id)}
                            title="Delete Reservation"
                          >
                            🗑️
                          </button>
                        </div>
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
              <h3>No Reservations Found</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>
                {searchTerm || statusFilter !== 'All'
                  ? 'No bookings match your current search or status filter.'
                  : 'There are no active vehicle reservations in the database right now.'}
              </p>
              <button
                className="btn btn-primary btn-sm"
                style={{ marginTop: '16px' }}
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('All');
                  setSubTab('new');
                }}
              >
                Create New Booking
              </button>
            </div>
          )}
        </div>
      )}

      {/* Invoice Modal for Existing Booking */}
      {activeInvoice && (
        <div className="modal-overlay" onClick={() => setActiveInvoice(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div className="modal-header" style={{ background: 'var(--primary)', color: '#fff', borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)' }}>
              <div>
                <h3 style={{ color: '#fff', margin: 0 }}>📄 Official Rental Receipt</h3>
                <span style={{ fontSize: '0.82rem', opacity: 0.9 }}>Booking Reference #{activeInvoice.id}</span>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none' }}
                onClick={() => setActiveInvoice(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body" style={{ padding: '24px' }}>
              <div style={{ background: 'var(--bg-alt)', borderRadius: 'var(--radius-md)', padding: '16px', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Customer Name:</span>
                  <strong>{activeInvoice.customer_name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Email & Phone:</span>
                  <span>{activeInvoice.email} • {activeInvoice.phone}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Vehicle Model:</span>
                  <strong>{activeInvoice.vehicle_name} ({activeInvoice.vehicle_type})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Rental Period:</span>
                  <span>{activeInvoice.start_date} to {activeInvoice.end_date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Current Status:</span>
                  <span className="badge-available">{activeInvoice.booking_status || 'Confirmed'}</span>
                </div>
                <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 'bold' }}>
                  <span>Total Rental Bill:</span>
                  <span style={{ color: 'var(--primary)' }}>₹{Number(activeInvoice.total_amount).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
                🖨️ Print Receipt
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => setActiveInvoice(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
