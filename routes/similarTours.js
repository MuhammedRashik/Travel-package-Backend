const express = require('express');
const { 
  addSimilarTour, 
  updateSimilarTour, 
  deleteSimilarTour, 
  getSimilarTours 
} = require('../controllers/similarTourController');
const { uploadSingle } = require('../middleware/upload');
const authMiddleware = require('../middleware/auth');
const { validateObjectId } = require('../middleware/validation');

const router = express.Router();

// All routes are protected and require admin authentication
router.use(authMiddleware);

// Get similar tours for a package
router.get('/:packageId', validateObjectId('packageId'), getSimilarTours);

// Add similar tour to package
router.post('/:packageId', validateObjectId('packageId'), uploadSingle, addSimilarTour);

// Update similar tour (tourIndex is the array index)
router.put('/:packageId/:tourIndex', validateObjectId('packageId'), uploadSingle, updateSimilarTour);

// Delete similar tour
router.delete('/:packageId/:tourIndex', validateObjectId('packageId'), deleteSimilarTour);

module.exports = router;