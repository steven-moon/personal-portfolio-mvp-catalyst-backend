// middlewares/index.js
const authenticateToken = require('./auth');
const authorize = require('./authorize');
const errorHandler = require('./errorHandler');
const getLogger = require('./logger');

module.exports = {
  authenticateToken,
  authorize,
  errorHandler,
  getLogger
}; 