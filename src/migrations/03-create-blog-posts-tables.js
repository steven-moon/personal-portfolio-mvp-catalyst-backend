/**
 * Migration script to create Blog Posts related tables (Categories and BlogPosts)
 */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create Categories table for blog post categories
    await queryInterface.createTable('Categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true              // No duplicate category names
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

    // Create BlogPosts table
    await queryInterface.createTable('BlogPosts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      excerpt: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT('long'), // Full blog content (HTML/text)
        allowNull: false
      },
      date: {
        type: Sequelize.DATE,        // Publication date
        allowNull: false
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: true             // Image URL (optional)
      },
      authorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'         // Remove posts if author is deleted
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Categories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'        // If category deleted, null out the categoryId
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
    // Drop BlogPosts first (depends on Categories)
    await queryInterface.dropTable('BlogPosts');
    await queryInterface.dropTable('Categories');
  }
}; 