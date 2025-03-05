/**
 * Global error handler middleware
 * Provides consistent error response format across the API
 */

const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('ERROR:', err.message);
  console.error(err.stack);

  // Default status code is 500 if not specified
  const statusCode = err.statusCode || 500;
  
  // Create error response object
  const errorResponse = {
    status: 'error',
    message: err.message || 'Internal Server Error',
  };

  // Add error details in development mode
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler; 