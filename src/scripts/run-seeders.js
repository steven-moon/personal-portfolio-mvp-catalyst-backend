/**
 * Script to run all seeders in the correct order
 */
'use strict';

const path = require('path');
const { Sequelize } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');
const config = require('../config/config');
const db = require('../models'); // Import all models

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

async function runSeeders() {
  try {
    console.log('Starting to run seeders...');
    
    // Create Sequelize instance
    const sequelize = new Sequelize(
      dbConfig.database,
      dbConfig.username,
      dbConfig.password,
      {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        logging: false,
      }
    );
    
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Get the query interface
    const queryInterface = sequelize.getQueryInterface();
    // Attach sequelize to queryInterface for seeder access
    queryInterface.sequelize = sequelize;
    
    // Drop tables one by one, skipping Sequelize-specific tables
    console.log('Dropping tables one by one...');
    
    // Get all tables in the database
    const tables = await queryInterface.showAllTables();
    
    // Filter out Sequelize-specific tables
    const tablesToDrop = tables.filter(table => 
      // Make sure to drop the SequelizeSeeders table as well to force seeders to run again
      table !== 'SequelizeMeta' && table !== 'sequelizemeta'
    );
    
    // Disable foreign key checks before dropping tables
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Drop each table
    for (const table of tablesToDrop) {
      try {
        await queryInterface.dropTable(table);
        console.log(`Dropped table: ${table}`);
      } catch (error) {
        console.error(`Error dropping table ${table}:`, error.message);
      }
    }
    
    // Re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('Finished dropping tables');
    
    // Sync models to recreate tables
    console.log('Recreating tables...');
    await db.sequelize.sync({ force: false });
    console.log('Tables recreated successfully');
    
    // Configure umzug for seeders with specific storage configuration
    const umzug = new Umzug({
      migrations: {
        glob: path.join(__dirname, '../seeders/*.js'),
        resolve: ({ name, path, context }) => {
          const migration = require(path);
          return {
            name,
            up: async () => migration.up(context, Sequelize),
            down: async () => migration.down(context, Sequelize),
          };
        },
      },
      context: queryInterface,
      // Use memory storage to force running all seeders regardless of previous execution
      storage: {
        async executed() {
          return []; // Return empty array to indicate no seeders have been run
        },
        async logMigration({ name }) {
          console.log(`Executed seeder: ${name}`);
          return;
        },
        async unlogMigration({ name }) {
          console.log(`Unlogged seeder: ${name}`);
          return;
        }
      },
      logger: console,
    });
    
    // Get all seeders
    const allSeeders = await umzug.migrations();
    console.log(`Found ${allSeeders.length} seeders to run.`);
    
    // Run all seeders regardless of previous execution state
    if (allSeeders.length > 0) {
      await umzug.up();
      console.log('All seeders executed successfully.');
    } else {
      console.log('No seeders found in the directory.');
    }
    
    // Close database connection
    await sequelize.close();
    console.log('Database connection closed.');
    
  } catch (error) {
    console.error('Error running seeders:', error);
    process.exit(1);
  }
}

// Run the seeders
runSeeders(); 