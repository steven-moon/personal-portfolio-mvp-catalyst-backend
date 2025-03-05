/**
 * Seeder script to create sample contact information and social media links
 */
'use strict';

module.exports = {
  // Apply seeder
  up: async (queryInterface, Sequelize) => {
    // Check if contact info exists before creating samples
    const contactInfo = await queryInterface.sequelize.query(
      'SELECT id FROM ContactInfos LIMIT 1;',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    // Only proceed if no contact info exists
    if (contactInfo.length === 0) {
      // Create contact info
      await queryInterface.bulkInsert('ContactInfos', [
        {
          email: 'contact@example.com',
          location: 'San Francisco, CA',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
      
      console.log('Contact info created successfully');
      
      // Create social media links
      await queryInterface.bulkInsert('SocialMedia', [
        {
          contactInfoId: 1,
          platform: 'github',
          name: 'GitHub',
          icon: 'github',
          url: 'https://github.com/username',
          enabled: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          contactInfoId: 1,
          platform: 'linkedin',
          name: 'LinkedIn',
          icon: 'linkedin',
          url: 'https://linkedin.com/in/username',
          enabled: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          contactInfoId: 1,
          platform: 'twitter',
          name: 'Twitter',
          icon: 'twitter',
          url: 'https://twitter.com/username',
          enabled: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          contactInfoId: 1,
          platform: 'instagram',
          name: 'Instagram',
          icon: 'instagram',
          url: 'https://instagram.com/username',
          enabled: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          contactInfoId: 1,
          platform: 'youtube',
          name: 'YouTube',
          icon: 'youtube',
          url: 'https://youtube.com/c/username',
          enabled: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
      
      console.log('Social media links created successfully');
    } else {
      console.log('Skipping contact info creation - contact info already exists');
    }
  },

  // Revert seeder
  down: async (queryInterface, Sequelize) => {
    // Delete in reverse order to respect foreign key constraints
    await queryInterface.bulkDelete('SocialMedia', {}, {});
    await queryInterface.bulkDelete('ContactInfos', {}, {});
  }
}; 