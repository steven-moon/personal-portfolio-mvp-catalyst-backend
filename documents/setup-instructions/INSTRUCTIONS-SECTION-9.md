# Instructions Step 10: Global Error Handling and Logging

## 10. Global Error Handling and Logging

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

By centralizing error handling and using middleware for logging, we adhere to the DRY principle and maintain clarity in the main business logic.