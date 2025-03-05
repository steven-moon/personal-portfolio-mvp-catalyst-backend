/**
 * Utility to run database migrations and seeders
 */
'use strict';

const path = require('path');
const fs = require('fs');
const { Sequelize } = require('sequelize');
const AppError = require('./AppError');

class MigrationRunner {
  constructor(sequelize) {
    this.sequelize = sequelize;
    this.queryInterface = sequelize.getQueryInterface();
    this.migrationsPath = path.join(__dirname, '../migrations');
    this.seedersPath = path.join(__dirname, '../seeders');
  }

  /**
   * Get all migration files sorted by name
   */
  getMigrationFiles() {
    try {
      return fs.readdirSync(this.migrationsPath)
        .filter(file => file.endsWith('.js'))
        .sort();
    } catch (error) {
      console.error('Error reading migration files:', error);
      return [];
    }
  }

  /**
   * Get all seeder files sorted by name
   */
  getSeederFiles() {
    try {
      return fs.readdirSync(this.seedersPath)
        .filter(file => file.endsWith('.js'))
        .sort();
    } catch (error) {
      console.error('Error reading seeder files:', error);
      return [];
    }
  }

  /**
   * Run all migrations
   */
  async runMigrations() {
    console.log('Running migrations...');

    try {
      // Create migrations table if it doesn't exist
      await this.createMigrationsTable();
      
      // Get completed migrations
      const completedMigrations = await this.getCompletedMigrations();
      
      // Get all migration files
      const migrationFiles = this.getMigrationFiles();
      
      // Run pending migrations
      for (const file of migrationFiles) {
        if (!completedMigrations.includes(file)) {
          await this.runMigration(file);
        } else {
          console.log(`Migration ${file} already completed. Skipping.`);
        }
      }
      
      console.log('All migrations completed successfully.');
    } catch (error) {
      console.error('Migration failed:', error);
      throw new AppError('Failed to run migrations', 500);
    }
  }

  /**
   * Create migrations tracking table if it doesn't exist
   */
  async createMigrationsTable() {
    try {
      await this.sequelize.query(`
        CREATE TABLE IF NOT EXISTS SequelizeMeta (
          name VARCHAR(255) NOT NULL PRIMARY KEY,
          createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } catch (error) {
      console.error('Error creating migrations table:', error);
      throw error;
    }
  }

  /**
   * Get list of completed migrations
   */
  async getCompletedMigrations() {
    try {
      const [results] = await this.sequelize.query('SELECT name FROM SequelizeMeta');
      return results.map(row => row.name);
    } catch (error) {
      console.error('Error getting completed migrations:', error);
      return [];
    }
  }

  /**
   * Run a specific migration
   */
  async runMigration(fileName) {
    console.log(`Running migration: ${fileName}`);
    
    try {
      const migration = require(path.join(this.migrationsPath, fileName));
      await migration.up(this.queryInterface, Sequelize);
      
      // Record migration completion
      await this.sequelize.query(
        'INSERT INTO SequelizeMeta (name) VALUES (?)',
        { replacements: [fileName] }
      );
      
      console.log(`Migration ${fileName} completed successfully.`);
    } catch (error) {
      console.error(`Error running migration ${fileName}:`, error);
      throw error;
    }
  }

  /**
   * Run all seeders
   */
  async runSeeders() {
    console.log('Running seeders...');
    
    try {
      // Create seeders table if it doesn't exist
      await this.createSeedersTable();
      
      // Get completed seeders
      const completedSeeders = await this.getCompletedSeeders();
      
      // Get all seeder files
      const seederFiles = this.getSeederFiles();
      
      // Run pending seeders
      for (const file of seederFiles) {
        if (!completedSeeders.includes(file)) {
          await this.runSeeder(file);
        } else {
          console.log(`Seeder ${file} already completed. Skipping.`);
        }
      }
      
      console.log('All seeders completed successfully.');
    } catch (error) {
      console.error('Seeder failed:', error);
      // Seeders can fail but we don't want to stop the app
      console.log('Continuing despite seeder error...');
    }
  }

  /**
   * Create seeders tracking table if it doesn't exist
   */
  async createSeedersTable() {
    try {
      await this.sequelize.query(`
        CREATE TABLE IF NOT EXISTS SequelizeSeeders (
          name VARCHAR(255) NOT NULL PRIMARY KEY,
          createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } catch (error) {
      console.error('Error creating seeders table:', error);
      throw error;
    }
  }

  /**
   * Get list of completed seeders
   */
  async getCompletedSeeders() {
    try {
      const [results] = await this.sequelize.query('SELECT name FROM SequelizeSeeders');
      return results.map(row => row.name);
    } catch (error) {
      console.error('Error getting completed seeders:', error);
      return [];
    }
  }

  /**
   * Run a specific seeder
   */
  async runSeeder(fileName) {
    console.log(`Running seeder: ${fileName}`);
    
    try {
      const seeder = require(path.join(this.seedersPath, fileName));
      await seeder.up(this.queryInterface, Sequelize);
      
      // Record seeder completion
      await this.sequelize.query(
        'INSERT INTO SequelizeSeeders (name) VALUES (?)',
        { replacements: [fileName] }
      );
      
      console.log(`Seeder ${fileName} completed successfully.`);
    } catch (error) {
      console.error(`Error running seeder ${fileName}:`, error);
      throw error;
    }
  }

  /**
   * Initialize database with migrations and seeders
   */
  async initDatabase() {
    await this.runMigrations();
    await this.runSeeders();
    console.log('Database initialization completed.');
  }
}

module.exports = MigrationRunner; 