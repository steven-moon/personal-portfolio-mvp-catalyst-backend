/**
 * Seeder script to create default site settings for a fictional female developer
 */
'use strict';

module.exports = {
  // Apply seeder
  up: async (queryInterface, Sequelize) => {
    // Check if site settings exist before creating defaults
    const settings = await queryInterface.sequelize.query(
      'SELECT id FROM SiteSettings LIMIT 1;',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    // Only create default settings if none exist
    if (settings.length === 0) {
      await queryInterface.bulkInsert('SiteSettings', [{
        siteName: 'Avery Parker Portfolio',
        authorName: 'Avery Parker',
        siteIcon: '/images/icons/icon_256X256.png',
        email: 'avery.parker@fictional.dev',
        showEmailInFooter: true,
        theme: 'light',
        primaryColor: '#FF78AE',
        enableAnimations: true,
        fontFamily: 'Open Sans, sans-serif',
        metaDescription: 'A passionate developer dedicated to building inclusive, cutting-edge web and mobile experiences.',
        keywords: 'web developer, mobile apps, AI, portfolio, software engineering, design',
        enableSocialMetaTags: true,
        googleAnalyticsId: '',
        enableBlog: true,
        enableProjects: true,
        enableContactForm: true,
        enableNewsletter: true,
        enableMvpBanner: true,
        enableGithub: true,
        enableLinkedin: true,
        enableTwitter: true,
        enableInstagram: true,
        enableYoutube: true,
        enableFacebook: true,
        githubUrl: 'https://github.com/averyparker-fictional',
        linkedinUrl: 'https://linkedin.com/in/averyparker-fictional',
        twitterUrl: 'https://twitter.com/averycodes-fictional',
        instagramUrl: 'https://instagram.com/avery.dev-fictional',
        youtubeUrl: 'https://youtube.com/averycodes-fictional',
        facebookUrl: 'https://facebook.com/averycodes-fictional',
        createdAt: new Date(),
        updatedAt: new Date()
      }]);
      
      console.log('Default site settings created successfully for Avery Parker');
    } else {
      console.log('Skipping site settings creation - settings already exist');
    }
  },

  // Revert seeder
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('SiteSettings', {}, {});
  }
};