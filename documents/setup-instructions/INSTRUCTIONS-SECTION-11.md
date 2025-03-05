# Step 11: Database Setup, Initialization, and Testing

This section provides detailed instructions for setting up the MySQL database, implementing database migrations and seeding, and creating testing utilities to ensure your database is properly configured and functioning.

## 11.1. MySQL Database Setup

### 11.1.1. Install MySQL Server

If you haven't already installed MySQL, follow these instructions:

**For Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

**For macOS (using Homebrew):**
```bash
brew install mysql
brew services start mysql
mysql_secure_installation
```

**For Windows:**
1. Download the MySQL Installer from the [official MySQL website](https://dev.mysql.com/downloads/installer/)
2. Run the installer and follow the installation wizard
3. Complete the setup including the security configuration

### 11.1.2. Create Database and User

Log in to MySQL as the root user and create the database and application user:

```bash
mysql -u root -p
```

Once logged in, execute the following SQL commands:

```sql
CREATE DATABASE portfolio_api_db;
CREATE USER 'portfolio_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON portfolio_api_db.* TO 'portfolio_user'@'localhost';
FLUSH PRIVILEGES;
```

### 11.1.3. Update Environment Variables

Update your `.env` file with the database credentials:

```
# Database Configuration
DB_HOST=localhost
DB_USER=portfolio_user
DB_PASSWORD=your_secure_password
DB_NAME=portfolio_api_db
DB_PORT=3306

# Optional Database Pool Configuration
DB_POOL_MAX=10
DB_POOL_MIN=0
DB_POOL_ACQUIRE=30000
DB_POOL_IDLE=10000
```

## 11.2. Database Migration System

### 11.2.1. Create Migration Directory Structure

Create a directory structure for migrations:

```bash
mkdir -p src/migrations
touch src/utils/migrate.js
```

### 11.2.2. Implement Migration Utility

Create the migration utility in `src/utils/migrate.js`:

```javascript
// src/utils/migrate.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');

// Initialize Sequelize with database configuration
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  logging: console.log
});

// Function to create migrations table if it doesn't exist
async function initMigrationsTable() {
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Migrations table initialized');
  } catch (error) {
    console.error('Error initializing migrations table:', error);
    process.exit(1);
  }
}

// Function to get executed migrations
async function getExecutedMigrations() {
  try {
    const [results] = await sequelize.query('SELECT name FROM migrations ORDER BY id ASC');
    return results.map(row => row.name);
  } catch (error) {
    console.error('Error getting executed migrations:', error);
    return [];
  }
}

// Function to run migrations
async function runMigrations() {
  try {
    // Initialize migrations table
    await initMigrationsTable();
    
    // Get executed migrations
    const executedMigrations = await getExecutedMigrations();
    
    // Get all migration files
    const migrationsDir = path.join(__dirname, '../migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.js'))
      .sort(); // Sort to ensure execution order
    
    // Filter out migrations that have already been executed
    const pendingMigrations = migrationFiles.filter(file => !executedMigrations.includes(file));
    
    if (pendingMigrations.length === 0) {
      console.log('No pending migrations');
      return;
    }
    
    console.log(`Found ${pendingMigrations.length} pending migrations`);
    
    // Execute each pending migration
    for (const migrationFile of pendingMigrations) {
      console.log(`Running migration: ${migrationFile}`);
      
      // Import the migration module
      const migration = require(path.join(migrationsDir, migrationFile));
      
      // Begin transaction
      const transaction = await sequelize.transaction();
      
      try {
        // Run the up function
        await migration.up(sequelize.queryInterface, Sequelize, transaction);
        
        // Record the migration as executed
        await sequelize.query(
          'INSERT INTO migrations (name) VALUES (:name)',
          {
            replacements: { name: migrationFile },
            transaction
          }
        );
        
        // Commit the transaction
        await transaction.commit();
        console.log(`Migration ${migrationFile} executed successfully`);
      } catch (error) {
        // Rollback the transaction in case of error
        await transaction.rollback();
        console.error(`Error executing migration ${migrationFile}:`, error);
        process.exit(1);
      }
    }
    
    console.log('All migrations executed successfully');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Function to reset migrations (dangerous, use with caution)
async function resetMigrations() {
  try {
    // Confirm reset with user
    console.log('WARNING: This will drop all tables and data in the database.');
    console.log('Type "RESET" to confirm:');
    
    // Read user input for confirmation
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    readline.question('', async (answer) => {
      if (answer.trim() !== 'RESET') {
        console.log('Reset operation cancelled');
        readline.close();
        process.exit(0);
      }
      
      readline.close();
      
      // Drop all tables
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
      const [tables] = await sequelize.query('SHOW TABLES');
      
      for (const tableObj of tables) {
        const tableName = tableObj[Object.keys(tableObj)[0]];
        await sequelize.query(`DROP TABLE IF EXISTS ${tableName}`);
        console.log(`Dropped table: ${tableName}`);
      }
      
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
      
      console.log('All tables dropped. Re-running migrations...');
      await runMigrations();
    });
  } catch (error) {
    console.error('Error resetting migrations:', error);
    process.exit(1);
  }
}

// Function to show migration status
async function showMigrationStatus() {
  try {
    // Initialize migrations table
    await initMigrationsTable();
    
    // Get executed migrations
    const executedMigrations = await getExecutedMigrations();
    
    // Get all migration files
    const migrationsDir = path.join(__dirname, '../migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.js'))
      .sort();
    
    console.log('Migration Status:');
    console.log('-----------------');
    
    for (const file of migrationFiles) {
      const status = executedMigrations.includes(file) ? 'Executed' : 'Pending';
      console.log(`${file}: ${status}`);
    }
    
    console.log('-----------------');
    console.log(`Total: ${migrationFiles.length} (${executedMigrations.length} executed, ${migrationFiles.length - executedMigrations.length} pending)`);
  } catch (error) {
    console.error('Error showing migration status:', error);
  } finally {
    await sequelize.close();
  }
}

// Main function to parse command line arguments and execute appropriate action
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--reset')) {
    await resetMigrations();
  } else if (args.includes('--status')) {
    await showMigrationStatus();
  } else {
    await runMigrations();
  }
}

// Execute the main function
main();
```

### 11.2.3. Create Sample Migration

Create your first migration file in `src/migrations/01-create-users-table.js`:

```javascript
// src/migrations/01-create-users-table.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize, transaction) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      role: {
        type: Sequelize.ENUM('user', 'admin'),
        defaultValue: 'user'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, { transaction });
  },

  down: async (queryInterface, Sequelize, transaction) => {
    await queryInterface.dropTable('Users', { transaction });
  }
};
```

### 11.2.4. Add Migration Commands to package.json

Add the following scripts to your `package.json`:

```json
"scripts": {
  "migrate": "node src/utils/migrate.js",
  "migrate:reset": "node src/utils/migrate.js --reset",
  "migrate:status": "node src/utils/migrate.js --status"
}
```

## 11.3. Database Seeding

### 11.3.1. Create Seeder Directory Structure

Create a directory structure for database seeds:

```bash
mkdir -p src/seeders
touch src/utils/seed.js
```

### 11.3.2. Implement Seeding Utility

Create the seeding utility in `src/utils/seed.js`:

```javascript
// src/utils/seed.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const dbConfig = require('../config/database');

// Initialize Sequelize with database configuration
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  logging: console.log
});

// Function to create seeds table if it doesn't exist
async function initSeedsTable() {
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS seeds (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Seeds table initialized');
  } catch (error) {
    console.error('Error initializing seeds table:', error);
    process.exit(1);
  }
}

// Function to get executed seeds
async function getExecutedSeeds() {
  try {
    const [results] = await sequelize.query('SELECT name FROM seeds ORDER BY id ASC');
    return results.map(row => row.name);
  } catch (error) {
    console.error('Error getting executed seeds:', error);
    return [];
  }
}

// Function to run seeds
async function runSeeds(adminOnly = false) {
  try {
    // Initialize seeds table
    await initSeedsTable();
    
    // Get executed seeds
    const executedSeeds = await getExecutedSeeds();
    
    // Get all seed files
    const seedsDir = path.join(__dirname, '../seeders');
    let seedFiles = fs.readdirSync(seedsDir)
      .filter(file => file.endsWith('.js'))
      .sort(); // Sort to ensure execution order
    
    // If adminOnly flag is set, only run admin-related seeds
    if (adminOnly) {
      seedFiles = seedFiles.filter(file => file.includes('admin'));
    }
    
    // Filter out seeds that have already been executed
    const pendingSeeds = seedFiles.filter(file => !executedSeeds.includes(file));
    
    if (pendingSeeds.length === 0) {
      console.log('No pending seeds');
      return;
    }
    
    console.log(`Found ${pendingSeeds.length} pending seeds`);
    
    // Execute each pending seed
    for (const seedFile of pendingSeeds) {
      console.log(`Running seed: ${seedFile}`);
      
      // Import the seed module
      const seed = require(path.join(seedsDir, seedFile));
      
      // Begin transaction
      const transaction = await sequelize.transaction();
      
      try {
        // Run the up function
        await seed.up(sequelize, Sequelize, transaction);
        
        // Record the seed as executed
        await sequelize.query(
          'INSERT INTO seeds (name) VALUES (:name)',
          {
            replacements: { name: seedFile },
            transaction
          }
        );
        
        // Commit the transaction
        await transaction.commit();
        console.log(`Seed ${seedFile} executed successfully`);
      } catch (error) {
        // Rollback the transaction in case of error
        await transaction.rollback();
        console.error(`Error executing seed ${seedFile}:`, error);
        process.exit(1);
      }
    }
    
    console.log('All seeds executed successfully');
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Function to reset seeds
async function resetSeeds() {
  try {
    // Clear the seeds record table (doesn't affect the data)
    await sequelize.query('TRUNCATE TABLE seeds');
    console.log('Seeds record cleared. Re-running seeds...');
    await runSeeds();
  } catch (error) {
    console.error('Error resetting seeds:', error);
    process.exit(1);
  }
}

// Main function to parse command line arguments and execute appropriate action
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--reset')) {
    await resetSeeds();
  } else if (args.includes('--admin')) {
    await runSeeds(true);
  } else {
    await runSeeds();
  }
}

// Execute the main function
main();
```

### 11.3.3. Create Sample Seeds

Create seed files for admin and test users:

**Admin User Seed**:
```javascript
// src/seeders/01-admin-user.js
'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (sequelize, Sequelize, transaction) => {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Check if admin already exists
    const [results] = await sequelize.query(
      'SELECT id FROM Users WHERE username = :username OR email = :email',
      {
        replacements: { username: 'admin', email: 'admin@example.com' },
        transaction
      }
    );
    
    if (results.length === 0) {
      await sequelize.query(
        `INSERT INTO Users (username, email, password, isActive, role, createdAt, updatedAt) 
         VALUES (:username, :email, :password, :isActive, :role, :createdAt, :updatedAt)`,
        {
          replacements: {
            username: 'admin',
            email: 'admin@example.com',
            password: hashedPassword,
            isActive: true,
            role: 'admin',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          transaction
        }
      );
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }
  },

  down: async (sequelize, Sequelize, transaction) => {
    await sequelize.query(
      'DELETE FROM Users WHERE username = :username',
      {
        replacements: { username: 'admin' },
        transaction
      }
    );
  }
};
```

**Test Users Seed**:
```javascript
// src/seeders/02-test-users.js
'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (sequelize, Sequelize, transaction) => {
    // Only run in development environment
    if (process.env.NODE_ENV !== 'development') {
      console.log('Skipping test users in non-development environment');
      return;
    }
    
    const testUsers = [
      { username: 'testuser1', email: 'user1@example.com', password: 'user123', role: 'user' },
      { username: 'testuser2', email: 'user2@example.com', password: 'user123', role: 'user' }
    ];
    
    for (const user of testUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      // Check if user already exists
      const [results] = await sequelize.query(
        'SELECT id FROM Users WHERE username = :username OR email = :email',
        {
          replacements: { username: user.username, email: user.email },
          transaction
        }
      );
      
      if (results.length === 0) {
        await sequelize.query(
          `INSERT INTO Users (username, email, password, isActive, role, createdAt, updatedAt) 
           VALUES (:username, :email, :password, :isActive, :role, :createdAt, :updatedAt)`,
          {
            replacements: {
              username: user.username,
              email: user.email,
              password: hashedPassword,
              isActive: true,
              role: user.role,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            transaction
          }
        );
        console.log(`Test user ${user.username} created`);
      } else {
        console.log(`Test user ${user.username} already exists`);
      }
    }
  },

  down: async (sequelize, Sequelize, transaction) => {
    if (process.env.NODE_ENV !== 'development') return;
    
    await sequelize.query(
      "DELETE FROM Users WHERE username LIKE 'testuser%'",
      { transaction }
    );
  }
};
```

### 11.3.4. Add Seeding Commands to package.json

Add the following scripts to your `package.json`:

```json
"scripts": {
  "seed": "node src/utils/seed.js",
  "seed:admin": "node src/utils/seed.js --admin",
  "seed:reset": "node src/utils/seed.js --reset"
}
```

## 11.4. Enhanced Database Initialization

### 11.4.1. Create Database Initialization Utility

Create or update the database initialization utility in `src/utils/dbInit.js`:

```javascript
// src/utils/dbInit.js
require('dotenv').config();
const { Sequelize } = require('sequelize');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Import database configuration
const dbConfig = require('../config/database');

/**
 * Tests the database connection
 * @returns {Promise<boolean>} True if connection is successful
 */
async function testConnection() {
  const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect
  });

  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    await sequelize.close();
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    return false;
  }
}

/**
 * Runs database migrations
 * @returns {Promise<boolean>} True if migrations are successful
 */
async function runMigrations() {
  try {
    console.log('Running database migrations...');
    await execPromise('npm run migrate');
    console.log('Migrations completed successfully');
    return true;
  } catch (error) {
    console.error('Migration failed:', error.message);
    return false;
  }
}

/**
 * Seeds the database with initial data
 * @param {boolean} adminOnly - If true, only run admin seeds
 * @returns {Promise<boolean>} True if seeding is successful
 */
async function seedDatabase(adminOnly = false) {
  try {
    console.log(`Seeding database${adminOnly ? ' (admin only)' : ''}...`);
    
    if (adminOnly) {
      await execPromise('npm run seed:admin');
    } else {
      await execPromise('npm run seed');
    }
    
    console.log('Database seeding completed successfully');
    return true;
  } catch (error) {
    console.error('Database seeding failed:', error.message);
    return false;
  }
}

/**
 * Initializes the database (runs migrations and seeds)
 * @returns {Promise<boolean>} True if initialization is successful
 */
async function initializeDatabase() {
  console.log('Starting database initialization...');
  
  // Run migrations
  const migrationsSuccessful = await runMigrations();
  if (!migrationsSuccessful) {
    console.warn('Database migrations had issues. Proceeding with caution.');
  }
  
  // Run seeds based on environment
  if (process.env.NODE_ENV === 'production') {
    // In production, only seed admin user if it doesn't exist
    await seedDatabase(true);
  } else {
    // In development, seed all test data
    await seedDatabase();
  }
  
  console.log('Database initialization complete');
  return migrationsSuccessful;
}

module.exports = {
  testConnection,
  initializeDatabase,
  runMigrations,
  seedDatabase
};
```

### 11.4.2. Update Main Application File

Update your main application file to use the enhanced initialization process:

```javascript
// In src/index.js

// Add this near the database connection code
const { testConnection, initializeDatabase } = require('./utils/dbInit');

// In the initializeApp function
const initializeApp = async () => {
  try {
    // Check if we should skip database connection (for troubleshooting)
    const skipDbCheck = process.env.NODE_SKIP_DB_CHECK === 'true';
    
    if (skipDbCheck) {
      console.warn('⚠️ DATABASE CHECK SKIPPED - Running in limited mode');
      console.warn('Some features requiring database access will not work!');
      startServer();
      return;
    }
    
    // Test database connection
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('Cannot establish database connection. Check your database configuration.');
      console.warn('Starting server without database functionality for API documentation access.');
      
      // Start the server anyway to allow access to documentation
      startServer();
      return;
    }
    
    // Run database migrations and seeds
    console.log('Running database migrations and seeds...');
    const initResult = await initializeDatabase();
    
    if (!initResult) {
      console.warn('Database initialization had issues. Some features might not work properly.');
    }
    
    // Start the server
    startServer();
  } catch (error) {
    console.error('Failed to initialize the application:', error);
    // Exit with error code for deployment environments
    process.exit(1);
  }
};
```

## 11.5. Database Testing

### 11.5.1. Create Database Test Utility

Create a database test utility in `scripts/db-test.js`:

```javascript
// scripts/db-test.js
require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../src/config/database');

// Define console colors for better readability
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

// Initialize Sequelize with database configuration
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  logging: false // Disable logging for tests
});

/**
 * Tests database connection
 */
async function testConnection() {
  console.log(`${colors.bright}Testing database connection...${colors.reset}`);
  
  try {
    await sequelize.authenticate();
    console.log(`${colors.green}✓ Database connection successful!${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}✗ Database connection failed: ${error.message}${colors.reset}`);
    return false;
  }
}

/**
 * Tests database query execution
 */
async function testQuery() {
  console.log(`${colors.bright}Testing simple query execution...${colors.reset}`);
  
  try {
    const [results] = await sequelize.query('SELECT 1+1 as result');
    if (results[0].result === 2) {
      console.log(`${colors.green}✓ Query execution successful!${colors.reset}`);
      return true;
    } else {
      console.error(`${colors.red}✗ Query returned unexpected result: ${results[0].result}${colors.reset}`);
      return false;
    }
  } catch (error) {
    console.error(`${colors.red}✗ Query execution failed: ${error.message}${colors.reset}`);
    return false;
  }
}

/**
 * Tests database tables accessibility
 */
async function testTables() {
  console.log(`${colors.bright}Testing database tables...${colors.reset}`);
  
  try {
    const [tables] = await sequelize.query('SHOW TABLES');
    
    if (tables.length === 0) {
      console.log(`${colors.yellow}! No tables found in the database${colors.reset}`);
      return true;
    }
    
    console.log(`${colors.green}✓ Found ${tables.length} tables in the database${colors.reset}`);
    
    // List all tables
    console.log(`${colors.blue}Tables:${colors.reset}`);
    tables.forEach(tableObj => {
      const tableName = tableObj[Object.keys(tableObj)[0]];
      console.log(`  - ${tableName}`);
    });
    
    return true;
  } catch (error) {
    console.error(`${colors.red}✗ Failed to list tables: ${error.message}${colors.reset}`);
    return false;
  }
}

/**
 * Tests database performance with a benchmark query
 */
async function testPerformance() {
  console.log(`${colors.bright}Testing database performance...${colors.reset}`);
  
  try {
    // Simple performance test: create a temporary table, insert rows, query them
    console.log(`Creating temporary table and inserting test data...`);
    
    // Create a temporary test table
    await sequelize.query(`
      CREATE TEMPORARY TABLE performance_test (
        id INT AUTO_INCREMENT PRIMARY KEY,
        data VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Insert test data
    const startInsert = Date.now();
    for (let i = 0; i < 1000; i++) {
      await sequelize.query(`
        INSERT INTO performance_test (data) VALUES ('Test data ${i}')
      `);
    }
    const endInsert = Date.now();
    
    // Query the data
    const startQuery = Date.now();
    const [results] = await sequelize.query('SELECT COUNT(*) as count FROM performance_test');
    const endQuery = Date.now();
    
    // Report results
    console.log(`${colors.green}✓ Inserted 1000 rows in ${endInsert - startInsert}ms (${(endInsert - startInsert) / 1000} seconds)${colors.reset}`);
    console.log(`${colors.green}✓ Queried ${results[0].count} rows in ${endQuery - startQuery}ms${colors.reset}`);
    
    return true;
  } catch (error) {
    console.error(`${colors.red}✗ Performance test failed: ${error.message}${colors.reset}`);
    return false;
  }
}

