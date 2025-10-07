const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const {
  getProfile,
  updateProfile,
  getUserById,
  validateProfileUpdate,
  handleValidationErrors
} = require('../controller/profileController');

// Profile management routes
router.get('/', authenticate, getProfile);
router.patch('/', authenticate, validateProfileUpdate, handleValidationErrors, updateProfile);

module.exports = router;