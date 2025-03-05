// middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

function authenticateToken(req, res, next) {
  // Expect auth header in format: "Bearer <token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];  // split out the token
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided.' });
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