/**
 * Main test function
 */
async function runTests() {
  console.log(`${colors.bright}======= DATABASE TESTS =======${colors.reset}`);
  console.log(`Database: ${dbConfig.database}`);
  console.log(`Host: ${dbConfig.host}`);
  console.log(`Dialect: ${dbConfig.dialect}`);
  console.log(`================================`);
  
  try {
    // Test connection
    if (!await testConnection()) return;
    
    // Test basic query
    if (!await testQuery()) return;
    
    // Test tables
    if (!await testTables()) return;
    
    // Test performance if flag is provided
    if (process.argv.includes('--performance')) {
      if (!await testPerformance()) return;
    }
    
    console.log(`${colors.bright}${colors.green}All database tests passed successfully!${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Unexpected error during tests: ${error.message}${colors.reset}`);
  } finally {
    // Close the database connection
    await sequelize.close();
    console.log(`${colors.blue}Database connection closed.${colors.reset}`);
  }
}

// Run the tests
runTests();
```

### 11.5.2. Add Testing Commands to package.json

Add the following scripts to your `package.json`:

```json
"scripts": {
  "test:db": "node scripts/db-test.js",
  "test:db:performance": "node scripts/db-test.js --performance"
}
```

## 11.6. Running and Testing the Complete Setup

### 11.6.1. Initial Setup and Database Initialization

Follow these steps to initialize your database and start the server:

1. Set up your environment variables:
   ```bash
   cp .env.example .env
   # Edit the .env file with your database credentials
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run database migrations:
   ```bash
   npm run migrate
   ```

