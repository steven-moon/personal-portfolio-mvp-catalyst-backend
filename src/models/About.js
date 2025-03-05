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
        notEmpty: true,
        isString(value) {
          console.log('Validating story field:', value);
          console.log('Story type:', typeof value);
          
          if (typeof value !== 'string') {
            throw new Error('story must be a string');
          }
          
          if (value.length < 10) {
            console.warn('Story is very short:', value);
          }
        }
      }
    }
  }, {
    tableName: 'Abouts',
    timestamps: true,
    hooks: {
      beforeValidate: (about, options) => {
        console.log('Before validate hook triggered for About model');
        console.log('Story value:', about.story);
        console.log('Story type:', typeof about.story);
        
        // If story is an array, convert it to a string
        if (Array.isArray(about.story)) {
          console.log('Converting story array to string');
          about.story = about.story.join('\n\n');
          console.log('Converted story:', about.story);
        }
      },
      validationFailed: (instance, options, error) => {
        console.error('Validation failed for About model:', error.message);
        console.error('Validation errors:', JSON.stringify(error, null, 2));
      }
    }
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