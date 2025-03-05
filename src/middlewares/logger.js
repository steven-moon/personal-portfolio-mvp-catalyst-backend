/**
 * Request logging middleware
 * Provides HTTP request logging capabilities
 */

const morgan = require('morgan');

// Create different logging formats based on environment
const getLogger = () => {
  // Use 'combined' format in production for detailed logs
  if (process.env.NODE_ENV === 'production') {
    return morgan('combined');
  }
  
  // Use 'dev' format in development for more readable, colorful logs
  return morgan('dev');
};

module.exports = getLogger; 