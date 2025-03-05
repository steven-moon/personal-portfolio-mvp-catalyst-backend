/**
 * Database setup script
 * 
 * This script creates the MySQL database if it doesn't exist.
 * Run it before starting the application for the first time.
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  console.log('Setting up database...');
  
  // Default configuration
  const dbName = process.env.DB_NAME || 'auth_api_db';
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  
  console.log('Using database configuration:');
  console.log(`- Host: ${host}`);
  console.log(`- Port: ${port}`);
  console.log(`- User: ${user}`);
  console.log(`- Database name: ${dbName}`);
  
  try {
    // Create connection to MySQL server (without database name)
    console.log('Attempting to connect to MySQL server...');
    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password
    });
    
    console.log('Connected to MySQL server successfully.');
    
    // Create database if it doesn't exist
    console.log(`Creating database '${dbName}' if it doesn't exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`Database '${dbName}' created or already exists.`);
    
    // Close connection
    await connection.end();
    
    console.log('Database setup completed successfully.');
    return true;
  } catch (error) {
    console.error('Database setup failed with error:', error.message);
    console.error('Error code:', error.code);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\nConnection refused. This could mean:');
      console.error('1. MySQL server is not running');
      console.error(`2. MySQL is not accessible at ${host}:${port}`);
      console.error('3. Username/password combination is incorrect\n');
      console.error('Please check your MySQL configuration and try again.');
    }
    
    return false;
  }
}

// Run the setup if script is executed directly
if (require.main === module) {
  setupDatabase()
    .then(success => {
      if (success) {
        console.log('\nDatabase setup completed successfully. You can now start the application with:');
        console.log('npm run dev');
        process.exit(0);
      } else {
        console.error('\nDatabase setup failed. Check your MySQL connection settings in .env file.');
        console.error('Make sure MySQL is running and accessible with the configured credentials.');
        process.exit(1);
      }
    });
} else {
  // Export for use in other scripts
  module.exports = { setupDatabase };
} 