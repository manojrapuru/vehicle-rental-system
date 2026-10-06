const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

// Lab Subquery demonstration endpoint
router.get('/demo/above-average', vehicleController.getAboveAverageVehicles);

// CRUD routes for vehicles
router.get('/', vehicleController.getAllVehicles);
router.get('/:id', vehicleController.getVehicleById);
router.post('/', vehicleController.createVehicle);
router.put('/:id', vehicleController.updateVehicle);
router.delete('/:id', vehicleController.deleteVehicle);

module.exports = router;
