# 🚗 Vehicle Rental System — Full Stack Web Application

A full-stack web application built using **React.js**, **Node.js + Express.js**, and **MySQL** (`mysql2`). Designed as a complete, clean, beginner-friendly academic project suitable for a college Full Stack Development lab, course project, and viva evaluation.

---

## 📌 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Tech Stack](#-tech-stack)
4. [Project Structure](#-project-structure)
5. [Database Setup (MySQL)](#-database-setup-mysql)
6. [Environment Configuration](#-environment-configuration)
7. [Step-by-Step Execution Guide](#-step-by-step-execution-guide)
8. [REST API Documentation & Endpoints](#-rest-api-documentation--endpoints)
9. [Sample API Requests & Payloads](#-sample-api-requests--payloads)
10. [Academic Concepts Demonstrated](#-academic-concepts-demonstrated)
    - [JavaScript Concepts](#1-javascript-concepts)
    - [React Concepts](#2-react-concepts)
    - [Express.js Concepts](#3-expressjs-concepts)
    - [MySQL Concepts](#4-mysql-concepts)
11. [Troubleshooting & Common Errors](#-troubleshooting--common-errors)
12. [College Viva Q&A Reference](#-college-viva-qa-reference)

---

## 🌟 Project Overview
The **Vehicle Rental System** enables users to:
- Browse an interactive fleet catalog of cars, touring bikes, vans, SUVs, and electric vehicles.
- View real-time daily rental rates, vehicle categories, and availability statuses.
- Book vehicles using a controlled reservation form with real-time rental duration & total price calculation.
- View, search, filter, add, edit, and cancel vehicle reservations.
- Explore an interactive **Lab Viva Concept Portal** providing live code demonstrations of React hooks, class components, JavaScript function types, and MySQL subqueries.

---

## ✨ Key Features
- **Modern Responsive UI**: Built with pure CSS design tokens, glassmorphism, responsive grids, and subtle micro-animations.
- **Dynamic Fleet Catalog**: Filter vehicles by type (*Car, Bike, Van, SUV, EV*) and availability (*Available, Not Available*).
- **Full CRUD API**: Complete Create, Read, Update, and Delete endpoints for vehicles and bookings.
- **Controlled Reservation System**: Validates dates, customer details, calculates total duration, and generates receipt modals.
- **Relational MySQL Database**: Relational schema with Foreign Key constraints (`ON DELETE CASCADE`), indexes, and aggregate subqueries.
- **Graceful Database Fallback**: Built-in fallback in-memory data store ensures uninterrupted demonstration even if MySQL is temporarily offline.

---

## 💻 Tech Stack

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | React.js (Vite + JSX) | Dynamic component-based Single Page Application |
| **Styling** | Vanilla CSS3 | Modern design system, CSS variables, glassmorphism |
| **Backend** | Node.js + Express.js | REST API server, routing, and request validation |
| **Database** | MySQL (with `mysql2`) | Relational database storage with connection pooling |
| **Utilities** | `cors`, `dotenv` | Cross-Origin requests & environment security |

---

## 📂 Project Structure

```text
vehicle-rental-system/
├── client/                          # React Frontend (Vite)
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Top navigation bar
│   │   │   ├── VehicleCard.jsx      # Child component (Props, Conditional Rendering)
│   │   │   ├── VehicleList.jsx      # Parent component (map(), filtering, search)
│   │   │   ├── BookingForm.jsx      # Controlled form (useState, real-time math)
│   │   │   ├── ClassCounter.jsx     # Class component vs Hook comparison
│   │   │   └── LabConcepts.jsx      # Interactive viva evaluation suite
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Hero, Services, Why Choose Us, Contact
│   │   │   ├── Vehicles.jsx         # Fleet catalog with Add/Edit/Delete modals
│   │   │   ├── Booking.jsx          # Reservation portal & Bookings history table
│   │   │   └── LabDemo.jsx          # Live lab testing & health dashboard
│   │   ├── App.jsx                  # Main application component & routing
│   │   ├── main.jsx                 # React DOM mount point
│   │   └── index.css                # Global stylesheet & design tokens
│   ├── index.html                   # HTML template & Google Fonts
│   ├── vite.config.js               # Vite config with /api proxying
│   └── package.json                 # Frontend dependencies
│
├── server/                          # Express.js Backend
│   ├── config/
│   │   └── db.js                    # MySQL connection pool & resilient fallback
│   ├── controllers/
│   │   ├── vehicleController.js     # Vehicle CRUD logic & subquery handler
│   │   └── bookingController.js     # Booking creation, days math & JOIN queries
│   ├── routes/
│   │   ├── vehicleRoutes.js         # /api/vehicles route definitions
│   │   └── bookingRoutes.js         # /api/bookings route definitions
│   ├── app.js                       # Express entrypoint, middleware & error handling
│   ├── .env                         # Environment variables (DB credentials)
│   ├── .env.example                 # Example environment template
│   └── package.json                 # Backend dependencies
│
├── database/
│   └── database.sql                 # MySQL schema, tables, sample data & queries
│
└── README.md                        # Documentation & lab manual
```

---

## 🗄️ Database Setup (MySQL)

### 1. Start MySQL Server
Start your MySQL server (via XAMPP, MySQL Workbench, MySQL Service, or terminal):
```bash
# Example for MySQL CLI
mysql -u root -p
```

### 2. Execute `database.sql`
Run the SQL script located at `database/database.sql`:
```sql
SOURCE /path/to/vehicle-rental-system/database/database.sql;
```
*Or copy and paste the contents into MySQL Workbench / phpMyAdmin.*

### Database Schema Summary:

#### Table 1: `vehicles`
| Field | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique Vehicle ID |
| `name` | VARCHAR(100) | NOT NULL | Name/Model (e.g. Toyota Car) |
| `type` | VARCHAR(50) | NOT NULL | Category (Car, Bike, Van, SUV, EV) |
| `rent` | INT | NOT NULL | Daily rental rate in ₹ |
| `availability` | VARCHAR(20) | NOT NULL, DEFAULT 'Available'| 'Available' or 'Not Available' |

#### Table 2: `bookings`
| Field | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Reservation ID |
| `customer_name`| VARCHAR(100) | NOT NULL | Customer Full Name |
| `email` | VARCHAR(100) | NOT NULL | Customer Email Address |
| `phone` | VARCHAR(20) | NOT NULL | Contact Phone Number |
| `vehicle_id` | INT | FOREIGN KEY REFERENCES `vehicles(id)` | Linked vehicle |
| `start_date` | DATE | NOT NULL | Booking Start Date |
| `end_date` | DATE | NOT NULL | Booking End Date |
| `total_amount` | DECIMAL(10,2)| NOT NULL | Calculated Total Cost |
| `booking_status`| VARCHAR(30) | NOT NULL, DEFAULT 'Confirmed' | Reservation Status |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Timestamp |

---

## ⚙️ Environment Configuration

Navigate to `server/` and configure `.env`:
```env
PORT=5000
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=vehicle_rental
MYSQL_PORT=3306
```

> **Note**: Passwords are kept in `.env` and **never** hardcoded into JavaScript source files.

---

## 🚀 Step-by-Step Execution Guide

### Step 1: Start Backend (Express API)
Open a terminal in the `server/` folder:
```bash
cd server
npm install
node app.js
```
*Backend runs at: `http://localhost:5000`*

### Step 2: Start Frontend (React + Vite)
Open a second terminal in the `client/` folder:
```bash
cd client
npm install
npm run dev
```
*Frontend runs at: `http://localhost:3000`*

> ⚠️ **IMPORTANT LAB NOTE**:
> React JSX components cannot be executed with `node App.js`. React must be compiled and served using `npm run dev` (Vite dev server).
> Express is started using `node app.js`.

---

## 📡 REST API Documentation & Endpoints

| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Hello World & API Index | `200 OK` |
| `GET` | `/api/health` | Health Check & Database Status | `200 OK` |
| `GET` | `/api/vehicles` | Get all vehicles (with optional query filter) | `200 OK`, `500` |
| `GET` | `/api/vehicles/:id` | Get single vehicle details by ID | `200 OK`, `400`, `404` |
| `POST` | `/api/vehicles` | Add a new vehicle to fleet | `201 Created`, `400`, `500` |
| `PUT` | `/api/vehicles/:id` | Update existing vehicle info | `200 OK`, `400`, `404` |
| `DELETE` | `/api/vehicles/:id` | Remove a vehicle from fleet | `200 OK`, `400`, `404` |
| `GET` | `/api/vehicles/demo/above-average` | **Subquery Demo**: Vehicles with rent > average rent | `200 OK` |
| `GET` | `/api/bookings` | Get all customer bookings (JOIN query) | `200 OK`, `500` |
| `POST` | `/api/bookings` | Create new reservation (auto total calculation) | `201 Created`, `400`, `404` |
| `DELETE` | `/api/bookings/:id` | Cancel/delete an existing reservation | `200 OK`, `400`, `500` |

---

## 🧪 Sample API Requests & Payloads

### 1. Add Vehicle (`POST /api/vehicles`)
**Request Body (JSON):**
```json
{
  "name": "Tata Nexon EV",
  "type": "EV",
  "rent": 2100,
  "availability": "Available"
}
```
**Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Vehicle added successfully",
  "data": {
    "id": 7,
    "name": "Tata Nexon EV",
    "type": "EV",
    "rent": 2100,
    "availability": "Available"
  }
}
```

### 2. Create Booking (`POST /api/bookings`)
**Request Body (JSON):**
```json
{
  "customer_name": "Rahul Sharma",
  "email": "rahul.sharma@example.com",
  "phone": "9876543210",
  "vehicle_id": 1,
  "start_date": "2026-10-10",
  "end_date": "2026-10-13"
}
```
**Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Booking created successfully!",
  "data": {
    "id": 1,
    "customer_name": "Rahul Sharma",
    "email": "rahul.sharma@example.com",
    "phone": "9876543210",
    "vehicle_id": 1,
    "vehicle_name": "Toyota Car",
    "vehicle_type": "Car",
    "daily_rate": 1800,
    "rental_days": 3,
    "start_date": "2026-10-10",
    "end_date": "2026-10-13",
    "total_amount": 5400,
    "booking_status": "Confirmed"
  }
}
```

---

## 🎓 Academic Concepts Demonstrated

### 1. JavaScript Concepts
- **Linking JavaScript**: Single-page application loaded through `<script type="module" src="/src/main.jsx"></script>`.
- **Function Types**:
  1. *Function Declaration*: `function calculateRent(rate, days) { return rate * days; }`
  2. *Function Expression*: `const calculateRent = function(rate, days) { return rate * days; };`
  3. *Arrow Function*: `const calculateRent = (rate, days) => rate * days;`
- **Events**: React Synthetic events (`onClick`, `onChange`, `onSubmit`) compared with DOM `.addEventListener()`.
- **Template Literals**: `` `₹${vehicle.rent} / day` `` for dynamic string interpolation.

### 2. React Concepts
- **Functional Components**: All modern pages and UI cards built with clean ES6 functions.
- **Class Component Counter**: `ReactClassCounter` in [`ClassCounter.jsx`](file:///C:/Users/sivas/.gemini/antigravity-ide/scratch/vehicle-rental-system/client/src/components/ClassCounter.jsx) demonstrating `this.state` and `this.setState()`.
- **Hooks**:
  - `useState`: Manages form inputs, counter numbers, active tabs, vehicle selection, and loading states.
  - `useEffect`: Asynchronously fetches vehicle records on component mount (`[]`).
- **Props**: Parent components (`VehicleList`) passing vehicle objects and action callbacks to child components (`VehicleCard`).
- **Controlled Forms**: Inputs bound to state with `value={formData.customer_name}` and `onChange={handleChange}`.
- **Dynamic Iteration**: `vehicles.map(vehicle => <VehicleCard key={vehicle.id} ... />)`.
- **Conditional Rendering**: Displays dynamic green badge for `"Available"` and red badge for `"Not Available"`.

### 3. Express.js Concepts
- **Route Handlers**: Modular routers using `express.Router()`.
- **Built-in Middleware**: `express.json()` for parsing incoming JSON request bodies.
- **Third-Party Middleware**: `cors()` enabling secure cross-origin HTTP communication.
- **HTTP Status Codes**: Proper utilization of `200`, `201`, `400`, `404`, and `500`.
- **Logging**: Console request logger recording request method, URL, and timestamps.

### 4. MySQL Concepts
- **DDL**: `CREATE DATABASE`, `CREATE TABLE`, `DROP TABLE`.
- **DML**: `INSERT INTO`, `SELECT`, `UPDATE`, `DELETE`.
- **Clauses**: `WHERE`, `ORDER BY`, `GROUP BY`, `HAVING`.
- **Subquery Demonstration**:
  ```sql
  SELECT id, name, type, rent, availability
  FROM vehicles
  WHERE rent > (
      SELECT AVG(rent)
      FROM vehicles
  )
  ORDER BY rent DESC;
  ```
- **Relational Integrity**: Foreign Key in `bookings.vehicle_id` referencing `vehicles.id` with `ON DELETE CASCADE`.
- **Relational JOIN**: Inner/Left JOIN combining customer booking records with vehicle names and types.

---

## 🛠️ Troubleshooting & Common Errors

1. **Port 5000 Already in Use**:
   - Change `PORT=5001` inside `server/.env` and update `client/vite.config.js` proxy target.
2. **Access Denied for MySQL User 'root'**:
   - Check your password inside `server/.env`. If your root user has no password, leave `MYSQL_PASSWORD=`.
3. **CORS Policy Error**:
   - Ensure `app.use(cors())` is placed before route definitions in `server/app.js`.
4. **Trying to run React with `node App.js`**:
   - JSX syntax is not native to Node.js. Run `npm run dev` inside `client/` instead.

---

## 💡 College Viva Q&A Reference

1. **Q: What is the purpose of connection pooling in `mysql2`?**
   - *A: Connection pooling maintains a pool of reusable database connections. Instead of opening and closing a new TCP connection on every API request (which is expensive), connections are borrowed from the pool and returned, improving performance and scalability.*

2. **Q: How does `useEffect` work in the vehicle catalog?**
   - *A: `useEffect` executes after the component renders. By supplying an empty dependency array `[]`, it triggers once when the component mounts, dispatching a `fetch('/api/vehicles')` request to hydrate state.*

3. **Q: What is a Foreign Key constraint?**
   - *A: A Foreign Key connects a column in one table (`bookings.vehicle_id`) to the Primary Key of another table (`vehicles.id`), maintaining referential integrity so bookings cannot exist for non-existent vehicles.*

4. **Q: Why use `express.json()` middleware?**
   - *A: By default, Express cannot parse raw JSON from HTTP request bodies. `express.json()` reads the stream and attaches the parsed payload to `req.body`.*
