# Instructions Step 8

## 8. Refactor: Simplify CRUD with a Base Repository Class

As projects grow, you may notice similar CRUD logic repeated for different models. Sequelize provides methods like `findAll`, `findByPk`, `create`, etc., which we used directly in our controllers. To reduce duplication, we can abstract common database operations into a Base Repository class (or helper). This way, controllers can call a generic method for common ops, keeping code DRY.

Create a utility class in `models/BaseRepository.js` (or `utils/` directory):

```javascript
// models/BaseRepository.js
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async getAll(filter = {}) {
    // filter can include options like where, attributes, include
    return this.model.findAll(filter);
  }

  async getById(id) {
    return this.model.findByPk(id);
  }

  async create(data) {
    return this.model.create(data);
  }

  async update(id, data) {
    return this.model.update(data, { where: { id } });
  }

  async delete(id) {
    return this.model.destroy({ where: { id } });
  }
}

module.exports = BaseRepository;
```

### Explanation

This class takes a Sequelize model (like our User model) and provides generic methods:

- **getAll(filter)**: retrieves multiple records, optionally with a filter (could include conditions, selected attributes, relations).
- **getById(id)**: retrieves one record by primary key.
- **create(data)**: creates a new record.
- **update(id, data)**: updates the record by id with given data.
- **delete(id)**: removes the record by id.

Each method simply calls the corresponding Sequelize model method. We could add more sophisticated error handling or logging here, but the idea is to encapsulate these operations.

### Using the Repository

Now, we can use this base class for our User model. For example, in the user controller, we could do:

```javascript
// At the top of controllers/userController.js
const BaseRepository = require('../models/BaseRepository');
const userRepo = new BaseRepository(User);

// ...inside functions:
const users = await userRepo.getAll({ attributes: { exclude: ['passwordHash'] } });
```

Similarly, use `userRepo.getById(id)`, `userRepo.update(id, updatedFields)`, etc., instead of calling User model methods directly. This makes the controller code more concise. For instance, our `getAllUsers` could become:

```javascript
async function getAllUsers(req, res, next) {
  try {
    const users = await userRepo.getAll({ attributes: { exclude: ['passwordHash'] } });
    res.json(users);
  } catch (err) {
    next(err);
  }
}
```

The BaseRepository approach shines when you have many models – you don't need to write the same CRUD logic for each. You can even extend the base class for model-specific repository classes (e.g., `class UserRepository extends BaseRepository { /* custom methods */ }`). This pattern of using a helper class for common DB operations is suggested by developers to organize code. It improves maintainability and testing (you can unit test the BaseRepository methods separately, or mock them in controllers).

## 9. Global Error Handling and Logging

### Error Handling

To handle errors consistently, Express allows a global error handler middleware. This is a function with signature `(err, req, res, next)`. We add it after all other routes in app.js. For example:

```javascript
// app.js (after setting up routes)
app.use((err, req, res, next) => {
  console.error(err.stack);  // log the error stack trace for debugging
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});
```

This catches any errors passed to `next(err)` in our controllers or middleware. It logs the error (here using `console.error`, though in production you might use a dedicated logger like Winston). Then it sends a JSON error response. We use `err.status` if set, or default to 500 for generic server errors. This ensures clients get a useful error message and proper status code, without crashing the server.

Our controllers already use `next(err)` on catch, so this middleware will handle those. You can enhance it to differentiate between different error types (e.g., validation errors vs. server errors) as needed.

### Logging

Logging requests and important events is crucial. You can use morgan (HTTP request logger middleware) to log each incoming request:

```javascript
const morgan = require('morgan');
app.use(morgan('combined'));  // or 'dev' for concise output
```

This will output logs for each request (method, URL, status code, response time, etc.). Logging helps in debugging and auditing access.

Also consider logging significant events in controllers (like a user login or deletion) using `console.log` or a logger library. For example, upon successful login, you might log `console.log(`User ${user.email} logged in`)` (ensuring not to log sensitive info). Over time, adopt a structured logging approach for better analysis.

By centralizing error handling and using middleware for logging, we adhere to the DRY principle and maintain clarity in the main business logic. Our app.js will tie everything together in a moment.

## 10. Integrate Routes and Start the Server

Finally, let's wire up everything in the main file (usually app.js or server.js). In this file, we will:

- Import Express and create an app.
- Use middleware (JSON parsing, logging, etc.).
- Mount our route modules.
- Connect to the database and start listening on a port.

```javascript
// app.js
const express = require('express');
const app = express();
require('dotenv').config();

const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Middleware
app.use(express.json());  // parse JSON request bodies
// (Add logging middleware if desired, e.g., app.use(morgan('dev')); )

// Route registration
app.use('/auth', authRoutes);    // public auth routes
app.use('/users', userRoutes);   // protected user routes

// Welcome route (optional)
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// Error handling middleware (as defined earlier)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start the server after connecting to DB
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
```

### Key Points

- We use `app.use(express.json())` to automatically parse JSON bodies of incoming requests (so `req.body` is populated).
- We mount the routes: any request starting with `/auth` goes to `authRoutes`, and `/users` goes to `userRoutes`.
- The order is important: we register routes before the error-handling middleware.
- We call `sequelize.sync()` (which returns a Promise) and, once resolved, start the server with `app.listen(...)`. This ensures the database tables are ready before accepting requests. The server listens on port 3000 (or the port from environment).

### API Endpoints Summary

Now our API is complete. Let's summarize the API endpoints and their access level:

- **POST /auth/signup** – Public: Registers a new user. Expects firstName, lastName, email, password (and optional role). Hashes the password and stores user. Returns a JWT token upon success.
- **POST /auth/signin** – Public: Logs in a user. Expects email and password. If valid, returns a JWT token. Otherwise, returns 401 Unauthorized.
- **GET /users** – Protected: Returns list of all users. Must include a valid JWT in Authorization header. (In a real app, you might restrict this to admin users only.)
- **GET /users/:id** – Protected: Returns details of a user by ID. Requires JWT. Returns 404 if user not found.
- **PUT /users/:id** – Protected: Updates a user's data (firstName, lastName, email, password, role). Requires JWT. Only provided fields are updated; if password is included, it will be hashed before update. Returns success message or 404 if user not found.
- **DELETE /users/:id** – Protected: Deletes the user with given ID. Requires JWT. Returns success message or 404 if not found.

All protected routes use the `authenticateToken` middleware, so if the JWT is missing or invalid, the request will not proceed to the controller – it will respond with 401/403 from the middleware.

### Testing the API

You can now run `node app.js` (or use Nodemon for auto-restart on changes). Use a tool like Postman or cURL to test the endpoints:

- Register a new user via POST /auth/signup with JSON body `{"firstName":"Alice","lastName":"Doe","email":"alice@example.com","password":"secret"}`. You should get back a token.
- Use that token for authorized requests: set HTTP header `Authorization: Bearer <token>` when calling the protected routes. For example, GET /users with the token should return a list including Alice's user data.
- Try accessing a protected route without a token or with an invalid token to ensure it's blocked with an error.

By following these steps, we have built a secure and organized Node.js API with user authentication. We used JWT for stateless auth, bcrypt for password security, Sequelize for database interactions, and structured our code into logical modules. This setup can be extended with additional models and routes as needed, maintaining the same patterns of security and clarity. Happy coding!