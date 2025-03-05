# Node.js Express API with Authentication

A secure and scalable RESTful API built with Node.js, Express, Sequelize, and JWT authentication.

## Features

- User authentication using JWT (JSON Web Tokens)
- User management with role-based authorization
- Secure password handling with bcrypt
- Sequelize ORM with MySQL database
- Global error handling and logging
- Structured project architecture
- Automated database migration and seeding

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Login and get JWT token

### Users
- `GET /api/users` - Get all users (requires authentication)
- `GET /api/users/:id` - Get user by ID (requires authentication)
- `PUT /api/users/:id` - Update user (requires authentication)
- `DELETE /api/users/:id` - Delete user (requires authentication)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL database

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/node-express-auth-api.git
cd node-express-auth-api
```

2. Install dependencies
```
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
```
npm run init
```

This command will:
- Create the database if it doesn't exist
- Apply all necessary migrations
- Add seed data (including an admin user)
- Start the application in development mode with auto-reload

Alternatively, you can run these steps individually:
```
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

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues, check:

1. **MySQL Configuration**: Make sure your MySQL server is running and properly configured in `.env`
   - Check the port number (common ports: 3306 for standard MySQL, 8889 for MAMP)
   - Verify username and password

2. **Run Without Database**: If you're having persistent database issues, you can run the API in a limited mode:
   ```
   npm run dev-no-db-check
   ```
   This will start the server without database connectivity, allowing you to at least see the API documentation.

3. **Review Connection Logs**: The application will output detailed connection information to help diagnose issues.

## Testing

To test the API endpoints, run the test script after starting the server:

```
node scripts/api-test.js
```

## Project Structure

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

## Database Seeders

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

```
node src/scripts/run-seeders.js
```

This will:
- Check if data already exists to avoid duplicates
- Apply all seeders in the correct order
- Only seed tables that don't already have data

### Manual Testing

After running the seeders, you can test the API endpoints using the provided test scripts:

```
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

## License

This project is licensed under the MIT License.