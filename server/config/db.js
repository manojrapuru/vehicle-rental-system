const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Create MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'vehicle_rental',
  port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT, 10) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

let isUsingMock = false;

// In-memory fallback mock storage (Used if MySQL is offline during college viva / lab testing)
const mockData = {
  vehicles: [
    { id: 1, name: 'Toyota Car', type: 'Car', rent: 1800, availability: 'Available' },
    { id: 2, name: 'Royal Enfield', type: 'Bike', rent: 800, availability: 'Available' },
    { id: 3, name: 'Mahindra Van', type: 'Van', rent: 2000, availability: 'Not Available' },
    { id: 4, name: 'Honda City', type: 'Car', rent: 2200, availability: 'Available' },
    { id: 5, name: 'Hyundai Creta', type: 'SUV', rent: 2500, availability: 'Available' },
    { id: 6, name: 'Yamaha R15', type: 'Bike', rent: 950, availability: 'Available' },
    { id: 7, name: 'Tata Nexon EV', type: 'EV', rent: 2100, availability: 'Available' },
    { id: 8, name: 'Maruti Swift', type: 'Car', rent: 1400, availability: 'Available' },
    { id: 9, name: 'Force Urbania', type: 'Van', rent: 3200, availability: 'Available' },
    { id: 10, name: 'KTM Duke 390', type: 'Bike', rent: 1200, availability: 'Not Available' },
  ],
  bookings: [
    {
      id: 1,
      customer_name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '9876543210',
      vehicle_id: 1,
      vehicle_name: 'Toyota Car',
      vehicle_type: 'Car',
      start_date: '2026-10-10',
      end_date: '2026-10-12',
      total_amount: 3600.0,
      booking_status: 'Confirmed',
    },
    {
      id: 2,
      customer_name: 'Ananya Patel',
      email: 'ananya.p@example.com',
      phone: '9123456780',
      vehicle_id: 2,
      vehicle_name: 'Royal Enfield',
      vehicle_type: 'Bike',
      start_date: '2026-10-15',
      end_date: '2026-10-16',
      total_amount: 800.0,
      booking_status: 'Confirmed',
    },
  ],
};

// Test Database Connection Function
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('----------------------------------------------------');
    console.log('✅ [Database] Successfully connected to MySQL database!');
    console.log(`📡 Host: ${process.env.MYSQL_HOST || 'localhost'}:${process.env.MYSQL_PORT || 3306}`);
    console.log(`🗄️  Database: ${process.env.MYSQL_DATABASE || 'vehicle_rental'}`);
    console.log('----------------------------------------------------');
    connection.release();
    isUsingMock = false;
    return true;
  } catch (error) {
    isUsingMock = true;
    console.warn('----------------------------------------------------');
    console.warn('⚠️  [Database Warning] Could not connect to MySQL server.');
    console.warn(`Reason: ${error.message}`);
    console.warn('💡 Tip: Make sure MySQL is running and database.sql is executed.');
    console.warn('🔄 [Fallback] Activated In-Memory Safe Storage for seamless testing & demonstration.');
    console.warn('----------------------------------------------------');
    return false;
  }
}

