// middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

function authenticateToken(req, res, next) {
  // Check if we're in development environment
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Expect auth header in format: "Bearer <token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];  // split out the token
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided.' });
  }
  
  // Special handling for development token
  if (isDevelopment && token === 'dev-token-123456789') {
    console.log('Using development authentication token');
    // Set a mock user for development
    req.user = {
      id: 1,
      username: 'admin',
      role: 'admin'
    };
    return next();
  }
  
  // Verify token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Attach decoded user info to request (for use in controllers if needed)
    req.user = decoded;
    next();  // token is valid, proceed to the next handler
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
}

module.exports = authenticateToken; 