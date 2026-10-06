import React from 'react';
import Logo from './Logo';

/**
 * Navbar Component
 * Includes Brand Logo, navigation tabs, quick booking action, and responsive styling
 */
export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <header className="navbar">
      <div className="container nav-container">
        <div className="nav-brand" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
          <Logo size={40} showText={true} />
        </div>

        <nav>
          <ul className="nav-links">
            <li>
              <button
                className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => setActiveTab('home')}
              >
                Home
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${activeTab === 'vehicles' ? 'active' : ''}`}
                onClick={() => setActiveTab('vehicles')}
              >
                Fleet Catalog
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${activeTab === 'booking' ? 'active' : ''}`}
                onClick={() => setActiveTab('booking')}
              >
                Book a Ride
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${activeTab === 'bookings-list' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookings-list')}
              >
                Manage Reservations
              </button>
            </li>
            <li>
              <button
                className={`nav-item lab-tag ${activeTab === 'lab' ? 'active' : ''}`}
                onClick={() => setActiveTab('lab')}
              >
                Lab Concepts 🧪
              </button>
            </li>
          </ul>
        </nav>

        <div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setActiveTab('booking')}
          >
            ⚡ Rent Now
          </button>
        </div>
      </div>
    </header>
  );
}
