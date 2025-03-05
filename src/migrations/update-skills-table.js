'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First remove the ENUM constraint
    await queryInterface.changeColumn('Skills', 'category', {
      type: Sequelize.STRING,
      allowNull: false
    });

    // Then add the categoryTitle column
    await queryInterface.addColumn('Skills', 'categoryTitle', {
      type: Sequelize.STRING,
      allowNull: true // Making it nullable initially for existing records
    });

    // Update existing records to set a default value for categoryTitle
    await queryInterface.sequelize.query(`
      UPDATE "Skills" 
      SET "categoryTitle" = CASE 
        WHEN "category" = 'technical' THEN 'Technical Skills'
        WHEN "category" = 'design' THEN 'Design Skills'
        ELSE 'Other Skills'
      END
    `);

    // Then make categoryTitle non-nullable
    await queryInterface.changeColumn('Skills', 'categoryTitle', {
      type: Sequelize.STRING,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop the categoryTitle column
    await queryInterface.removeColumn('Skills', 'categoryTitle');

    // Change category back to ENUM
    await queryInterface.changeColumn('Skills', 'category', {
      type: Sequelize.ENUM('technical', 'design'),
      allowNull: false
    });
  }
}; 