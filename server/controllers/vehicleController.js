const db = require('../config/db');

// @desc    Get all vehicles
// @route   GET /api/vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const { type, availability } = req.query;
    let sql = 'SELECT * FROM vehicles';
    const params = [];
    const conditions = [];

    if (type && type !== 'All') {
      conditions.push('type = ?');
      params.push(type);
    }

    if (availability) {
      conditions.push('availability = ?');
      params.push(availability);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY id ASC';

    const vehicles = await db.query(sql, params);
    return res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles,
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching vehicles',
      error: error.message,
    });
  }
};

// @desc    Get single vehicle by ID
// @route   GET /api/vehicles/:id
exports.getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vehicle ID provided',
      });
    }

    const rows = await db.query('SELECT * FROM vehicles WHERE id = ?', [id]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Vehicle with ID ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error('Error fetching vehicle by ID:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching vehicle details',
      error: error.message,
    });
  }
};

// @desc    Add a new vehicle
// @route   POST /api/vehicles
exports.createVehicle = async (req, res) => {
  try {
    const { name, type, rent, availability = 'Available' } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Vehicle name is required' });
    }
    if (!type || !type.trim()) {
      return res.status(400).json({ success: false, message: 'Vehicle type is required' });
    }
    if (rent === undefined || isNaN(rent) || Number(rent) <= 0) {
      return res.status(400).json({ success: false, message: 'Valid positive rent price is required' });
    }

    const validAvailability = availability === 'Not Available' ? 'Not Available' : 'Available';

    const result = await db.query(
      'INSERT INTO vehicles (name, type, rent, availability) VALUES (?, ?, ?, ?)',
      [name.trim(), type.trim(), parseInt(rent, 10), validAvailability]
    );

    return res.status(201).json({
      success: true,
      message: 'Vehicle added successfully',
      data: {
        id: result.insertId,
        name: name.trim(),
        type: type.trim(),
        rent: parseInt(rent, 10),
        availability: validAvailability,
      },
    });
  } catch (error) {
    console.error('Error adding vehicle:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while adding vehicle',
      error: error.message,
    });
  }
};

// @desc    Update vehicle information
// @route   PUT /api/vehicles/:id
exports.updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, rent, availability } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid vehicle ID' });
    }

    // Check if vehicle exists
    const existing = await db.query('SELECT * FROM vehicles WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: `Vehicle with ID ${id} not found` });
    }

    const current = existing[0];
    const updatedName = name !== undefined ? name.trim() : current.name;
    const updatedType = type !== undefined ? type.trim() : current.type;
    const updatedRent = rent !== undefined ? parseInt(rent, 10) : current.rent;
    const updatedAvailability = availability !== undefined ? availability : current.availability;

    await db.query(
      'UPDATE vehicles SET name = ?, type = ?, rent = ?, availability = ? WHERE id = ?',
      [updatedName, updatedType, updatedRent, updatedAvailability, id]
    );

    return res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      data: {
        id: parseInt(id, 10),
        name: updatedName,
        type: updatedType,
        rent: updatedRent,
        availability: updatedAvailability,
      },
    });
  } catch (error) {
    console.error('Error updating vehicle:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating vehicle',
      error: error.message,
    });
  }
};

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
exports.deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid vehicle ID' });
    }

    // Check if vehicle exists
    const existing = await db.query('SELECT * FROM vehicles WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: `Vehicle with ID ${id} not found` });
    }

    await db.query('DELETE FROM vehicles WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully',
      deletedId: parseInt(id, 10),
    });
  } catch (error) {
    console.error('Error deleting vehicle:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting vehicle',
      error: error.message,
    });
  }
};

// @desc    Demonstrate SQL Subquery (Vehicles with rent > average rent)
// @route   GET /api/vehicles/demo/above-average
exports.getAboveAverageVehicles = async (req, res) => {
  try {
    const sql = `
      SELECT id, name, type, rent, availability
      FROM vehicles
      WHERE rent > (
          SELECT AVG(rent)
          FROM vehicles
      )
      ORDER BY rent DESC
    `;
    const rows = await db.query(sql);
    return res.status(200).json({
      success: true,
      description: 'Demonstrating MySQL Subquery: Vehicles with rent > average rent',
      query: 'SELECT name, rent FROM vehicles WHERE rent > (SELECT AVG(rent) FROM vehicles);',
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error('Error in subquery demo:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while running subquery demo',
      error: error.message,
    });
  }
};
