const express = require('express');
const { loginAdmin, logoutAdmin, verifyAdmin } = require('../controllers/authController');
const { validateLogin, handleValidationErrors } = require('../middleware/validation');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/login', validateLogin, handleValidationErrors, loginAdmin);
router.post('/logout', logoutAdmin);

// Protected routes
router.get('/verify', authMiddleware, verifyAdmin);

module.exports = router;