/**
 * Database initialization script
 */
'use strict';

const { sequelize } = require('../config/database');
const MigrationRunner = require('./migrationRunner');

/**
 * Initialize database schema and seed data
 */
async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Create migration runner
    const migrationRunner = new MigrationRunner(sequelize);
    
    // Run migrations and seeders
    await migrationRunner.initDatabase();
    
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
}

module.exports = { initializeDatabase }; 