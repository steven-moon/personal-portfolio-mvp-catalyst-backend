# Database Configuration and Management

This document provides information about the database setup, migration commands, and other database-related details for the Personal Portfolio MVP Catalyst Backend.

## Database Configuration

The database connection is configured in two places:

1. **`src/config/database.js`**: Used by the application at runtime
2. **`src/config/config.json`**: Used by Sequelize CLI for migrations and seeders

### Config JSON Structure

The `config.json` file includes configurations for different environments:

```json
{
  "development": {
    "username": "root",
    "password": "abcd999",
    "database": "personal_portfolio_db",
    "host": "127.0.0.1",
    "port": 3306,
    "dialect": "mysql",
    "dialectOptions": {
      "socketPath": "/Applications/MAMP/tmp/mysql/mysql.sock"
    }
  },
  "test": {
    "username": "root",
    "password": "abcd999",
    "database": "personal_portfolio_db_test",
    "host": "127.0.0.1",
    "port": 3306,
    "dialect": "mysql",
    "dialectOptions": {
      "socketPath": "/Applications/MAMP/tmp/mysql/mysql.sock"
    }
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "personal_portfolio_db_production",
    "host": "127.0.0.1",
    "port": 3306,
    "dialect": "mysql",
    "logging": false
  }
}
```

### Sequelize RC File

The `.sequelizerc` file in the project root configures the paths for Sequelize CLI:

```javascript
const path = require('path');

module.exports = {
  'config': path.resolve('src/config', 'config.json'),
  'models-path': path.resolve('src/models'),
  'seeders-path': path.resolve('src/seeders'),
  'migrations-path': path.resolve('src/migrations')
};
```

## Database Setup

Before running migrations, ensure you have:

1. MySQL installed and running (e.g., via MAMP on macOS)
2. Created the database:
   ```sql
   CREATE DATABASE personal_portfolio_db;
   ```
3. Configured the correct credentials in `.env` and `src/config/config.json`

## Migration Commands

### Running Migrations

To apply all pending migrations:

```bash
npx sequelize-cli db:migrate
```

This will create all the necessary tables in your database according to the migration files.

### Reverting Migrations

To undo the most recent migration:

```bash
npx sequelize-cli db:migrate:undo
```

To undo all migrations:

```bash
npx sequelize-cli db:migrate:undo:all
```

To undo migrations up to a specific one:

```bash
npx sequelize-cli db:migrate:undo --to XXXXXXXXXXXXXX-migration-name.js
```

### Creating New Migrations

To create a new migration file:

```bash
npx sequelize-cli migration:generate --name migration-name
```

The file will be created in `src/migrations/` with a timestamp prefix.

## Existing Migrations

The following migration files define the database schema:

1. **01-create-users-table.js** - Creates the Users table
2. **02-create-about-tables.js** - Creates tables for About, WorkExperiences, Educations, Skills, Values
3. **03-create-blog-posts-tables.js** - Creates tables for Categories and BlogPosts
4. **04-create-contact-info-tables.js** - Creates tables for ContactInfos and SocialMedia
5. **05-create-home-page-tables.js** - Creates tables for HomePages and Services
6. **06-create-projects-tables.js** - Creates tables for Projects, Tags, ProjectImages, ProjectTags
7. **07-create-site-settings-table.js** - Creates the SiteSettings table

## Database Schema Relationships

The database schema includes the following relationships:

- **Users** to **Abouts**: One-to-one
- **Abouts** to **WorkExperiences/Educations/Skills/Values**: One-to-many
- **Users** to **BlogPosts**: One-to-many (as author)
- **Categories** to **BlogPosts**: One-to-many
- **ContactInfos** to **SocialMedia**: One-to-many
- **HomePages** to **Services**: One-to-many
- **Projects** to **ProjectImages**: One-to-many
- **Projects** to **Tags**: Many-to-many (via ProjectTags)

## Adding a New Model to the Project

When adding a new model to the project, follow these steps to ensure proper integration with the existing codebase:

### Step 1: Create a Migration File

1. Generate a new migration file:
   ```bash
   npx sequelize-cli migration:generate --name create-your-model-table
   ```

2. Define the table schema in the migration file:
   ```javascript
   'use strict';

   module.exports = {
     up: async (queryInterface, Sequelize) => {
       await queryInterface.createTable('YourModels', {
         id: {
           allowNull: false,
           autoIncrement: true,
           primaryKey: true,
           type: Sequelize.INTEGER
         },
         // Add your model fields here
         field1: {
           type: Sequelize.STRING,
           allowNull: false
         },
         field2: {
           type: Sequelize.TEXT
         },
         // Define any relationships with foreign keys
         relatedModelId: {
           type: Sequelize.INTEGER,
           references: {
             model: 'RelatedModels',
             key: 'id'
           },
           onUpdate: 'CASCADE',
           onDelete: 'CASCADE'
         },
         // Add timestamps
         createdAt: {
           allowNull: false,
           type: Sequelize.DATE
         },
         updatedAt: {
           allowNull: false,
           type: Sequelize.DATE
         }
       });
     },

     down: async (queryInterface, Sequelize) => {
       await queryInterface.dropTable('YourModels');
     }
   };
   ```

