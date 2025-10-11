const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  changePassword,
  deactivateAccount,
} = require('../controller/userController');

const { getUserById } = require('../controller/profileController');

const { authenticate } = require('../middleware/authMiddleware');
const { handleValidationErrors } = require('../middleware/validator');
const { validateRegistration, validateLogin, validatePasswordChange } = require('../validation/userValidation');

router.post('/register', validateRegistration, handleValidationErrors, registerUser);
router.post('/login', validateLogin, handleValidationErrors, loginUser);
router.patch('/change-password', authenticate, validatePasswordChange, handleValidationErrors, changePassword);

router.patch('/deactivate', authenticate, deactivateAccount);
router.get('/:userId', authenticate, getUserById);

module.exports = router;