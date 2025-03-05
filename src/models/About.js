const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const About = sequelize.define('About', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    headline: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    subheadline: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    story: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    tableName: 'Abouts',
    timestamps: true
  });

  About.associate = function(models) {
    // One-to-one relationship with User
    About.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    // One-to-many relationships
    About.hasMany(models.WorkExperience, {
      foreignKey: 'aboutId',
      as: 'workExperiences'
    });

    About.hasMany(models.Education, {
      foreignKey: 'aboutId',
      as: 'educations'
    });

    About.hasMany(models.Skill, {
      foreignKey: 'aboutId',
      as: 'skills'
    });

    About.hasMany(models.Value, {
      foreignKey: 'aboutId',
      as: 'values'
    });
  };

  return About;
}; 