3. Run the migration:
   ```bash
   npx sequelize-cli db:migrate
   ```

### Step 2: Create the Model

1. Create a new file in `src/models/` (e.g., `YourModel.js`):
   ```javascript
   const { DataTypes } = require('sequelize');

   module.exports = (sequelize) => {
     const YourModel = sequelize.define('YourModel', {
       id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
         allowNull: false
       },
       // Add your model fields here
       field1: {
         type: DataTypes.STRING,
         allowNull: false,
         validate: {
           notEmpty: true
         }
       },
       field2: {
         type: DataTypes.TEXT
       },
       // Add any other fields matching your migration
     }, {
       // Optional model options
       tableName: 'YourModels', // Must match your migration table name
       timestamps: true,
     });

     // Define model associations
     YourModel.associate = (models) => {
       // Example: One-to-Many Relationship
       YourModel.belongsTo(models.RelatedModel, {
         foreignKey: 'relatedModelId',
         as: 'relatedModel'
       });
       
       // Example: Many-to-Many Relationship
       YourModel.belongsToMany(models.AnotherModel, {
         through: 'JoinTableModel',
         foreignKey: 'yourModelId',
         otherKey: 'anotherModelId',
         as: 'anotherModels'
       });
     };

     return YourModel;
   };
   ```

2. Ensure the model is exported in `src/models/index.js` (this should happen automatically if you follow the Sequelize structure).

### Step 3: Create a Controller

1. Create a new file in `src/controllers/` (e.g., `yourModelController.js`):
   ```javascript
   const { YourModel } = require('../models');
   const BaseRepository = require('../models/BaseRepository');

   const yourModelRepo = new BaseRepository(YourModel);

   /******************************
    * YourModel Operations
    ******************************/

   // Get all records
   async function getAllYourModels(req, res, next) {
     try {
       const records = await yourModelRepo.getAll();
       res.json(records);
     } catch (err) {
       console.error('Error in getAllYourModels:', err);
       next(err);
     }
   }

   // Get a single record by ID
   async function getYourModelById(req, res, next) {
     try {
       const { id } = req.params;
       const record = await yourModelRepo.getById(id);
       
       if (!record) {
         return res.status(404).json({ error: 'Record not found' });
       }
       
       res.json(record);
     } catch (err) {
       console.error('Error in getYourModelById:', err);
       next(err);
     }
   }

   // Create a new record
   async function createYourModel(req, res, next) {
     try {
       // Extract data from request body and validate
       const { field1, field2, relatedModelId } = req.body;
       
       // Add validation for required fields
       if (!field1) {
         return res.status(400).json({ error: 'Field1 is required' });
       }
       
       // Create record
       const record = await yourModelRepo.create({
         field1,
         field2,
         relatedModelId
       });
       
       res.status(201).json(record);
     } catch (err) {
       console.error('Error in createYourModel:', err);
       next(err);
     }
   }

   // Update a record
   async function updateYourModel(req, res, next) {
     try {
       const { id } = req.params;
       
       // Check if record exists
       const existingRecord = await yourModelRepo.getById(id);
       if (!existingRecord) {
         return res.status(404).json({ error: 'Record not found' });
       }
       
       // Extract and prepare updates
       const updates = {};
       const allowedFields = ['field1', 'field2', 'relatedModelId'];
       
       // Only add fields that are in the request body and in the allowed fields list
       for (const field of allowedFields) {
         if (req.body[field] !== undefined) {
           updates[field] = req.body[field];
         }
       }
       
       // Update record
       const updatedRecord = await yourModelRepo.update(id, updates);
       res.json(updatedRecord);
     } catch (err) {
       console.error('Error in updateYourModel:', err);
       next(err);
     }
   }

   // Delete a record
   async function deleteYourModel(req, res, next) {
     try {
       const { id } = req.params;
       
       // Check if record exists
       const existingRecord = await yourModelRepo.getById(id);
       if (!existingRecord) {
         return res.status(404).json({ error: 'Record not found' });
       }
       
       // Delete record
       await yourModelRepo.delete(id);
       res.status(204).send();
     } catch (err) {
       console.error('Error in deleteYourModel:', err);
       next(err);
     }
   }

   module.exports = {
     getAllYourModels,
     getYourModelById,
     createYourModel,
     updateYourModel,
     deleteYourModel
   };
   ```

### Step 4: Create Routes

