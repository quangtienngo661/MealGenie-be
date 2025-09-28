// ========= IMPORT SECTION =========

// Built-in dependencies/middlewares
const express = require('express');
const cors = require('cors')
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Utils
const { success } = require('./util/response');
const { globalErrorHandler } = require('./middleware/globalErrorHandler');
const { routeNotFound } = require('./middleware/routeNotFound');

// Configs
const { connectDb } = require('./config/dbConfig');
const { corsConfig } = require('./config/corsConfig');
const { globalLimiter } = require('./config/rateLimitConfig');

// Imported routes

// ========= MIDDLEWARE SECTION =========
const app = express();
connectDb();

// Swagger Doc

// Using middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsConfig));
app.use(globalLimiter);
app.use(helmet());

// Response helper
app.use((req, res, next) => {
    res.ok = (data, status, meta) => success(res, data, status, meta);
    next();
})

// Swagger setup

// Routes

// Middleware for catching unexisted routes
// For more specifically, if there is an unmatched route ascendingly, this middleware will run 
app.use(routeNotFound)

// Error handler
app.use(globalErrorHandler);

// Export to server.js
module.exports = app;