# Instructions Step 6

## 6. Create JWT Authentication Middleware to Protect Routes

With the signup and login issuing JWTs, we need middleware to protect other endpoints (like user CRUD routes). The middleware will verify the token on incoming requests. If the token is valid, the request continues; if not, it returns an unauthorized error.

Create `middleware/auth.js`:

```javascript
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
```

### Explanation

This middleware function checks for a JWT in the Authorization header of the request. We expect the header in the standard format: `"Authorization: Bearer <JWT_TOKEN>"`. We extract the token portion by splitting the header string by space. If no token is provided, respond with 401 Unauthorized.

If a token is found, we attempt to verify it using `jwt.verify()` with our secret key. If verification fails (throws an error, e.g., token is invalid or expired), we respond with 403 Forbidden indicating the token is not acceptable. If verification succeeds, we attach the decoded token payload to `req.user` (this might contain the user's id and role, since we included those when signing the token) and call `next()` to pass control to the actual route handler.

This pattern is a common way to protect routes using JWTs in Express: the middleware sits in front of protected routes, denying access if the JWT is missing or bad. By attaching the decoded info to the request, subsequent handlers can know which user is making the request (useful for implementing authorization checks, e.g., only an admin can delete a user).

### Authentication Components

Now we have the pieces needed for authentication:

- **Public routes**: to login or signup and receive a token.
- **Middleware**: to guard protected routes by requiring a valid token.

Next, we'll implement the user CRUD operations and apply this middleware to those routes.
