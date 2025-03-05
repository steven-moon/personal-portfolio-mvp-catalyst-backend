const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const HomePage = sequelize.define('HomePage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    profession: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'HomePages',
    timestamps: true
  });

  HomePage.associate = function(models) {
    // Define relationship with Services
    HomePage.hasMany(models.Service, {
      foreignKey: 'homePageId',
      as: 'services',
      onDelete: 'CASCADE'
    });
  };

  return HomePage;
}; 