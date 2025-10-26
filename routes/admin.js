const express = require('express');
const { createPackage, updatePackage, deletePackage, deletePackageImage, uploadPackageImage } = require('../controllers/packageController');
const { addItineraryDay, updateItineraryDay, deleteItineraryDay } = require('../controllers/itineraryController');
const authMiddleware = require('../middleware/auth');
const { 
  validatePackage, 
  validateItinerary, 
  validatePackageUpdate, 
  validateItineraryUpdate, 
  handleValidationErrors,
  validateObjectId 
} = require('../middleware/validation');
const { uploadSingle } = require('../middleware/upload');

const router = express.Router();

// All admin routes are protected
router.use(authMiddleware);

// Package management routes
router.post('/packages', uploadSingle, validatePackage, handleValidationErrors, createPackage);
router.put('/packages/:id', validateObjectId('id'), uploadSingle, validatePackageUpdate, handleValidationErrors, updatePackage);
router.delete('/packages/:id', validateObjectId('id'), deletePackage);

// Itinerary management routes
router.post('/itinerary', validateItinerary, handleValidationErrors, addItineraryDay);
router.put('/itinerary/:id', validateObjectId('id'), validateItineraryUpdate, handleValidationErrors, updateItineraryDay);
router.delete('/itinerary/:id', validateObjectId('id'), deleteItineraryDay);

router.post('/upload/image', uploadSingle, uploadPackageImage);
router.delete('/upload/image', deletePackageImage);

module.exports = router;