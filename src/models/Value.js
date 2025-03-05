const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Value = sequelize.define('Value', {
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
    tableName: 'Values',
    timestamps: true
  });

  Value.associate = function(models) {
    // Many-to-one relationship with About
    Value.belongsTo(models.About, {
      foreignKey: 'aboutId',
      as: 'about',
      onDelete: 'CASCADE'
    });
  };

  return Value;
}; 