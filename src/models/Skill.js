const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Skill = sequelize.define('Skill', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('technical', 'design'),
      allowNull: false,
      validate: {
        isIn: [['technical', 'design']]
      }
    },
    name: {
      type: DataTypes.STRING,
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
    tableName: 'Skills',
    timestamps: true
  });

  Skill.associate = function(models) {
    // Many-to-one relationship with About
    Skill.belongsTo(models.About, {
      foreignKey: 'aboutId',
      as: 'about',
      onDelete: 'CASCADE'
    });
  };

  return Skill;
}; 