/**
 * Seeder script to create default home page content for the fictional developer Avery Parker
 */
'use strict';

module.exports = {
  // Apply seeder
  up: async (queryInterface, Sequelize) => {
    // Check if homepage exists before creating defaults
    const home = await queryInterface.sequelize.query(
      'SELECT id FROM HomePages LIMIT 1;',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    // Only create default homepage if none exists
    if (home.length === 0) {
      // Create the homepage
      await queryInterface.bulkInsert('HomePages', [{
        title: 'Avery Parker',
        subtitle: 'Creating inclusive, next-generation web and AI solutions',
        profession: 'Full-Stack & AI Developer',
        profileImage: '/images/sample-profile.png',
        createdAt: new Date(),
        updatedAt: new Date()
      }]);
      
      console.log('Default home page created successfully for Avery Parker');
      
      // Create services
      await queryInterface.bulkInsert('Services', [
        {
          title: 'End-to-End Web Development',
          description: 'Building user-friendly, performance-driven applications using modern frameworks and best practices.',
          homePageId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'AI & ML Solutions',
          description: 'Harnessing artificial intelligence for advanced analytics, predictive modeling, and data-driven experiences.',
          homePageId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Blockchain Integrations',
          description: 'Implementing secure, decentralized functionalities with Ethereum, Solidity, and other Web3 technologies.',
          homePageId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Technical Leadership',
          description: 'Mentoring teams, overseeing complex projects, and driving innovation from concept to launch.',
          homePageId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
      
      console.log('Default services created successfully for Avery Parker');
    } else {
      console.log('Skipping home page creation - home page already exists');
    }
  },

  // Revert seeder
  down: async (queryInterface, Sequelize) => {
    // Delete services first (to respect foreign key constraints)
    await queryInterface.bulkDelete('Services', {}, {});
    // Then delete home page
    await queryInterface.bulkDelete('HomePages', {}, {});
  }
};