// Wrapper for executing queries with auto-fallback
async function query(sql, params = []) {
  if (!isUsingMock) {
    try {
      const [results] = await pool.query(sql, params);
      return results;
    } catch (err) {
      console.error('MySQL query error:', err.message);
      throw err;
    }
  }

  // MOCK ENGINE (When MySQL is not active)
  const normalizedSql = sql.trim().toLowerCase();

  // 1. SELECT VEHICLES
  if (normalizedSql.startsWith('select') && normalizedSql.includes('from vehicles')) {
    if (normalizedSql.includes('where id =')) {
      const id = parseInt(params[0], 10);
      const vehicle = mockData.vehicles.find((v) => v.id === id);
      return vehicle ? [vehicle] : [];
    }
    if (normalizedSql.includes('avg(rent)')) {
      // Subquery mock: vehicles with rent > average rent
      const total = mockData.vehicles.reduce((acc, v) => acc + v.rent, 0);
      const avg = total / mockData.vehicles.length;
      return mockData.vehicles.filter((v) => v.rent > avg);
    }
    return [...mockData.vehicles];
  }

  // 2. INSERT VEHICLE
  if (normalizedSql.startsWith('insert into vehicles')) {
    const newId = mockData.vehicles.length ? Math.max(...mockData.vehicles.map((v) => v.id)) + 1 : 1;
    const newVehicle = {
      id: newId,
      name: params[0],
      type: params[1],
      rent: parseInt(params[2], 10),
      availability: params[3] || 'Available',
    };
    mockData.vehicles.push(newVehicle);
    return { insertId: newId, affectedRows: 1 };
  }

  // 3. UPDATE VEHICLE
  if (normalizedSql.startsWith('update vehicles')) {
    const id = parseInt(params[params.length - 1], 10);
    const vehicle = mockData.vehicles.find((v) => v.id === id);
    if (vehicle) {
      if (normalizedSql.includes('availability = ?') && params.length === 2) {
        vehicle.availability = params[0];
      } else if (params.length === 4 || (params.length === 5 && normalizedSql.includes('name ='))) {
        vehicle.name = params[0];
        vehicle.type = params[1];
        vehicle.rent = parseInt(params[2], 10);
        vehicle.availability = params[3];
      } else if (params.length === 1 && normalizedSql.includes('availability =')) {
        vehicle.availability = params[0];
      }
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // 4. DELETE VEHICLE
  if (normalizedSql.startsWith('delete from vehicles')) {
    const id = parseInt(params[0], 10);
    const initialLen = mockData.vehicles.length;
    mockData.vehicles = mockData.vehicles.filter((v) => v.id !== id);
    return { affectedRows: initialLen - mockData.vehicles.length };
  }

  // 5. SELECT BOOKINGS (WITH JOIN)
  if (normalizedSql.startsWith('select') && normalizedSql.includes('from bookings')) {
    if (normalizedSql.includes('where id =') || normalizedSql.includes('where b.id =')) {
      const id = parseInt(params[0], 10);
      const b = mockData.bookings.find((item) => item.id === id);
      if (!b) return [];
      const v = mockData.vehicles.find((veh) => veh.id === b.vehicle_id) || {};
      return [{
        id: b.id,
        customer_name: b.customer_name,
        email: b.email,
        phone: b.phone,
        vehicle_id: b.vehicle_id,
        vehicle_name: b.vehicle_name || v.name || 'Vehicle',
        vehicle_type: b.vehicle_type || v.type || 'Car',
        daily_rate: v.rent || 0,
        start_date: b.start_date,
        end_date: b.end_date,
        total_amount: b.total_amount,
        booking_status: b.booking_status,
        created_at: b.created_at || new Date().toISOString(),
      }];
    }

    return mockData.bookings.map((b) => {
      const v = mockData.vehicles.find((veh) => veh.id === b.vehicle_id) || {};
      return {
        id: b.id,
        customer_name: b.customer_name,
        email: b.email,
        phone: b.phone,
        vehicle_id: b.vehicle_id,
        vehicle_name: b.vehicle_name || v.name || 'Unknown Vehicle',
        vehicle_type: b.vehicle_type || v.type || 'Standard',
        daily_rate: v.rent || 0,
        start_date: b.start_date,
        end_date: b.end_date,
        total_amount: b.total_amount,
        booking_status: b.booking_status || 'Confirmed',
        created_at: b.created_at || new Date().toISOString(),
      };
    });
  }

  // 6. INSERT BOOKING
  if (normalizedSql.startsWith('insert into bookings')) {
    const newId = mockData.bookings.length ? Math.max(...mockData.bookings.map((b) => b.id)) + 1 : 1;
    const vId = parseInt(params[3], 10);
    const v = mockData.vehicles.find((veh) => veh.id === vId);
    if (v) {
      v.availability = 'Not Available';
    }
    const newBooking = {
      id: newId,
      customer_name: params[0],
      email: params[1],
      phone: params[2],
      vehicle_id: vId,
      vehicle_name: v ? v.name : 'Selected Vehicle',
      vehicle_type: v ? v.type : 'Car',
      start_date: params[4],
      end_date: params[5],
      total_amount: parseFloat(params[6]),
      booking_status: params[7] || 'Confirmed',
      created_at: new Date().toISOString(),
    };
    mockData.bookings.unshift(newBooking);
    return { insertId: newId, affectedRows: 1 };
  }

  // 7. UPDATE BOOKING
  if (normalizedSql.startsWith('update bookings')) {
    const id = parseInt(params[params.length - 1], 10);
    const booking = mockData.bookings.find((b) => b.id === id);
    if (booking) {
      if (normalizedSql.includes('booking_status =')) {
        booking.booking_status = params[0];
        if (params[0] === 'Cancelled' || params[0] === 'Completed') {
          const v = mockData.vehicles.find((veh) => veh.id === booking.vehicle_id);
          if (v) v.availability = 'Available';
        }
      }
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // 8. DELETE BOOKING
  if (normalizedSql.startsWith('delete from bookings')) {
    const id = parseInt(params[0], 10);
    const initialLen = mockData.bookings.length;
    const booking = mockData.bookings.find((b) => b.id === id);
    if (booking) {
      const v = mockData.vehicles.find((veh) => veh.id === booking.vehicle_id);
      if (v) v.availability = 'Available';
    }
    mockData.bookings = mockData.bookings.filter((b) => b.id !== id);
    return { affectedRows: initialLen - mockData.bookings.length };
  }

  return [];
}

module.exports = {
  pool,
  query,
  testConnection,
  getIsUsingMock: () => isUsingMock,
};