4. Seed the database:
   ```bash
   npm run seed
   ```

5. Start the server:
   ```bash
   npm start
   # or npm run dev for development mode with nodemon
   ```

### 11.6.2. Testing the Database

Run the database tests:

```bash
# Run basic database tests
npm run test:db

# Run database tests with performance testing
npm run test:db:performance
```

### 11.6.3. Testing the API

Test the API endpoints using the Postman collection:

1. Import the Postman collection from `postman_collection.json`
2. Set up the environment variables in Postman
3. Execute the following requests in sequence:
   - Sign up a new user
   - Sign in with the user credentials
   - Copy the JWT token and set it as the `authToken` environment variable
   - Test protected routes (Get users, Get user by ID, Update user, Delete user)

## 11.7. Troubleshooting

### 11.7.1. Common Database Issues

**Issue: Cannot connect to database**
- Verify MySQL service is running
- Check database credentials in `.env`
- Ensure the database exists and user has proper permissions

**Issue: Migration fails**
- Check MySQL version compatibility
- Verify SQL syntax in migrations
- Check for table name conflicts

**Issue: Seed fails**
- Check for duplicate username/email in seed data
- Verify references to foreign keys

### 11.7.2. Resetting the Database

If you need to completely reset your database:

```bash
# Reset migrations (this will drop all tables and data)
npm run migrate:reset

# Re-run migrations
npm run migrate

# Re-seed the database
npm run seed
```

---

With these detailed instructions, you should be able to set up, initialize, and test your database system with confidence. This comprehensive approach ensures your application has a solid foundation for data persistence and retrieval. 