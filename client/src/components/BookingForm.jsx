import React, { useState, useEffect } from 'react';

/**
 * BookingForm Component
 * Includes:
 * - Real-time rental calculation
 * - Promo code application (e.g. DRIVE20, LAB100)
 * - Payment mode selection
 * - Interactive Invoice / Confirmation modal with Print / PDF action
 */
export default function BookingForm({
  vehicles,
  preselectedVehicle,
  onBookingSuccess,
  onViewAllBookings,
}) {
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  // 1. Form state
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    vehicle_id: preselectedVehicle ? preselectedVehicle.id : '',
    start_date: todayStr,
    end_date: tomorrowStr,
    payment_method: 'UPI / QR Code',
    notes: '',
  });

  // 2. Pricing & discount states
  const [selectedVehicle, setSelectedVehicle] = useState(preselectedVehicle || null);
  const [rentalDays, setRentalDays] = useState(1);
  const [subTotal, setSubTotal] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [promoMessage, setPromoMessage] = useState('');
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

  // Calculate rental duration and amount dynamically
  useEffect(() => {
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      const diffTime = end - start;
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const validDays = days > 0 ? days : 1;
      setRentalDays(validDays);

      if (selectedVehicle) {
        const rawSubtotal = validDays * Number(selectedVehicle.rent);
        setSubTotal(rawSubtotal);

        // Re-apply discount if promo active
        if (appliedPromo === 'DRIVE20') {
          setDiscountAmount(Math.round(rawSubtotal * 0.2));
        } else if (appliedPromo === 'LAB100') {
          setDiscountAmount(Math.min(100, rawSubtotal));
        } else {
          setDiscountAmount(0);
        }
      }
    } else if (selectedVehicle) {
      setRentalDays(1);
      const rawSubtotal = Number(selectedVehicle.rent);
      setSubTotal(rawSubtotal);
      setDiscountAmount(0);
    } else {
      setRentalDays(1);
      setSubTotal(0);
      setDiscountAmount(0);
    }
  }, [formData.start_date, formData.end_date, selectedVehicle, appliedPromo]);

  // Apply promo code handler
  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'DRIVE20') {
      setAppliedPromo('DRIVE20');
      const disc = Math.round(subTotal * 0.2);
      setDiscountAmount(disc);
      setPromoMessage('🎉 Promo DRIVE20 Applied! 20% discount added.');
    } else if (code === 'LAB100') {
      setAppliedPromo('LAB100');
      const disc = Math.min(100, subTotal);
      setDiscountAmount(disc);
      setPromoMessage('🎉 Promo LAB100 Applied! ₹100 flat discount added.');
    } else {
      setPromoMessage('❌ Invalid coupon code. Try DRIVE20 or LAB100');
      setTimeout(() => setPromoMessage(''), 3000);
    }
  };

  const gstTax = Math.round(subTotal * 0.05); // 5% GST
  const finalPayable = Math.max(0, subTotal - discountAmount + gstTax);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMsg('');
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.customer_name.trim()) {
      setErrorMsg('Please enter customer full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      setErrorMsg('Please provide a valid 10-digit phone number.');
      return;
    }
    if (!formData.vehicle_id) {
      setErrorMsg('Please select an available vehicle from the fleet.');
      return;
    }
    if (!formData.start_date || !formData.end_date) {
      setErrorMsg('Please select both Start and End rental dates.');
      return;
    }
    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      setErrorMsg('Drop-off date cannot be earlier than Pick-up date.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        customer_name: formData.customer_name,
        email: formData.email,
        phone: formData.phone,
        vehicle_id: parseInt(formData.vehicle_id, 10),
        start_date: formData.start_date,
        end_date: formData.end_date,
        total_amount: finalPayable,
        payment_method: formData.payment_method,
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Error occurred while saving reservation');
      }

      setConfirmedBooking(result.data);

      if (onBookingSuccess) {
        onBookingSuccess(result.data);
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      setErrorMsg(err.message || 'Failed to submit reservation. Please check server.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const resetForm = () => {
    setFormData({
      customer_name: '',
      email: '',
      phone: '',
      vehicle_id: '',
      start_date: todayStr,
      end_date: tomorrowStr,
      payment_method: 'UPI / QR Code',
      notes: '',
    });
    setSelectedVehicle(null);
    setConfirmedBooking(null);
    setAppliedPromo('');
    setDiscountAmount(0);
    setPromoCode('');
  };

  return (
    <div>
      {/* 2-Column Booking Layout */}
      <div className="booking-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Left Column: Form */}
        <div className="card" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>📝 Customer & Trip Details</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
            Fill in your details below to reserve your vehicle with instant confirmation.
          </p>

          {errorMsg && (
            <div className="alert alert-danger" style={{ marginBottom: '16px' }}>
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
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

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email Address *</label>
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
                <label className="form-label">Phone Number *</label>
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

            <div className="form-group">
              <label className="form-label">Select Vehicle from Fleet *</label>
              <select
                name="vehicle_id"
                className="form-control"
                value={formData.vehicle_id}
                onChange={handleChange}
                required
              >
                <option value="">-- Choose a Vehicle --</option>
                {vehicles.map((v) => (
                  <option
                    key={v.id}
                    value={v.id}
                    disabled={v.availability !== 'Available'}
                  >
                    {v.name} ({v.type}) - ₹{v.rent}/day {v.availability !== 'Available' ? '❌ [Booked]' : '✅ [Available]'}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Pick-up Date *</label>
                <input
                  type="date"
                  name="start_date"
                  className="form-control"
                  min={todayStr}
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Drop-off Date *</label>
                <input
                  type="date"
                  name="end_date"
                  className="form-control"
                  min={formData.start_date || todayStr}
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Payment Preference</label>
              <select
                name="payment_method"
                className="form-control"
                value={formData.payment_method}
                onChange={handleChange}
              >
                <option value="UPI / QR Code">📱 UPI (Google Pay, PhonePe, Paytm)</option>
                <option value="Credit / Debit Card">💳 Credit / Debit Card</option>
                <option value="Net Banking">🏦 Net Banking</option>
                <option value="Pay at Pickup">💵 Pay Cash upon Vehicle Pickup</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '12px' }}
              disabled={loading || !formData.vehicle_id || (selectedVehicle && selectedVehicle.availability !== 'Available')}
            >
              {loading
                ? 'Processing Reservation...'
                : selectedVehicle && selectedVehicle.availability !== 'Available'
                ? 'Selected Vehicle Is Booked'
                : `⚡ Confirm & Reserve (₹${finalPayable.toLocaleString('en-IN')})`}
            </button>
          </form>
        </div>

        {/* Right Column: Dynamic Price Breakdown & Promo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Selected Vehicle Preview Card */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '14px' }}>🚗 Vehicle Summary</h3>

            {selectedVehicle ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.15rem' }}>{selectedVehicle.name}</h4>
                    <span className="vehicle-type-tag" style={{ display: 'inline-block', marginTop: '4px' }}>
                      {selectedVehicle.type}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                      ₹{selectedVehicle.rent}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>per day</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Rental Duration:</span>
                    <strong>{rentalDays} {rentalDays === 1 ? 'Day' : 'Days'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Base Rent ({rentalDays} × ₹{selectedVehicle.rent}):</span>
                    <span>₹{subTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>GST (5%):</span>
                    <span>₹{gstTax.toLocaleString('en-IN')}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: 'bold' }}>
                      <span>Discount ({appliedPromo}):</span>
                      <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div style={{ borderTop: '2px dashed var(--border)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 'bold' }}>
                    <span>Estimated Total:</span>
                    <span style={{ color: 'var(--primary)' }}>₹{finalPayable.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2.4rem', marginBottom: '8px' }}>🚘</div>
                <p>Select a vehicle on the left to view the real-time cost breakdown.</p>
              </div>
            )}
          </div>

          {/* Promo Code Card */}
          <div className="card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '8px' }}>🏷️ Have a Promo Code?</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Use coupon <strong>DRIVE20</strong> for 20% off or <strong>LAB100</strong> for ₹100 off!
            </p>

            <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="form-control"
                style={{ textTransform: 'uppercase', fontSize: '0.85rem' }}
                placeholder="Enter DRIVE20"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button type="submit" className="btn btn-secondary btn-sm" style={{ whiteSpace: 'nowrap' }}>
                Apply
              </button>
            </form>

            {promoMessage && (
              <div style={{ marginTop: '8px', fontSize: '0.82rem', color: appliedPromo ? '#16a34a' : '#dc2626' }}>
                {promoMessage}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Confirmation / Invoice Modal */}
      {confirmedBooking && (
        <div className="modal-overlay" onClick={() => setConfirmedBooking(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div className="modal-header" style={{ background: 'var(--primary)', color: '#fff', borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)' }}>
              <div>
                <h3 style={{ color: '#fff', margin: 0 }}>🎉 Booking Confirmed!</h3>
                <span style={{ fontSize: '0.82rem', opacity: 0.9 }}>Reservation #{confirmedBooking.id} • Vehicle Rental System</span>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none' }}
                onClick={() => setConfirmedBooking(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body" style={{ padding: '24px' }}>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>✅</div>
                <h4 style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>Vehicle Reserved Successfully</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  A confirmation email has been dispatched to <strong>{confirmedBooking.email}</strong>.
                </p>
              </div>

              {/* Invoice Breakdown */}
              <div style={{ background: 'var(--bg-alt)', borderRadius: 'var(--radius-md)', padding: '16px', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Customer Name:</span>
                  <strong>{confirmedBooking.customer_name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Phone:</span>
                  <span>{confirmedBooking.phone}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Vehicle Booked:</span>
                  <strong>{confirmedBooking.vehicle_name} ({confirmedBooking.vehicle_type})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Rental Period:</span>
                  <span>{confirmedBooking.start_date} to {confirmedBooking.end_date} ({confirmedBooking.rental_days || rentalDays} Days)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Booking Status:</span>
                  <span className="badge-available">{confirmedBooking.booking_status || 'Confirmed'}</span>
                </div>
                <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 'bold' }}>
                  <span>Total Rent Paid / Due:</span>
                  <span style={{ color: 'var(--primary)' }}>₹{Number(confirmedBooking.total_amount).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
                🖨️ Print Invoice
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={resetForm}
                >
                  Book Another
                </button>
                {onViewAllBookings && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setConfirmedBooking(null);
                      onViewAllBookings();
                    }}
                  >
                    View in My Bookings →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
