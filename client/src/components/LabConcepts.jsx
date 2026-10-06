import React, { useState } from 'react';
import { ReactClassCounter, FunctionalHookCounter } from './ClassCounter';

/**
 * LabConcepts Component
 * A comprehensive, interactive College Lab & Viva demonstration suite.
 */
export default function LabConcepts() {
  const [activeLabSection, setActiveLabSection] = useState('react');
  const [subqueryResult, setSubqueryResult] = useState(null);
  const [subqueryLoading, setSubqueryLoading] = useState(false);

  // JS Concept Demo states
  const [fnInputA, setFnInputA] = useState(1800);
  const [fnInputB, setFnInputB] = useState(3);
  const [fnOutput, setFnOutput] = useState('');

  // 1. Function Declaration
  function calculateRentDeclaration(rate, days) {
    return rate * days;
  }

  // 2. Function Expression
  const calculateRentExpression = function (rate, days) {
    return rate * days;
  };

  // 3. Arrow Function
  const calculateRentArrow = (rate, days) => rate * days;

  // Test Function Types
  const handleTestFn = (type) => {
    let result = 0;
    let explanation = '';
    if (type === 'declaration') {
      result = calculateRentDeclaration(Number(fnInputA), Number(fnInputB));
      explanation = `Executed: function calculateRentDeclaration(${fnInputA}, ${fnInputB}) => ₹${result} (Hoisted in JS scope)`;
    } else if (type === 'expression') {
      result = calculateRentExpression(Number(fnInputA), Number(fnInputB));
      explanation = `Executed: const calculateRentExpression = function(${fnInputA}, ${fnInputB}) => ₹${result} (Assigned to variable)`;
    } else {
      result = calculateRentArrow(Number(fnInputA), Number(fnInputB));
      explanation = `Executed: (${fnInputA}, ${fnInputB}) => ${fnInputA} * ${fnInputB} => ₹${result} (ES6 Arrow syntax)`;
    }
    setFnOutput(explanation);
  };

  // Test Live MySQL Subquery from Backend API
  const fetchSubqueryDemo = async () => {
    setSubqueryLoading(true);
    try {
      const res = await fetch('/api/vehicles/demo/above-average');
      const json = await res.json();
      setSubqueryResult(json);
    } catch (err) {
      setSubqueryResult({ error: err.message });
    } finally {
      setSubqueryLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <div className="section-header" style={{ textAlign: 'left', marginBottom: '24px' }}>
        <span className="section-tag">Academic Review & Viva Guide</span>
        <h2 className="section-title">🎓 Lab Syllabus Concepts Demonstration</h2>
        <p className="section-subtitle" style={{ margin: '0' }}>
          Interactive proof and side-by-side code demonstrations for JavaScript, React, Express, and MySQL.
        </p>
      </div>

      {/* Lab Tab Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          className={`btn ${activeLabSection === 'react' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveLabSection('react')}
        >
          ⚛️ React Concepts
        </button>
        <button
          className={`btn ${activeLabSection === 'js' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveLabSection('js')}
        >
          🟨 JavaScript Concepts
        </button>
        <button
          className={`btn ${activeLabSection === 'express' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveLabSection('express')}
        >
          🚀 Express.js API Concepts
        </button>
        <button
          className={`btn ${activeLabSection === 'mysql' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveLabSection('mysql')}
        >
          🗄️ MySQL & Subqueries
        </button>
      </div>

      {/* =========================================================
          SECTION 1: REACT CONCEPTS
         ========================================================= */}
      {activeLabSection === 'react' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Class Component Demo */}
            <ReactClassCounter />

            {/* Functional Hook Counter Demo */}
            <FunctionalHookCounter />
          </div>

          <div className="concept-card">
            <span className="lab-badge">React Concept #3 & #4</span>
            <h3>Props & Dynamic List Rendering with map()</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '8px 0' }}>
              The parent component <code>VehicleList.jsx</code> iterates over the fleet array using{' '}
              <code>vehicles.map()</code> and passes each vehicle object to the child{' '}
              <code>VehicleCard.jsx</code> via <strong>Props</strong>.
            </p>
            <div className="code-snippet">
{`// Parent Component (VehicleList.jsx)
{vehicles.map((vehicle) => (
  <VehicleCard
    key={vehicle.id}
    vehicle={vehicle}     // <--- Passing data as props
    onBook={handleBooking} // <--- Passing callback function as props
  />
))}

// Child Component (VehicleCard.jsx)
function VehicleCard({ vehicle, onBook }) {
  return (
    <div>
      <h3>{vehicle.name}</h3>
      <p>₹\${vehicle.rent} / day</p>
      {/* Conditional Rendering */}
      {vehicle.availability === 'Available' ? (
        <span className="badge-available">Available</span>
      ) : (
        <span className="badge-unavailable">Not Available</span>
      )}
    </div>
  );
}`}
            </div>
          </div>

          <div className="concept-card">
            <span className="lab-badge">React Concept #5</span>
            <h3>useEffect Hook (Data Fetching Lifecycle)</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '8px 0' }}>
              Executes on component mounting to fetch live vehicle records from the Express backend.
            </p>
            <div className="code-snippet">
{`useEffect(() => {
  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles');
      const data = await response.json();
      setVehicles(data.data);
    } catch (err) {
      console.error("API error:", err);
    }
  };
  fetchVehicles();
}, []); // Empty dependency array = runs once on component mount`}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          SECTION 2: JAVASCRIPT CONCEPTS
         ========================================================= */}
      {activeLabSection === 'js' && (
        <div>
          <div className="concept-card">
            <span className="lab-badge">JavaScript Concept #1</span>
            <h3>Function Declarations vs Function Expressions vs Arrow Functions</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '8px 0' }}>
              Test how different function styles compute rental rate × days in real-time:
            </p>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', margin: '16px 0', flexWrap: 'wrap' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Rate (₹):</label>
                <input
                  type="number"
                  className="form-control"
                  style={{ width: '120px' }}
                  value={fnInputA}
                  onChange={(e) => setFnInputA(e.target.value)}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Days:</label>
                <input
                  type="number"
                  className="form-control"
                  style={{ width: '120px' }}
                  value={fnInputB}
                  onChange={(e) => setFnInputB(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-end' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => handleTestFn('declaration')}>
                  Run Declaration
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => handleTestFn('expression')}>
                  Run Expression
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => handleTestFn('arrow')}>
                  Run Arrow Function
                </button>
              </div>
            </div>

            {fnOutput && (
              <div className="alert alert-info" style={{ marginTop: '10px' }}>
                💡 {fnOutput}
              </div>
            )}

            <div className="code-snippet">
{`// 1. Function Declaration (Hoisted)
function calculateRentDeclaration(rate, days) {
  return rate * days;
}

// 2. Function Expression (Anonymous function assigned to a variable)
const calculateRentExpression = function(rate, days) {
  return rate * days;
};

// 3. Arrow Function (ES6 concise syntax, lexical 'this')
const calculateRentArrow = (rate, days) => rate * days;`}
            </div>
          </div>

          <div className="concept-card">
            <span className="lab-badge">JavaScript Concept #2</span>
            <h3>Event Handling & DOM Integration</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '8px 0' }}>
              Comparison of Vanilla DOM selectors vs React Synthetic Event handlers:
            </p>
            <div className="code-snippet">
{`// Vanilla JavaScript:
document.getElementById("rentBtn").addEventListener("click", function(event) {
  console.log("Rent button clicked!");
});

// React Synthetic Event (In this application):
<button onClick={(e) => handleRentClick(vehicle)}>
  Rent Vehicle
</button>`}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          SECTION 3: EXPRESS.JS CONCEPTS
         ========================================================= */}
      {activeLabSection === 'express' && (
        <div>
          <div className="concept-card">
            <span className="lab-badge">Express Concept #1</span>
            <h3>REST API Route Architecture & Middleware</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '8px 0' }}>
              Express handles REST endpoints using controller modularization, <code>cors()</code>, and <code>express.json()</code>.
            </p>
            <div className="code-snippet">
{`// server/app.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); // Parses application/json request body

// Hello World Route
app.get('/', (req, res) => {
  res.status(200).json({ message: "Vehicle Rental API Running!" });
});

// Mount modular route handlers
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);`}
            </div>
          </div>

          <div className="concept-card">
            <span className="lab-badge">Express Concept #2</span>
            <h3>Standard HTTP Status Codes Used</h3>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-main)', fontSize: '0.92rem', lineHeight: '1.8' }}>
              <li><code>200 OK</code>: Successful retrieval or update (GET, PUT, DELETE)</li>
              <li><code>201 Created</code>: Successful creation of a new vehicle or booking (POST)</li>
              <li><code>400 Bad Request</code>: Validation failed (missing required fields or invalid dates)</li>
              <li><code>404 Not Found</code>: Vehicle ID or endpoint does not exist</li>
              <li><code>500 Internal Server Error</code>: Unhandled exception or database error</li>
            </ul>
          </div>
        </div>
      )}

      {/* =========================================================
          SECTION 4: MYSQL & SUBQUERIES
         ========================================================= */}
      {activeLabSection === 'mysql' && (
        <div>
          <div className="concept-card">
            <span className="lab-badge">MySQL Requirement</span>
            <h3>Live SQL Subquery Demonstration</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '8px 0' }}>
              Demonstrates finding all vehicles whose daily rent is strictly greater than the average rent of all vehicles across the fleet.
            </p>

            <div className="code-snippet">
{`SELECT id, name, type, rent, availability
FROM vehicles
WHERE rent > (
    SELECT AVG(rent)
    FROM vehicles
)
ORDER BY rent DESC;`}
            </div>

            <div style={{ marginTop: '16px' }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={fetchSubqueryDemo}
                disabled={subqueryLoading}
              >
                {subqueryLoading ? 'Executing Subquery on Express...' : '⚡ Execute Live Subquery'}
              </button>
            </div>

            {subqueryResult && (
              <div style={{ marginTop: '16px' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '8px', color: 'var(--primary)' }}>
                  ✅ Query Results ({subqueryResult.count || subqueryResult.data?.length} vehicles found):
                </h4>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Vehicle Name</th>
                        <th>Type</th>
                        <th>Rent/Day</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subqueryResult.data?.map((v) => (
                        <tr key={v.id}>
                          <td>#{v.id}</td>
                          <td><strong>{v.name}</strong></td>
                          <td>{v.type}</td>
                          <td style={{ color: 'var(--primary)', fontWeight: 'bold' }}>₹{v.rent}</td>
                          <td>
                            {v.availability === 'Available' ? (
                              <span className="badge-available">Available</span>
                            ) : (
                              <span className="badge-unavailable">Not Available</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="concept-card">
            <span className="lab-badge">MySQL Relational Query</span>
            <h3>INNER JOIN / Relational Integrity</h3>
            <div className="code-snippet">
{`-- Fetch customer bookings along with vehicle names using foreign key vehicle_id
SELECT 
    b.id,
    b.customer_name,
    b.email,
    v.name AS vehicle_name,
    v.type AS vehicle_type,
    b.start_date,
    b.end_date,
    b.total_amount
FROM bookings b
JOIN vehicles v ON b.vehicle_id = v.id
ORDER BY b.id DESC;`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
