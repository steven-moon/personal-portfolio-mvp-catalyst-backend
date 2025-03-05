const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    }
  }, {
    tableName: 'Categories',
    timestamps: true
  });

  Category.associate = function(models) {
    // One-to-many relationship with BlogPost
    Category.hasMany(models.BlogPost, {
      foreignKey: 'categoryId',
      as: 'blogPosts'
    });
  };

  return Category;
}; 