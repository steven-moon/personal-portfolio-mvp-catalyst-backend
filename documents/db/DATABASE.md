# Database Configuration and Management

This document provides information about the database setup, migration commands, and other database-related details for the Personal Portfolio MVP Catalyst Backend.

## Database Configuration

The database connection is configured in two places:

1. **`src/config/database.js`**: Used by the application at runtime
2. **`src/config/config.json`**: Used by Sequelize CLI for migrations and seeders

### Config JSON Structure

The `config.json` file includes configurations for different environments:

```json
{
  "development": {
    "username": "root",
    "password": "abcd999",
    "database": "personal_portfolio_db",
    "host": "127.0.0.1",
    "port": 3306,
    "dialect": "mysql",
    "dialectOptions": {
      "socketPath": "/Applications/MAMP/tmp/mysql/mysql.sock"
    }
  },
  "test": {
    "username": "root",
    "password": "abcd999",
    "database": "personal_portfolio_db_test",
    "host": "127.0.0.1",
    "port": 3306,
    "dialect": "mysql",
    "dialectOptions": {
      "socketPath": "/Applications/MAMP/tmp/mysql/mysql.sock"
    }
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "personal_portfolio_db_production",
    "host": "127.0.0.1",
    "port": 3306,
    "dialect": "mysql",
    "logging": false
  }
}
```

### Sequelize RC File

The `.sequelizerc` file in the project root configures the paths for Sequelize CLI:

```javascript
const path = require('path');

module.exports = {
  'config': path.resolve('src/config', 'config.json'),
  'models-path': path.resolve('src/models'),
  'seeders-path': path.resolve('src/seeders'),
  'migrations-path': path.resolve('src/migrations')
};
```

## Database Setup

Before running migrations, ensure you have:

1. MySQL installed and running (e.g., via MAMP on macOS)
2. Created the database:
   ```sql
   CREATE DATABASE personal_portfolio_db;
   ```
3. Configured the correct credentials in `.env` and `src/config/config.json`

## Migration Commands

### Running Migrations

To apply all pending migrations:

```bash
npx sequelize-cli db:migrate
```

This will create all the necessary tables in your database according to the migration files.

### Reverting Migrations

To undo the most recent migration:

```bash
npx sequelize-cli db:migrate:undo
```

To undo all migrations:

```bash
npx sequelize-cli db:migrate:undo:all
```

To undo migrations up to a specific one:

```bash
npx sequelize-cli db:migrate:undo --to XXXXXXXXXXXXXX-migration-name.js
```

### Creating New Migrations

To create a new migration file:

```bash
npx sequelize-cli migration:generate --name migration-name
```

The file will be created in `src/migrations/` with a timestamp prefix.

## Existing Migrations

The following migration files define the database schema:

1. **01-create-users-table.js** - Creates the Users table
2. **02-create-about-tables.js** - Creates tables for About, WorkExperiences, Educations, Skills, Values
3. **03-create-blog-posts-tables.js** - Creates tables for Categories and BlogPosts
4. **04-create-contact-info-tables.js** - Creates tables for ContactInfos and SocialMedia
5. **05-create-home-page-tables.js** - Creates tables for HomePages and Services
6. **06-create-projects-tables.js** - Creates tables for Projects, Tags, ProjectImages, ProjectTags
7. **07-create-site-settings-table.js** - Creates the SiteSettings table

## Database Schema Relationships

The database schema includes the following relationships:

- **Users** to **Abouts**: One-to-one
- **Abouts** to **WorkExperiences/Educations/Skills/Values**: One-to-many
- **Users** to **BlogPosts**: One-to-many (as author)
- **Categories** to **BlogPosts**: One-to-many
- **ContactInfos** to **SocialMedia**: One-to-many
- **HomePages** to **Services**: One-to-many
- **Projects** to **ProjectImages**: One-to-many
- **Projects** to **Tags**: Many-to-many (via ProjectTags)

## Troubleshooting

### Common Issues

1. **Migration Error - Cannot find config.json**:
   - Ensure `src/config/config.json` exists
   - Make sure `.sequelizerc` is properly configured

2. **Database Connection Error**:
   - Verify MySQL is running
   - Check credentials in both `config.json` and `.env`
   - For MAMP users, ensure the socketPath in dialectOptions is correct

3. **Missing Dependencies**:
   - Run `npm install sequelize sequelize-cli mysql2` to install required packages

### Debugging Migrations

To see more detailed logs during migrations:

```bash
NODE_ENV=development DEBUG=sequelize* npx sequelize-cli db:migrate
```
