const { sequelize } = require('../config/database');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

const db = {};

// Load all model files (except index.js and BaseRepository.js) and add them to the db object
fs.readdirSync(__dirname)
  .filter(file => (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file !== 'BaseRepository.js' &&
    file.slice(-3) === '.js'
  ))
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize);
    db[model.name] = model;
  });

// Associate all models that have an associate method
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Add sequelize instance and Sequelize library to db object
db.sequelize = sequelize;

module.exports = db; 