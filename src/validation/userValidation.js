const { body } = require('express-validator');

exports.validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
    .toLowerCase(),
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('age')
    .isInt({ min: 13, max: 120 })
    .withMessage('Age must be between 13 and 120'),
  body('gender')
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  body('height')
    .isFloat({ min: 50, max: 300 })
    .withMessage('Height must be between 50 and 300 cm'),
  body('weight')
    .isFloat({ min: 20, max: 500 })
    .withMessage('Weight must be between 20 and 500 kg'),
  body('goal')
    .isIn([
      'lose_weight',
      'maintain_weight',
      'gain_weight',
      'build_muscle',
      'improve_health',
    ])
    .withMessage(
      'Goal must be one of: lose_weight, maintain_weight, gain_weight, build_muscle, improve_health'
    ),
  body('preferences')
    .optional()
    .isArray()
    .withMessage('Preferences must be an array of strings'),
  body('allergies')
    .optional()
    .isArray()
    .withMessage('Allergies must be an array of strings'),
];

// Validation middleware for login
exports.validateLogin = [
  body('email')
  .notEmpty()
  .withMessage('Email is required')
  .isEmail()
  .withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Validation middleware for password change
exports.validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      'New password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
];
