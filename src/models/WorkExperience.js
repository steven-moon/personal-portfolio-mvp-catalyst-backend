const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const WorkExperience = sequelize.define('WorkExperience', {
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
    company: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    period: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    aboutId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Abouts',
        key: 'id'
      }
    }
  }, {
    tableName: 'WorkExperiences',
    timestamps: true
  });

  WorkExperience.associate = function(models) {
    // Many-to-one relationship with About
    WorkExperience.belongsTo(models.About, {
      foreignKey: 'aboutId',
      as: 'about',
      onDelete: 'CASCADE'
    });
  };

  return WorkExperience;
}; 