import React from 'react';

/**
 * VehicleCard Component (Child Component)
 * Demonstrates:
 * - Props receiving (vehicle data & callback functions from parent)
 * - Conditional Rendering (Available vs Not Available status badge)
 * - String Literals (`₹${vehicle.rent}/day`)
 * - Event handling
 */
export default function VehicleCard({ vehicle, onBook, onEdit, onDelete }) {
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

  const isAvailable = vehicle.availability === 'Available';

  return (
    <div className="vehicle-card">
      <div className="vehicle-card-image">
        <span>{getVehicleIcon(vehicle.type)}</span>
        <span className="vehicle-type-tag">{vehicle.type}</span>
        <span className="vehicle-id-badge">#{vehicle.id}</span>
      </div>

      <div className="vehicle-card-body">
        <h3 className="vehicle-name">{vehicle.name}</h3>

        <div className="vehicle-meta">
          <div className="vehicle-price">
            {`₹${vehicle.rent}`}
            <span> / day</span>
          </div>

          {/* Conditional Rendering Demonstration */}
          {isAvailable ? (
            <span className="badge-available">Available</span>
          ) : (
            <span className="badge-unavailable">Not Available</span>
          )}
        </div>

        <div className="vehicle-card-actions">
          <button
            className="btn btn-primary btn-sm btn-book"
            onClick={() => onBook(vehicle)}
            disabled={!isAvailable}
            title={isAvailable ? 'Book this vehicle' : 'Vehicle is currently booked/unavailable'}
          >
            {isAvailable ? 'Rent Vehicle' : 'Unavailable'}
          </button>

          {onEdit && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onEdit(vehicle)}
              title="Edit vehicle details"
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
