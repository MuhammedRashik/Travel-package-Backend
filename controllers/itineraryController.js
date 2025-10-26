const Itinerary = require('../models/Itinerary');
const TravelPackage = require('../models/TravelPackage');

// Get itinerary for a package
const getItineraryByPackage = async (req, res) => {
  try {
    const itinerary = await Itinerary.find({ packageId: req.params.packageId })
      .sort({ dayNumber: 1 });

    res.json({
      success: true,
      count: itinerary.length,
      data: itinerary
    });
  } catch (error) {
    console.error('Get itinerary error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching itinerary' 
    });
  }
};

// Add day to itinerary
const addItineraryDay = async (req, res) => {
  try {
    const package = await TravelPackage.findById(req.body.packageId);
    if (!package) {
      return res.status(404).json({ 
        success: false,
        message: 'Package not found' 
      });
    }

    const itinerary = new Itinerary(req.body);
    await itinerary.save();

    res.status(201).json({
      success: true,
      message: 'Itinerary day added successfully',
      data: itinerary
    });
  } catch (error) {
    console.error('Add itinerary error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Day number already exists for this package'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Server error while adding itinerary day' 
    });
  }
};

// Update itinerary day
const updateItineraryDay = async (req, res) => {
  try {
    const itinerary = await Itinerary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!itinerary) {
      return res.status(404).json({ 
        success: false,
        message: 'Itinerary day not found' 
      });
    }

    res.json({
      success: true,
      message: 'Itinerary day updated successfully',
      data: itinerary
    });
  } catch (error) {
    console.error('Update itinerary error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Server error while updating itinerary day' 
    });
  }
};

// Delete itinerary day
const deleteItineraryDay = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    
    if (!itinerary) {
      return res.status(404).json({ 
        success: false,
        message: 'Itinerary day not found' 
      });
    }

    await Itinerary.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Itinerary day deleted successfully'
    });
  } catch (error) {
    console.error('Delete itinerary error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while deleting itinerary day' 
    });
  }
};

module.exports = {
  getItineraryByPackage,
  addItineraryDay,
  updateItineraryDay,
  deleteItineraryDay
};