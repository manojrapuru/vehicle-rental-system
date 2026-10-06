import React, { useState } from 'react';
import VehicleCard from './VehicleCard';

/**
 * VehicleList Component
 * Includes advanced multi-filtering, sorting, quick stats, and list rendering
 */
export default function VehicleList({
  vehicles,
  onBook,
  onEdit,
  onDelete,
  onAddNew,
  onToggleAvailability,
  initialTypeFilter = 'All',
}) {
  const [selectedType, setSelectedType] = useState(initialTypeFilter || 'All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState('All');

  const types = ['All', 'Car', 'Bike', 'Van', 'SUV', 'EV'];

  // Filter vehicles based on user selections
  const filteredVehicles = vehicles
    .filter((v) => {
      const matchesType = selectedType === 'All' || v.type.toLowerCase() === selectedType.toLowerCase();
      const matchesAvailability =
        availabilityFilter === 'All' ||
        (availabilityFilter === 'Available' && v.availability === 'Available') ||
        (availabilityFilter === 'Not Available' && v.availability !== 'Available');
      const matchesSearch =
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.type.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesPrice = true;
      const rent = Number(v.rent);
      if (priceRange === 'under1500') matchesPrice = rent < 1500;
      else if (priceRange === '1500to2500') matchesPrice = rent >= 1500 && rent <= 2500;
      else if (priceRange === 'above2500') matchesPrice = rent > 2500;

      return matchesType && matchesAvailability && matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.rent - b.rent;
      if (sortBy === 'price-high') return b.rent - a.rent;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      return a.id - b.id;
    });

  const availableCount = vehicles.filter((v) => v.availability === 'Available').length;

  return (
    <div>
      {/* Quick Summary Pill Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.88rem' }}>
          <span className="badge-available">● {availableCount} Available</span>
          <span className="badge-unavailable">● {vehicles.length - availableCount} Booked</span>
          <span style={{ color: 'var(--text-muted)' }}>Total: <strong>{vehicles.length}</strong> vehicles in fleet</span>
        </div>

        {onAddNew && (
          <button className="btn btn-primary btn-sm" onClick={onAddNew}>
            ➕ Add New Vehicle
          </button>
        )}
      </div>

      {/* Filter & Controls Bar */}
      <div className="filter-bar" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
            CATEGORY:
          </span>
          <div className="filter-group" style={{ margin: 0 }}>
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
        </div>

        {/* Secondary Filters & Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px', minWidth: '180px' }}>
            <input
              type="text"
              className="search-input form-control"
              style={{ width: '100%', padding: '8px 14px', fontSize: '0.88rem' }}
              placeholder="🔍 Search vehicle name or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ minWidth: '140px' }}>
            <select
              className="form-control"
              style={{ padding: '8px 12px', fontSize: '0.85rem', width: '100%' }}
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available Only</option>
              <option value="Not Available">Booked / Unavailable</option>
            </select>
          </div>

          <div style={{ minWidth: '150px' }}>
            <select
              className="form-control"
              style={{ padding: '8px 12px', fontSize: '0.85rem', width: '100%' }}
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <option value="All">All Price Ranges</option>
              <option value="under1500">Under ₹1,500/day</option>
              <option value="1500to2500">₹1,500 – ₹2,500/day</option>
              <option value="above2500">Above ₹2,500/day</option>
            </select>
          </div>

          <div style={{ minWidth: '160px' }}>
            <select
              className="form-control"
              style={{ padding: '8px 12px', fontSize: '0.85rem', width: '100%' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Sort: Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>

          {(selectedType !== 'All' || availabilityFilter !== 'All' || searchTerm || priceRange !== 'All' || sortBy !== 'default') && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSelectedType('All');
                setAvailabilityFilter('All');
                setSearchTerm('');
                setPriceRange('All');
                setSortBy('default');
              }}
              title="Reset all filters"
            >
              Reset Filters ✕
            </button>
          )}
        </div>
      </div>

      {/* Dynamic List Rendering */}
      {filteredVehicles.length > 0 ? (
        <div className="vehicles-grid">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onBook={onBook}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleAvailability={onToggleAvailability}
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
            marginTop: '20px',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</div>
          <h3>No Vehicles Match Your Search</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>
            Try relaxing your filter criteria or searching with different keywords.
          </p>
          <button
            className="btn btn-primary btn-sm"
            style={{ marginTop: '16px' }}
            onClick={() => {
              setSelectedType('All');
              setAvailabilityFilter('All');
              setSearchTerm('');
              setPriceRange('All');
              setSortBy('default');
            }}
          >
            Show All Vehicles ({vehicles.length})
          </button>
        </div>
      )}
    </div>
  );
}
