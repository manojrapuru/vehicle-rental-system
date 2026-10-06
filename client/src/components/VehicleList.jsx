import React, { useState } from 'react';
import VehicleCard from './VehicleCard';

/**
 * VehicleList Component (Parent Component)
 * Demonstrates:
 * - map() iteration to render lists dynamically
 * - Props passing from Parent (VehicleList) to Child (VehicleCard)
 * - Filtering, Searching, and Empty State Handling
 */
export default function VehicleList({ vehicles, onBook, onEdit, onDelete, onAddNew }) {
  const [selectedType, setSelectedType] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const types = ['All', 'Car', 'Bike', 'Van', 'SUV', 'EV'];

  // Filter vehicles based on user selections
  const filteredVehicles = vehicles.filter((v) => {
    const matchesType = selectedType === 'All' || v.type.toLowerCase() === selectedType.toLowerCase();
    const matchesAvailability =
      availabilityFilter === 'All' ||
      (availabilityFilter === 'Available' && v.availability === 'Available') ||
      (availabilityFilter === 'Not Available' && v.availability !== 'Available');
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesType && matchesAvailability && matchesSearch;
  });

  return (
    <div>
      {/* Search & Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
            TYPE:
          </span>
          {types.map((type) => (
            <button
              key={type}
              className={`filter-pill ${selectedType === type ? 'active' : ''}`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="filter-group">
          <select
            className="form-control"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
          >
            <option value="All">All Availability</option>
            <option value="Available">Available Only</option>
            <option value="Not Available">Unavailable Only</option>
          </select>

          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search vehicle name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {onAddNew && (
            <button className="btn btn-primary btn-sm" onClick={onAddNew}>
              + Add Vehicle
            </button>
          )}
        </div>
      </div>

      {/* Dynamic List Rendering using map() */}
      {filteredVehicles.length > 0 ? (
        <div className="vehicles-grid">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onBook={onBook}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--border)',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</div>
          <h3>No Vehicles Found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>
            No vehicles match your search or filter criteria. Try changing filters or reset search.
          </p>
          <button
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '16px' }}
            onClick={() => {
              setSelectedType('All');
              setAvailabilityFilter('All');
              setSearchTerm('');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
