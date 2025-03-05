const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProjectImage = sequelize.define('ProjectImage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Projects',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    tableName: 'ProjectImages',
    timestamps: true
  });

  ProjectImage.associate = function(models) {
    // Define relationship with Project
    ProjectImage.belongsTo(models.Project, {
      foreignKey: 'projectId',
      as: 'project'
    });
  };

  return ProjectImage;
}; 