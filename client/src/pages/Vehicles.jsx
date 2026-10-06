import React, { useState } from 'react';
import VehicleList from '../components/VehicleList';

/**
 * Vehicles Page Component
 * Demonstrates:
 * - Full CRUD Integration (Read, Create, Update, Delete)
 * - Quick Availability Toggling
 * - State management with useState
 * - Modal forms for adding/editing vehicles
 * - Error and loading feedback
 */
export default function Vehicles({
  vehicles,
  loading,
  error,
  onRefresh,
  onBookVehicle,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Car',
    rent: '',
    availability: 'Available',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  // Open modal to Add New Vehicle
  const handleOpenAdd = () => {
    setEditingVehicle(null);
    setFormData({
      name: '',
      type: 'Car',
      rent: '',
      availability: 'Available',
    });
    setFormError('');
    setModalOpen(true);
  };

  // Open modal to Edit Vehicle
  const handleOpenEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      name: vehicle.name,
      type: vehicle.type,
      rent: vehicle.rent,
      availability: vehicle.availability,
    });
    setFormError('');
    setModalOpen(true);
  };

  // Quick toggle vehicle availability
  const handleToggleAvailability = async (vehicle) => {
    const newStatus = vehicle.availability === 'Available' ? 'Not Available' : 'Available';
    try {
      const res = await fetch(`/api/vehicles/${vehicle.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: vehicle.name,
          type: vehicle.type,
          rent: vehicle.rent,
          availability: newStatus,
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Failed to update availability');
      }
      setSuccessToast(`Vehicle #${vehicle.id} (${vehicle.name}) marked as ${newStatus}`);
      setTimeout(() => setSuccessToast(''), 3000);
      onRefresh();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Delete vehicle handler
  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete vehicle #${id}?`)) {
      try {
        const res = await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
        const result = await res.json();
        if (!res.ok || !result.success) {
          throw new Error(result.message || 'Failed to delete vehicle');
        }
        setSuccessToast(`Vehicle #${id} deleted successfully from database.`);
        setTimeout(() => setSuccessToast(''), 3000);
        onRefresh();
      } catch (err) {
        alert(`Error: ${err.message}`);
      }
    }
  };

  // Submit Add or Edit Form
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Vehicle name is required.');
      return;
    }
    if (!formData.rent || Number(formData.rent) <= 0) {
      setFormError('Please enter a valid daily rental rate.');
      return;
    }

    setSubmitting(true);
    try {
      const url = editingVehicle ? `/api/vehicles/${editingVehicle.id}` : '/api/vehicles';
      const method = editingVehicle ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Error saving vehicle');
      }

      setSuccessToast(
        editingVehicle ? `Vehicle #${editingVehicle.id} updated successfully!` : 'New vehicle added to fleet database!'
      );
      setTimeout(() => setSuccessToast(''), 3500);
      setModalOpen(false);
      onRefresh();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '2.2rem' }}>Vehicle Fleet Catalog</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Explore available cars, bikes, vans, SUVs, and electric vehicles with real-time MySQL database sync.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          ➕ Add New Vehicle
        </button>
      </div>

      {successToast && (
        <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <span>✅</span>
          <span>{successToast}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <span>⚠️</span>
          <span>Failed to connect to API: {error}</span>
          <button
            className="btn btn-secondary btn-sm"
            style={{ marginLeft: 'auto' }}
            onClick={onRefresh}
          >
            Retry Fetch
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', marginBottom: '16px' }}></div>
          <p style={{ color: 'var(--text-muted)' }}>Loading vehicles from Express API & MySQL...</p>
        </div>
      ) : (
        <VehicleList
          vehicles={vehicles}
          onBook={onBookVehicle}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onAddNew={handleOpenAdd}
          onToggleAvailability={handleToggleAvailability}
        />
      )}

      {/* Add / Edit Vehicle Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingVehicle ? `✏️ Edit Vehicle #${editingVehicle.id}` : '➕ Add New Vehicle to Fleet'}</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitForm}>
              <div className="modal-body">
                {formError && (
                  <div className="alert alert-danger" style={{ padding: '10px', marginBottom: '16px' }}>
                    {formError}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Vehicle Name & Model</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Honda City ZX, Royal Enfield Hunter 350"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Vehicle Type</label>
                    <select
                      className="form-control"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="Car">Car</option>
                      <option value="Bike">Bike</option>
                      <option value="Van">Van</option>
                      <option value="SUV">SUV</option>
                      <option value="EV">EV</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Daily Rent (₹/day)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="e.g. 1800"
                      value={formData.rent}
                      onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                      required
                      min="1"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Initial Availability Status</label>
                  <select
                    className="form-control"
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  >
                    <option value="Available">Available for Rent</option>
                    <option value="Not Available">Not Available / Booked</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving to Database...' : editingVehicle ? 'Update Vehicle' : 'Add to Fleet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
