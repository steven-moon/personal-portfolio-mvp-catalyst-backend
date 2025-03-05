# Instructions Step 4

## 4. Define the User Model with Sequelize

Using Sequelize, define a User model that maps to a users table in the database. Create a file `models/User.js`:

```javascript
// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true  // ensure emails are unique in the database
  },
  passwordHash: {
    type: DataTypes.STRING,  // will store the bcrypt-hashed password
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user'    // e.g., 'user' or 'admin'
  }
}, {
  tableName: 'users',
  timestamps: true  // adds createdAt and updatedAt fields automatically
});

module.exports = User;
```

### Explanation
We use `sequelize.define` to create a model named 'User'. The fields correspond to columns in the users table:

- **id**: Primary key, auto-increment integer.
- **firstName** and **lastName**: Strings, required.
- **email**: String, required and must be unique (we don't want two users with the same email).
- **passwordHash**: String, required, will store the hashed password (not plaintext).
- **role**: String, optional role of the user, defaulting to 'user' (this could help implement role-based access if needed, e.g., 'admin' vs 'user').

We enable `timestamps: true` so Sequelize will add `createdAt` and `updatedAt` fields automatically. The model is exported for use in other parts of the app (controllers, etc.).

> **Security Note**: We never store plain text passwords in the database – we will only store a secure hash of the password. This ensures that even if the database is compromised, the original passwords are not exposed.

### Syncing the Model with the Database
After defining the model, you need to sync it with the database. One simple way is to use `sequelize.sync()` at app startup to create the table if it doesn't exist:

```javascript
// In app.js or a separate sync script
const sequelize = require('./config/database');
require('./models/User');  // ensure the model is loaded

sequelize.sync()
  .then(() => console.log("Database synced (tables created/updated)"))
  .catch(err => console.error("Sync error:", err));
```

This will create the users table according to our model definition. In production, you might use migrations instead, but for simplicity, `sync()` helps to quickly set up the schema.
