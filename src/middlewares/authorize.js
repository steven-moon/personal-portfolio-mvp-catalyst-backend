/**
 * Role-based authorization middleware
 * @param {string|string[]} roles - Required role(s) to access the route
 * @returns {function} - Express middleware function
 */
function authorize(roles = []) {
  // Convert string to array if single role is provided
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    // req.user should be set by the authenticateToken middleware
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Unauthorized - Authentication required before authorization' 
      });
    }

    // Check if user's role is in the allowed roles
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Forbidden - Insufficient permissions to access this resource' 
      });
    }

    // User has required role, proceed to next middleware/controller
    next();
  };
}

module.exports = authorize; 