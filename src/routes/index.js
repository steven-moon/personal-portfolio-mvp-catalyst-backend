// routes/index.js
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');

module.exports = (app) => {
  app.use('/api/users', userRoutes);
  app.use('/api/auth', authRoutes);
}; 