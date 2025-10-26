const express = require('express');
const { getAllPackages, getPackageById, getSimilarTours } = require('../controllers/packageController');
const { getItineraryByPackage } = require('../controllers/itineraryController');
const { validateObjectId } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', getAllPackages);
router.get('/:id', validateObjectId('id'), getPackageById);
router.get('/:packageId/itinerary', validateObjectId('packageId'), getItineraryByPackage);
router.get('/similar-tours/:packageId', validateObjectId('packageId'), getSimilarTours);

module.exports = router;