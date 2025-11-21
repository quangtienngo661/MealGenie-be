const { catchAsync } = require('../util/catchAsync');
const userService = require('../service/userService');
const { createSendToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with complete profile information
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegistrationRequest'
 *           examples:
 *             newUser:
 *               summary: Register new user
 *               value:
 *                 email: "john.doe@example.com"
 *                 username: "john_doe"
 *                 password: "SecurePass123"
 *                 name: "John Doe"
 *                 age: 25
 *                 gender: "male"
 *                 height: 175
 *                 weight: 70
 *                 goal: "build_muscle"
 *                 preferences: ["vegetarian", "high_protein"]
 *                 allergies: ["nuts"]
 */
const registerUser = catchAsync(async (req, res, next) => {
  const userData = req.body;

  const user = await userService.registerUser(userData);

  createSendToken(user, 201, res, 'User registered successfully');
});

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate user with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLoginRequest'
 *           examples:
 *             login:
 *               summary: User login
 *               value:
 *                 email: "john.doe@example.com"
 *                 password: "SecurePass123"
 */
const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userService.loginUser(email, password);

  createSendToken(user, 200, res, 'Login successful');
});

/**
 * @swagger
 * /api/v1/users/change-password:
 *   patch:
 *     summary: Change user password
 */
const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const result = await userService.changePassword(
    req.user._id,
    currentPassword,
    newPassword
  );

  return res.ok(result.message, 200);
});

/**
 * @swagger
 * /api/v1/users/deactivate:
 *   patch:
 *     summary: Deactivate user account
 */
const deactivateAccount = catchAsync(async (req, res, next) => {
  const result = await userService.deactivateUser(req.user._id);

  return res.ok(result.message, 200);
});

module.exports = {
  registerUser,
  loginUser,
  changePassword,
  deactivateAccount,
  // updateProfile,
  // getProfileByUsername,
  // searchUsers,
  // getSuggestedUsers,
};