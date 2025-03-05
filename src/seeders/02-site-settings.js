/**
 * Seeder script to create default site settings
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
        siteName: 'My Professional Portfolio',
        authorName: 'John Developer',
        siteIcon: '/assets/images/logo.png',
        email: 'john@example.com',
        showEmailInFooter: true,
        theme: 'light',
        primaryColor: '#4A6CF7',
        enableAnimations: true,
        fontFamily: 'Roboto, sans-serif',
        metaDescription: 'Professional portfolio showcasing my work and skills as a developer',
        keywords: 'web developer, software engineer, portfolio, projects, coding',
        enableSocialMetaTags: true,
        googleAnalyticsId: '',
        enableBlog: true,
        enableProjects: true,
        enableContactForm: true,
        enableNewsletter: false,
        enableMvpBanner: true,
        enableGithub: true,
        enableLinkedin: true,
        enableTwitter: true,
        enableInstagram: false,
        enableYoutube: false,
        enableFacebook: false,
        githubUrl: 'https://github.com/johndeveloper',
        linkedinUrl: 'https://linkedin.com/in/johndeveloper',
        twitterUrl: 'https://twitter.com/johndeveloper',
        instagramUrl: null,
        youtubeUrl: null,
        facebookUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }]);
      
      console.log('Default site settings created successfully');
    } else {
      console.log('Skipping site settings creation - settings already exist');
    }
  },

  // Revert seeder
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('SiteSettings', {}, {});
  }
}; 