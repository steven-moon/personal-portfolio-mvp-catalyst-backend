# Node.js Express API with Authentication

A secure and scalable RESTful API built with Node.js, Express, Sequelize, and JWT authentication for the Personal Portfolio project.

## 🌟 Features

- User authentication using JWT (JSON Web Tokens)
- User management with role-based authorization
- Secure password handling with bcrypt
- Sequelize ORM with MySQL database
- Global error handling and logging
- Structured project architecture
- Automated database migration and seeding

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Login and get JWT token

### Users
- `GET /api/users` - Get all users (requires authentication)
- `GET /api/users/:id` - Get user by ID (requires authentication)
- `PUT /api/users/:id` - Update user (requires authentication)
- `DELETE /api/users/:id` - Delete user (requires authentication)

## 🛠️ Technology Stack

- **Backend**:
  - Node.js
  - Express.js
  - Sequelize ORM
  - MySQL database
  - JWT for authentication
  - bcrypt for password hashing

- **Tools & Utilities**:
  - dotenv for environment variables
  - Winston for logging
  - Express Validator for request validation
  - ESLint for code linting

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL database

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/node-express-auth-api.git
cd node-express-auth-api
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=auth_api_db
DB_PORT=3306
JWT_SECRET=your_jwt_secret_key
```

4. Setup the database and start the application
```bash
npm run init
```

This command will:
- Create the database if it doesn't exist
- Apply all necessary migrations
- Add seed data (including an admin user)
- Start the application in development mode with auto-reload

Alternatively, you can run these steps individually:
```bash
# Create database only
npm run setup-db

# Start the app (which will run migrations automatically)
npm run dev
```

The server will start on port 3000 (or the port specified in your `.env` file).

### Default Admin User

After initialization, you can log in with these credentials:
- Email: admin@example.com
- Password: admin123

## ⚠️ Troubleshooting

### Database Connection Issues

If you encounter database connection issues, check:

1. **MySQL Configuration**: Make sure your MySQL server is running and properly configured in `.env`
   - Check the port number (common ports: 3306 for standard MySQL, 8889 for MAMP)
   - Verify username and password

2. **Run Without Database**: If you're having persistent database issues, you can run the API in a limited mode:
   ```bash
   npm run dev-no-db-check
   ```
   This will start the server without database connectivity, allowing you to at least see the API documentation.

3. **Review Connection Logs**: The application will output detailed connection information to help diagnose issues.

## 🧪 Testing

To test the API endpoints, run the test script after starting the server:

```bash
node scripts/api-test.js
```

## 🧩 Project Structure

```
.
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middlewares/    # Custom middlewares
│   ├── migrations/     # Database migrations
│   ├── models/         # Sequelize models
│   ├── routes/         # API routes
│   ├── seeders/        # Database seeders
│   ├── utils/          # Utility functions
│   └── index.js        # Application entry point
├── scripts/            # Utility scripts
├── .env                # Environment variables
├── package.json
└── README.md
```

## 🌱 Database Seeders

The application comes with several seeders to populate your database with sample data for development and testing.

### Available Seeders

1. **User Seeders** - Creates admin and sample users
2. **Site Settings** - Initializes default site configuration settings
3. **Home Page Content** - Creates sample hero, services and testimonials
4. **About Page Content** - Populates bio, education, work experience, and skills
5. **Projects** - Adds sample portfolio projects with tags and images
6. **Contact Messages** - Creates sample contact form submissions
7. **Blog** - Adds blog categories and sample blog posts

### Running Seeders

To run all seeders at once:

```bash
node src/scripts/run-seeders.js
```

This will:
- Check if data already exists to avoid duplicates
- Apply all seeders in the correct order
- Only seed tables that don't already have data

### Manual Testing

After running the seeders, you can test the API endpoints using the provided test scripts:

```bash
# Test authentication and user API
node scripts/auth-test.js

# Test home page API
node scripts/home-api-test.js

# Test project API
node scripts/project-api-test.js

# Test about page API
node scripts/about-api-test.js

# Test blog API
node scripts/blog-api-test.js

# Test contact API
node scripts/contact-api-test.js
```

## 🤖 Cursor Rules for AI

This project uses Cursor's Rules for AI feature to maintain consistent coding standards, architecture, and development practices. The rules are structured in the following way:

- Root-level `.cursor` file: Contains high-level project guidelines and references to component-specific rules
- `/frontend/.cursor`: Contains detailed frontend development rules
- `/backend/.cursor`: Contains detailed backend development rules

These rules help guide AI assistants to follow project-specific conventions and ensure consistency across the codebase.

### Backend-Specific Rules

The backend rules in this project cover:

- MVC architecture pattern implementation
- Express.js and Node.js best practices
- Sequelize ORM usage patterns
- API endpoint design principles
- Authentication and security best practices
- Error handling strategies
- Project structure guidelines
- Testing methodologies
- Code style and naming conventions

### How Cursor Rules Work

Rules for AI contain guidelines, patterns, and instructions for AI to follow when generating or modifying code. These rules help ensure:

- Consistent code style and formatting
- Adherence to project architecture
- Following best practices for specific technologies
- Implementing proper design patterns

### Project-Wide Rules

The root-level rules address:

- Cross-cutting concerns
- API integration between frontend and backend
- Deployment considerations
- Security guidelines
- Performance considerations
- Git workflow guidelines

For more information, check out the [Cursor Rules for AI Documentation](https://docs.cursor.com/context/rules-for-ai).

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements
- [Express.js](https://expressjs.com/)
- [Sequelize ORM](https://sequelize.org/)
- [JWT](https://jwt.io/)
- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/)
- [Cursor](https://cursor.com/)

---

Created with ❤️ by [Steve Moon]