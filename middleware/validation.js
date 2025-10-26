const { body, validationResult } = require('express-validator');

// Validation rules for admin login
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

// Validation rules for travel package (form-data compatible)
const validatePackage = [
  body('title')
    .notEmpty()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('route')
    .notEmpty()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Route must be between 10 and 500 characters'),
  
  body('duration')
    .isInt({ min: 1, max: 365 })
    .withMessage('Duration must be a positive number between 1 and 365'),
  
body('description')
  .notEmpty()
  .trim()
  .isLength({ min: 20, max: 5000 }) // Reduced min, increased max
  .withMessage('Description must be between 20 and 5000 characters'),


  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  
  body('included')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed);
        } catch {
          return false;
        }
      }
      return Array.isArray(value);
    })
    .withMessage('Included items must be a valid JSON array string or array'),
  
  body('included.*')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Each included item must be a non-empty string'),
  
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be either active or inactive'),
  
 body('brochureUrl')
  .optional({ checkFalsy: true }) // This allows empty strings
  .isURL()
  .withMessage('Brochure URL must be a valid URL'),

  body('similarTours')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed);
        } catch {
          return false;
        }
      }
      return Array.isArray(value);
    })
    .withMessage('Similar tours must be a valid JSON array string or array'),
  
  body('similarTours.*.title')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Similar tour title is required'),
  
  body('similarTours.*.description')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Similar tour description is required'),
  
  body('similarTours.*.image')
    .optional()
    .isString()
    .trim()
    .withMessage('Similar tour image must be a string')
];

// Validation rules for updating package (all fields optional, form-data compatible)
const validatePackageUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('route')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Route must be between 10 and 500 characters'),
  
  body('duration')
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage('Duration must be a positive number between 1 and 365'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 50, max: 2000 })
    .withMessage('Description must be between 50 and 2000 characters'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  
  body('included')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed);
        } catch {
          return false;
        }
      }
      return Array.isArray(value);
    })
    .withMessage('Included items must be a valid JSON array string or array'),
  
  body('included.*')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Each included item must be a non-empty string'),
  
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be either active or inactive'),
  
 body('brochureUrl')
  .optional({ checkFalsy: true }) // This allows empty strings
  .isURL()
  .withMessage('Brochure URL must be a valid URL'),
  
  body('heroImage')
    .optional()
    .isURL()
    .withMessage('Hero image must be a valid URL'),
  
  body('similarTours')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed);
        } catch {
          return false;
        }
      }
      return Array.isArray(value);
    })
    .withMessage('Similar tours must be a valid JSON array string or array')
];

// Validation rules for itinerary
const validateItinerary = [
  body('packageId')
    .notEmpty()
    .withMessage('Package ID is required')
    .isMongoId()
    .withMessage('Invalid package ID format'),
  
  body('dayNumber')
    .isInt({ min: 1, max: 365 })
    .withMessage('Day number must be a positive number between 1 and 365'),
  
  body('title')
    .notEmpty()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('description')
    .notEmpty()
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  
  body('activities')
    .optional()
    .isArray()
    .withMessage('Activities must be an array'),
  
  body('activities.*')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Each activity must be a non-empty string')
];

// Validation rules for updating itinerary (all fields optional)
const validateItineraryUpdate = [
  body('dayNumber')
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage('Day number must be a positive number between 1 and 365'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  
  body('activities')
    .optional()
    .isArray()
    .withMessage('Activities must be an array'),
  
  body('activities.*')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Each activity must be a non-empty string')
];

// Middleware to check for validation errors
// CORRECT - Use a different variable name:
const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req); // ✅ Changed to validationErrors
  
  console.log('=== VALIDATION ERRORS ===');
  console.log(validationErrors.array()); // ✅ Now it works
  console.log('=== END VALIDATION ERRORS ===');
  
  if (!validationErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: validationErrors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

// File upload validation (for images)
const validateFileUpload = (req, res, next) => {
  if (!req.file) {
    return next(); // File is optional for updates
  }

  // Check file type
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed'
    });
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (req.file.size > maxSize) {
    return res.status(400).json({
      success: false,
      message: 'File size too large. Maximum size is 5MB'
    });
  }

  next();
};

// ObjectId validation middleware
const validateObjectId = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    // Basic MongoDB ObjectId validation (24 hex characters)
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName} format`
      });
    }
    
    next();
  };
};

module.exports = {
  validateLogin,
  validatePackage,
  validateItinerary,
  validatePackageUpdate,
  validateItineraryUpdate,
  handleValidationErrors,
  validateFileUpload,
  validateObjectId
};