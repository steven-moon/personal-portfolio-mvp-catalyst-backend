/**
 * Migration script to create Home Page related tables (HomePages and Services)
 */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create HomePages table (hero section content)
    await queryInterface.createTable('HomePages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,    // e.g., "Jane Doe"
        allowNull: false
      },
      subtitle: {
        type: Sequelize.STRING,    // Tagline or subtitle
        allowNull: false
      },
      profession: {
        type: Sequelize.STRING,    // e.g., "Frontend Developer"
        allowNull: false
      },
      profileImage: {
        type: Sequelize.STRING,    // URL or path to profile image
        allowNull: true           // Optional (could be null if using a default image)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create Services table (services offered on home page)
    await queryInterface.createTable('Services', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,    // e.g., "UI/UX Design"
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,    // Short description of the service
        allowNull: false
      },
      homePageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'HomePages', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'        // Remove services if HomePage is deleted
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  
  down: async (queryInterface, Sequelize) => {
    // Drop Services first, then HomePages
    await queryInterface.dropTable('Services');
    await queryInterface.dropTable('HomePages');
  }
}; 