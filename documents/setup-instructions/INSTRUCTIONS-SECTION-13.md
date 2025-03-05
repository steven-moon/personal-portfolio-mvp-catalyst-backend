# Instructions Step 13: Database Migrations for Portfolio Data Models

## 13. Database Migrations for Portfolio Data Models

This step covers creating comprehensive Sequelize migration scripts for all the portfolio data models required for your application.

### Overview of Portfolio Data Models

For a complete portfolio website, we'll need several database tables to store various types of content:

1. **About Me section**: Personal information, work experiences, education, skills, and values
2. **Blog section**: Blog posts and categories
3. **Contact section**: Contact information and social media links
4. **Home Page**: Hero content and services
5. **Projects section**: Projects, tags, and project images
6. **Site Settings**: Global site configuration

### Setting Up Sequelize CLI

First, let's set up Sequelize CLI for easier migrations management:

1. **Create a Sequelize CLI configuration file** in `src/config/config.json`:
   ```json
   {
     "development": {
       "username": "portfolio_user",
       "password": "your_secure_password",
       "database": "portfolio_api_db",
       "host": "127.0.0.1",
       "dialect": "mysql"
     },
     "test": {
       "username": "portfolio_user",
       "password": "your_secure_password",
       "database": "portfolio_api_test_db",
       "host": "127.0.0.1",
       "dialect": "mysql"
     },
     "production": {
       "username": "portfolio_user",
       "password": "your_secure_password",
       "database": "portfolio_api_db",
       "host": "127.0.0.1",
       "dialect": "mysql",
       "logging": false
     }
   }
   ```

2. **Create a `.sequelizerc` file** in the project root to define paths:
   ```javascript
   // .sequelizerc
   const path = require('path');

   module.exports = {
     'config': path.resolve('src/config', 'config.json'),
     'models-path': path.resolve('src', 'models'),
     'seeders-path': path.resolve('src', 'seeders'),
     'migrations-path': path.resolve('src', 'migrations')
   };
   ```

### Creating Migration Scripts

Now, let's create the migration scripts for each section of the portfolio:

#### 1. About Me Section Migration

Create a file named `src/migrations/02-create-about-tables.js`:

```javascript
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create About table
    await queryInterface.createTable('abouts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        unique: true
      },
      headline: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      subheadline: {
        type: Sequelize.STRING(255)
      },
      story: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create WorkExperiences table
    await queryInterface.createTable('workExperiences', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      aboutId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'abouts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      company: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      period: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create Educations table
    await queryInterface.createTable('educations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      aboutId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'abouts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      degree: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      institution: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      period: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create Skills table
    await queryInterface.createTable('skills', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      aboutId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'abouts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      category: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create Values table
    await queryInterface.createTable('values', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      aboutId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'abouts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface) => {
    // Drop tables in reverse order to avoid foreign key constraints
    await queryInterface.dropTable('values');
    await queryInterface.dropTable('skills');
    await queryInterface.dropTable('educations');
    await queryInterface.dropTable('workExperiences');
    await queryInterface.dropTable('abouts');
  }
};
```

#### 2. Blog Posts Migration

Create a file named `src/migrations/03-create-blog-posts-tables.js`:

```javascript
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create Categories table
    await queryInterface.createTable('categories', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create BlogPosts table
    await queryInterface.createTable('blogPosts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      excerpt: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      imageUrl: {
        type: Sequelize.STRING(255)
      },
      authorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('blogPosts');
    await queryInterface.dropTable('categories');
  }
};
```

#### 3. Contact Info Migration

Create a file named `src/migrations/04-create-contact-info-tables.js`:

```javascript
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create ContactInfos table
    await queryInterface.createTable('contactInfos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      location: {
        type: Sequelize.STRING(100)
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create SocialMedia table
    await queryInterface.createTable('socialMedia', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      contactInfoId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'contactInfos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      platform: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      icon: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      url: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Add unique constraint for platform per contact
    await queryInterface.addConstraint('socialMedia', {
      fields: ['contactInfoId', 'platform'],
      type: 'unique',
      name: 'unique_platform_per_contact'
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('socialMedia');
    await queryInterface.dropTable('contactInfos');
  }
};
```

#### 4. Home Page Migration

