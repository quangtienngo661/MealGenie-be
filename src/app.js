// ========= IMPORT SECTION =========

// Built-in dependencies/middlewares
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Utils
const { success } = require('./util/response');

// Middlewares
const { globalErrorHandler } = require('./middleware/globalErrorHandler');
const { routeNotFound } = require('./middleware/routeNotFound');

// Configs
const { connectDb } = require('./config/dbConfig');
const { corsConfig } = require('./config/corsConfig');
const { globalLimiter } = require('./config/rateLimitConfig');

// Swagger setup
const { swaggerSpec, swaggerUi, swaggerUiOptions } = require('./swagger');

// Import models to register them
require('./model/foodModel');

// Imported routes
const userRoute = require('./route/userRoute');
const profileRoute = require('./route/profileRoute');

// ========= MIDDLEWARE SECTION =========
const app = express();
connectDb();

// Swagger configuration is now imported from swagger.js

// Using middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsConfig));
app.use(globalLimiter);
app.use(helmet());

// Response helper
app.use((req, res, next) => {
  res.ok = (data, message, status, meta) =>
    success(res, data, message, status, meta);
  next();
});

// Swagger UI setup
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);

// Routes
app.use('/api/v1/users', userRoute); // Authentication routes
app.use('/api/v1/profile', profileRoute); // Profile management routes

// Home route
// app.use('/', (req, res) => {
//   return res.end('Welcome to MealGenie API');
// });

// Middleware for catching unexisted routes
// For more specifically, if there is an unmatched route ascendingly, this middleware will run
app.use(routeNotFound);

// Error handler
app.use(globalErrorHandler);

// Export to server.js
module.exports = app;
