# Instructions Step 12: Database Setup, Initialization, and Testing

## 12. Database Setup, Initialization, and Testing

This step focuses on setting up your MySQL database, implementing migration and seeding systems, and creating testing utilities.

### MySQL Database Setup

First, let's set up the MySQL database:

1. **Install MySQL Server** (version 8.0 or higher)

2. **Create a new database and user**:
   ```sql
   CREATE DATABASE portfolio_api_db;
   CREATE USER 'portfolio_user'@'localhost' IDENTIFIED BY 'your_secure_password';
   GRANT ALL PRIVILEGES ON portfolio_api_db.* TO 'portfolio_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Update .env file** with database credentials:
   ```
   DB_HOST=localhost
   DB_USER=portfolio_user
   DB_PASSWORD=your_secure_password
   DB_NAME=portfolio_api_db
   DB_PORT=3306
   ```

4. **Configure connection settings** in `src/config/database.js` with appropriate timeout and pool settings.

### Database Migration System

Next, let's create a migration system to manage database schema changes:

1. **Create migration directory**:
   ```bash
   mkdir -p src/migrations
   ```

2. **Create a migration file** for the users table:
   ```javascript
   // src/migrations/01-create-users-table.js
   module.exports = {
     up: async (queryInterface, Sequelize) => {
       await queryInterface.createTable('users', {
         id: {
           type: Sequelize.INTEGER,
           primaryKey: true,
           autoIncrement: true
         },
         firstName: {
           type: Sequelize.STRING,
           allowNull: false
         },
         lastName: {
           type: Sequelize.STRING,
           allowNull: false
         },
         email: {
           type: Sequelize.STRING,
           allowNull: false,
           unique: true
         },
         passwordHash: {
           type: Sequelize.STRING,
           allowNull: false
         },
         role: {
           type: Sequelize.STRING,
           defaultValue: 'user'
         },
         createdAt: {
           type: Sequelize.DATE,
           allowNull: false
         },
         updatedAt: {
           type: Sequelize.DATE,
           allowNull: false
         }
       });
     },
     down: async (queryInterface) => {
       await queryInterface.dropTable('users');
     }
   };
   ```

3. **Create a migration runner utility** in `src/utils/migrate.js`:
   ```javascript
   // src/utils/migrate.js
   const fs = require('fs').promises;
   const path = require('path');
   const sequelize = require('../config/database');

   async function runMigrations(reset = false) {
     try {
       // Get all migration files
       const migrationsDir = path.join(__dirname, '../migrations');
       const files = await fs.readdir(migrationsDir);
       const migrationFiles = files.filter(f => f.endsWith('.js')).sort();

       // Create migrations table if it doesn't exist
       await sequelize.query(`
         CREATE TABLE IF NOT EXISTS migrations (
           id INT AUTO_INCREMENT PRIMARY KEY,
           name VARCHAR(255) NOT NULL,
           executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
         )
       `);

       // Get executed migrations
       const [executed] = await sequelize.query('SELECT name FROM migrations');
       const executedNames = executed.map(e => e.name);

       if (reset) {
         console.log('Resetting all migrations...');
         // Run down methods in reverse order
         for (const file of [...migrationFiles].reverse()) {
           if (executedNames.includes(file)) {
             const migration = require(path.join(migrationsDir, file));
             if (typeof migration.down === 'function') {
               console.log(`Reverting migration: ${file}`);
               await migration.down(sequelize.getQueryInterface(), sequelize.Sequelize);
               await sequelize.query('DELETE FROM migrations WHERE name = ?', {
                 replacements: [file]
               });
             }
           }
         }
         executedNames.length = 0; // Clear executed migrations after reset
       }

       // Run pending migrations
       for (const file of migrationFiles) {
         if (!executedNames.includes(file)) {
           const migration = require(path.join(migrationsDir, file));
           console.log(`Executing migration: ${file}`);
           await migration.up(sequelize.getQueryInterface(), sequelize.Sequelize);
           await sequelize.query('INSERT INTO migrations (name) VALUES (?)', {
             replacements: [file]
           });
         }
       }

       console.log('Migrations completed successfully.');
     } catch (error) {
       console.error('Migration error:', error);
       throw error;
     }
   }

   // Handle command line arguments
   const args = process.argv.slice(2);
   if (args.includes('--reset')) {
     runMigrations(true);
   } else if (args.includes('--status')) {
     // Show migration status
     (async () => {
       await sequelize.authenticate();
       const [executed] = await sequelize.query('SELECT name, executed_at FROM migrations ORDER BY id');
       console.log('Executed migrations:');
       executed.forEach(m => console.log(`- ${m.name} (${new Date(m.executed_at).toLocaleString()})`));
       sequelize.close();
     })();
   } else {
     runMigrations();
   }

   module.exports = runMigrations;
   ```

4. **Add migration commands** to `package.json`:
   ```json
   "scripts": {
     "migrate": "node src/utils/migrate.js",
     "migrate:reset": "node src/utils/migrate.js --reset",
     "migrate:status": "node src/utils/migrate.js --status"
   }
   ```

### Database Seeding

Now, let's implement a seeding system to populate the database with initial data:

1. **Create seeders directory**:
   ```bash
   mkdir -p src/seeders
   ```

2. **Create a seed file** for an admin user:
   ```javascript
   // src/seeders/01-admin-user.js
   const bcrypt = require('bcrypt');

   module.exports = {
     up: async (queryInterface) => {
       const passwordHash = await bcrypt.hash('admin123', 10);
       return queryInterface.bulkInsert('users', [{
         firstName: 'Admin',
         lastName: 'User',
         email: 'admin@example.com',
         passwordHash,
         role: 'admin',
         createdAt: new Date(),
         updatedAt: new Date()
       }]);
     },
     down: async (queryInterface) => {
       return queryInterface.bulkDelete('users', { email: 'admin@example.com' });
     }
   };
   ```

3. **Create a seeder runner utility** in `src/utils/seed.js`:
   ```javascript
   // src/utils/seed.js
   const fs = require('fs').promises;
   const path = require('path');
   const sequelize = require('../config/database');

   async function runSeeders(adminOnly = false, reset = false) {
     try {
       // Get all seeder files
       const seedersDir = path.join(__dirname, '../seeders');
       const files = await fs.readdir(seedersDir);
       let seederFiles = files.filter(f => f.endsWith('.js')).sort();

       // Create seeders table if it doesn't exist
       await sequelize.query(`
         CREATE TABLE IF NOT EXISTS seeders (
           id INT AUTO_INCREMENT PRIMARY KEY,
           name VARCHAR(255) NOT NULL,
           executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
         )
       `);

       // Get executed seeders
       const [executed] = await sequelize.query('SELECT name FROM seeders');
       const executedNames = executed.map(e => e.name);

       if (reset) {
         console.log('Resetting all seeders...');
         // Run down methods in reverse order
         for (const file of [...seederFiles].reverse()) {
           if (executedNames.includes(file)) {
             const seeder = require(path.join(seedersDir, file));
             if (typeof seeder.down === 'function') {
               console.log(`Reverting seeder: ${file}`);
               await seeder.down(sequelize.getQueryInterface(), sequelize.Sequelize);
               await sequelize.query('DELETE FROM seeders WHERE name = ?', {
                 replacements: [file]
               });
             }
           }
         }
         return; // Don't proceed to seeding after reset
       }

       // Filter for admin only
       if (adminOnly) {
         seederFiles = seederFiles.filter(file => file.includes('admin'));
       }

       // Run pending seeders
       for (const file of seederFiles) {
         if (!executedNames.includes(file)) {
           const seeder = require(path.join(seedersDir, file));
           console.log(`Executing seeder: ${file}`);
           await seeder.up(sequelize.getQueryInterface(), sequelize.Sequelize);
           await sequelize.query('INSERT INTO seeders (name) VALUES (?)', {
             replacements: [file]
           });
         }
       }

       console.log('Seeders completed successfully.');
     } catch (error) {
       console.error('Seeder error:', error);
       throw error;
     }
   }

   // Handle command line arguments
   const args = process.argv.slice(2);
   if (args.includes('--admin')) {
     runSeeders(true);
   } else if (args.includes('--reset')) {
     runSeeders(false, true);
   } else {
     runSeeders();
   }

   module.exports = runSeeders;
   ```

4. **Add seeding commands** to `package.json`:
   ```json
   "scripts": {
     "seed": "node src/utils/seed.js",
     "seed:admin": "node src/utils/seed.js --admin",
     "seed:reset": "node src/utils/seed.js --reset"
   }
   ```

### Enhanced Database Initialization

Let's enhance the database initialization process for better startup reliability:

1. **Create a database initialization utility** in `src/utils/dbInit.js`:
   ```javascript
   // src/utils/dbInit.js
   const sequelize = require('../config/database');
   const runMigrations = require('./migrate');
   const runSeeders = require('./seed');

   async function initializeDatabase() {
     try {
       // Check database connectivity
       console.log('Checking database connection...');
       await sequelize.authenticate();
       console.log('Database connection established successfully.');

       // Run migrations
       console.log('Running database migrations...');
       await runMigrations();

       // Run seeders in development environment
       if (process.env.NODE_ENV === 'development') {
         console.log('Running database seeders...');
         await runSeeders();
       }

       console.log('Database initialization completed successfully.');
       return true;
     } catch (error) {
       console.error('Database initialization failed:', error);
       return false;
     }
   }

   module.exports = initializeDatabase;
   ```

2. **Update the main app file** to use this initialization process:
   ```javascript
   // In app.js
   const initializeDatabase = require('./utils/dbInit');

   // Initialize the application
   async function startApp() {
     const dbInitialized = await initializeDatabase();
     
     if (!dbInitialized) {
       console.error('Could not initialize database. Exiting application.');
       process.exit(1);
     }
     
     const PORT = process.env.PORT || 3000;
     app.listen(PORT, () => {
       console.log(`Server running on port ${PORT}`);
     });
   }

   startApp();
   ```

### Database Backup and Restore

Implement database backup and restore capabilities:

1. **Create database backup script** in `scripts/db-backup.js`:
   ```javascript
   // scripts/db-backup.js
   const { exec } = require('child_process');
   const path = require('path');
   const fs = require('fs');
   const dotenv = require('dotenv');

   dotenv.config();

   const {
     DB_NAME,
     DB_USER,
     DB_PASSWORD,
     DB_HOST = 'localhost'
   } = process.env;

   // Create backups directory if it doesn't exist
   const backupDir = path.join(__dirname, '../backups');
   if (!fs.existsSync(backupDir)) {
     fs.mkdirSync(backupDir, { recursive: true });
   }

   // Generate backup filename with timestamp
   const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
   const backupFile = path.join(backupDir, `${DB_NAME}-backup-${timestamp}.sql`);

   // MySQL dump command
   const mysqldump = `mysqldump -h ${DB_HOST} -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} > ${backupFile}`;

   console.log(`Creating backup of ${DB_NAME} database...`);
   exec(mysqldump, (error, stdout, stderr) => {
     if (error) {
       console.error(`Backup error: ${error.message}`);
       return;
     }
     if (stderr) {
       console.error(`Backup stderr: ${stderr}`);
       return;
     }
     console.log(`Backup created successfully: ${backupFile}`);
     
     // Compress the backup file
     exec(`gzip ${backupFile}`, (error) => {
       if (error) {
         console.error(`Compression error: ${error.message}`);
         return;
       }
       console.log(`Backup compressed: ${backupFile}.gz`);
       
       // Delete old backups (keep last 5)
       const files = fs.readdirSync(backupDir)
         .filter(file => file.endsWith('.gz'))
         .map(file => path.join(backupDir, file))
         .sort((a, b) => fs.statSync(b).mtime.getTime() - fs.statSync(a).mtime.getTime());
       
       if (files.length > 5) {
         files.slice(5).forEach(file => {
           fs.unlinkSync(file);
           console.log(`Deleted old backup: ${file}`);
         });
       }
     });
   });
   ```

2. **Create database restore script** in `scripts/db-restore.js`:
   ```javascript
   // scripts/db-restore.js
   const { exec } = require('child_process');
   const path = require('path');
   const fs = require('fs');
   const readline = require('readline');
   const dotenv = require('dotenv');

   dotenv.config();

   const {
     DB_NAME,
     DB_USER,
     DB_PASSWORD,
     DB_HOST = 'localhost'
   } = process.env;

   const backupDir = path.join(__dirname, '../backups');

   // List available backups
   const backups = fs.readdirSync(backupDir)
     .filter(file => file.endsWith('.gz'))
     .sort((a, b) => b.localeCompare(a));

   if (backups.length === 0) {
     console.error('No backup files found in backups directory');
     process.exit(1);
   }

   console.log('Available backups:');
   backups.forEach((file, index) => {
     console.log(`${index + 1}. ${file}`);
   });

   const rl = readline.createInterface({
     input: process.stdin,
     output: process.stdout
   });

   rl.question('Enter the number of the backup to restore: ', (answer) => {
     const index = parseInt(answer, 10) - 1;
     
     if (isNaN(index) || index < 0 || index >= backups.length) {
       console.error('Invalid selection');
       rl.close();
       process.exit(1);
     }
     
     const selectedBackup = path.join(backupDir, backups[index]);
     
     rl.question(`Are you sure you want to restore ${backups[index]}? This will REPLACE ALL DATA in ${DB_NAME} database. (y/n): `, (confirm) => {
       if (confirm.toLowerCase() !== 'y') {
         console.log('Restore cancelled');
         rl.close();
         return;
       }
       
       console.log(`Restoring ${selectedBackup} to ${DB_NAME} database...`);
       
       // Decompress the backup file
       const tempFile = selectedBackup.replace('.gz', '');
       exec(`gunzip -c ${selectedBackup} > ${tempFile}`, (error) => {
         if (error) {
           console.error(`Decompression error: ${error.message}`);
           rl.close();
           return;
         }
         
         // Restore the database
         const mysqlRestore = `mysql -h ${DB_HOST} -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} < ${tempFile}`;
         exec(mysqlRestore, (error, stdout, stderr) => {
           // Clean up temporary file
           fs.unlinkSync(tempFile);
           
           if (error) {
             console.error(`Restore error: ${error.message}`);
             rl.close();
             return;
           }
           if (stderr) {
             console.error(`Restore stderr: ${stderr}`);
           }
           console.log(`Database ${DB_NAME} restored successfully!`);
           rl.close();
         });
       });
     });
   });
   ```

### Database Testing

Create database testing utilities:

1. **Create database test script** in `scripts/db-test.js`:
   ```javascript
   // scripts/db-test.js
   const sequelize = require('../src/config/database');
   const { performance } = require('perf_hooks');

   async function testConnection() {
     try {
       console.log('Testing database connection...');
       await sequelize.authenticate();
       console.log('✅ Connection has been established successfully.');
       return true;
     } catch (error) {
       console.error('❌ Unable to connect to the database:', error);
       return false;
     }
   }

   async function testPerformance() {
     try {
       console.log('\n--- Database Performance Tests ---');
       
       // Test simple query
       console.log('\nTesting simple query performance...');
       const start1 = performance.now();
       await sequelize.query('SELECT 1+1 as result');
       const end1 = performance.now();
       console.log(`✅ Simple query: ${(end1 - start1).toFixed(2)}ms`);
       
       // Test table listing
       console.log('\nTesting table listing performance...');
       const start2 = performance.now();
       const [tables] = await sequelize.query('SHOW TABLES');
       const end2 = performance.now();
       console.log(`✅ Table listing (${tables.length} tables): ${(end2 - start2).toFixed(2)}ms`);
       
       // Test user table query if it exists
       console.log('\nTesting user table query performance...');
       try {
         const start3 = performance.now();
         const [users] = await sequelize.query('SELECT COUNT(*) as count FROM users');
         const end3 = performance.now();
         console.log(`✅ User count query (${users[0].count} users): ${(end3 - start3).toFixed(2)}ms`);
       } catch (error) {
         console.log('❌ Users table not found or error querying it');
       }
       
       console.log('\nPerformance tests completed.');
     } catch (error) {
       console.error('Error during performance tests:', error);
     }
   }

   async function main() {
     const connected = await testConnection();
     
     if (connected) {
       if (process.argv.includes('--performance')) {
         await testPerformance();
       }
     }
     
     await sequelize.close();
   }

   main();
   ```

2. **Add testing commands** to `package.json`:
   ```json
   "scripts": {
     "test:db": "node scripts/db-test.js",
     "test:db:performance": "node scripts/db-test.js --performance"
   }
   ```

### Add Database Monitoring and Health Checks

1. **Implement database health check endpoint**:
   ```javascript
   // src/routes/healthRoutes.js
   const express = require('express');
   const router = express.Router();
   const sequelize = require('../config/database');
   const { performance } = require('perf_hooks');

   router.get('/db', async (req, res) => {
     try {
       // Measure connection time
       const startTime = performance.now();
       await sequelize.authenticate();
       const connectionTime = performance.now() - startTime;
       
       // Get connection pool stats
       const pool = sequelize.connectionManager.pool;
       
       res.json({
         status: 'up',
         connectionTime: `${connectionTime.toFixed(2)}ms`,
         pool: {
           total: pool.size,
           available: pool.available,
           used: pool.size - pool.available
         }
       });
     } catch (error) {
       res.status(500).json({
         status: 'down',
         error: error.message
       });
     }
   });

   module.exports = router;
   ```

2. **Mount the health routes** in your main app file:
   ```javascript
   const healthRoutes = require('./routes/healthRoutes');
   app.use('/api/health', healthRoutes);
   ```

By implementing these components, you've built a robust database infrastructure for your Node.js API. Your application now includes migration capabilities, seeding, backup/restore functionality, and performance monitoring. This comprehensive approach ensures your data layer is reliable, maintainable, and properly tested.

Add these commands to your `package.json` scripts section for easy access:

```json
"scripts": {
  "migrate": "node src/utils/migrate.js",
  "migrate:reset": "node src/utils/migrate.js --reset",
  "migrate:status": "node src/utils/migrate.js --status",
  "seed": "node src/utils/seed.js",
  "seed:admin": "node src/utils/seed.js --admin",
  "seed:reset": "node src/utils/seed.js --reset",
  "backup": "node scripts/db-backup.js",
  "restore": "node scripts/db-restore.js",
  "test:db": "node scripts/db-test.js",
  "test:db:performance": "node scripts/db-test.js --performance"
}
```

With these scripts, you can easily perform database operations from the command line. 