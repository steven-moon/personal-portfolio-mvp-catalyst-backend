/**
 * Seeder script to create sample projects and tags
 */
'use strict';

module.exports = {
  // Apply seeder
  up: async (queryInterface, Sequelize) => {
    // Check if projects exist before creating samples
    const projects = await queryInterface.sequelize.query(
      'SELECT id FROM Projects LIMIT 1;',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    // Check if tags exist before creating samples
    const tags = await queryInterface.sequelize.query(
      'SELECT id FROM Tags LIMIT 1;',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    // Only proceed if no projects and tags exist
    if (projects.length === 0 && tags.length === 0) {
      // Create tags first
      await queryInterface.bulkInsert('Tags', [
        {
          name: 'React',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Node.js',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'JavaScript',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'TypeScript',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'MongoDB',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Express',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'GraphQL',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'MySQL',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'CSS',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'HTML',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
      
      console.log('Sample tags created successfully');
      
      // Create projects
      await queryInterface.bulkInsert('Projects', [
        {
          title: 'E-commerce Platform',
          description: 'A full-featured e-commerce platform with product management, shopping cart, and payment integration.',
          image: '/assets/images/projects/ecommerce.jpg',
          link: 'https://github.com/johndeveloper/ecommerce-platform',
          fullDescription: `# E-commerce Platform

This project is a complete e-commerce solution built with React, Node.js, and MongoDB. It features:

- User authentication and profiles
- Product catalog with categories and search
- Shopping cart and checkout functionality
- Payment integration with Stripe
- Admin dashboard for managing products, orders, and users
- Responsive design for mobile and desktop

The application follows best practices for security, performance, and user experience.`,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Task Management App',
          description: 'A collaborative task management application with real-time updates, task assignment, and progress tracking.',
          image: '/assets/images/projects/taskmanager.jpg',
          link: 'https://github.com/johndeveloper/task-manager',
          fullDescription: `# Task Management Application

A collaborative task management tool built with the MERN stack featuring real-time updates using Socket.io. The app includes:

- User authentication and team management
- Projects, tasks, and subtasks organization
- Task assignment and priority settings
- Due dates and reminders
- Comments and file attachments
- Kanban board view for visualizing workflow
- Activity log for tracking changes

This project demonstrates advanced React patterns, state management with Redux, and WebSocket integration.`,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Weather Dashboard',
          description: 'A weather dashboard that displays current conditions and forecasts for multiple locations using weather API data.',
          image: '/assets/images/projects/weather.jpg',
          link: 'https://github.com/johndeveloper/weather-dashboard',
          fullDescription: `# Weather Dashboard

A single-page application built with React that provides detailed weather information for any location. Features include:

- Current weather conditions display
- 5-day forecast with hourly breakdowns
- Multiple location saving and tracking
- Animated weather visualizations
- Geolocation for automatic local weather
- Historical weather data charts

This project demonstrates API integration, data visualization with Chart.js, and geolocation services.`,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Blog CMS',
          description: 'A content management system for blogs with markdown editing, image uploading, and SEO optimization.',
          image: '/assets/images/projects/blog.jpg',
          link: 'https://github.com/johndeveloper/blog-cms',
          fullDescription: `# Blog Content Management System

A full-featured blog CMS built with Node.js, Express, and MySQL. Key features:

- Rich text and markdown editing
- Image and file uploading with cloud storage
- SEO tools for metadata and social sharing
- Categories and tagging system
- User roles and permissions
- Content scheduling and drafts
- Analytics dashboard

This project focuses on creating a user-friendly interface for content creators while maintaining performance and security.`,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
      
      console.log('Sample projects created successfully');
      
      // Create project images
      await queryInterface.bulkInsert('ProjectImages', [
        {
          projectId: 1,
          imageUrl: '/assets/images/projects/ecommerce-1.jpg',
          caption: 'Product catalog view',
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          projectId: 1,
          imageUrl: '/assets/images/projects/ecommerce-2.jpg',
          caption: 'Shopping cart interface',
          order: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          projectId: 1,
          imageUrl: '/assets/images/projects/ecommerce-3.jpg',
          caption: 'Admin dashboard',
          order: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          projectId: 2,
          imageUrl: '/assets/images/projects/taskmanager-1.jpg',
          caption: 'Kanban board view',
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          projectId: 2,
          imageUrl: '/assets/images/projects/taskmanager-2.jpg',
          caption: 'Task detail view',
          order: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          projectId: 3,
          imageUrl: '/assets/images/projects/weather-1.jpg',
          caption: 'Current weather display',
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          projectId: 3,
          imageUrl: '/assets/images/projects/weather-2.jpg',
          caption: 'Five-day forecast',
          order: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          projectId: 4,
          imageUrl: '/assets/images/projects/blog-1.jpg',
          caption: 'Content editor',
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          projectId: 4,
          imageUrl: '/assets/images/projects/blog-2.jpg',
          caption: 'Analytics dashboard',
          order: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
      
      console.log('Sample project images created successfully');
      
      // Create project-tag associations
      await queryInterface.bulkInsert('ProjectTags', [
        // E-commerce Platform
        {
          projectId: 1,
          tagId: 1, // React
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          projectId: 1,
          tagId: 2, // Node.js
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          projectId: 1,
          tagId: 5, // MongoDB
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          projectId: 1,
          tagId: 6, // Express
          createdAt: new Date(),
          updatedAt: new Date()
        },
        
        // Task Management App
        {
          projectId: 2,
          tagId: 1, // React
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          projectId: 2,
          tagId: 2, // Node.js
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          projectId: 2,
          tagId: 3, // JavaScript
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          projectId: 2,
          tagId: 7, // GraphQL
          createdAt: new Date(),
          updatedAt: new Date()
        },
        
        // Weather Dashboard
        {
          projectId: 3,
          tagId: 1, // React
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          projectId: 3,
          tagId: 3, // JavaScript
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          projectId: 3,
          tagId: 9, // CSS
          createdAt: new Date(),
          updatedAt: new Date()
        },
        
        // Blog CMS
        {
          projectId: 4,
          tagId: 2, // Node.js
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          projectId: 4,
          tagId: 6, // Express
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          projectId: 4,
          tagId: 8, // MySQL
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          projectId: 4,
          tagId: 4, // TypeScript
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
      
      console.log('Project-tag associations created successfully');
    } else {
      console.log('Skipping project creation - projects or tags already exist');
    }
  },

  // Revert seeder
  down: async (queryInterface, Sequelize) => {
    // Delete in reverse order to respect foreign key constraints
    await queryInterface.bulkDelete('ProjectTags', {}, {});
    await queryInterface.bulkDelete('ProjectImages', {}, {});
    await queryInterface.bulkDelete('Projects', {}, {});
    await queryInterface.bulkDelete('Tags', {}, {});
  }
}; 