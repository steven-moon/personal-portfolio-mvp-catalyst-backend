/**
 * Migration script to create the SiteSettings table for global site configuration
 */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SiteSettings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // General settings
      siteName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      authorName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      siteIcon: {
        type: Sequelize.STRING,
        allowNull: true,            // URL or file path to site icon (optional)
        defaultValue: ''           // default to empty string if not provided
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { isEmail: true }
      },
      showEmailInFooter: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      // Appearance settings
      theme: {
        type: Sequelize.STRING,     // e.g., 'light' or 'dark'
        allowNull: false,
        defaultValue: 'light'
      },
      primaryColor: {
        type: Sequelize.STRING,     // hex color code
        allowNull: false,
        defaultValue: '#ffffff'     // default white (can be updated)
      },
      enableAnimations: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      fontFamily: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'inter'
      },
      // SEO settings
      metaDescription: {
        type: Sequelize.STRING,
        allowNull: true
      },
      keywords: {
        type: Sequelize.STRING,
        allowNull: true
      },
      enableSocialMetaTags: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      googleAnalyticsId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      // Feature toggles
      enableBlog: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      enableProjects: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      enableContactForm: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      enableNewsletter: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      enableMvpBanner: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      // Social media integration toggles
      enableGithub: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      enableLinkedin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      enableTwitter: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      enableInstagram: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      enableYoutube: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      enableFacebook: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      // Social media URLs
      githubUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      linkedinUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      twitterUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      instagramUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      youtubeUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      facebookUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      // Timestamps
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
    await queryInterface.dropTable('SiteSettings');
  }
}; 