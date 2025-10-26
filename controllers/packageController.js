const TravelPackage = require('../models/TravelPackage');
const Itinerary = require('../models/Itinerary');
const cloudinary = require('../config/cloudinary');

// Get all packages (public)
const getAllPackages = async (req, res) => {
  try {
    const packages = await TravelPackage.find({ status: 'active' })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: packages.length,
      data: packages
    });
  } catch (error) {
    console.error('Get packages error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching packages' 
    });
  }
};

// Get single package by ID (public)
const getPackageById = async (req, res) => {
  try {
    const package = await TravelPackage.findById(req.params.id);
    
    if (!package) {
      return res.status(404).json({ 
        success: false,
        message: 'Package not found' 
      });
    }

    // Get itinerary for this package
    const itinerary = await Itinerary.find({ packageId: req.params.id })
      .sort({ dayNumber: 1 });

    res.json({
      success: true,
      data: {
        package,
        itinerary
      }
    });
  } catch (error) {
    console.error('Get package error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching package' 
    });
  }
};


// Create new package (admin only)
const createPackage = async (req, res) => {
  try {
    console.log('=== CREATE PACKAGE REQUEST ===');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('File:', req.file);
    console.log('=== END REQUEST ===');
    const packageData = {
      ...req.body,
      // If image was uploaded, use the Cloudinary URL
      heroImage: req.file ? req.file.path : req.body.heroImage || ''
    };

    // Parse included array if it's a string (from form data)
    if (typeof packageData.included === 'string') {
      packageData.included = JSON.parse(packageData.included);
    }

    // Parse similarTours if it exists
    if (packageData.similarTours && typeof packageData.similarTours === 'string') {
      packageData.similarTours = JSON.parse(packageData.similarTours);
    }

    const package = new TravelPackage(packageData);
    await package.save();

    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      data: package
    });
  } catch (error) {
    console.error('Create package error:', error);
    
    // If there's an error and a file was uploaded, delete it from Cloudinary
    if (req.file && req.file.path) {
      try {
        const urlParts = req.file.path.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = publicIdWithExtension.split('.')[0];
        const fullPublicId = `travel-app/packages/${publicId}`;
        await cloudinary.uploader.destroy(fullPublicId);
      } catch (deleteError) {
        console.error('Error deleting uploaded image after failure:', deleteError);
      }
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
      message: 'Server error while creating package' 
    });
  }
};


// Update package (admin only)
const updatePackage = async (req, res) => {
  try {
    console.log('hh');
    
    const existingPackage = await TravelPackage.findById(req.params.id);
    
    if (!existingPackage) {
      return res.status(404).json({ 
        success: false,
        message: 'Package not found' 
      });
    }

    const updateData = {
      ...req.body,
      // If new image was uploaded, use the new Cloudinary URL
      heroImage: req.file ? req.file.path : req.body.heroImage
    };

    // Parse included array if it's a string
    if (typeof updateData.included === 'string') {
      updateData.included = JSON.parse(updateData.included);
    }

    // Parse similarTours if it exists
    if (updateData.similarTours && typeof updateData.similarTours === 'string') {
      updateData.similarTours = JSON.parse(updateData.similarTours);
    }

    // If new image was uploaded and old image exists in Cloudinary, delete old one
    if (req.file && existingPackage.heroImage && 
        existingPackage.heroImage.includes('res.cloudinary.com')) {
      
      try {
        const urlParts = existingPackage.heroImage.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = publicIdWithExtension.split('.')[0];
        const fullPublicId = `travel-app/packages/${publicId}`;
        
        await cloudinary.uploader.destroy(fullPublicId);
        console.log('Deleted old image from Cloudinary:', fullPublicId);
      } catch (cloudinaryError) {
        console.error('Error deleting old image from Cloudinary:', cloudinaryError);
      }
    }

    const package = await TravelPackage.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Package updated successfully',
      data: package
    });
  } catch (error) {
    console.error('Update package error:', error);
    
    // If there's an error and a new file was uploaded, delete it from Cloudinary
    if (req.file && req.file.path) {
      try {
        const urlParts = req.file.path.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = publicIdWithExtension.split('.')[0];
        const fullPublicId = `travel-app/packages/${publicId}`;
        await cloudinary.uploader.destroy(fullPublicId);
      } catch (deleteError) {
        console.error('Error deleting uploaded image after failure:', deleteError);
      }
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
      message: 'Server error while updating package' 
    });
  }
};


// Delete package (admin only)
const deletePackage = async (req, res) => {
  try {
    const package = await TravelPackage.findById(req.params.id);
    
    if (!package) {
      return res.status(404).json({ 
        success: false,
        message: 'Package not found' 
      });
    }

    // Delete hero image from Cloudinary if it exists
    if (package.heroImage && package.heroImage.includes('res.cloudinary.com')) {
      try {
        const urlParts = package.heroImage.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = publicIdWithExtension.split('.')[0];
        const fullPublicId = `travel-app/packages/${publicId}`;
        
        await cloudinary.uploader.destroy(fullPublicId);
        console.log('Deleted package image from Cloudinary:', fullPublicId);
      } catch (cloudinaryError) {
        console.error('Error deleting image from Cloudinary:', cloudinaryError);
        // Continue with deletion even if image deletion fails
      }
    }

    // Delete associated itineraries
    await Itinerary.deleteMany({ packageId: req.params.id });
    
    // Delete package
    await TravelPackage.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Package deleted successfully'
    });
  } catch (error) {
    console.error('Delete package error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while deleting package' 
    });
  }
};

// Get similar tours for a package
const getSimilarTours = async (req, res) => {
  try {
    const package = await TravelPackage.findById(req.params.packageId);
    
    if (!package) {
      return res.status(404).json({ 
        success: false,
        message: 'Package not found' 
      });
    }

    // For now, return the similar tours from the package itself
    // Later you can implement logic to find actually similar packages
    res.json({
      success: true,
      data: package.similarTours || []
    });
  } catch (error) {
    console.error('Get similar tours error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching similar tours' 
    });
  }
};

// Upload package image (admin only)
const uploadPackageImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // File is automatically uploaded to Cloudinary by multer
    const imageUrl = req.file.path;
    const publicId = req.file.filename;

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: imageUrl,
        publicId: publicId,
        format: req.file.format,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image'
    });
  }
};

// Delete package image (admin only)
const deletePackageImage = async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      res.json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to delete image'
      });
    }
  } catch (error) {
    console.error('Image deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image'
    });
  }
};

module.exports = {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
  getSimilarTours,
  uploadPackageImage,
  deletePackageImage
};