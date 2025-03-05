const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Education = sequelize.define('Education', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    degree: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    institution: {
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
    tableName: 'Educations',
    timestamps: true
  });

  Education.associate = function(models) {
    // Many-to-one relationship with About
    Education.belongsTo(models.About, {
      foreignKey: 'aboutId',
      as: 'about',
      onDelete: 'CASCADE'
    });
  };

  return Education;
}; 