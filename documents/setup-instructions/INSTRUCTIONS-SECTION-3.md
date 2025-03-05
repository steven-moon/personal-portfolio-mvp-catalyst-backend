# Instructions Step 3

## 3. Configure Sequelize and Connect to MySQL

Now, set up Sequelize to connect to a MySQL database. In `config/database.js`, configure a new Sequelize instance with your database credentials:

```javascript
// config/database.js
const { Sequelize } = require('sequelize');

// Load environment variables from .env (for DB credentials, etc.)
require('dotenv').config();

// Initialize Sequelize with MySQL connection details
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST || 'localhost',
  dialect: 'mysql',
  logging: false,  // disable logging SQL queries (or use console.log for debugging)
});

module.exports = sequelize;
```

### Explanation
We import Sequelize and create a new connection using database name, user, password, host, and specify `dialect: 'mysql'`. These values are loaded from environment variables for security (you would define `DB_NAME`, `DB_USER`, `DB_PASS`, `DB_HOST` in your `.env` file). Using environment variables means sensitive info isn't hard-coded. We also set `logging: false` to prevent Sequelize from outputting SQL logs (you can enable it for debugging).

### Database Setup
Make sure your MySQL server is running and the credentials are correct. You might create a database (e.g., `myapp_db`) in MySQL for this project.

### Test Connection (Optional)
You can test the DB connection when the app starts. For example, in your main `app.js` (which we'll set up later), you can call:

```javascript
const sequelize = require('./config/database');
sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('DB connection error:', err));
```

This will verify that Sequelize can connect to MySQL (log success or errors accordingly).
