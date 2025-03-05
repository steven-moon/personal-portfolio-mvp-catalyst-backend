/**
 * Seeder script to create default about page content
 */
'use strict';

module.exports = {
  // Apply seeder
  up: async (queryInterface, Sequelize) => {
    // Check if about data exists before creating defaults
    const about = await queryInterface.sequelize.query(
      'SELECT id FROM Abouts LIMIT 1;',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    // Only create default about content if none exists
    if (about.length === 0) {
      // Find the admin user
      const users = await queryInterface.sequelize.query(
        'SELECT id FROM Users WHERE role = "admin" LIMIT 1;',
        { type: Sequelize.QueryTypes.SELECT }
      );
      
      if (users.length === 0) {
        console.log('No admin user found. Run the admin user seeder first.');
        return;
      }
      
      const userId = users[0].id;
      
      // Create the about page
      const [aboutPage] = await queryInterface.bulkInsert('Abouts', [{
        userId: userId,
        headline: 'Full Stack Developer & UI/UX Enthusiast',
        subheadline: 'Building Modern Web Applications',
        story: 'I am a passionate full-stack developer with 5+ years of experience building web applications. My journey in software development began during college when I built my first website, and I have been hooked ever since. I specialize in JavaScript technologies and have worked with companies ranging from startups to large enterprises.\n\nI believe in creating clean, maintainable code and building applications that provide exceptional user experiences. When I\'m not coding, I enjoy hiking, photography, and contributing to open source projects.',
        createdAt: new Date(),
        updatedAt: new Date()
      }], { returning: true });
      
      console.log('Default about page created successfully');
      
      // Create education history
      await queryInterface.bulkInsert('Educations', [
        {
          aboutId: 1,
          institution: 'University of Technology',
          degree: 'Master of Computer Science',
          fieldOfStudy: 'Software Engineering',
          startDate: '2015-09-01',
          endDate: '2017-06-30',
          description: 'Focused on advanced software engineering principles, distributed systems, and machine learning.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          aboutId: 1,
          institution: 'State College',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          startDate: '2011-09-01',
          endDate: '2015-05-30',
          description: 'Core computer science curriculum with specialization in web technologies and databases.',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
      
      console.log('Default education history created successfully');
      
      // Create work experience
      await queryInterface.bulkInsert('WorkExperiences', [
        {
          aboutId: 1,
          company: 'Tech Innovations Inc.',
          position: 'Senior Software Developer',
          startDate: '2020-03-01',
          endDate: null, // Current job
          description: 'Lead developer for the company\'s flagship SaaS product. Responsible for architecture decisions, implementing new features, and mentoring junior developers.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          aboutId: 1,
          company: 'WebSolutions Co.',
          position: 'Full Stack Developer',
          startDate: '2017-07-15',
          endDate: '2020-02-28',
          description: 'Developed and maintained multiple client websites and web applications using React, Node.js, and MongoDB.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          aboutId: 1,
          company: 'StartupX',
          position: 'Frontend Developer',
          startDate: '2015-06-01',
          endDate: '2017-07-01',
          description: 'Built responsive user interfaces for a SaaS marketing platform. Improved site performance by 40%.',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
      
      console.log('Default work experience created successfully');
      
      // Create skills
      await queryInterface.bulkInsert('Skills', [
        {
          aboutId: 1,
          name: 'JavaScript',
          proficiency: 90,
          category: 'frontend',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          aboutId: 1,
          name: 'React',
          proficiency: 85,
          category: 'frontend',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          aboutId: 1,
          name: 'Node.js',
          proficiency: 80,
          category: 'backend',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          aboutId: 1,
          name: 'Express',
          proficiency: 85,
          category: 'backend',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          aboutId: 1,
          name: 'SQL',
          proficiency: 75,
          category: 'database',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          aboutId: 1,
          name: 'MongoDB',
          proficiency: 80,
          category: 'database',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          aboutId: 1,
          name: 'Git',
          proficiency: 85,
          category: 'tools',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          aboutId: 1,
          name: 'Docker',
          proficiency: 70,
          category: 'devops',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
      
      console.log('Default skills created successfully');
      
      // Create values
      await queryInterface.bulkInsert('Values', [
        {
          aboutId: 1,
          title: 'Clean Code',
          description: 'I believe in writing clean, maintainable code that follows best practices and is easy for others to understand.',
          icon: 'code',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          aboutId: 1,
          title: 'User-Centric Design',
          description: 'I focus on creating applications that are intuitive and provide an exceptional user experience.',
          icon: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          aboutId: 1,
          title: 'Continuous Learning',
          description: 'I am committed to continuous improvement and staying updated with the latest technologies and best practices.',
          icon: 'book',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          aboutId: 1,
          title: 'Problem Solving',
          description: 'I enjoy tackling complex problems and finding elegant solutions through creative thinking.',
          icon: 'puzzle-piece',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
      
      console.log('Default values created successfully');
    } else {
      console.log('Skipping about page creation - about content already exists');
    }
  },

  // Revert seeder
  down: async (queryInterface, Sequelize) => {
    // Delete related records first (to respect foreign key constraints)
    await queryInterface.bulkDelete('Values', {}, {});
    await queryInterface.bulkDelete('Skills', {}, {});
    await queryInterface.bulkDelete('WorkExperiences', {}, {});
    await queryInterface.bulkDelete('Educations', {}, {});
    // Then delete about page
    await queryInterface.bulkDelete('Abouts', {}, {});
  }
}; 