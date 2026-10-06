import React, { useState, useEffect } from 'react';
import { apiUrl } from '../config/api';

/**
 * BookingForm Component (Real-World Commercial Grade)
 * Includes:
 * - Pick-up / Delivery Location selector
 * - Self-Drive vs Chauffeur Driver option
 * - Damage Protection Insurance Tier selection
 * - Live dynamic cost calculation with promo codes
 * - Official Invoice / Receipt Modal with Print & Download capabilities
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
    pickup_location: 'City Airport Terminal (T1 & T2)',
    driver_option: 'self-drive', // 'self-drive' or 'chauffeur' (+₹600/day)
    insurance_plan: 'standard', // 'standard' (₹0) or 'zero-dep' (+₹250/day)
    payment_method: 'UPI / QR Code',
    notes: '',
  });

  // 2. Pricing & discount states
  const [selectedVehicle, setSelectedVehicle] = useState(preselectedVehicle || null);
  const [rentalDays, setRentalDays] = useState(1);
  const [baseRentTotal, setBaseRentTotal] = useState(0);
  const [driverAddonCost, setDriverAddonCost] = useState(0);
  const [insuranceCost, setInsuranceCost] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [promoMessage, setPromoMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Sync when preselectedVehicle changes
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
    let days = 1;
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      const diffTime = end - start;
      const calculated = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      days = calculated > 0 ? calculated : 1;
    }
    setRentalDays(days);

    if (selectedVehicle) {
      const base = days * Number(selectedVehicle.rent);
      setBaseRentTotal(base);

      // Driver fee: ₹600/day if chauffeur selected (not applicable for bikes)
      const isChauffeur = formData.driver_option === 'chauffeur' && selectedVehicle.type?.toLowerCase() !== 'bike';
      const driverCost = isChauffeur ? days * 600 : 0;
      setDriverAddonCost(driverCost);

      // Insurance fee: ₹250/day if zero-dep selected
      const insCost = formData.insurance_plan === 'zero-dep' ? days * 250 : 0;
      setInsuranceCost(insCost);

      const subtotalBeforeDiscount = base + driverCost + insCost;

      // Apply promo discounts
      if (appliedPromo === 'DRIVE20') {
        setDiscountAmount(Math.round(subtotalBeforeDiscount * 0.2));
      } else if (appliedPromo === 'LAB100') {
        setDiscountAmount(Math.min(100, subtotalBeforeDiscount));
      } else {
        setDiscountAmount(0);
      }
    } else {
      setBaseRentTotal(0);
      setDriverAddonCost(0);
      setInsuranceCost(0);
      setDiscountAmount(0);
    }
  }, [
    formData.start_date,
    formData.end_date,
    formData.driver_option,
    formData.insurance_plan,
    selectedVehicle,
    appliedPromo,
  ]);

  // Apply promo code handler
  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    const subtotal = baseRentTotal + driverAddonCost + insuranceCost;

    if (code === 'DRIVE20') {
      setAppliedPromo('DRIVE20');
      const disc = Math.round(subtotal * 0.2);
      setDiscountAmount(disc);
      setPromoMessage('🎉 Promo DRIVE20 Applied! 20% discount applied.');
    } else if (code === 'LAB100') {
      setAppliedPromo('LAB100');
      const disc = Math.min(100, subtotal);
      setDiscountAmount(disc);
      setPromoMessage('🎉 Promo LAB100 Applied! ₹100 flat discount applied.');
    } else {
      setPromoMessage('❌ Invalid coupon code. Try DRIVE20 or LAB100');
      setTimeout(() => setPromoMessage(''), 3000);
    }
  };

  const subTotalCombined = baseRentTotal + driverAddonCost + insuranceCost;
  const taxableAmount = Math.max(0, subTotalCombined - discountAmount);
  const gstTax = Math.round(taxableAmount * 0.05); // 5% GST
  const finalPayable = taxableAmount + gstTax;

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
        pickup_location: formData.pickup_location,
        driver_option: formData.driver_option,
        insurance_plan: formData.insurance_plan,
        payment_method: formData.payment_method,
      };

      const response = await fetch(apiUrl('/api/bookings'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Error occurred while saving reservation');
      }

      setConfirmedBooking({
        ...result.data,
        pickup_location: formData.pickup_location,
        driver_option: formData.driver_option,
        insurance_plan: formData.insurance_plan,
        vehicle_image: selectedVehicle?.image,
      });

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
      pickup_location: 'City Airport Terminal (T1 & T2)',
      driver_option: 'self-drive',
      insurance_plan: 'standard',
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
      <div className="booking-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
        {/* Left Column: Form */}
        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.4rem', margin: 0 }}>📝 Rental Booking Form</h2>
            <span className="badge-available">Instant Confirmation</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '22px' }}>
            Book your self-drive or chauffeur-driven vehicle with full insurance coverage.
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
                  placeholder="e.g. rahul.sharma@example.com"
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

            {/* Pick-up / Delivery Location */}
            <div className="form-group">
              <label className="form-label">Pick-up & Drop-off Hub Location</label>
              <select
                name="pickup_location"
                className="form-control"
                value={formData.pickup_location}
                onChange={handleChange}
              >
                <option value="City Airport Terminal (T1 & T2)">✈️ City Airport Terminal (T1 & T2)</option>
                <option value="Central Railway Station Hub">🚆 Central Railway Station Hub</option>
                <option value="Tech Park / Downtown Hub">🏢 Tech Park / Downtown Center</option>
                <option value="Doorstep Delivery (Home / Hotel)">🏠 Doorstep Delivery to Address (+Free)</option>
              </select>
            </div>

            {/* Drive Mode & Insurance Options */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Driving Preference</label>
                <select
                  name="driver_option"
                  className="form-control"
                  value={formData.driver_option}
                  onChange={handleChange}
                >
                  <option value="self-drive">🚗 Self-Drive (Included)</option>
                  <option value="chauffeur" disabled={selectedVehicle?.type?.toLowerCase() === 'bike'}>
                    👨‍✈️ With Chauffeur (+₹600/day)
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Protection Package</label>
                <select
                  name="insurance_plan"
                  className="form-control"
                  value={formData.insurance_plan}
                  onChange={handleChange}
                >
                  <option value="standard">🛡️ Standard Basic Coverage (Free)</option>
                  <option value="zero-dep">🌟 Zero-Dep Comprehensive (+₹250/day)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Payment Mode</label>
              <select
                name="payment_method"
                className="form-control"
                value={formData.payment_method}
                onChange={handleChange}
              >
                <option value="UPI / QR Code">📱 UPI (Google Pay, PhonePe, Paytm)</option>
                <option value="Credit / Debit Card">💳 Credit / Debit Card (Visa, Mastercard)</option>
                <option value="Net Banking">🏦 Net Banking (All Major Banks)</option>
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
                ? 'Processing Your Reservation...'
                : selectedVehicle && selectedVehicle.availability !== 'Available'
                ? 'Selected Vehicle Is Booked'
                : `⚡ Complete Reservation (₹${finalPayable.toLocaleString('en-IN')})`}
            </button>
          </form>
        </div>

        {/* Right Column: Dynamic Price Breakdown & Selected Vehicle Visual */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Selected Vehicle Preview Card with Real Photo */}
          <div className="card" style={{ padding: '24px', overflow: 'hidden' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '14px' }}>🚗 Selected Ride Summary</h3>

            {selectedVehicle ? (
              <div>
                {selectedVehicle.image && (
                  <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '160px', marginBottom: '14px' }}>
                    <img
                      src={selectedVehicle.image}
                      alt={selectedVehicle.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.2rem', margin: 0 }}>{selectedVehicle.name}</h4>
                    <span className="vehicle-type-tag" style={{ display: 'inline-block', marginTop: '6px' }}>
                      {selectedVehicle.type}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                      ₹{selectedVehicle.rent}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>per 24 hrs</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Rental Duration:</span>
                    <strong>{rentalDays} {rentalDays === 1 ? 'Day' : 'Days'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Base Rent ({rentalDays} × ₹{selectedVehicle.rent}):</span>
                    <span>₹{baseRentTotal.toLocaleString('en-IN')}</span>
                  </div>

                  {driverAddonCost > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Chauffeur Driver ({rentalDays} × ₹600):</span>
                      <span>₹{driverAddonCost.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {insuranceCost > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Zero-Dep Insurance ({rentalDays} × ₹250):</span>
                      <span>₹{insuranceCost.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: 'bold' }}>
                      <span>Discount Coupon ({appliedPromo}):</span>
                      <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>GST (5%):</span>
                    <span>₹{gstTax.toLocaleString('en-IN')}</span>
                  </div>

                  <div style={{ borderTop: '2px dashed var(--border)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    <span>Final Payable Total:</span>
                    <span style={{ color: 'var(--primary)' }}>₹{finalPayable.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '36px 10px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🚘</div>
                <p>Select any available vehicle on the left to view the itemized price breakdown.</p>
              </div>
            )}
          </div>

          {/* Promo Code Card */}
          <div className="card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '8px' }}>🏷️ Apply Promo Code</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Use coupon <strong>DRIVE20</strong> for 20% off or <strong>LAB100</strong> for ₹100 flat off!
            </p>

            <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="form-control"
                style={{ textTransform: 'uppercase', fontSize: '0.85rem' }}
                placeholder="Enter promo code"
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
            <div className="modal-header" style={{ background: 'var(--primary)', color: '#fff', borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)' }}>
              <div>
                <h3 style={{ color: '#fff', margin: 0 }}>🎉 Reservation Confirmed!</h3>
                <span style={{ fontSize: '0.82rem', opacity: 0.9 }}>Booking Reference ID #{confirmedBooking.id} • Official Tax Invoice</span>
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
              <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                <div style={{ fontSize: '2.8rem', marginBottom: '4px' }}>✅</div>
                <h4 style={{ color: 'var(--primary)', fontSize: '1.3rem' }}>Vehicle Reserved & Booked</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Confirmation SMS & Email sent to <strong>{confirmedBooking.email}</strong> / <strong>{confirmedBooking.phone}</strong>.
                </p>
              </div>

              {/* Invoice Breakdown */}
              <div style={{ background: 'var(--bg-alt)', borderRadius: 'var(--radius-md)', padding: '18px', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Customer Name:</span>
                  <strong>{confirmedBooking.customer_name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Vehicle Model:</span>
                  <strong>{confirmedBooking.vehicle_name} ({confirmedBooking.vehicle_type})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Pick-up / Drop Location:</span>
                  <span>{confirmedBooking.pickup_location || formData.pickup_location}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Trip Dates:</span>
                  <span>{confirmedBooking.start_date} to {confirmedBooking.end_date} ({rentalDays} Days)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Drive Preference:</span>
                  <span style={{ textTransform: 'capitalize' }}>{confirmedBooking.driver_option || formData.driver_option}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Protection Plan:</span>
                  <span>{formData.insurance_plan === 'zero-dep' ? 'Zero-Dep Comprehensive' : 'Standard Basic'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Booking Status:</span>
                  <span className="badge-available">{confirmedBooking.booking_status || 'Confirmed'}</span>
                </div>
                <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 'bold' }}>
                  <span>Total Amount Paid / Due:</span>
                  <span style={{ color: 'var(--primary)' }}>₹{Number(confirmedBooking.total_amount).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
                🖨️ Print / Save PDF
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={resetForm}
                >
                  Book Another Ride
                </button>
                {onViewAllBookings && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setConfirmedBooking(null);
                      onViewAllBookings();
                    }}
                  >
                    Go to My Bookings →
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
