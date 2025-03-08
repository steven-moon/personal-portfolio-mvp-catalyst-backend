const { sequelize } = require('../config/database');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

const db = {};

// Check if database connection is working
const isDatabaseConnected = process.env.DB_CONNECTION_FAILED !== 'true';

// Load all model files (except index.js and BaseRepository.js) and add them to the db object
try {
  fs.readdirSync(__dirname)
    .filter(file => (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file !== 'BaseRepository.js' &&
      file.slice(-3) === '.js'
    ))
    .forEach(file => {
      try {
        const model = require(path.join(__dirname, file))(sequelize);
        db[model.name] = model;
      } catch (modelError) {
        console.error(`Error loading model ${file}:`, modelError);
        // Create a safe fallback model with no-op methods if database connection failed
        if (!isDatabaseConnected) {
          const modelName = file.replace('.js', '');
          console.log(`Creating fallback model for ${modelName} due to database connection issues`);
          db[modelName] = {
            findOne: async () => null,
            findAll: async () => [],
            findByPk: async () => null,
            create: async () => ({}),
            update: async () => ({}),
            destroy: async () => 0,
            getWithServices: async () => null
          };
        }
      }
    });
} catch (error) {
  console.error('Error loading models:', error);
}

// Associate all models that have an associate method
try {
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      try {
        db[modelName].associate(db);
      } catch (associateError) {
        console.error(`Error associating model ${modelName}:`, associateError);
      }
    }
  });
} catch (error) {
  console.error('Error during model association:', error);
}

// Add sequelize instance and Sequelize library to db object
db.sequelize = sequelize;

module.exports = db; 