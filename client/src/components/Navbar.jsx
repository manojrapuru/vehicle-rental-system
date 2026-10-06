import React from 'react';

/**
 * Navbar Component
 * Demonstrates: Functional component, Props, Event handling, Conditional CSS classes
 */
export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <header className="navbar">
      <div className="container nav-container">
        <div className="nav-brand" onClick={() => setActiveTab('home')}>
          <div className="brand-icon-wrapper">🚗</div>
          <span>Vehicle Rental System</span>
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
                Vehicles
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${activeTab === 'booking' ? 'active' : ''}`}
                onClick={() => setActiveTab('booking')}
              >
                Book a Vehicle
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${activeTab === 'bookings-list' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookings-list')}
              >
                Manage Bookings
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
