/**
 * Seeder script to create default home page content
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
      const [homePage] = await queryInterface.bulkInsert('HomePages', [{
        heroTitle: 'John Developer',
        heroSubtitle: 'Full Stack Developer',
        heroDescription: 'I build beautiful, responsive web applications using modern technologies. With over 5 years of experience, I help businesses transform their ideas into reality.',
        heroImage: '/assets/images/hero.jpg',
        ctaText: 'View My Work',
        ctaLink: '/projects',
        introText: 'Creating exceptional digital experiences through code',
        createdAt: new Date(),
        updatedAt: new Date()
      }], { returning: true });
      
      console.log('Default home page created successfully');
      
      // Create services
      await queryInterface.bulkInsert('Services', [
        {
          title: 'Web Development',
          description: 'I build responsive, modern websites and web applications using latest technologies like React, Node.js, and more.',
          icon: 'code',
          homePageId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Mobile Applications',
          description: 'I create cross-platform mobile applications using React Native and Flutter that work seamlessly on both iOS and Android.',
          icon: 'smartphone',
          homePageId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'UI/UX Design',
          description: 'I design intuitive user interfaces and create engaging user experiences that help businesses connect with their customers.',
          icon: 'palette',
          homePageId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'API Development',
          description: 'I build robust and scalable RESTful APIs and GraphQL services that power your web and mobile applications.',
          icon: 'api',
          homePageId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
      
      console.log('Default services created successfully');
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