require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { testConnection } = require('./config/database');
const db = require('./models');
const routes = require('./routes');
const { errorHandler, getLogger } = require('./middlewares');
const AppError = require('./utils/AppError');
const { initializeDatabase } = require('./utils/dbInit');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080', 'http://frontend:8080', 'http://nginx:80', 'http://localhost:9090'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Enable CORS
app.use(cors(corsOptions));

// Request logging middleware
app.use(getLogger());

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Add security headers middleware
app.use((req, res, next) => {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

// Setup API routes
routes(app);

// Basic route for testing and API documentation
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Node.js Express API with Authentication',
    documentation: {
      endpoints: {
        authentication: {
          signup: { method: 'POST', url: '/api/auth/signup', access: 'Public' },
          signin: { method: 'POST', url: '/api/auth/signin', access: 'Public' }
        },
        users: {
          getAllUsers: { method: 'GET', url: '/api/users', access: 'Protected' },
          getUserById: { method: 'GET', url: '/api/users/:id', access: 'Protected' },
          updateUser: { method: 'PUT', url: '/api/users/:id', access: 'Protected' },
          deleteUser: { method: 'DELETE', url: '/api/users/:id', access: 'Protected' }
        }
      },
      authentication: 'JWT token required for protected routes. Add to request header: Authorization: Bearer <token>'
    }
  });
});

// Handle 404 errors - route not found
app.use('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

// Global error handler middleware
app.use(errorHandler);

// Initialize database connection
const initializeApp = async () => {
  try {
    console.log('Initializing backend application...');
    
    // Check if we should skip database connection (for troubleshooting)
    const skipDbCheck = process.env.NODE_SKIP_DB_CHECK === 'true';
    
    if (skipDbCheck) {
      console.warn('⚠️ DATABASE CHECK SKIPPED - Running in limited mode');
      console.warn('Some features requiring database access will not work!');
      startServer();
      return;
    }
    
    console.log('Testing database connection...');
    console.log('Database config:', {
      host: process.env.DB_HOST || 'Not set',
      port: process.env.DB_PORT || 'Not set',
      user: process.env.DB_USER || 'Not set (username hidden)',
      database: process.env.DB_NAME || 'Not set',
      dialect: process.env.DB_DIALECT || 'Not set'
    });
    
    // Test database connection with a timeout
    let isConnected = false;
    try {
      const connectionPromise = testConnection();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database connection timeout')), 10000)
      );
      
      isConnected = await Promise.race([connectionPromise, timeoutPromise]);
    } catch (connError) {
      console.error('Database connection error:', connError.message);
      isConnected = false;
    }
    
    if (!isConnected) {
      console.error('Cannot establish database connection. Check your database configuration.');
      console.warn('Starting server without database functionality for API documentation access.');
      
      // Set environment flag to skip DB operations in controllers
      process.env.DB_CONNECTION_FAILED = 'true';
      
      // Start the server anyway to allow access to documentation
      startServer();
      return;
    }
    
    // Run database migrations and seeds
    console.log('Running database migrations and seeds...');
    let initResult = false;
    try {
      initResult = await initializeDatabase();
    } catch (initError) {
      console.error('Database initialization failed:', initError);
      console.warn('Continuing with server startup despite database initialization failure');
    }
    
    if (!initResult) {
      console.warn('Database initialization had issues. Some features might not work properly.');
    }
    
    // Sync database models (don't force in production)
    // Modified to use simpler sync to avoid "too many keys" error
    try {
      if (process.env.NODE_ENV === 'development') {
        // Use sync without alter to avoid adding more keys
        await db.sequelize.sync({ force: false, alter: false });
        console.log('Database tables synchronized (without schema changes)');
      } else {
        await db.sequelize.sync();
        console.log('Database connected in production mode');
      }
    } catch (syncError) {
      console.error('Error synchronizing database:', syncError.message);
      console.warn('Starting server anyway, but some database features may not work properly');
    }
    
    // Start the server
    startServer();
  } catch (error) {
    console.error('Failed to initialize the application:', error);
    console.log('Starting server despite initialization error to maintain service availability');
    startServer();
  }
};

// Start the Express server
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
    console.log(`API documentation available at http://localhost:${PORT}`);
  });
};

// Start the application
initializeApp(); 