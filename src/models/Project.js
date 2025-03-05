const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Project = sequelize.define('Project', {
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
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    fullDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    tableName: 'Projects',
    timestamps: true
  });

  Project.associate = function(models) {
    // Define relationship with additional images
    Project.hasMany(models.ProjectImage, {
      foreignKey: 'projectId',
      as: 'images',
      onDelete: 'CASCADE'
    });

    // Define relationship with tags (many-to-many)
    Project.belongsToMany(models.Tag, {
      through: models.ProjectTag,
      foreignKey: 'projectId',
      otherKey: 'tagId',
      as: 'tags'
    });
  };

  return Project;
}; 