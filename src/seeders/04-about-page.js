/**
 * Seeder script to create default about page content for a fictional developer, Avery Parker
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
      await queryInterface.bulkInsert('Abouts', [{
        userId: userId,
        headline: 'Full Stack & AI Developer',
        subheadline: 'Pushing boundaries in web, AI, and decentralized solutions',
        story: `
I am Avery Parker, a full-stack developer passionate about AI, blockchain, and next-gen web technologies. 
With over 7 years of hands-on development experience, I’ve been fortunate to collaborate with innovative startups 
and established tech firms alike—delivering scalable, secure, and user-centric solutions.

My expertise spans from building robust backend architectures and AI-driven features 
to creating intuitive interfaces for both mobile and web applications. 
When I'm not iterating on code, you’ll find me exploring new frameworks, 
contributing to open-source projects, or sharing knowledge with fellow devs.
        `.trim(),
        createdAt: new Date(),
        updatedAt: new Date()
      }]);
      
      console.log('Default about page created successfully for Avery Parker');
      
      // Create education history
      await queryInterface.bulkInsert('Educations', [
        {
          aboutId: 1,
          institution: 'Stanford University',
          degree: 'BS in Computer Science',
          period: 'Graduated in 2016',
          description: 'Focused on software engineering principles, distributed systems, and AI fundamentals.',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
      
      console.log('Default education history created successfully for Avery Parker');
      
      // Create work experience
      await queryInterface.bulkInsert('WorkExperiences', [
        {
          aboutId: 1,
          title: 'Senior AI Engineer',
          company: 'Techverse Labs',
          period: 'Feb 2023 – Present',
          description: 'Overseeing development of AI-driven products, integrating ML models into web applications, and mentoring junior engineers.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          aboutId: 1,
          title: 'Full Stack Developer',
          company: 'Skyline Solutions',
          period: 'Aug 2019 – Jan 2023',
          description: 'Built responsive web apps, implemented blockchain features, and handled end-to-end system architecture for diverse clients.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          aboutId: 1,
          title: 'Frontend Developer',
          company: 'Aurora Innovations',
          period: '2017 – 2019',
          description: 'Developed interactive user experiences with React, improved performance on large-scale SPAs, and collaborated with UX teams.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          aboutId: 1,
          title: 'Blockchain Research Intern',
          company: 'BlockBright Research',
          period: 'Summer 2016',
          description: 'Contributed to whitepapers on consensus mechanisms and helped prototype a smart contract auditing tool.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          aboutId: 1,
          title: 'Freelance Web Developer',
          company: 'Self-Employed',
          period: '2015 – 2017',
          description: 'Worked with small businesses to create dynamic websites and set up e-commerce platforms using Node and Vue.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          aboutId: 1,
          title: 'Undergraduate Research Assistant',
          company: 'Stanford AI Lab',
          period: '2014 – 2015',
          description: 'Assisted with research on natural language processing and contributed to open-source AI projects.',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
      
      console.log('Default work experience created successfully for Avery Parker');
      
      // Create skills
      await queryInterface.bulkInsert('Skills', [
        {
          aboutId: 1,
          name: 'TypeScript',
          category: 'technical',
          categoryTitle: 'Technical Skills',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          aboutId: 1,
          name: 'React/Next.js',
          category: 'technical',
          categoryTitle: 'Technical Skills',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          aboutId: 1,
          name: 'Node/Express',
          category: 'technical',
          categoryTitle: 'Technical Skills',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          aboutId: 1,
          name: 'Python (AI & ML)',
          category: 'technical',
          categoryTitle: 'Technical Skills',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          aboutId: 1,
          name: 'Solidity & Web3',
          category: 'technical',
          categoryTitle: 'Technical Skills',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          aboutId: 1,
          name: 'AWS & Cloud Services',
          category: 'technical',
          categoryTitle: 'Technical Skills',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          aboutId: 1,
          name: 'UI/UX Design',
          category: 'design',
          categoryTitle: 'Design Skills',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          aboutId: 1,
          name: 'Team Leadership',
          category: 'soft',
          categoryTitle: 'Soft Skills',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          aboutId: 1,
          name: 'Agile Methodologies',
          category: 'soft',
          categoryTitle: 'Soft Skills',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          aboutId: 1,
          name: 'Problem Solving',
          category: 'soft',
          categoryTitle: 'Soft Skills',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          aboutId: 1,
          name: 'Public Speaking',
          category: 'soft',
          categoryTitle: 'Soft Skills',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
      
      console.log('Default skills created successfully for Avery Parker');
      
      // Create values
      await queryInterface.bulkInsert('Values', [
        {
          aboutId: 1,
          title: 'Innovation',
          description: 'I constantly explore emerging tech and challenge myself to experiment with new tools, frameworks, and paradigms.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          aboutId: 1,
          title: 'Inclusivity',
          description: 'I prioritize creating environments and products that welcome all users, promoting equitable access to technology.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          aboutId: 1,
          title: 'Continuous Growth',
          description: 'I believe in lifelong learning—staying on top of industry trends and consistently refining my skills.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          aboutId: 1,
          title: 'Transparency & Trust',
          description: 'Whether coding or collaborating, I value open communication and ethical responsibility in my work.',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
      
      console.log('Default values created successfully for Avery Parker');
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