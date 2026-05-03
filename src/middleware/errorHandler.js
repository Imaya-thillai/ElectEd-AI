/**
 * Error Handling Middleware
 * 
 * Centralized error handling for the Express application.
 * Provides consistent error response format and logging.
 * 
 * @module middleware/errorHandler
 */

'use strict';

const { logger } = require('../utils/logger');

/**
 * Handles 404 Not Found errors for unmatched routes.
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 */
function notFoundHandler(req, res, next) {
  // Only handle API routes as 404; non-API routes serve the SPA
  if (req.path.startsWith('/api/')) {
    res.status(404).json({
      success: false,
      error: 'Endpoint not found',
      path: req.path,
      method: req.method
    });
  } else {
    next();
  }
}

/**
 * Global error handler middleware.
 * Catches all unhandled errors and returns a structured response.
 * 
 * @param {Error} err - The error object
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} _next - Express next function
 */
function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || err.status || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  // Log the error with context
  logger.error('Request error:', {
    message: err.message,
    statusCode,
    path: req.path,
    method: req.method,
    ip: req.ip,
    stack: isProduction ? undefined : err.stack
  });

  res.status(statusCode).json({
    success: false,
    error: isProduction && statusCode === 500
      ? 'An internal server error occurred.'
      : err.message,
    ...(isProduction ? {} : { stack: err.stack })
  });
}

module.exports = { notFoundHandler, errorHandler };
