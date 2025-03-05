const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Tag = sequelize.define('Tag', {
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
    tableName: 'Tags',
    timestamps: true
  });

  Tag.associate = function(models) {
    // Define relationship with projects (many-to-many)
    Tag.belongsToMany(models.Project, {
      through: models.ProjectTag,
      foreignKey: 'tagId',
      otherKey: 'projectId',
      as: 'projects'
    });
  };

  return Tag;
}; 