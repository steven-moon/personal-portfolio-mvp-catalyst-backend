# Instructions Step 5

## 5. Implement JWT Authentication Endpoints (Signup & Login)

Now, let's create the authentication controller that handles user registration (signup) and login. These endpoints are public (no token required to call them). We will use bcrypt to hash passwords and jsonwebtoken (JWT) to generate tokens.

Create a file `controllers/authController.js`:

```javascript
// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Secret key for JWT (use an env variable in production!)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; 

// User Sign-up
async function signup(req, res, next) {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    
    // Check if user with email already exists (optional – unique constraint also covers this)
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({ error: 'Email is already in use.' });
    }
    
    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10); // 10 salt rounds
    // Create new user in database
    const newUser = await User.create({ firstName, lastName, email, passwordHash, role });
    
    // Generate JWT token for the new user
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role }, 
      JWT_SECRET, 
      { expiresIn: '1h' }  // token valid for 1 hour
    );
    
    return res.status(201).json({ 
      message: 'User registered successfully', 
      token 
    });
  } catch (err) {
    next(err);  // pass errors to the error handler
  }
}

// User Sign-in (Login)
async function signin(req, res, next) {
  try {
    const { email, password } = req.body;
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    // Check password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    // Password is correct – generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    return res.json({ message: 'Authentication successful', token });
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, signin };
```

### What's Happening

We define two async functions: `signup` and `signin`, each expecting `req.body` to contain the necessary data.

#### Signup Process
- We destructure `firstName`, `lastName`, `email`, `password`, `role` from the request
- We optionally check if the email is already taken
- We hash the plaintext password using `bcrypt.hash(password, 10)`, where 10 is the salt rounds (higher values increase security but also CPU usage)
- Using bcrypt ensures the password is stored as an irreversible hash
- Next, we call `User.create()` to save the new user in the database (storing the `passwordHash`, not the raw password)
- After creating the user, we generate a JWT token using `jwt.sign()`, embedding the user's id, email, and role in the token's payload
- We use a secret key (`JWT_SECRET`) to sign the token – in production, never hard-code this in code but load from `process.env.JWT_SECRET` (our example provides a fallback string for simplicity)
- We set the token to expire in 1 hour (`expiresIn: '1h'`)
- Finally, we return a 201 Created status with a JSON containing a success message and the token

#### Signin Process
- We get `email` and `password` from the request
- We look up the user by email
- If not found, or if the password doesn't match, we return HTTP 401 Unauthorized with a generic error (to avoid giving away which part was wrong)
- To check the password, we use `bcrypt.compare` with the provided plaintext password and the stored `user.passwordHash`
- If the comparison passes, we generate a JWT token (similarly to signup) and return it along with a success message
- We do not expose the user's hashed password or other sensitive info in the response

Both functions are wrapped in try/catch blocks and call `next(err)` on exceptions, which will hand off to our error handling middleware (set up later). This prevents the app from crashing on errors and sends a proper error response.

### Security & Best Practices

- **JWT Secret Key**: Should be long, random, and kept private (in `.env`). "You should never share this secret… The more complex this token secret is, the more secure your application will be."
- **Use HTTPS**: In production so that tokens (and passwords during login) are transmitted securely.
- **Token Expiration**: We set a reasonable expiration on tokens (1 hour here). In a real app, you might also implement refresh tokens if you want longer sessions without requiring re-login.
- **Password Hashing**: By using bcrypt with salt rounds, even if two users have the same password, their hashes will differ. This protects against rainbow table attacks. Always hash on signup, and compare hashes on login – never store or compare plaintext passwords.
