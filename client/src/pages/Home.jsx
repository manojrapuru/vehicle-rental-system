import React, { useState } from 'react';
import VehicleCard from '../components/VehicleCard';

/**
 * Home Page Component
 * Contains:
 * - Hero section with Quick Search Widget and CTA buttons
 * - Live Fleet statistics
 * - Featured Available Vehicles preview
 * - Premier Rental Services
 * - Interactive FAQ accordion
 * - Contact Us section
 */
export default function Home({ vehicles, setActiveTab, onBookVehicle }) {
  const [quickType, setQuickType] = useState('All');
  const [quickPickup, setQuickPickup] = useState(new Date().toISOString().split('T')[0]);
  const [quickDropoff, setQuickDropoff] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [openFaq, setOpenFaq] = useState(null);

  const availableVehicles = vehicles.filter((v) => v.availability === 'Available').slice(0, 3);

  const handleQuickSearch = (e) => {
    e.preventDefault();
    setActiveTab('vehicles');
  };

  const faqs = [
    {
      q: 'What documents are required to rent a vehicle?',
      a: 'You only need a valid Government ID (Aadhaar/Passport/Voter ID) and a valid Driving License (commercial or private).',
    },
    {
      q: 'Is there any security deposit required?',
      a: 'We offer zero-deposit rentals on most economy cars and bikes. Luxury vehicles require a nominal refundable deposit.',
    },
    {
      q: 'What is the fuel policy?',
      a: 'We operate on a Same-to-Same fuel policy. The fuel level when you return the vehicle should match the level at pickup.',
    },
    {
      q: 'Can I cancel or reschedule my booking?',
      a: 'Yes, cancellations made at least 24 hours prior to the scheduled pickup receive a 100% full refund with instant processing.',
    },
  ];

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div>
            <div className="hero-badge">⚡ Easy, Fast & Reliable Rentals</div>
            <h1 className="hero-title">
              Drive Your Journey With <span>Premium Rentals</span>
            </h1>
            <p className="hero-description">
              Choose from our wide range of sanitized cars, touring bikes, family vans, and electric vehicles.
              Real-time database sync with zero hidden charges.
            </p>

            <div className="hero-buttons">
              <button
                className="btn btn-primary"
                onClick={() => setActiveTab('booking')}
              >
                🚀 Rent a Vehicle
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setActiveTab('vehicles')}
              >
                🚗 View All Vehicles ({vehicles.length})
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  const contactEl = document.getElementById('contact-section');
                  if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                📞 Contact Us
              </button>
            </div>
          </div>

          {/* Quick Search Widget */}
          <div className="card" style={{ padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>⚡ Quick Fleet Finder</h3>
              <span className="badge-available">Live Database</span>
            </div>

            <form onSubmit={handleQuickSearch} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.82rem' }}>Vehicle Type</label>
                <select
                  className="form-control"
                  value={quickType}
                  onChange={(e) => setQuickType(e.target.value)}
                >
                  <option value="All">All Categories (Cars, Bikes, SUVs, EVs)</option>
                  <option value="Car">Cars</option>
                  <option value="Bike">Bikes</option>
                  <option value="Van">Vans</option>
                  <option value="SUV">SUVs</option>
                  <option value="EV">Electric Vehicles (EV)</option>
                </select>
              </div>

              <div className="form-row" style={{ margin: 0 }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>Pick-up Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={quickPickup}
                    onChange={(e) => setQuickPickup(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>Drop-off Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={quickDropoff}
                    onChange={(e) => setQuickDropoff(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', marginTop: '6px' }}
              >
                🔍 Search Available Rides →
              </button>
            </form>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.2rem' }}>
                  {vehicles.filter((v) => v.availability === 'Available').length}
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Ready for Pickup</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.2rem' }}>₹800/day</div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Starting Price</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED AVAILABLE VEHICLES */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Popular Fleet</span>
            <h2 className="section-title">Featured Ready-to-Drive Vehicles</h2>
            <p className="section-subtitle">
              Hand-picked verified vehicles available right now for instant booking.
            </p>
          </div>

          <div className="vehicles-grid">
            {availableVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onBook={onBookVehicle}
              />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <button
              className="btn btn-primary"
              onClick={() => setActiveTab('vehicles')}
            >
              Explore Entire Fleet ({vehicles.length} Vehicles) →
            </button>
          </div>
        </div>
      </section>

      {/* 3. SERVICES SECTION */}
      <section className="section" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">What We Offer</span>
            <h2 className="section-title">Our Premier Rental Services</h2>
            <p className="section-subtitle">
              End-to-end mobility solutions tailored for personal travel, road trips, and daily commutes.
            </p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🛠️</div>
              <h3>24/7 Roadside Assistance</h3>
              <p>Round-the-clock emergency support and free on-site breakdown assistance across the city.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">📅</div>
              <h3>Flexible Daily & Weekly Plans</h3>
              <p>Rent by the day or week with instant confirmation and easy online extensions.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">🛡️</div>
              <h3>Insurance Coverage Included</h3>
              <p>Transparent pricing with standard comprehensive damage protection included.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">✨</div>
              <h3>Cleaned & Sanitized Fleet</h3>
              <p>Every car and bike is thoroughly inspected, serviced, and sanitized before handover.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQ ACCORDION SECTION */}
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="section-header">
            <span className="section-tag">Got Questions?</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Everything you need to know about vehicle rentals, documentation, and pricing.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="card"
                  style={{
                    padding: '16px 20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: isOpen ? '1px solid var(--primary)' : '1px solid var(--border)',
                  }}
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '1rem', margin: 0 }}>{faq.q}</h4>
                    <span style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                      {isOpen ? '−' : '+'}
                    </span>
                  </div>
                  {isOpen && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '10px', lineHeight: '1.6' }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. CONTACT US SECTION */}
      <section id="contact-section" className="section" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Get In Touch</span>
            <h2 className="section-title">Contact Us</h2>
            <p className="section-subtitle">
              Have questions about vehicle booking, bulk rentals, or custom durations? Reach out to us.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div className="service-card" style={{ textAlign: 'center' }}>
              <div className="service-icon" style={{ margin: '0 auto 16px' }}>📍</div>
              <h3>Main Hub Location</h3>
              <p>Vehicle Rental Hub, Tech Park Avenue, College Road, City Campus</p>
            </div>

            <div className="service-card" style={{ textAlign: 'center' }}>
              <div className="service-icon" style={{ margin: '0 auto 16px' }}>📞</div>
              <h3>24/7 Helpline</h3>
              <p>+91 98765 43210 / +91 91234 56789<br />Available 24 hours, 7 days a week</p>
            </div>

            <div className="service-card" style={{ textAlign: 'center' }}>
              <div className="service-icon" style={{ margin: '0 auto 16px' }}>✉️</div>
              <h3>Email Support</h3>
              <p>support@vehiclerentalsystem.com<br />help@university.edu</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
