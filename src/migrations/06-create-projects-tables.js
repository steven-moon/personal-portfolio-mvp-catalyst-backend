/**
 * Migration script to create Projects related tables (Projects, Tags, ProjectImages, ProjectTags)
 */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create Projects table
    await queryInterface.createTable('Projects', {
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
      description: {
        type: Sequelize.STRING,    // short summary of project
        allowNull: false
      },
      image: {
        type: Sequelize.STRING,    // main image path/URL
        allowNull: false
      },
      link: {
        type: Sequelize.STRING,    // external link to project or demo
        allowNull: false
      },
      fullDescription: {
        type: Sequelize.TEXT,      // detailed description of the project
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

    // Create Tags table
    await queryInterface.createTable('Tags', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true               // Each tag name should be unique
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

    // Create ProjectImages table (additional images per project)
    await queryInterface.createTable('ProjectImages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
      },
      projectId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Projects', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'        // Remove image entries if project is deleted
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

    // Create ProjectTags join table (many-to-many relation between Projects and Tags)
    await queryInterface.createTable('ProjectTags', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      projectId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Projects', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tagId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Tags', key: 'id' },
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

    // Ensure each project-tag pair is unique
    await queryInterface.addConstraint('ProjectTags', {
      fields: ['projectId', 'tagId'],
      type: 'unique',
      name: 'unique_project_tag_pair'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop join table and related tables in reverse order
    await queryInterface.dropTable('ProjectTags');
    await queryInterface.dropTable('ProjectImages');
    await queryInterface.dropTable('Tags');
    await queryInterface.dropTable('Projects');
  }
}; 