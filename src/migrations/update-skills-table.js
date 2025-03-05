'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First remove the ENUM constraint
    await queryInterface.changeColumn('Skills', 'category', {
      type: Sequelize.STRING,
      allowNull: false
    });

    // Check if categoryTitle column already exists
    try {
      const tableInfo = await queryInterface.describeTable('Skills');
      // Only add the column if it doesn't exist yet
      if (!tableInfo.categoryTitle) {
        // Then add the categoryTitle column
        await queryInterface.addColumn('Skills', 'categoryTitle', {
          type: Sequelize.STRING,
          allowNull: true // Making it nullable initially for existing records
        });

        // Update existing records to set a default value for categoryTitle
        await queryInterface.sequelize.query(`
          UPDATE \`Skills\` 
          SET \`categoryTitle\` = CASE 
            WHEN \`category\` = 'technical' THEN 'Technical Skills'
            WHEN \`category\` = 'design' THEN 'Design Skills'
            ELSE 'Other Skills'
          END
        `);

        // Then make categoryTitle non-nullable
        await queryInterface.changeColumn('Skills', 'categoryTitle', {
          type: Sequelize.STRING,
          allowNull: false
        });
      } else {
        console.log('categoryTitle column already exists, skipping migration step');
      }
    } catch (error) {
      console.error('Error checking or adding categoryTitle column:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Drop the categoryTitle column if it exists
    try {
      const tableInfo = await queryInterface.describeTable('Skills');
      if (tableInfo.categoryTitle) {
        await queryInterface.removeColumn('Skills', 'categoryTitle');
      }
    } catch (error) {
      console.error('Error removing categoryTitle column:', error);
    }

    // Change category back to ENUM
    await queryInterface.changeColumn('Skills', 'category', {
      type: Sequelize.ENUM('technical', 'design'),
      allowNull: false
    });
  }
}; 