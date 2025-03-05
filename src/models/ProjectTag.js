const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProjectTag = sequelize.define('ProjectTag', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
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
    },
    tagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Tags',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    tableName: 'ProjectTags',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['projectId', 'tagId'],
        name: 'unique_project_tag_pair'
      }
    ]
  });

  return ProjectTag;
}; 