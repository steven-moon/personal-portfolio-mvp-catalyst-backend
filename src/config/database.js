const { Sequelize } = require('sequelize');
require('dotenv').config();

// Get configuration from environment variables with defaults
const dbName = process.env.DB_NAME || 'personal_portfolio_db';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = 'abcdef9999';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '3306', 10);

// Log database connection details in development mode
if (process.env.NODE_ENV === 'development') {
  console.log('Database configuration:');
  console.log(`- Host: ${dbHost}`);
  console.log(`- Port: ${dbPort}`);
  console.log(`- Database: ${dbName}`);
  console.log(`- User: ${dbUser}`);
  console.log(`- Password: ${dbPassword ? '********' : 'not set'}`);
}

// Create a Sequelize instance with database credentials
const sequelize = new Sequelize(
  dbName,
  dbUser,
  dbPassword,
  {
    host: dbHost,
    port: dbPort,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    // For MAMP on macOS, use the socket path
    dialectOptions: {
      socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
    },
    // Connection retry options for development
    retry: {
      max: 3,
      match: [
        /ETIMEDOUT/,
        /ECONNRESET/,
        /ECONNREFUSED/,
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/
      ],
      backoffBase: 1000,
      backoffExponent: 1.5,
    }
  }
);

/**
 * Test database connection
 */
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    if (error.original && error.original.code === 'ECONNREFUSED') {
      console.error(`Make sure MySQL is running at ${dbHost}:${dbPort} and credentials are correct.`);
    }
    return false;
  }
};

module.exports = { sequelize, testConnection };