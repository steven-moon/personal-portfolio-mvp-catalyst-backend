/**
 * Migration script to create the About Me related tables (About, WorkExperience, Education, Skills, Values)
 */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create About table (profile for each user)
    await queryInterface.createTable('Abouts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,                 // One-to-one with Users
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      headline: {
        type: Sequelize.STRING,
        allowNull: false
      },
      subheadline: {
        type: Sequelize.STRING,
        allowNull: false
      },
      story: {
        type: Sequelize.TEXT,        // Multiple paragraphs of text
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

    // Create WorkExperiences table (multiple per About)
    await queryInterface.createTable('WorkExperiences', {
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
      company: {
        type: Sequelize.STRING,
        allowNull: false
      },
      period: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      aboutId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Abouts', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'          // Delete experiences if profile is deleted
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

    // Create Educations table (multiple per About)
    await queryInterface.createTable('Educations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      degree: {
        type: Sequelize.STRING,
        allowNull: false
      },
      institution: {
        type: Sequelize.STRING,
        allowNull: false
      },
      period: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      aboutId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Abouts', key: 'id' },
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

    // Create Skills table (technical/design skills per About)
    await queryInterface.createTable('Skills', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      category: {
        type: Sequelize.ENUM('technical', 'design'),  // Skill type
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      aboutId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Abouts', key: 'id' },
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

    // Create Values table (personal values per About)
    await queryInterface.createTable('Values', {
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
        type: Sequelize.TEXT,
        allowNull: false
      },
      aboutId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Abouts', key: 'id' },
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
  },

  down: async (queryInterface, Sequelize) => {
    // Drop tables in reverse order of creation (children first)
    await queryInterface.dropTable('Values');
    await queryInterface.dropTable('Skills');
    await queryInterface.dropTable('Educations');
    await queryInterface.dropTable('WorkExperiences');
    await queryInterface.dropTable('Abouts');
  }
}; 