Create a file named `src/migrations/05-create-home-page-tables.js`:

```javascript
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create HomePages table
    await queryInterface.createTable('homePages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      subtitle: {
        type: Sequelize.STRING(255)
      },
      profession: {
        type: Sequelize.STRING(100)
      },
      profileImage: {
        type: Sequelize.STRING(255)
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create Services table
    await queryInterface.createTable('services', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      homePageId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'homePages',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('services');
    await queryInterface.dropTable('homePages');
  }
};
```

#### 5. Projects Migration

Create a file named `src/migrations/06-create-projects-tables.js`:

```javascript
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create Projects table
    await queryInterface.createTable('projects', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      image: {
        type: Sequelize.STRING(255)
      },
      link: {
        type: Sequelize.STRING(255)
      },
      fullDescription: {
        type: Sequelize.TEXT
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create Tags table
    await queryInterface.createTable('tags', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create ProjectImages table
    await queryInterface.createTable('projectImages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      projectId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'projects',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      imageUrl: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create ProjectTags junction table
    await queryInterface.createTable('projectTags', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      projectId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'projects',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tagId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'tags',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Add unique constraint to project-tag pairs
    await queryInterface.addConstraint('projectTags', {
      fields: ['projectId', 'tagId'],
      type: 'unique',
      name: 'unique_project_tag'
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('projectTags');
    await queryInterface.dropTable('projectImages');
    await queryInterface.dropTable('tags');
    await queryInterface.dropTable('projects');
  }
};
```

#### 6. Site Settings Migration

Create a file named `src/migrations/07-create-site-settings-table.js`:

```javascript
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('siteSettings', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      // General settings
      siteName: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: 'My Portfolio'
      },
      authorName: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: 'Portfolio Owner'
      },
      siteIcon: {
        type: Sequelize.STRING(255)
      },
      email: {
        type: Sequelize.STRING(100)
      },
      showEmailInFooter: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      
      // Appearance settings
      theme: {
        type: Sequelize.STRING(20),
        defaultValue: 'light'
      },
      primaryColor: {
        type: Sequelize.STRING(20),
        defaultValue: '#3498db'
      },
      enableAnimations: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      fontFamily: {
        type: Sequelize.STRING(50),
        defaultValue: 'Roboto, sans-serif'
      },
      
      // SEO settings
      metaDescription: {
        type: Sequelize.STRING(160)
      },
      keywords: {
        type: Sequelize.STRING(255)
      },
      enableSocialMetaTags: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      googleAnalyticsId: {
        type: Sequelize.STRING(20)
      },
      
      // Feature toggles
      enableBlog: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      enableProjects: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      enableContactForm: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      enableNewsletter: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      enableMvpBanner: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      
      // Social media settings
      enableGithub: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      githubUrl: {
        type: Sequelize.STRING(255)
      },
      enableLinkedin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      linkedinUrl: {
        type: Sequelize.STRING(255)
      },
      enableTwitter: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      twitterUrl: {
        type: Sequelize.STRING(255)
      },
      
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('siteSettings');
  }
};
```

### Running and Testing Migrations

Now, you can run these migrations using the Sequelize CLI or your custom migration runner:

1. **Using your custom migration runner**:
   ```bash
   npm run migrate
   ```

2. **Using Sequelize CLI**:
   ```bash
   npx sequelize-cli db:migrate
   ```

3. **Check migration status**:
   ```bash
   npm run migrate:status
   # or
   npx sequelize-cli db:migrate:status
   ```

4. **Verify tables in your database**:
   ```sql
   SHOW TABLES;
   ```

5. **Reset all migrations if needed**:
   ```bash
   npm run migrate:reset
   # or
   npx sequelize-cli db:migrate:undo:all
   ```

### Database Documentation

Create a comprehensive database documentation file in `documents/db/DATABASE.md` with the following information:

1. Database schema overview
2. Table relationships diagram
3. Detailed description of each table and its columns
4. Migration commands reference
5. Troubleshooting guide for common issues

This documentation will help developers understand the database structure and how to work with it.

By completing this step, you've created a comprehensive database schema for your portfolio application, with proper relationships between tables and constraints to ensure data integrity. The next step will be to create Sequelize models that correspond to these tables and implement business logic for working with your data. 