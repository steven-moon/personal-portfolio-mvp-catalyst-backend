const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Service = sequelize.define('Service', {
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
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    homePageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'HomePages',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    tableName: 'Services',
    timestamps: true
  });

  Service.associate = function(models) {
    // Define relationship with HomePage
    Service.belongsTo(models.HomePage, {
      foreignKey: 'homePageId',
      as: 'homePage'
    });
  };

  return Service;
}; 