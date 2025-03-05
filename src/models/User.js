const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 30],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 100],
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
    },
  }, {
    timestamps: true, // Adds createdAt and updatedAt
    hooks: {
      beforeCreate: async (user) => {
        console.log('[DEBUG] beforeCreate hook triggered for User model');
        try {
          if (user.password) {
            console.log('[DEBUG] Hashing password for new user');
            user.password = await bcrypt.hash(user.password, 10);
            console.log('[DEBUG] Password successfully hashed');
          }
        } catch (error) {
          console.error('[ERROR] Failed to hash password:', error);
          throw error;
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          console.log('[DEBUG] beforeUpdate hook - hashing updated password');
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  });

  // Instance method to check password validity
  User.prototype.isValidPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  // This will be used to create associations with other models
  User.associate = function(models) {
    // Define associations here when needed
    // One-to-one relationship with About
    User.hasOne(models.About, {
      foreignKey: 'userId',
      as: 'about',
      onDelete: 'CASCADE'
    });
    
    // One-to-many relationship with BlogPost (as author)
    User.hasMany(models.BlogPost, {
      foreignKey: 'authorId',
      as: 'blogPosts',
      onDelete: 'CASCADE'
    });
  };

  return User;
}; 