import React from 'react';

/**
 * VehicleCard Component
 * Displays vehicle specifications, status, pricing, and actions (Book, Edit, Delete, Toggle Status)
 */
export default function VehicleCard({ vehicle, onBook, onEdit, onDelete, onToggleAvailability }) {
  // Helper to select vehicle emoji icon based on vehicle type
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

  // Specs helper based on vehicle type
  const getVehicleSpecs = (type) => {
    switch (type?.toLowerCase()) {
      case 'bike':
        return { seats: '2 Seats', fuel: 'Petrol', transmission: 'Manual', luggage: '1 Bag' };
      case 'van':
        return { seats: '8-10 Seats', fuel: 'Diesel', transmission: 'Manual', luggage: '6 Bags' };
      case 'suv':
        return { seats: '7 Seats', fuel: 'Diesel / Petrol', transmission: 'Automatic', luggage: '4 Bags' };
      case 'ev':
        return { seats: '5 Seats', fuel: '100% Electric', transmission: 'Automatic', luggage: '3 Bags' };
      case 'car':
      default:
        return { seats: '5 Seats', fuel: 'Petrol / CNG', transmission: 'Manual / Auto', luggage: '3 Bags' };
    }
  };

  const isAvailable = vehicle.availability === 'Available';
  const specs = getVehicleSpecs(vehicle.type);

  return (
    <div className={`vehicle-card ${!isAvailable ? 'vehicle-card-unavailable' : ''}`}>
      <div className="vehicle-card-image">
        <span className="vehicle-icon-huge">{getVehicleIcon(vehicle.type)}</span>
        <span className="vehicle-type-tag">{vehicle.type}</span>
        <span className="vehicle-id-badge">#{vehicle.id}</span>
      </div>

      <div className="vehicle-card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <h3 className="vehicle-name">{vehicle.name}</h3>
        </div>

        {/* Feature Tags / Specs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '8px 0 12px' }}>
          <span style={{ fontSize: '0.75rem', background: 'var(--bg-alt)', color: 'var(--text-muted)', padding: '3px 8px', borderRadius: '4px' }}>
            👥 {specs.seats}
          </span>
          <span style={{ fontSize: '0.75rem', background: 'var(--bg-alt)', color: 'var(--text-muted)', padding: '3px 8px', borderRadius: '4px' }}>
            ⛽ {specs.fuel}
          </span>
          <span style={{ fontSize: '0.75rem', background: 'var(--bg-alt)', color: 'var(--text-muted)', padding: '3px 8px', borderRadius: '4px' }}>
            ⚙️ {specs.transmission}
          </span>
        </div>

        <div className="vehicle-meta">
          <div className="vehicle-price">
            {`₹${Number(vehicle.rent).toLocaleString('en-IN')}`}
            <span> / day</span>
          </div>

          {/* Availability Status Badge */}
          {isAvailable ? (
            <span
              className="badge-available"
              style={{ cursor: onToggleAvailability ? 'pointer' : 'default' }}
              title={onToggleAvailability ? 'Click to toggle availability' : ''}
              onClick={() => onToggleAvailability && onToggleAvailability(vehicle)}
            >
              ● Available
            </span>
          ) : (
            <span
              className="badge-unavailable"
              style={{ cursor: onToggleAvailability ? 'pointer' : 'default' }}
              title={onToggleAvailability ? 'Click to toggle availability' : ''}
              onClick={() => onToggleAvailability && onToggleAvailability(vehicle)}
            >
              ● Booked / Unavailable
            </span>
          )}
        </div>

        <div className="vehicle-card-actions">
          <button
            className="btn btn-primary btn-sm btn-book"
            onClick={() => onBook(vehicle)}
            disabled={!isAvailable}
            title={isAvailable ? 'Book this vehicle' : 'Vehicle is currently unavailable'}
          >
            {isAvailable ? '🚀 Rent Vehicle' : '🔒 Unavailable'}
          </button>

          {onEdit && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onEdit(vehicle)}
              title="Edit vehicle details"
            >
              ✏️ Edit
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
