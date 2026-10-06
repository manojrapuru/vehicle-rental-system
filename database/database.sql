-- =======================================================
-- VEHICLE RENTAL SYSTEM - DATABASE SCRIPT
-- =======================================================
-- Database: vehicle_rental
-- Technologies: MySQL, Node.js, Express.js, React.js
-- =======================================================

-- 1. CREATE DATABASE
CREATE DATABASE IF NOT EXISTS vehicle_rental;
USE vehicle_rental;

-- 2. DROP TABLES IF THEY EXIST (To avoid duplicate errors on re-run)
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS vehicles;

-- 3. CREATE VEHICLES TABLE
CREATE TABLE vehicles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    rent INT NOT NULL,
    availability VARCHAR(20) NOT NULL DEFAULT 'Available'
);

-- 4. CREATE BOOKINGS TABLE (WITH FOREIGN KEY)
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    vehicle_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    booking_status VARCHAR(30) NOT NULL DEFAULT 'Confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

-- =======================================================
-- 5. SAMPLE DATA INSERTION (INSERT STATEMENTS)
-- =======================================================

-- Insert Sample Vehicles
INSERT INTO vehicles (name, type, rent, availability) VALUES
('Toyota Car', 'Car', 1800, 'Available'),
('Royal Enfield', 'Bike', 800, 'Available'),
('Mahindra Van', 'Van', 2000, 'Not Available'),
('Honda City', 'Car', 2200, 'Available'),
('Hyundai Creta', 'SUV', 2500, 'Available'),
('Yamaha R15', 'Bike', 950, 'Available'),
('Tata Nexon EV', 'EV', 2100, 'Available'),
('Maruti Swift', 'Car', 1400, 'Available'),
('Force Urbania', 'Van', 3200, 'Available'),
('KTM Duke 390', 'Bike', 1200, 'Not Available');

-- Insert Sample Bookings
INSERT INTO bookings (customer_name, email, phone, vehicle_id, start_date, end_date, total_amount, booking_status) VALUES
('Rahul Sharma', 'rahul.sharma@example.com', '9876543210', 1, '2026-10-10', '2026-10-12', 3600.00, 'Confirmed'),
('Ananya Patel', 'ananya.p@example.com', '9123456780', 2, '2026-10-15', '2026-10-16', 800.00, 'Confirmed'),
('Vikram Singh', 'vikram.singh@example.com', '9988776655', 3, '2026-10-08', '2026-10-11', 6000.00, 'Completed'),
('Pooja Mehta', 'pooja.m@example.com', '9456123789', 5, '2026-10-20', '2026-10-23', 7500.00, 'Confirmed');

-- =======================================================
-- 6. LAB DEMONSTRATION QUERIES
-- =======================================================

-- A. SELECT ALL (Basic Read)
SELECT * FROM vehicles;
SELECT * FROM bookings;

-- B. WHERE CLAUSE (Filtering)
-- Find all available cars
SELECT * FROM vehicles 
WHERE type = 'Car' AND availability = 'Available';

-- C. ORDER BY (Sorting)
-- Sort vehicles by rent in descending order (highest to lowest)
SELECT * FROM vehicles 
ORDER BY rent DESC;

-- D. GROUP BY & AGGREGATE FUNCTIONS (COUNT, AVG, MIN, MAX)
-- Group vehicles by type and calculate average rent and total count
SELECT 
    type, 
    COUNT(*) AS total_vehicles, 
    AVG(rent) AS average_rent,
    MIN(rent) AS min_rent,
    MAX(rent) AS max_rent
FROM vehicles
GROUP BY type;

-- E. SUBQUERY DEMONSTRATION (Concept Requirement)
-- Find vehicles whose daily rent is strictly greater than the average rent of all vehicles
SELECT id, name, type, rent, availability
FROM vehicles
WHERE rent > (
    SELECT AVG(rent)
    FROM vehicles
)
ORDER BY rent DESC;

-- F. INNER JOIN (Relational Data Query)
-- Fetch booking details along with vehicle name, type, and daily rent
SELECT 
    b.id AS booking_id,
    b.customer_name,
    b.email,
    b.phone,
    v.name AS vehicle_name,
    v.type AS vehicle_type,
    v.rent AS daily_rate,
    b.start_date,
    b.end_date,
    b.total_amount,
    b.booking_status
FROM bookings b
INNER JOIN vehicles v ON b.vehicle_id = v.id
ORDER BY b.id DESC;

-- G. UPDATE STATEMENT
-- Change availability of a vehicle
UPDATE vehicles 
SET availability = 'Available' 
WHERE id = 3;

-- H. DELETE STATEMENT
-- Delete a canceled/completed booking
DELETE FROM bookings 
WHERE id = 3;
