# Instructions Step 7: User Controller

## 7. Implement User CRUD Operations (Protected Routes)

We will create controllers for user CRUD (Create, Read, Update, Delete) and set up routes for them. These routes should all require authentication, so we'll apply the `authenticateToken` middleware to them.

### User Controller

Create `controllers/userController.js`:

```javascript
// controllers/userController.js
const User = require('../models/User');

// Get all users (protected)
async function getAllUsers(req, res, next) {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['passwordHash'] }  // don't return password hashes
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
}

// Get a specific user by ID (protected)
async function getUserById(req, res, next) {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['passwordHash'] }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
}

// Update a user by ID (protected)
async function updateUser(req, res, next) {
  try {
    const userId = req.params.id;
    const { firstName, lastName, email, password, role } = req.body;
    // If password is provided, hash it before saving
    let updatedFields = { firstName, lastName, email, role };
    if (password) {
      updatedFields.passwordHash = await User.generateHash(password);
      // (Alternatively, hash here with bcrypt if no class method)
    }
    const [affectedCount] = await User.update(updatedFields, { where: { id: userId } });
    if (affectedCount === 0) {
      return res.status(404).json({ error: 'User not found or no changes' });
    }
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    next(err);
  }
}

// Delete a user by ID (protected)
async function deleteUser(req, res, next) {
  try {
    const userId = req.params.id;
    const deletedCount = await User.destroy({ where: { id: userId } });
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
```

#### Explanation

This controller provides four functions for user resource operations:

- **getAllUsers**: Fetches all users from the DB using `User.findAll()`. We exclude the `passwordHash` field from the results for security. (Even though it's hashed, there's no need to send it to clients.) Returns the list of users in JSON.
- **getUserById**: Uses `User.findByPk(id)` to get a single user by primary key. Also excludes the password hash. If the user isn't found, returns 404 Not Found; otherwise returns the user data.
- **updateUser**: Uses `User.update` to modify an existing user. We gather updatable fields from `req.body`. If a new password is provided in the request, we hash it (you might use `bcrypt.hash` here; for brevity, we assume `User.generateHash` could be a custom model method to hash a password). The update call returns an array where the first element is the count of affected rows. If 0, the user was not found (or nothing changed), so respond 404. If successful, return a message. We don't return the updated user object here, but you could fetch and return it if needed.
- **deleteUser**: Calls `User.destroy` to remove the user. If no rows are deleted (count 0), the user id didn't exist, respond 404. Otherwise respond with a success message.

All these functions are meant to be protected by the JWT middleware, meaning they should only execute if `req.user` is present and valid (set by `authenticateToken`). For example, before deleting a user, you might also check `req.user.role` to ensure only admins can delete – that's an authorization check which we can add because our token contains the user's role.

We should also ensure that normal users can only update their own data, etc., by comparing `req.user.id` to `req.params.id`. Such logic can be added as needed (for brevity, not shown). The main point is that thanks to our middleware, we know who the requester is, so we can enforce additional rules if desired.

Notice each function uses try/catch and calls `next(err)` on error, enabling centralized error handling.

### User Routes

Now define the Express routes that map URLs to these controller functions. Create `routes/userRoutes.js`:

```javascript
// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');

// All routes in this file are protected by JWT middleware
router.get('/', authenticateToken, userController.getAllUsers);
router.get('/:id', authenticateToken, userController.getUserById);
router.put('/:id', authenticateToken, userController.updateUser);
router.delete('/:id', authenticateToken, userController.deleteUser);

module.exports = router;
```

This uses an Express Router. We import our `authenticateToken` middleware and apply it to each route. Now any request to `/users` or `/users/:id` must include a valid JWT token. The controller functions will execute only after the token is verified (or not at all if verification fails, since the middleware will respond with an error first).

We deliberately do not create a `POST /users` route for user creation, because user signup is handled by `/auth/signup`. In some APIs, an admin could create users via a protected endpoint, but here registration is done through the public signup.

### Authentication Routes

Also create `routes/authRoutes.js` for the auth-related endpoints:

```javascript
// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Public routes for authentication
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

module.exports = router;
```

These routes do not use the auth middleware (`authenticateToken`), because obtaining a token should not require already having one. They directly call the controller functions we wrote for sign up and sign in.
