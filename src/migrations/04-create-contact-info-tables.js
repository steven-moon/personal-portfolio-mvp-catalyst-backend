/**
 * Migration script to create Contact Info related tables (ContactInfos and SocialMedia)
 */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create ContactInfos table (holds general contact details)
    await queryInterface.createTable('ContactInfos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { isEmail: true }
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false
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

    // Create SocialMedia table (multiple entries per ContactInfo)
    await queryInterface.createTable('SocialMedia', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      platform: {
        type: Sequelize.STRING,    // e.g., 'github', 'linkedin'
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,    // Display name (e.g., 'GitHub')
        allowNull: false
      },
      icon: {
        type: Sequelize.STRING,    // Icon component name or identifier
        allowNull: false
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      contactInfoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'ContactInfos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

    // Add unique constraint to prevent duplicate platform entries per ContactInfo
    await queryInterface.addConstraint('SocialMedia', {
      fields: ['contactInfoId', 'platform'],
      type: 'unique',
      name: 'unique_social_platform_per_contact'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop SocialMedia first (depends on ContactInfos)
    await queryInterface.dropTable('SocialMedia');
    await queryInterface.dropTable('ContactInfos');
  }
}; 