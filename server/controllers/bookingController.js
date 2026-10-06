const db = require('../config/db');

// Helper to calculate days between two dates
function calculateDays(startDateStr, endDateStr) {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 0 ? 1 : diffDays;
}

// @desc    Get all bookings (Joined with vehicle details)
// @route   GET /api/bookings
exports.getAllBookings = async (req, res) => {
  try {
    const sql = `
      SELECT 
        b.id,
        b.customer_name,
        b.email,
        b.phone,
        b.vehicle_id,
        v.name AS vehicle_name,
        v.type AS vehicle_type,
        v.rent AS daily_rate,
        b.start_date,
        b.end_date,
        b.total_amount,
        b.booking_status,
        b.created_at
      FROM bookings b
      LEFT JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.id DESC
    `;
    const bookings = await db.query(sql);
    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings',
      error: error.message,
    });
  }
};

// @desc    Create a new booking
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { customer_name, email, phone, vehicle_id, start_date, end_date } = req.body;

    // 1. Validation
    if (!customer_name || !customer_name.trim()) {
      return res.status(400).json({ success: false, message: 'Customer name is required' });
    }
    if (!email || !email.trim() || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Valid email address is required' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, message: 'Contact phone number is required' });
    }
    if (!vehicle_id || isNaN(vehicle_id)) {
      return res.status(400).json({ success: false, message: 'Valid vehicle ID is required' });
    }
    if (!start_date || !end_date) {
      return res.status(400).json({ success: false, message: 'Rental start and end dates are required' });
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    if (endDate < startDate) {
      return res.status(400).json({ success: false, message: 'End date must be greater than or equal to start date' });
    }

    // 2. Check vehicle existence and rate
    const vehicleRows = await db.query('SELECT * FROM vehicles WHERE id = ?', [vehicle_id]);
    if (!vehicleRows || vehicleRows.length === 0) {
      return res.status(404).json({ success: false, message: `Selected vehicle ID ${vehicle_id} does not exist` });
    }

    const vehicle = vehicleRows[0];
    const rentalDays = calculateDays(start_date, end_date);
    const totalAmount = rentalDays * Number(vehicle.rent);
    const bookingStatus = 'Confirmed';

    // 3. Insert booking into database
    const sql = `
      INSERT INTO bookings (customer_name, email, phone, vehicle_id, start_date, end_date, total_amount, booking_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await db.query(sql, [
      customer_name.trim(),
      email.trim(),
      phone.trim(),
      parseInt(vehicle_id, 10),
      start_date,
      end_date,
      totalAmount,
      bookingStatus,
    ]);

    // 4. Update vehicle status to Not Available
    try {
      await db.query('UPDATE vehicles SET availability = ? WHERE id = ?', ['Not Available', parseInt(vehicle_id, 10)]);
    } catch (updateErr) {
      console.warn('Could not update vehicle availability:', updateErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Booking created successfully!',
      data: {
        id: result.insertId,
        customer_name: customer_name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        vehicle_id: parseInt(vehicle_id, 10),
        vehicle_name: vehicle.name,
        vehicle_type: vehicle.type,
        daily_rate: vehicle.rent,
        rental_days: rentalDays,
        start_date,
        end_date,
        total_amount: totalAmount,
        booking_status: bookingStatus,
      },
    });
  } catch (error) {
    console.error('Error creating booking:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while processing booking',
      error: error.message,
    });
  }
};

// @desc    Update booking status (Confirmed, Completed, Cancelled)
// @route   PATCH /api/bookings/:id/status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid booking ID' });
    }

    const validStatuses = ['Confirmed', 'Active', 'Completed', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const bookings = await db.query('SELECT * FROM bookings WHERE id = ?', [id]);
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ success: false, message: `Booking #${id} not found` });
    }

    const booking = bookings[0];
    await db.query('UPDATE bookings SET booking_status = ? WHERE id = ?', [status, id]);

    // If cancelled or completed, release vehicle availability
    if (status === 'Cancelled' || status === 'Completed') {
      try {
        await db.query('UPDATE vehicles SET availability = ? WHERE id = ?', ['Available', booking.vehicle_id]);
      } catch (e) {
        console.warn('Error releasing vehicle availability:', e.message);
      }
    } else if (status === 'Confirmed' || status === 'Active') {
      try {
        await db.query('UPDATE vehicles SET availability = ? WHERE id = ?', ['Not Available', booking.vehicle_id]);
      } catch (e) {
        console.warn('Error locking vehicle availability:', e.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Booking #${id} status updated to ${status}`,
      data: { id: parseInt(id, 10), status },
    });
  } catch (error) {
    console.error('Error updating booking status:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating booking status',
      error: error.message,
    });
  }
};

// @desc    Delete / Cancel a booking by ID
// @route   DELETE /api/bookings/:id
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid booking ID' });
    }

    const bookings = await db.query('SELECT * FROM bookings WHERE id = ?', [id]);
    if (bookings && bookings.length > 0) {
      const vehicleId = bookings[0].vehicle_id;
      // Free up vehicle
      try {
        await db.query('UPDATE vehicles SET availability = ? WHERE id = ?', ['Available', vehicleId]);
      } catch (e) {
        console.warn('Error freeing vehicle on delete:', e.message);
      }
    }

    await db.query('DELETE FROM bookings WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: `Booking #${id} canceled/deleted successfully`,
      deletedId: parseInt(id, 10),
    });
  } catch (error) {
    console.error('Error deleting booking:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting booking',
      error: error.message,
    });
  }
};
