# Instructions Step 2

## 2. Organize Project Structure for Maintainability

A clear project structure makes the codebase easier to maintain and scale. Create the following folders in your project:

- **models/** – Contains Sequelize models (database tables definitions, e.g. `User.js`).
- **controllers/** – Contains functions to handle requests and responses (business/login logic for each route).
- **routes/** – Contains route definitions, grouping related endpoints (e.g. auth routes, user routes).
- **middleware/** – Contains middleware functions (e.g. JWT authentication verifier).

This separation follows Express best practices: controllers handle request logic, routes define URL mappings, models interact with the DB, and middleware contains reusable request handlers (like auth or logging). For example, the controllers folder will house functions that process incoming requests and produce HTTP responses (often calling the models or services), while the routes folder will map URL paths (like `/auth/signup`) to those controller functions.

Inside the project root, also create a `config/` folder or file (e.g. `config/database.js`) to configure the database connection. Additionally, prepare a `.env` file at the root to store configuration secrets (database credentials, JWT secret, etc.). Keeping secrets in environment variables (via `.env`) instead of hard-coding them in code is a security best practice.

Your initial project structure might look like this:

```
project/
 ├── controllers/
 │    ├── authController.js
 │    └── userController.js
 ├── middleware/
 │    └── auth.js
 ├── models/
 │    ├── User.js
 │    └── index.js        (Sequelize initialization)
 ├── routes/
 │    ├── authRoutes.js
 │    └── userRoutes.js
 ├── config/
 │    └── database.js
 ├── app.js               (Express app setup)
 ├── package.json
 └── .env
```

This modular structure ensures separation of concerns, making the project easier to navigate and extend. For instance, any authentication logic lives in `middleware/auth.js`, and new models (tables) would get their own file in `models/`. All route definitions are centralized in the routes directory, improving clarity when adding new API endpoints.

