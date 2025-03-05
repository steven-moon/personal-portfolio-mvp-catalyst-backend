# Personal Portfolio API Postman Collection

This Postman collection contains all the API endpoints for the Personal Portfolio MVP Catalyst backend application.

## Table of Contents

- [Importing the Collection](#importing-the-collection)
- [Environment Setup](#environment-setup)
- [Authentication](#authentication)
- [Available Endpoints](#available-endpoints)

## Importing the Collection

To import this collection into Postman:

1. Open Postman
2. Click on "Import" in the top left corner
3. Select "File" and choose the `postman_collection.json` file
4. Click "Import"

## Environment Setup

The collection uses environment variables that need to be set up:

1. In Postman, click on "Environments" in the sidebar
2. Click "+" to create a new environment
3. Name it "Personal Portfolio API"
4. Add the following variables:
   - `baseUrl`: `http://localhost:3000` (or your deployed API URL)
   - `authToken`: Leave this empty for now (will be set after authentication)
5. Click "Save"
6. Make sure to select this environment from the environment dropdown in the top right corner

## Authentication

To use protected endpoints, you need to authenticate first:

1. Go to the "Authentication" folder in the collection
2. Execute the "Sign Up" request to create a new user (if you don't already have an account)
3. Execute the "Sign In" request to obtain a JWT token
4. In the response, you will receive a token
5. Copy this token and set it as the value for the `authToken` environment variable

## Available Endpoints

### Documentation
- `GET /` - Get API documentation and available endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Authenticate a user and get a JWT token

### Users (Protected Routes)
- `GET /api/users` - Get a list of all users
- `GET /api/users/:id` - Get a specific user by ID
- `PUT /api/users/:id` - Update a user by ID
- `DELETE /api/users/:id` - Delete a user by ID

## Request and Response Examples

### Sign Up
Request body:
```json
{
    "username": "testuser",
    "email": "test@example.com",
    "password": "securePassword123"
}
```

### Sign In
Request body:
```json
{
    "email": "test@example.com",
    "password": "securePassword123"
}
```

### Update User
Request body:
```json
{
    "username": "updatedUsername",
    "email": "updated@example.com"
}
```

## Testing Workflow

1. First, create a user with the Sign Up endpoint
2. Log in with the Sign In endpoint and copy the token to your environment variables
3. Use the protected endpoints (Users) with the authentication token
4. Test all CRUD operations on users 