import React from 'react';
import VehicleCard from '../components/VehicleCard';

/**
 * Home Page Component
 * Contains:
 * - Hero section with stats and CTA buttons
 * - Services section
 * - Why Choose Us section
 * - Quick Fleet Preview
 * - Contact Us section
 */
export default function Home({ vehicles, setActiveTab, onBookVehicle }) {
  const availableVehicles = vehicles.filter((v) => v.availability === 'Available').slice(0, 3);

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
              Best rates with zero hidden charges.
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
                🚗 View All Vehicles
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

          {/* Hero Statistics Card */}
          <div className="hero-stats-card">
            <div className="stats-header">
              <h3 style={{ fontSize: '1.1rem' }}>Fleet Performance</h3>
              <span className="badge-available">Live System</span>
            </div>
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-number">{vehicles.length}</div>
                <div className="stat-label">Total Fleet</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">
                  {vehicles.filter((v) => v.availability === 'Available').length}
                </div>
                <div className="stat-label">Available Now</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">₹800</div>
                <div className="stat-label">Starting Rate/Day</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">4.9 ★</div>
                <div className="stat-label">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED VEHICLES PREVIEW */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Popular Choices</span>
            <h2 className="section-title">Featured Available Vehicles</h2>
            <p className="section-subtitle">
              Hand-picked vehicles ready for immediate booking. Explore our top-rated rides below.
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
              Explore Full Fleet ({vehicles.length} Vehicles) →
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
              We provide end-to-end mobility solutions tailored for personal travel, family trips, and daily commutes.
            </p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🛠️</div>
              <h3>24/7 Roadside Help</h3>
              <p>Round-the-clock emergency support and breakdown assistance wherever you travel.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">📅</div>
              <h3>Flexible Bookings</h3>
              <p>Rent by the day, week, or month with instant confirmation and easy extensions.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">🛡️</div>
              <h3>Zero Hidden Charges</h3>
              <p>Transparent pricing with full insurance coverage included in your daily rate.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">✨</div>
              <h3>Sanitized Vehicles</h3>
              <p>Every vehicle is thoroughly cleaned, inspected, and serviced before handover.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US SECTION */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Quality Assurance</span>
            <h2 className="section-title">Why Choose Vehicle Rental System?</h2>
            <p className="section-subtitle">
              Designed with reliability, affordability, and seamless technology in mind.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-box">
              <div className="feature-check">✓</div>
              <div>
                <h4 style={{ marginBottom: '4px' }}>Verified & Maintained Fleet</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  All cars, bikes, and vans undergo periodic multi-point safety inspections.
                </p>
              </div>
            </div>

            <div className="feature-box">
              <div className="feature-check">✓</div>
              <div>
                <h4 style={{ marginBottom: '4px' }}>Instant MySQL Sync</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  Real-time database queries prevent double bookings and guarantee your reservation.
                </p>
              </div>
            </div>

            <div className="feature-box">
              <div className="feature-check">✓</div>
              <div>
                <h4 style={{ marginBottom: '4px' }}>Instant Doorstep Delivery</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  Get your vehicle delivered right to your home, airport terminal, or station.
                </p>
              </div>
            </div>

            <div className="feature-box">
              <div className="feature-check">✓</div>
              <div>
                <h4 style={{ marginBottom: '4px' }}>Transparent Refund Policy</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  Free cancellations up to 24 hours before your trip start date with instant refunds.
                </p>
              </div>
            </div>
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
              Have questions about vehicle booking or long-term rentals? Reach out to our support team.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div className="service-card" style={{ textAlign: 'center' }}>
              <div className="service-icon" style={{ margin: '0 auto 16px' }}>📍</div>
              <h3>Our Location</h3>
              <p>Vehicle Rental Hub, Tech Park Avenue, College Road, City Campus</p>
            </div>

            <div className="service-card" style={{ textAlign: 'center' }}>
              <div className="service-icon" style={{ margin: '0 auto 16px' }}>📞</div>
              <h3>Call Support</h3>
              <p>+91 98765 43210 / +91 91234 56789<br />Available 24 hours, 7 days a week</p>
            </div>

            <div className="service-card" style={{ textAlign: 'center' }}>
              <div className="service-icon" style={{ margin: '0 auto 16px' }}>✉️</div>
              <h3>Email Inquiries</h3>
              <p>support@vehiclerentalsystem.com<br />labproject@university.edu</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
