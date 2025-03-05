# Building a Secure Node.js, Express & Sequelize API (JWT & MySQL)

In this step-by-step guide, we will build a RESTful backend API using Node.js, Express, Sequelize (with MySQL), implementing JWT authentication and following best practices. We'll create user signup/login endpoints that issue JWT tokens, secure all other routes with JWT middleware, use bcrypt to hash passwords, and organize the project into logical folders for maintainability. Code snippets and explanations are provided for each step, emphasizing security (never storing plain passwords) and efficiency.

## 1. Initialize the Project and Install Dependencies

### Initialize Node.js Project
Create a new directory for your project and run `npm init -y` to initialize a Node.js project with default settings. This creates a `package.json` file.

### Install Required Packages
Next, install the libraries needed for our API: Express (web framework), Sequelize (ORM for MySQL), MySQL2 (database driver for Sequelize), JSON Web Token (JWT) for authentication, bcrypt for password hashing, and dotenv for configuration. Run:

```bash
npm install express sequelize mysql2 jsonwebtoken bcrypt dotenv
```

These packages provide the core functionality for our API:
- **Express**: to handle HTTP requests
- **Sequelize**: to interact with MySQL
- **jsonwebtoken**: for JWT creation/verification
- **bcrypt**: for secure password hashing
- **dotenv**: to manage configuration like secrets

### Initialize Git (Optional)
It's good practice to version control your code. Run `git init` and create a `.gitignore` file (include `node_modules/` and `.env` file to avoid committing sensitive data).
