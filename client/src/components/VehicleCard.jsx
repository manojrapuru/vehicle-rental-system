import React, { useState } from 'react';

/**
 * VehicleCard Component
 * Displays real vehicle photography, specs, rating, live pricing, and actions
 */
export default function VehicleCard({
  vehicle,
  onBook,
  onEdit,
  onDelete,
  onToggleAvailability,
}) {
  const [imgLoaded, setImgLoaded] = useState(true);

  // Fallback icon based on vehicle type
  const getVehicleIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'bike':
        return '🏍️';
      case 'van':
        return '🚐';
      case 'suv':
        return '🚙';
      case 'ev':
        return '⚡🚗';
      case 'car':
      default:
        return '🚗';
    }
  };

  // Specs helper
  const getVehicleSpecs = (v) => {
    const type = v.type?.toLowerCase();
    return {
      seats: v.seats || (type === 'bike' ? '2 Seats' : type === 'van' ? '10 Seats' : type === 'suv' ? '7 Seats' : '5 Seats'),
      fuel: v.fuel || (type === 'ev' ? 'Electric (400km)' : type === 'bike' ? 'Petrol' : 'Diesel / Petrol'),
      transmission: v.transmission || (type === 'bike' ? 'Manual' : type === 'ev' ? 'Automatic' : 'Automatic / Manual'),
      rating: v.rating || 4.8,
      trips: v.trips || Math.floor(Math.random() * 80 + 40),
    };
  };

  const isAvailable = vehicle.availability === 'Available';
  const specs = getVehicleSpecs(vehicle);

  // Default fallback image by vehicle type if vehicle.image is not present
  const getFallbackImage = (type) => {
    switch (type?.toLowerCase()) {
      case 'bike':
        return 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80';
      case 'van':
        return 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop&q=80';
      case 'suv':
        return 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80';
      case 'ev':
        return 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80';
      case 'car':
      default:
        return 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80';
    }
  };

  const imgSrc = vehicle.image || getFallbackImage(vehicle.type);

  return (
    <div className={`vehicle-card ${!isAvailable ? 'vehicle-card-unavailable' : ''}`}>
      {/* Vehicle Photo Container */}
      <div className="vehicle-card-image" style={{ height: '200px', position: 'relative', overflow: 'hidden', background: '#0f172a' }}>
        {imgLoaded && imgSrc ? (
          <img
            src={imgSrc}
            alt={vehicle.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
            className="vehicle-photo-img"
            onError={() => setImgLoaded(false)}
            loading="lazy"
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '4.5rem' }}>
            <span>{getVehicleIcon(vehicle.type)}</span>
          </div>
        )}

        {/* Gradient shadow for text readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.2) 50%, rgba(0,0,0,0.4) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Top Badges */}
        <span className="vehicle-type-tag" style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2, background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(6px)' }}>
          {vehicle.type}
        </span>

        <span className="vehicle-id-badge" style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2, background: 'rgba(255,255,255,0.9)', color: '#0f172a', fontWeight: 'bold' }}>
          #{vehicle.id}
        </span>

        {/* Bottom Rating Pill on Photo */}
        <div style={{ position: 'absolute', bottom: '10px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2, color: '#fff', fontSize: '0.82rem' }}>
          <span style={{ background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            ⭐ <strong>{specs.rating}</strong> ({specs.trips} trips)
          </span>
          <span style={{ fontSize: '0.75rem', background: isAvailable ? 'rgba(16,185,129,0.85)' : 'rgba(239,68,68,0.85)', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>
            {isAvailable ? 'Instant Booking' : 'Currently Booked'}
          </span>
        </div>
      </div>

      {/* Vehicle Info & Specs */}
      <div className="vehicle-card-body" style={{ padding: '20px' }}>
        <h3 className="vehicle-name" style={{ fontSize: '1.2rem', marginBottom: '8px' }}>
          {vehicle.name}
        </h3>

        {/* Feature Tags / Specs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', margin: '8px 0 16px', textAlign: 'center' }}>
          <div style={{ background: 'var(--bg-alt)', padding: '6px 4px', borderRadius: '6px', fontSize: '0.75rem' }}>
            <div style={{ color: 'var(--text-muted)' }}>👥 Seats</div>
            <strong style={{ fontSize: '0.78rem' }}>{specs.seats}</strong>
          </div>
          <div style={{ background: 'var(--bg-alt)', padding: '6px 4px', borderRadius: '6px', fontSize: '0.75rem' }}>
            <div style={{ color: 'var(--text-muted)' }}>⛽ Fuel</div>
            <strong style={{ fontSize: '0.78rem' }}>{specs.fuel}</strong>
          </div>
          <div style={{ background: 'var(--bg-alt)', padding: '6px 4px', borderRadius: '6px', fontSize: '0.75rem' }}>
            <div style={{ color: 'var(--text-muted)' }}>⚙️ Drive</div>
            <strong style={{ fontSize: '0.78rem' }}>{specs.transmission}</strong>
          </div>
        </div>

        <div className="vehicle-meta" style={{ marginBottom: '16px' }}>
          <div className="vehicle-price">
            {`₹${Number(vehicle.rent).toLocaleString('en-IN')}`}
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}> / 24 hrs</span>
          </div>

          {/* Availability Status Badge */}
          {isAvailable ? (
            <span
              className="badge-available"
              style={{ cursor: onToggleAvailability ? 'pointer' : 'default', padding: '4px 10px' }}
              title={onToggleAvailability ? 'Click to toggle availability status' : ''}
              onClick={() => onToggleAvailability && onToggleAvailability(vehicle)}
            >
              ● Available
            </span>
          ) : (
            <span
              className="badge-unavailable"
              style={{ cursor: onToggleAvailability ? 'pointer' : 'default', padding: '4px 10px' }}
              title={onToggleAvailability ? 'Click to toggle availability status' : ''}
              onClick={() => onToggleAvailability && onToggleAvailability(vehicle)}
            >
              ● Booked
            </span>
          )}
        </div>

        <div className="vehicle-card-actions">
          <button
            className="btn btn-primary btn-sm btn-book"
            style={{ flex: 1, padding: '10px 14px' }}
            onClick={() => onBook(vehicle)}
            disabled={!isAvailable}
            title={isAvailable ? 'Book this vehicle now' : 'Vehicle is currently booked/unavailable'}
          >
            {isAvailable ? '🚀 Reserve Now' : '🔒 Unavailable'}
          </button>

          {onEdit && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onEdit(vehicle)}
              title="Edit vehicle specs"
            >
              ✏️
            </button>
          )}

          {onDelete && (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(vehicle.id)}
              title="Delete vehicle from fleet"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
