// middlewares/index.js
const authenticateToken = require('./auth');
const authorize = require('./authorize');
const errorHandler = require('./errorHandler');
const getLogger = require('./logger');
const upload = require('./upload');

module.exports = {
  authenticateToken,
  authorize,
  errorHandler,
  getLogger,
  upload
}; 