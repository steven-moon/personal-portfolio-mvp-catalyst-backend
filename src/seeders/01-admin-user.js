/**
 * Seeder script to create an initial admin user
 */
'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  // Apply seeder
  up: async (queryInterface, Sequelize) => {
    // Check if users exist before creating admin
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users LIMIT 1;',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    // Only create admin if no users exist
    if (users.length === 0) {
      const hashedPassword = await bcrypt.hash('password', 10);
      
      await queryInterface.bulkInsert('Users', [{
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        isActive: true,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }]);
      
      console.log('Admin user created successfully');
    } else {
      console.log('Skipping admin user creation - users already exist');
    }
  },

  // Revert seeder
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', { 
      username: 'admin',
      email: 'admin@example.com'
    }, {});
  }
}; 