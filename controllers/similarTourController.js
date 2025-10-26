const TravelPackage = require('../models/TravelPackage');
const cloudinary = require('../config/cloudinary');

// Add similar tour to package
const addSimilarTour = async (req, res) => {
  try {
    const { packageId } = req.params;
    const { title, description } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image is required for similar tour'
      });
    }

    const package = await TravelPackage.findById(packageId);
    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    // Check if already has 3 similar tours
    if (package.similarTours.length >= 3) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 3 similar tours allowed per package'
      });
    }

    const similarTour = {
      title,
      description,
      image: req.file.path,
      publicId: req.file.filename
    };

    package.similarTours.push(similarTour);
    await package.save();

    res.status(201).json({
      success: true,
      message: 'Similar tour added successfully',
      data: similarTour
    });
  } catch (error) {
    console.error('Add similar tour error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding similar tour'
    });
  }
};

// Update similar tour
const updateSimilarTour = async (req, res) => {
  try {
    console.log('lettss');
    
    const { packageId, tourIndex } = req.params;
    const { title, description } = req.body;

    const package = await TravelPackage.findById(packageId);
    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    if (tourIndex < 0 || tourIndex >= package.similarTours.length) {
      return res.status(404).json({
        success: false,
        message: 'Similar tour not found'
      });
    }

    const existingTour = package.similarTours[tourIndex];

    // If new image uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      if (existingTour.publicId) {
        try {
          await cloudinary.uploader.destroy(existingTour.publicId);
        } catch (cloudinaryError) {
          console.error('Error deleting old image:', cloudinaryError);
        }
      }

      existingTour.image = req.file.path;
      existingTour.publicId = req.file.filename;
    }

    // Update other fields
    existingTour.title = title || existingTour.title;
    existingTour.description = description || existingTour.description;

    await package.save();

    res.json({
      success: true,
      message: 'Similar tour updated successfully',
      data: existingTour
    });
  } catch (error) {
    console.error('Update similar tour error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating similar tour'
    });
  }
};

// Delete similar tour
const deleteSimilarTour = async (req, res) => {
  try {
    const { packageId, tourIndex } = req.params;

    const package = await TravelPackage.findById(packageId);
    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    if (tourIndex < 0 || tourIndex >= package.similarTours.length) {
      return res.status(404).json({
        success: false,
        message: 'Similar tour not found'
      });
    }

    const deletedTour = package.similarTours[tourIndex];

    // Delete image from Cloudinary
    if (deletedTour.publicId) {
      try {
        await cloudinary.uploader.destroy(deletedTour.publicId);
      } catch (cloudinaryError) {
        console.error('Error deleting image:', cloudinaryError);
      }
    }

    // Remove from array
    package.similarTours.splice(tourIndex, 1);
    await package.save();

    res.json({
      success: true,
      message: 'Similar tour deleted successfully'
    });
  } catch (error) {
    console.error('Delete similar tour error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting similar tour'
    });
  }
};

// Get similar tours for a package
const getSimilarTours = async (req, res) => {
  try {
    const { packageId } = req.params;

    const package = await TravelPackage.findById(packageId).select('similarTours');
    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    res.json({
      success: true,
      data: package.similarTours
    });
  } catch (error) {
    console.error('Get similar tours error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching similar tours'
    });
  }
};

module.exports = {
  addSimilarTour,
  updateSimilarTour,
  deleteSimilarTour,
  getSimilarTours
};