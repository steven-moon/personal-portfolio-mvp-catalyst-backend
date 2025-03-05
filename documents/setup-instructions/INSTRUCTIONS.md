# Node.js Express API with Authentication - Instructions

This document provides an overview of all the steps required to build a secure Node.js Express API with authentication. Each section contains detailed instructions and code examples.

## Table of Contents

1. [Project Setup and Dependencies](#step-1-project-setup-and-dependencies)
2. [Project Structure Organization](#step-2-project-structure-organization)
3. [Database Configuration](#step-3-database-configuration)
4. [User Model](#step-4-user-model)
5. [Authentication Controller](#step-5-authentication-controller)
6. [Authentication Middleware](#step-6-authentication-middleware)
7. [User Controller](#step-7-user-controller)
8. [Routes](#step-8-routes)
9. [Refactor: Base Repository Class](#step-9-refactor-base-repository-class)
10. [Global Error Handling and Logging](#step-10-global-error-handling-and-logging)
11. [Integrate Routes and Start the Server](#step-11-integrate-routes-and-start-the-server)
12. [Database Setup, Initialization, and Testing](#step-12-database-setup-initialization-and-testing)
13. [Database Migrations for Portfolio Data Models](#step-13-database-migrations-for-portfolio-data-models)
14. [Seeder Bug Fixes and Implementation](#step-14-seeder-bug-fixes-and-implementation)

## Step 1: Project Setup and Dependencies

[Detailed Instructions for Step 1](INSTRUCTIONS-SECTION-1.md)

Set up the project structure and install necessary dependencies.

## Step 2: Project Structure Organization

[Detailed Instructions for Step 2](INSTRUCTIONS-SECTION-2.md)

Organize your project into a maintainable structure with appropriate directories.

## Step 3: Database Configuration

[Detailed Instructions for Step 3](INSTRUCTIONS-SECTION-3.md)

Configure the database connection using Sequelize ORM.

## Step 4: User Model

[Detailed Instructions for Step 4](INSTRUCTIONS-SECTION-4.md)

Create the User model with Sequelize.

## Step 5: Authentication Controller

[Detailed Instructions for Step 5](INSTRUCTIONS-SECTION-7.md)

Implement authentication controller for signup and signin.

## Step 6: Authentication Middleware

[Detailed Instructions for Step 6](INSTRUCTIONS-SECTION-6.md)

Implement JWT authentication middleware to protect routes.

## Step 7: User Controller

[Detailed Instructions for Step 7](INSTRUCTIONS-SECTION-5.md)

Create the User controller with CRUD operations.

## Step 8: Routes

Set up routes for user and authentication endpoints.

This includes:
- Setting up auth routes for signup and signin
- Setting up protected user routes
- Mounting all routes in the main application

## Step 9: Refactor: Base Repository Class

[Detailed Instructions for Step 9](INSTRUCTIONS-SECTION-8.md)

Refactor CRUD operations by creating a Base Repository class.

## Step 10: Global Error Handling and Logging

[Detailed Instructions for Step 10](INSTRUCTIONS-SECTION-9.md)

Implement global error handling and logging.

## Step 11: Integrate Routes and Start the Server

This step involves wiring everything together:
- Setting up the Express app with middleware
- Mounting all routes 
- Implementing error handling
- Starting the server with database connection

## Step 12: Database Setup, Initialization, and Testing

Set up the MySQL database, implement migration and seeding systems, and create testing utilities.

This includes:
- Database connection configuration
- Migration system setup
- Seeder implementation
- Backup and restore functionality
- Health checks and monitoring

## Step 13: Database Migrations for Portfolio Data Models

Create migration scripts for all portfolio data models:
- About Me section tables
- Blog posts tables
- Contact information tables
- Home page tables
- Projects tables
- Site settings table

## Step 14: Seeder Bug Fixes and Implementation

Fix issues with seeders and implement data population:
- Correct table name mismatches
- Fix incorrect field references
- Implement proper foreign key relationships
- Populate the database with sample data

---

Follow these instructions step by step to build a complete, secure Node.js Express API with user authentication, proper error handling, and a well-organized structure.
