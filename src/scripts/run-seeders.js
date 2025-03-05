/**
 * Script to run all seeders in the correct order
 */
'use strict';

const path = require('path');
const { Sequelize } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');
const config = require('../config/config');

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
    
    // Configure umzug for seeders
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
      storage: new SequelizeStorage({ sequelize }),
      logger: console,
    });
    
    // Run all pending seeders
    const pending = await umzug.pending();
    if (pending.length === 0) {
      console.log('No pending seeders to run.');
    } else {
      console.log(`Found ${pending.length} pending seeders to run.`);
      await umzug.up();
      console.log('All seeders executed successfully.');
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