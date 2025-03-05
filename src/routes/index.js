// routes/index.js
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const aboutRoutes = require('./aboutRoutes');
const blogRoutes = require('./blogRoutes');
const contactRoutes = require('./contactRoutes');
const homeRoutes = require('./homeRoutes');
const projectRoutes = require('./projectRoutes');
const siteSettingRoutes = require('./siteSettingRoutes');

module.exports = (app) => {
  app.use('/api/users', userRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/about', aboutRoutes);
  app.use('/api/blog', blogRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/home', homeRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/settings', siteSettingRoutes);
}; 