1. Create a new file in `src/routes/` (e.g., `yourModelRoutes.js`):
   ```javascript
   const express = require('express');
   const { 
     getAllYourModels,
     getYourModelById,
     createYourModel,
     updateYourModel,
     deleteYourModel
   } = require('../controllers/yourModelController');
   const { authenticateToken } = require('../middlewares');

   const router = express.Router();

   // Public routes (if any)
   router.get('/', getAllYourModels);
   router.get('/:id', getYourModelById);

   // Protected routes - require authentication
   router.post('/', authenticateToken, createYourModel);
   router.put('/:id', authenticateToken, updateYourModel);
   router.delete('/:id', authenticateToken, deleteYourModel);

   module.exports = router;
   ```

2. Update the routes index file (`src/routes/index.js`) to include your new routes:
   ```javascript
   // Add this line with the other require statements
   const yourModelRoutes = require('./yourModelRoutes');

   module.exports = (app) => {
     // Add this line with the other route registrations
     app.use('/api/your-models', yourModelRoutes);
   };
   ```

### Step 5: Create a Test Script

1. Create a test script in `src/tests/` (e.g., `your-model-api-test.js`):
   ```javascript
   // Test script for YourModel API
   const fetch = require('node-fetch');

   const BASE_URL = 'http://localhost:8080/api';
   const API_PATH = '/your-models';
   
   // Store authentication token after login
   let authToken = '';
   // Store record ID for updates and deletion
   let recordId = '';

   // Generic API request function
   async function apiRequest(endpoint, method = 'GET', data = null, token = null) {
     const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
     
     const headers = {
       'Content-Type': 'application/json'
     };
     
     if (token) {
       headers['Authorization'] = `Bearer ${token}`;
     }
     
     const options = {
       method,
       headers
     };
     
     if (data && (method === 'POST' || method === 'PUT')) {
       options.body = JSON.stringify(data);
     }
     
     try {
       const response = await fetch(url, options);
       const responseData = await response.json();
       
       return {
         status: response.status,
         data: responseData
       };
     } catch (error) {
       console.error(`Error making ${method} request to ${url}:`, error);
       throw error;
     }
   }

   // Login to get auth token
   async function login() {
     try {
       const response = await apiRequest('/auth/signin', 'POST', {
         email: 'admin@example.com',
         password: 'password123'
       });
       
       if (response.status !== 200) {
         throw new Error(`Login failed: ${JSON.stringify(response.data)}`);
       }
       
       authToken = response.data.token;
       console.log('✅ Login successful, auth token obtained');
     } catch (error) {
       console.error('❌ Login failed:', error.message);
       process.exit(1);
     }
   }

   // Test creating a record
   async function testCreateRecord() {
     try {
       const testData = {
         field1: 'Test Value 1',
         field2: 'Test Value 2',
         relatedModelId: 1 // Assuming a related model with ID 1 exists
       };

       const response = await apiRequest(API_PATH, 'POST', testData, authToken);

       if (response.status === 201) {
         recordId = response.data.id;
         console.log('✅ Record created:', response.data);
         return response.data;
       }
       
       throw new Error(`Create record failed: ${JSON.stringify(response.data)}`);
     } catch (error) {
       console.error('❌ Create record failed:', error.message);
       return null;
     }
   }

   // Add other test functions for get, update, delete operations

   // Main test function
   async function runTests() {
     console.log('🚀 Starting YourModel API tests...');
     
     // Login first to get auth token
     await login();
     
     // Run tests
     const record = await testCreateRecord();
     
     if (record) {
       // Add calls to other test functions here
     }
     
     console.log('✅ All YourModel API tests completed');
   }

   // Run the tests
   runTests().catch(error => {
     console.error('❌ Test error:', error);
   });
   ```

### Step 6: Update Documentation

1. Update the `DATABASE.md` file to include your new model in the list of migrations.
2. Update any other relevant documentation to reflect the new functionality.

### Step 7: Test Your Implementation

1. Start the server:
   ```bash
   npm start
   ```

2. Run your test script:
   ```bash
   node src/tests/your-model-api-test.js
   ```

3. Manually test the endpoints using a tool like Postman:
   - `GET /api/your-models` - List all records
   - `GET /api/your-models/:id` - Get a specific record
   - `POST /api/your-models` - Create a record (requires auth)
   - `PUT /api/your-models/:id` - Update a record (requires auth)
   - `DELETE /api/your-models/:id` - Delete a record (requires auth)

By following these steps, you can easily add new models to the project with full CRUD operations and proper integration with the existing authentication and API structure.

## Troubleshooting

### Common Issues

1. **Migration Error - Cannot find config.json**:
   - Ensure `src/config/config.json` exists
   - Make sure `.sequelizerc` is properly configured

2. **Database Connection Error**:
   - Verify MySQL is running
   - Check credentials in both `config.json` and `.env`
   - For MAMP users, ensure the socketPath in dialectOptions is correct

3. **Missing Dependencies**:
   - Run `npm install sequelize sequelize-cli mysql2` to install required packages

### Debugging Migrations

To see more detailed logs during migrations:

```bash
NODE_ENV=development DEBUG=sequelize* npx sequelize-cli db:migrate
```
