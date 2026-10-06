import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Vehicles from './pages/Vehicles';
import Booking from './pages/Booking';
import LabDemo from './pages/LabDemo';
import Logo from './components/Logo';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [preselectedVehicle, setPreselectedVehicle] = useState(null);

  // Fetch all vehicles from Express API on mount (useEffect demonstration)
  const fetchVehicles = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/vehicles');
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.message || 'Failed to fetch vehicles from API');
      }
      setVehicles(json.data || []);
    } catch (err) {
      console.error('Fetch vehicles error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Handle "Book Now" clicked on a specific vehicle
  const handleBookVehicle = (vehicle) => {
    setPreselectedVehicle(vehicle);
    setActiveTab('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-layout">
      {/* Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'home' && (
          <Home
            vehicles={vehicles}
            setActiveTab={setActiveTab}
            onBookVehicle={handleBookVehicle}
          />
        )}

        {activeTab === 'vehicles' && (
          <Vehicles
            vehicles={vehicles}
            loading={loading}
            error={error}
            onRefresh={fetchVehicles}
            onBookVehicle={handleBookVehicle}
          />
        )}

        {activeTab === 'booking' && (
          <Booking
            vehicles={vehicles}
            preselectedVehicle={preselectedVehicle}
            initialSubTab="new"
            onBookingCreated={() => {
              fetchVehicles(); // Sync vehicle availability
            }}
          />
        )}

        {activeTab === 'bookings-list' && (
          <Booking
            vehicles={vehicles}
            preselectedVehicle={null}
            initialSubTab="history"
            onBookingCreated={fetchVehicles}
          />
        )}

        {activeTab === 'lab' && <LabDemo />}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <div style={{ marginBottom: '14px' }}>
              <Logo size={36} showText={true} />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '380px', lineHeight: '1.6' }}>
              DrivePulse is a modern, enterprise-grade vehicle rental platform providing seamless self-drive cars, touring bikes, SUVs, and luxury vans with 100% insurance and instant confirmation.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '12px' }}>Quick Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
              <li>
                <a href="#home" onClick={(e) => { e.preventDefault(); setActiveTab('home'); }}>
                  Home Page
                </a>
              </li>
              <li>
                <a href="#vehicles" onClick={(e) => { e.preventDefault(); setActiveTab('vehicles'); }}>
                  Fleet Catalog
                </a>
              </li>
              <li>
                <a href="#booking" onClick={(e) => { e.preventDefault(); setActiveTab('booking'); }}>
                  Book a Vehicle
                </a>
              </li>
              <li>
                <a href="#bookings-list" onClick={(e) => { e.preventDefault(); setActiveTab('bookings-list'); }}>
                  Manage Bookings
                </a>
              </li>
              <li>
                <a href="#lab" onClick={(e) => { e.preventDefault(); setActiveTab('lab'); }}>
                  Lab Viva Concepts 🧪
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '12px' }}>Enterprise Architecture</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.8' }}>
              • <strong>Frontend:</strong> React 18 + Vite (SPA)<br />
              • <strong>Backend:</strong> Node.js + Express.js API<br />
              • <strong>Database:</strong> MySQL 8.0 with Pool & Auto-Fallback<br />
              • <strong>Security:</strong> Input sanitized REST endpoints
            </p>
          </div>
        </div>

        <div className="container footer-bottom">
          © {new Date().getFullYear()} DrivePulse Mobility Network | All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
