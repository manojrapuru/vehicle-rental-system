import React, { useState, useEffect } from 'react';

/**
 * BookingForm Component
 * Demonstrates:
 * - Controlled React Form (value, onChange, onSubmit)
 * - useState for multiple states (form values, calculation, booking status, error feedback)
 * - useEffect for real-time rent calculation and vehicle sync
 * - String templates, input validation, and confirmation modal
 */
export default function BookingForm({ vehicles, preselectedVehicle, onBookingSuccess }) {
  // 1. Form state using useState hook
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    vehicle_id: preselectedVehicle ? preselectedVehicle.id : '',
    start_date: '',
    end_date: '',
  });

  // 2. Status & summary states
  const [selectedVehicle, setSelectedVehicle] = useState(preselectedVehicle || null);
  const [rentalDays, setRentalDays] = useState(1);
  const [estimatedTotal, setEstimatedTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Sync when preselectedVehicle prop changes
  useEffect(() => {
    if (preselectedVehicle) {
      setFormData((prev) => ({ ...prev, vehicle_id: preselectedVehicle.id }));
      setSelectedVehicle(preselectedVehicle);
    }
  }, [preselectedVehicle]);

  // Update selected vehicle object when vehicle_id changes
  useEffect(() => {
    if (formData.vehicle_id) {
      const found = vehicles.find((v) => String(v.id) === String(formData.vehicle_id));
      setSelectedVehicle(found || null);
    } else {
      setSelectedVehicle(null);
    }
  }, [formData.vehicle_id, vehicles]);

  // Calculate rental duration and estimated amount dynamically
  useEffect(() => {
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      const diffTime = end - start;
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const validDays = days > 0 ? days : 1;
      setRentalDays(validDays);

      if (selectedVehicle) {
        setEstimatedTotal(validDays * Number(selectedVehicle.rent));
      }
    } else if (selectedVehicle) {
      setRentalDays(1);
      setEstimatedTotal(Number(selectedVehicle.rent));
    } else {
      setRentalDays(1);
      setEstimatedTotal(0);
    }
  }, [formData.start_date, formData.end_date, selectedVehicle]);

  // Handle input changes (Controlled Form onChange)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMsg('');
  };

  // Handle Form Submission (onSubmit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Form Validations
    if (!formData.customer_name.trim()) {
      setErrorMsg('Please enter customer full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      setErrorMsg('Please provide a valid phone number.');
      return;
    }
    if (!formData.vehicle_id) {
      setErrorMsg('Please select a vehicle from the fleet.');
      return;
    }
    if (!formData.start_date || !formData.end_date) {
      setErrorMsg('Please select both rental start and end dates.');
      return;
    }
    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      setErrorMsg('Rental end date cannot be earlier than start date.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to submit booking');
      }

      // Success
      setConfirmedBooking(result.data);
      if (onBookingSuccess) {
        onBookingSuccess(result.data);
      }

      // Reset form
      setFormData({
        customer_name: '',
        email: '',
        phone: '',
        vehicle_id: '',
        start_date: '',
        end_date: '',
      });
    } catch (err) {
      setErrorMsg(err.message || 'Error occurred while contacting server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="booking-grid">
        {/* Left Side: Controlled React Form */}
        <div className="form-card">
          <h2 style={{ marginBottom: '8px', fontSize: '1.6rem' }}>📝 Vehicle Reservation Form</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.92rem' }}>
            Fill out the details below to book your ride. Your reservation will be confirmed instantly.
          </p>

          {errorMsg && (
            <div className="alert alert-danger">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Customer Name */}
            <div className="form-group">
              <label className="form-label">
                Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="customer_name"
                className="form-control"
                placeholder="e.g. Rahul Sharma"
                value={formData.customer_name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email & Phone */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="e.g. rahul@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Vehicle Selection Dropdown */}
            <div className="form-group">
              <label className="form-label">
                Select Vehicle <span className="required">*</span>
              </label>
              <select
                name="vehicle_id"
                className="form-control"
                value={formData.vehicle_id}
                onChange={handleChange}
                required
              >
                <option value="">-- Choose a vehicle from fleet --</option>
                {vehicles.map((v) => (
                  <option
                    key={v.id}
                    value={v.id}
                    disabled={v.availability !== 'Available'}
                  >
                    {v.name} ({v.type}) - ₹{v.rent}/day {v.availability !== 'Available' ? '[Unavailable]' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Dates */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Rental Start Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  name="start_date"
                  className="form-control"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Rental End Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  name="end_date"
                  className="form-control"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary btn-block"
              style={{ marginTop: '12px', padding: '14px' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: '18px', height: '18px', borderTopColor: '#fff' }}></span>
                  Processing Booking...
                </>
              ) : (
                '🚀 Confirm & Book Vehicle'
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Dynamic Booking Summary */}
        <div className="summary-card">
          <h3>📊 Rental Summary</h3>

          <div className="summary-row">
            <span>Selected Vehicle:</span>
            <strong>{selectedVehicle ? selectedVehicle.name : 'None Selected'}</strong>
          </div>

          <div className="summary-row">
            <span>Vehicle Type:</span>
            <span>{selectedVehicle ? selectedVehicle.type : '-'}</span>
          </div>

          <div className="summary-row">
            <span>Daily Rental Rate:</span>
            <span>{selectedVehicle ? `₹${selectedVehicle.rent} / day` : '₹0'}</span>
          </div>

          <div className="summary-row">
            <span>Rental Duration:</span>
            <span>{rentalDays} day{rentalDays > 1 ? 's' : ''}</span>
          </div>

          <div className="summary-row">
            <span>Status:</span>
            <span style={{ color: '#4ade80' }}>Instant Confirmation</span>
          </div>

          <div className="summary-row total">
            <span>Total Payable:</span>
            <span className="summary-total-amount">₹{estimatedTotal.toLocaleString('en-IN')}</span>
          </div>

          <div
            style={{
              marginTop: '24px',
              padding: '14px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              color: '#94a3b8',
            }}
          >
            🛡️ <strong>Includes:</strong> Zero hidden fees, comprehensive insurance coverage, and 24/7 breakdown assistance.
          </div>
        </div>
      </div>

      {/* Confirmation Modal Receipt (Appears after successful submission) */}
      {confirmedBooking && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                🎉 Booking Confirmed!
              </h3>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setConfirmedBooking(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div
                style={{
                  textAlign: 'center',
                  padding: '16px',
                  background: 'var(--success-bg)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '20px',
                  border: '1px solid var(--success-border)',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>✅</div>
                <h4 style={{ color: '#065f46' }}>Reservation Reference #{confirmedBooking.id}</h4>
                <p style={{ color: '#047857', fontSize: '0.9rem' }}>
                  Thank you, <strong>{confirmedBooking.customer_name}</strong>! Your vehicle has been reserved.
                </p>
              </div>

              <div style={{ fontSize: '0.92rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Vehicle:</span>
                  <strong>{confirmedBooking.vehicle_name || selectedVehicle?.name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Dates:</span>
                  <span>{confirmedBooking.start_date} to {confirmedBooking.end_date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Contact Email:</span>
                  <span>{confirmedBooking.email}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Contact Phone:</span>
                  <span>{confirmedBooking.phone}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                  <span style={{ fontWeight: 'bold' }}>Total Rent Paid:</span>
                  <strong style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>
                    ₹{confirmedBooking.total_amount}
                  </strong>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={() => setConfirmedBooking(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
